/**
 * Input — single-line text input following the design system.
 */
export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  disabled = false,
  style = {},
  onKeyDown,
  autoFocus = false,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        style={{
          background: "var(--surface)",
          border: `0.5px solid ${error ? "var(--red)" : "var(--border)"}`,
          borderRadius: "var(--radius)",
          padding: "10px 14px",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--text-primary)",
          width: "100%",
          outline: "none",
          transition: "border-color 0.15s",
          opacity: disabled ? 0.6 : 1,
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? "var(--red)" : "var(--accent)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "var(--red)" : "var(--border)";
        }}
      />
      {error && (
        <span style={{ fontSize: "12px", color: "var(--red)" }}>{error}</span>
      )}
    </div>
  );
}
