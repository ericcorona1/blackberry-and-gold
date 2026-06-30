export interface Room {
  id: string;
  code: string;
  created_at: string;
  is_active: boolean;
}

export interface Order {
  id: string;
  room_id: string;
  order_number: number;
  guest_name: string;
  drink_id: string;
  drink_name: string;
  notes: string;
  status: OrderStatus;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

export type OrderStatus = "pending" | "making" | "ready" | "served";

export interface Drink {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
}

export interface LocalState {
  roomCode: string;
  nickname: string;
  orderId: string | null;
}
