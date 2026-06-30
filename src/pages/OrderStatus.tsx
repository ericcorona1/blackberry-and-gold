import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { useOrders } from "@/hooks/useOrders";
import { useRooms } from "@/hooks/useRooms";
import { useNotificationSound } from "@/components/NotificationSound";
import { ORDER_STATUS_LABELS, STATUS_ORDER } from "@/constants/menu";

const GOLD = "#d4a843";
const CREAM = "#f5e6c8";
const DARK_BG = "#1a1a1a";

export function OrderStatus() {
  const navigate = useNavigate();
  const { roomCode, orderId, setOrderId } = useStore();
  const { findRoomByCode } = useRooms();
  const [room, setRoom] = useState<{ id: string } | null>(null);
  const { orders } = useOrders(room?.id ?? null);
  const { playReadySound } = useNotificationSound();
  const [notifiedReady, setNotifiedReady] = useState<Set<string>>(new Set());

  const currentOrder = orders.find((o) => o.id === orderId);

  useEffect(() => {
    if (!roomCode || !orderId) {
      navigate("/");
      return;
    }
    findRoomByCode(roomCode).then((r) => {
      if (r) setRoom(r);
    });
  }, [roomCode, orderId, navigate, findRoomByCode]);

  useEffect(() => {
    if (
      currentOrder?.status === "ready" &&
      !notifiedReady.has(currentOrder.id)
    ) {
      playReadySound();
      setNotifiedReady((prev) => new Set(prev).add(currentOrder.id));
    }
  }, [currentOrder?.status, notifiedReady, playReadySound]);

  function getStatusIndex(status: string): number {
    return STATUS_ORDER.indexOf(status);
  }

  if (!currentOrder) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold" style={{ color: GOLD }}>
          No Active Order
        </h2>
        <p className="mt-2" style={{ color: CREAM }}>
          Place an order from the menu to see its status here.
        </p>
        <button
          onClick={() => navigate("/menu")}
          className="mt-4 px-6 py-2 rounded-md font-bold"
          style={{ backgroundColor: GOLD, color: "#000" }}
        >
          View Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold" style={{ color: GOLD }}>
          Order Status
        </h2>
        <p className="text-sm" style={{ color: CREAM }}>
          Order #{currentOrder.order_number}
        </p>
      </div>

      <div
        className="p-6 rounded-lg"
        style={{ backgroundColor: DARK_BG, border: `1px solid ${GOLD}40` }}
      >
        <div className="text-center mb-4">
          <p className="text-lg font-bold">{currentOrder.drink_name}</p>
          <p className="text-sm opacity-80">{currentOrder.guest_name}</p>
          {currentOrder.notes && (
            <p className="text-sm italic mt-1 opacity-70">
              "{currentOrder.notes}"
            </p>
          )}
        </div>

        <div className="space-y-3">
          {STATUS_ORDER.map((status, index) => {
            const currentIndex = getStatusIndex(currentOrder.status);
            const isComplete = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={status} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    backgroundColor: isComplete ? GOLD : `${GOLD}20`,
                    color: isComplete ? "#000" : GOLD,
                    border: `2px solid ${GOLD}`,
                  }}
                >
                  {isComplete ? "✓" : index + 1}
                </div>
                <div className="flex-1">
                  <p
                    className="font-medium"
                    style={{
                      color: isCurrent
                        ? GOLD
                        : isComplete
                          ? CREAM
                          : `${CREAM}60`,
                    }}
                  >
                    {ORDER_STATUS_LABELS[status]}
                  </p>
                </div>
                {isCurrent && (
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: GOLD }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {currentOrder.status === "served" && (
        <div className="text-center">
          <p className="mb-3" style={{ color: CREAM }}>
            Enjoy your drink! 🥂
          </p>
          <button
            onClick={() => {
              setOrderId(null);
              navigate("/menu");
            }}
            className="px-6 py-2 rounded-md font-bold"
            style={{ backgroundColor: GOLD, color: "#000" }}
          >
            Order Another
          </button>
        </div>
      )}
    </div>
  );
}
