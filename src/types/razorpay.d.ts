export {};

type RazorpayInstance = { open: () => void; on: (event: string, cb: (response: unknown) => void) => void };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}
