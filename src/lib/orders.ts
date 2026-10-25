import type { Order } from "./types";

// Browser copy of the customer's recent orders, used by the confirmation and account pages.
// Phase 2: orders are read from Supabase for signed-in customers; this stays as a guest fallback.
const ORDERS = "kc_orders_v1";

export function saveOrder(order: Order) {
  try {
    const all = readOrders();
    window.localStorage.setItem(ORDERS, JSON.stringify([order, ...all].slice(0, 20)));
  } catch {
    /* storage unavailable */
  }
}

export function readOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(ORDERS);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

export function newOrderId() {
  return "KC" + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);
}
