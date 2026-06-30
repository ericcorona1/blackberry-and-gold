import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Order, OrderStatus } from "@/types";

export function useOrders(roomId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    fetchOrders();
    subscribeToOrders();

    return () => {
      supabase.channel(`orders-${roomId}`).unsubscribe();
    };
  }, [roomId]);

  async function fetchOrders() {
    if (!roomId) return;
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;
      setOrders(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  function subscribeToOrders() {
    if (!roomId) return;

    supabase
      .channel(`orders-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [...prev, payload.new as Order]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === (payload.new as Order).id ? (payload.new as Order) : o,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        },
      )
      .subscribe();
  }

  async function createOrder(params: {
    room_id: string;
    guest_name: string;
    drink_id: string;
    drink_name: string;
    notes: string;
  }): Promise<Order | null> {
    const { data: countData } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("room_id", params.room_id);

    const orderNumber = (countData?.length ?? 0) + 1;

    const guestName = params.guest_name || `Guest ${orderNumber}`;

    const { data, error: createError } = await supabase
      .from("orders")
      .insert({
        room_id: params.room_id,
        order_number: orderNumber,
        guest_name: guestName,
        drink_id: params.drink_id,
        drink_name: params.drink_name,
        notes: params.notes,
        status: "pending",
      })
      .select()
      .single();

    if (createError) {
      setError(createError.message);
      return null;
    }
    return data;
  }

  async function updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<boolean> {
    const updateData: Record<string, string> = { status };

    if (status === "ready") {
      updateData.completed_at = new Date().toISOString();
    }
    if (status === "served") {
      updateData.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) {
      setError(updateError.message);
      return false;
    }
    return true;
  }

  const getOrdersByStatus = useCallback(
    (status: OrderStatus) => {
      return orders.filter((o) => o.status === status);
    },
    [orders],
  );

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    getOrdersByStatus,
  };
}
