/**
 * Badge — skill tag, contribution level, impact label.
 * variant: "default" | "green" | "amber" | "red" | "outline"
 */
export default function Badge({ children, variant = "default" }) {
  const styles = {
    default: {
      background: "var(--bg-secondary)",
      color: "var(--text-secondary)",
      border: "0.5px solid var(--border)",
    },
    green: {
      background: "var(--green-bg)",
      color: "var(--green)",
      border: "0.5px solid var(--green)",
    },
    amber: {
      background: "var(--amber-bg)",
      color: "var(--amber)",
      border: "0.5px solid var(--amber)",
    },
    red: {
      background: "var(--red-bg)",
      color: "var(--red)",
      border: "0.5px solid var(--red)",
    },
    outline: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "0.5px solid var(--border-strong)",
    },
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "4px",
        fontSize: "11px",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        ...styles[variant],
      }}
    >
      {children}
    </span>
  );
}
