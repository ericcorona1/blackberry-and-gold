import { create } from "zustand";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable - silently fail
  }
}

interface AppState {
  roomCode: string;
  nickname: string;
  orderId: string | null;
  adminAuthenticated: boolean;

  setRoomCode: (code: string) => void;
  setNickname: (name: string) => void;
  setOrderId: (id: string | null) => void;
  setAdminAuthenticated: (auth: boolean) => void;
  clearLocalState: () => void;
}

export const useStore = create<AppState>((set) => ({
  roomCode: loadFromStorage("bg_room_code", ""),
  nickname: loadFromStorage("bg_nickname", ""),
  orderId: loadFromStorage<string | null>("bg_order_id", null),
  adminAuthenticated: false,

  setRoomCode: (code: string) => {
    saveToStorage("bg_room_code", code);
    set({ roomCode: code });
  },

  setNickname: (name: string) => {
    saveToStorage("bg_nickname", name);
    set({ nickname: name });
  },

  setOrderId: (id: string | null) => {
    saveToStorage("bg_order_id", id);
    set({ orderId: id });
  },

  setAdminAuthenticated: (auth: boolean) => {
    set({ adminAuthenticated: auth });
  },

  clearLocalState: () => {
    localStorage.removeItem("bg_room_code");
    localStorage.removeItem("bg_nickname");
    localStorage.removeItem("bg_order_id");
    set({ roomCode: "", nickname: "", orderId: null });
  },
}));
