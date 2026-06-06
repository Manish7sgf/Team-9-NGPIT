/**
 * Button — Primary and Secondary variants.
 * Primary: black fill, off-white text.
 * Secondary: transparent, outline border.
 */
export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  fullWidth = false,
  type = "button",
  style = {},
}) {
  const base = {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 500,
    padding: "10px 20px",
    borderRadius: "var(--radius)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "opacity 0.15s, background 0.15s, border-color 0.15s",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.5 : 1,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
    ...style,
  };

  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--accent-text)",
    },
    secondary: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "0.5px solid var(--border-strong)",
    },
    danger: {
      background: "var(--red-bg)",
      color: "var(--red)",
      border: "0.5px solid var(--red)",
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "0.8";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "1";
      }}
    >
      {children}
    </button>
  );
}
