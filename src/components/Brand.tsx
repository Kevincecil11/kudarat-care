export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand brand--compact" : "brand"}>
      <span className="brand__mono" aria-hidden="true" />
      <span className="brand__word" role="img" aria-label="KudaratCare" />
    </span>
  );
}
