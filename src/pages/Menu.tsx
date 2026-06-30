import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { useOrders } from "@/hooks/useOrders";
import { useRooms } from "@/hooks/useRooms";
import { COCKTAIL_MENU } from "@/constants/menu";
import type { Drink } from "@/types";
import { useEffect } from "react";

const GOLD = "#d4a843";
const CREAM = "#f5e6c8";
const DARK_BG = "#1a1a1a";
const CARD_BG = "#f5e6c8";
const CARD_TEXT = "#2c1810";

export function Menu() {
  const navigate = useNavigate();
  const { roomCode, nickname, setOrderId } = useStore();
  const [room, setRoom] = useState<{ id: string } | null>(null);
  const { findRoomByCode } = useRooms();
  const { createOrder } = useOrders(room?.id ?? null);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomCode) {
      navigate("/");
      return;
    }
    findRoomByCode(roomCode).then((r) => {
      if (!r || !r.is_active) {
        setError("Room not found or closed.");
        navigate("/");
      } else {
        setRoom(r);
      }
    });
  }, [roomCode, navigate, findRoomByCode]);

  async function handleSubmit() {
    if (!selectedDrink || !room) return;
    setSubmitting(true);
    setError(null);

    const order = await createOrder({
      room_id: room.id,
      guest_name: nickname,
      drink_id: selectedDrink.id,
      drink_name: selectedDrink.name,
      notes,
    });

    setSubmitting(false);

    if (order) {
      setOrderId(order.id);
      navigate("/order-status");
    } else {
      setError("Failed to submit order. Please try again.");
    }
  }

  const categories = [...new Set(COCKTAIL_MENU.map((d) => d.category))];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold" style={{ color: GOLD }}>
          Cocktail Menu
        </h2>
        <p style={{ color: CREAM }}>
          Room: <span className="font-bold tracking-wider">{roomCode}</span>
        </p>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h3
            className="text-lg font-semibold uppercase tracking-wider mb-3"
            style={{ color: GOLD }}
          >
            {category}
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {COCKTAIL_MENU.filter((d) => d.category === category).map(
              (drink) => (
                <button
                  key={drink.id}
                  onClick={() => setSelectedDrink(drink)}
                  className="text-left p-4 rounded-lg border-2 transition-all"
                  style={{
                    backgroundColor:
                      selectedDrink?.id === drink.id ? GOLD : CARD_BG,
                    color: selectedDrink?.id === drink.id ? "#000" : CARD_TEXT,
                    borderColor:
                      selectedDrink?.id === drink.id ? GOLD : `${GOLD}40`,
                  }}
                  aria-pressed={selectedDrink?.id === drink.id}
                  aria-label={`${drink.name} — $${drink.price}: ${drink.description}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold">{drink.name}</span>
                    <span className="text-sm font-bold">${drink.price}</span>
                  </div>
                  <p className="text-sm mt-1 opacity-80">{drink.description}</p>
                </button>
              ),
            )}
          </div>
        </div>
      ))}

      {selectedDrink && (
        <div
          className="p-6 rounded-lg space-y-4"
          style={{ backgroundColor: DARK_BG, border: `1px solid ${GOLD}40` }}
        >
          <h3 className="text-xl font-bold" style={{ color: GOLD }}>
            {selectedDrink.name} — ${selectedDrink.price}
          </h3>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm mb-1"
              style={{ color: CREAM }}
            >
              Special requests <span className="opacity-70">(optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. light on the ice, extra lime..."
              className="w-full px-4 py-3 rounded-md"
              style={{
                backgroundColor: CARD_BG,
                color: CARD_TEXT,
                border: `2px solid ${GOLD}`,
              }}
              rows={3}
              maxLength={200}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedDrink(null);
                setNotes("");
              }}
              className="flex-1 py-3 rounded-md font-medium border-2"
              style={{
                borderColor: GOLD,
                color: GOLD,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3 rounded-md font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: GOLD,
                color: "#000",
              }}
            >
              {submitting ? "Ordering..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
