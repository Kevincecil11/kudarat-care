"use client";
import { useEffect, useState, type FormEvent } from "react";
import { errText, type SectionProps } from "./shared";

type Rules = { points_per_100: number; point_value_inr: number; min_redeem: number; expiry_months: number; photo_review_bonus: number; video_review_bonus: number };

const FIELDS: { id: keyof Rules; label: string; step?: string }[] = [
  { id: "points_per_100", label: "Points earned per ₹100 spent" },
  { id: "point_value_inr", label: "Value of 1 point (₹)", step: "0.25" },
  { id: "min_redeem", label: "Minimum points to redeem" },
  { id: "expiry_months", label: "Points expire after (months)" },
  { id: "photo_review_bonus", label: "Bonus for approved photo review" },
  { id: "video_review_bonus", label: "Bonus for approved video review" },
];

export function Rewards({ db, flash }: SectionProps) {
  const [rules, setRules] = useState<Rules | null>(null);
  const [members, setMembers] = useState(0);

  useEffect(() => {
    db.from("reward_rules")
      .select("points_per_100, point_value_inr, min_redeem, expiry_months, photo_review_bonus, video_review_bonus")
      .eq("id", 1)
      .single()
      .then(({ data }) => setRules(data as Rules));
    db.from("reward_balances")
      .select("user_id", { count: "exact", head: true })
      .gt("balance", 0)
      .then(({ count }) => setMembers(count ?? 0));
  }, [db]);

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const patch: Record<string, number> = {};
    FIELDS.forEach((x) => {
      patch[x.id] = Math.max(0, Number(f.get(x.id)) || 0);
    });
    if (!patch.expiry_months) patch.expiry_months = 12;
    const { error } = await db.from("reward_rules").update(patch).eq("id", 1);
    flash(error ? errText(error) : "Reward rules saved. New orders and reviews use these rules.");
  };

  if (!rules) return <div className="empty" aria-busy="true">Loading…</div>;
  return (
    <>
      <h1>KC Circle rules</h1>
      <form className="card form" onSubmit={save}>
        <p className="muted">Points are added automatically: on payment for orders, and when you approve a signed-in customer's photo or video review.</p>
        <div className="form__grid">
          {FIELDS.map((x) => (
            <div className="field" key={x.id}>
              <label htmlFor={`rw-${x.id}`}>{x.label}</label>
              <input id={`rw-${x.id}`} name={x.id} type="number" min={0} step={x.step ?? "1"} className="input" defaultValue={rules[x.id]} />
            </div>
          ))}
        </div>
        <button className="btn btn-primary" type="submit">
          Save rules
        </button>
      </form>
      <div className="card">
        <h2>Members with points</h2>
        <p className="muted">{members ? `${members} customer${members === 1 ? "" : "s"} currently hold points.` : "No points issued yet."}</p>
      </div>
    </>
  );
}
