import { Icon } from "./Icon";

export function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={size} className={i <= Math.round(value) ? "on" : "off"} />
      ))}
    </span>
  );
}
