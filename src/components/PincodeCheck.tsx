"use client";
import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

export function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const check = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      setResult("Please enter a valid 6-digit PIN code.");
      return;
    }
    // Phase 2: look up the `serviceable_pincodes` table.
    setResult(`Estimated delivery to ${pin}: ${site.shipping.deliveryEstimate}.`);
  };

  return (
    <form className="pincode" onSubmit={check}>
      <label htmlFor="pincode">
        <Icon name="truck" size={18} /> Check delivery
      </label>
      <div className="pincode__row">
        <input
          id="pincode"
          className="input"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Enter PIN code"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
        />
        <button className="btn btn-ghost" type="submit">
          Check
        </button>
      </div>
      {result ? (
        <p className="pincode__result" role="status">
          {result}
        </p>
      ) : null}
    </form>
  );
}
