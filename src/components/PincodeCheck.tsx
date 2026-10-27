"use client";
import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Icon } from "./Icon";

export function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const check = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      setResult("Please enter a valid 6-digit PIN code.");
      return;
    }
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setResult(`Estimated delivery to ${pin}: ${site.shipping.deliveryEstimate}.`);
      return;
    }
    // An empty PIN list means KudaratCare delivers everywhere in India.
    const [{ count }, { data: settings }] = await Promise.all([
      supabase.from("serviceable_pincodes").select("pincode", { count: "exact", head: true }),
      supabase.from("site_settings").select("delivery_estimate").eq("id", 1).maybeSingle(),
    ]);
    const eta = (settings as { delivery_estimate?: string } | null)?.delivery_estimate ?? site.shipping.deliveryEstimate;
    if (count) {
      const { data } = await supabase.from("serviceable_pincodes").select("pincode").eq("pincode", pin).maybeSingle();
      if (!data) {
        setResult(`Sorry, we do not deliver to ${pin} yet. Message us and we will try to help.`);
        return;
      }
    }
    setResult(`Estimated delivery to ${pin}: ${eta}.`);
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
