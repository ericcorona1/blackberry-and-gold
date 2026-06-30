import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "@/store";
import { useRooms } from "@/hooks/useRooms";

const GOLD = "#d4a843";
const CREAM = "#f5e6c8";
const DARK_BG = "#1a1a1a";
const CARD_BG = "#f5e6c8";
const CARD_TEXT = "#2c1810";

export function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { roomCode, nickname, setRoomCode, setNickname } = useStore();
  const { findRoomByCode } = useRooms();

  const [code, setCode] = useState(roomCode || searchParams.get("room") || "");
  const [name, setName] = useState(nickname);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const roomParam = searchParams.get("room");
    if (roomParam && !roomCode) {
      setCode(roomParam);
    }
  }, [searchParams, roomCode]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError("Please enter a room code.");
      return;
    }

    setLoading(true);
    const room = await findRoomByCode(code.trim().toUpperCase());
    setLoading(false);

    if (!room) {
      setError("Room not found. Please check the code and try again.");
      return;
    }

    if (!room.is_active) {
      setError("This room is currently closed.");
      return;
    }

    setRoomCode(code.trim().toUpperCase());
    setNickname(name.trim());
    navigate("/menu");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div
        className="w-full max-w-md p-8 rounded-lg shadow-xl"
        style={{ backgroundColor: DARK_BG, border: `1px solid ${GOLD}40` }}
      >
        <h2
          className="text-3xl font-bold text-center mb-2"
          style={{ color: GOLD }}
        >
          Welcome
        </h2>
        <p className="text-center mb-6" style={{ color: CREAM }}>
          Enter the room code to join the lounge.
        </p>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label
              htmlFor="roomCode"
              className="block text-sm font-medium mb-1"
              style={{ color: GOLD }}
            >
              Room Code
            </label>
            <input
              id="roomCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. LOUNGE"
              className="w-full px-4 py-3 rounded-md text-lg font-bold tracking-widest uppercase text-center"
              style={{
                backgroundColor: CARD_BG,
                color: CARD_TEXT,
                border: `2px solid ${GOLD}`,
              }}
              maxLength={10}
            />
          </div>

          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium mb-1"
              style={{ color: GOLD }}
            >
              Nickname <span className="text-sm opacity-70">(optional)</span>
            </label>
            <input
              id="nickname"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-md"
              style={{
                backgroundColor: CARD_BG,
                color: CARD_TEXT,
                border: `2px solid ${GOLD}`,
              }}
              maxLength={30}
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md font-bold text-lg uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: GOLD,
              color: "#000",
            }}
          >
            {loading ? "Joining..." : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
