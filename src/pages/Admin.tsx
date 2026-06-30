import { useState } from "react";
import { useStore } from "@/store";
import { useRooms } from "@/hooks/useRooms";
import { useOrders } from "@/hooks/useOrders";
import { ORDER_STATUS_LABELS, STATUS_ORDER } from "@/constants/menu";
import type { OrderStatus } from "@/types";

const GOLD = "#d4a843";
const CREAM = "#f5e6c8";
const DARK_BG = "#1a1a1a";
const CARD_BG = "#f5e6c8";
const CARD_TEXT = "#2c1810";

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || "admin123";

export function Admin() {
  const { adminAuthenticated, setAdminAuthenticated } = useStore();
  const {
    rooms,
    loading: roomsLoading,
    createRoom,
    toggleRoomActive,
  } = useRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const {
    orders,
    loading: ordersLoading,
    updateOrderStatus,
  } = useOrders(selectedRoomId);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [newRoomCode, setNewRoomCode] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  if (!adminAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div
          className="w-full max-w-sm p-8 rounded-lg"
          style={{ backgroundColor: DARK_BG, border: `1px solid ${GOLD}40` }}
        >
          <h2
            className="text-2xl font-bold text-center mb-6"
            style={{ color: GOLD }}
          >
            Admin Access
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (passcode === ADMIN_PASSCODE) {
                setAdminAuthenticated(true);
                setPasscodeError(false);
              } else {
                setPasscodeError(true);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="passcode"
                className="block text-sm mb-1"
                style={{ color: GOLD }}
              >
                Passcode
              </label>
              <input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-md"
                style={{
                  backgroundColor: CARD_BG,
                  color: CARD_TEXT,
                  border: `2px solid ${GOLD}`,
                }}
              />
            </div>
            {passcodeError && (
              <p className="text-red-400 text-sm text-center">
                Invalid passcode.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-md font-bold uppercase tracking-wider"
              style={{ backgroundColor: GOLD, color: "#000" }}
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  async function handleCreateRoom() {
    if (!newRoomCode.trim()) return;
    setCreatingRoom(true);
    await createRoom(newRoomCode.trim().toUpperCase());
    setNewRoomCode("");
    setCreatingRoom(false);
  }

  async function handleToggleRoom(roomId: string, currentActive: boolean) {
    await toggleRoomActive(roomId, !currentActive);
  }

  async function handleStatusChange(
    orderId: string,
    direction: "back" | "next",
  ) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const currentIndex = STATUS_ORDER.indexOf(order.status);
    let newIndex: number;

    if (direction === "back") {
      newIndex = Math.max(0, currentIndex - 1);
    } else {
      newIndex = Math.min(STATUS_ORDER.length - 1, currentIndex + 1);
    }

    if (newIndex !== currentIndex) {
      await updateOrderStatus(orderId, STATUS_ORDER[newIndex] as OrderStatus);
    }
  }

  // Popular tonight - drink counts
  const drinkCounts: Record<string, number> = {};
  orders.forEach((o) => {
    drinkCounts[o.drink_name] = (drinkCounts[o.drink_name] || 0) + 1;
  });
  const popularDrinks = Object.entries(drinkCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: GOLD }}>
        Admin Dashboard
      </h2>

      {/* Create Room */}
      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: DARK_BG, border: `1px solid ${GOLD}40` }}
      >
        <h3 className="font-bold mb-3" style={{ color: GOLD }}>
          Create Room
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newRoomCode}
            onChange={(e) => setNewRoomCode(e.target.value.toUpperCase())}
            placeholder="ROOM CODE"
            className="flex-1 px-4 py-2 rounded-md uppercase tracking-wider font-bold"
            style={{
              backgroundColor: CARD_BG,
              color: CARD_TEXT,
              border: `2px solid ${GOLD}`,
            }}
            maxLength={10}
          />
          <button
            onClick={handleCreateRoom}
            disabled={creatingRoom || !newRoomCode.trim()}
            className="px-4 py-2 rounded-md font-bold disabled:opacity-50"
            style={{ backgroundColor: GOLD, color: "#000" }}
          >
            Create
          </button>
        </div>
      </div>

      {/* Rooms List */}
      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: DARK_BG, border: `1px solid ${GOLD}40` }}
      >
        <h3 className="font-bold mb-3" style={{ color: GOLD }}>
          Rooms
        </h3>
        {roomsLoading ? (
          <p className="text-sm opacity-70">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="text-sm opacity-70">No rooms yet.</p>
        ) : (
          <div className="space-y-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors"
                style={{
                  backgroundColor:
                    selectedRoomId === room.id ? `${GOLD}20` : "transparent",
                  border: `1px solid ${selectedRoomId === room.id ? GOLD : `${GOLD}20`}`,
                }}
                onClick={() => setSelectedRoomId(room.id)}
              >
                <div>
                  <span className="font-bold tracking-wider">{room.code}</span>
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      room.is_active ? "text-green-400" : "text-red-400"
                    }`}
                    style={{
                      backgroundColor: room.is_active
                        ? "rgba(74, 222, 128, 0.15)"
                        : "rgba(248, 113, 113, 0.15)",
                    }}
                  >
                    {room.is_active ? "Active" : "Closed"}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleRoom(room.id, room.is_active);
                  }}
                  className="text-xs px-3 py-1 rounded-md font-medium"
                  style={{
                    backgroundColor: room.is_active ? "#ef4444" : "#22c55e",
                    color: "#fff",
                  }}
                >
                  {room.is_active ? "Close" : "Open"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Tonight */}
      {popularDrinks.length > 0 && (
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: DARK_BG, border: `1px solid ${GOLD}40` }}
        >
          <h3 className="font-bold mb-3" style={{ color: GOLD }}>
            Popular Tonight
          </h3>
          <div className="space-y-2">
            {popularDrinks.map(([name, count], index) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: GOLD }}>
                    #{index + 1}
                  </span>
                  <span style={{ color: CREAM }}>{name}</span>
                </div>
                <span
                  className="text-sm font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${GOLD}20`,
                    color: GOLD,
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Management */}
      {selectedRoom && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold" style={{ color: GOLD }}>
            Orders — {selectedRoom.code}
          </h3>

          {ordersLoading ? (
            <p className="text-sm opacity-70">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm opacity-70">No orders yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {STATUS_ORDER.map((status) => {
                const statusOrders = orders.filter((o) => o.status === status);
                return (
                  <div
                    key={status}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: DARK_BG,
                      border: `1px solid ${GOLD}40`,
                    }}
                  >
                    <h4
                      className="font-bold text-sm uppercase tracking-wider mb-3 pb-2 border-b"
                      style={{
                        color: GOLD,
                        borderColor: `${GOLD}30`,
                      }}
                    >
                      {ORDER_STATUS_LABELS[status]}
                      <span className="ml-2 text-xs opacity-70">
                        ({statusOrders.length})
                      </span>
                    </h4>
                    <div className="space-y-3">
                      {statusOrders.map((order) => (
                        <div
                          key={order.id}
                          className="p-3 rounded-md"
                          style={{
                            backgroundColor: CARD_BG,
                            color: CARD_TEXT,
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm">
                              #{order.order_number}
                            </span>
                            <span className="text-xs opacity-70">
                              {order.guest_name}
                            </span>
                          </div>
                          <p className="font-medium text-sm">
                            {order.drink_name}
                          </p>
                          {order.notes && (
                            <p className="text-xs italic mt-1 opacity-70">
                              "{order.notes}"
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() =>
                                handleStatusChange(order.id, "back")
                              }
                              disabled={status === "pending"}
                              className="flex-1 text-xs py-1 rounded font-medium disabled:opacity-30"
                              style={{
                                backgroundColor: `${CARD_TEXT}15`,
                                color: CARD_TEXT,
                              }}
                            >
                              ← Back
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(order.id, "next")
                              }
                              disabled={status === "served"}
                              className="flex-1 text-xs py-1 rounded font-medium disabled:opacity-30"
                              style={{
                                backgroundColor: GOLD,
                                color: "#000",
                              }}
                            >
                              Next →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
