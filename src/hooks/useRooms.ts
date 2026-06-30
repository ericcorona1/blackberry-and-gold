import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Room } from "@/types";

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
    subscribeToRooms();

    return () => {
      supabase.channel("rooms-channel").unsubscribe();
    };
  }, []);

  async function fetchRooms() {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setRooms(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }

  function subscribeToRooms() {
    supabase
      .channel("rooms-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setRooms((prev) => [payload.new as Room, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setRooms((prev) =>
              prev.map((r) =>
                r.id === (payload.new as Room).id ? (payload.new as Room) : r,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setRooms((prev) => prev.filter((r) => r.id !== payload.old.id));
          }
        },
      )
      .subscribe();
  }

  async function createRoom(code: string): Promise<Room | null> {
    const { data, error: createError } = await supabase
      .from("rooms")
      .insert({ code, is_active: true })
      .select()
      .single();

    if (createError) {
      setError(createError.message);
      return null;
    }
    return data;
  }

  async function toggleRoomActive(
    roomId: string,
    isActive: boolean,
  ): Promise<boolean> {
    const { error: updateError } = await supabase
      .from("rooms")
      .update({ is_active: isActive })
      .eq("id", roomId);

    if (updateError) {
      setError(updateError.message);
      return false;
    }
    return true;
  }

  async function findRoomByCode(code: string): Promise<Room | null> {
    const { data, error: fetchError } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (fetchError) {
      setError(fetchError.message);
      return null;
    }
    return data;
  }

  return {
    rooms,
    loading,
    error,
    createRoom,
    toggleRoomActive,
    findRoomByCode,
  };
}
