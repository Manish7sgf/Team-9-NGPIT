import Badge from "../ui/Badge";
import Button from "../ui/Button";

/**
 * PortfolioCard — displays a single verified portfolio item.
 *
 * Props:
 *   item     — portfolio_items DB row
 *   onRemove — callback(id)
 *   highlight — bool, if true shows fade-in animation (newly added item)
 */
export default function PortfolioCard({ item, onRemove, highlight = false }) {
  const levelVariant = {
    high: "green",
    medium: "amber",
    low: "red",
  }[item.contribution_level] || "default";

  const techStack = Array.isArray(item.tech_stack)
    ? item.tech_stack
    : JSON.parse(item.tech_stack || "[]");

  const skills = Array.isArray(item.skills_demonstrated)
    ? item.skills_demonstrated
    : JSON.parse(item.skills_demonstrated || "[]");

  return (
    <div
      className={highlight ? "fade-in" : ""}
      style={{
        background: "var(--surface)",
        border: "0.5px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        position: "relative",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--border-strong)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
    >
      {/* Remove button */}
      <button
        onClick={() => onRemove(item.id)}
        title="Remove"
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-tertiary)",
          fontSize: "16px",
          lineHeight: 1,
          padding: "2px 6px",
          borderRadius: "4px",
          transition: "color 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--red)";
          e.currentTarget.style.background = "var(--red-bg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-tertiary)";
          e.currentTarget.style.background = "none";
        }}
      >
        ✕
      </button>

      {/* Header row: title + contribution badge */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingRight: "30px", marginBottom: "8px" }}>
        <h3
          style={{
            fontFamily: "var(--font)",
            fontSize: "15px",
            fontWeight: 500,
            color: "var(--text-primary)",
            flex: 1,
          }}
        >
          {item.title}
        </h3>
        <Badge variant={levelVariant}>
          {item.contribution_level || "medium"}
        </Badge>
        {item.verified && (
          <Badge variant="green">✓ verified</Badge>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: "14px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {item.description}
      </p>

      {/* Complexity + contribution reason */}
      {(item.complexity_score || item.contribution_reason) && (
        <div style={{ marginBottom: "14px" }}>
          {item.complexity_score && (
            <p style={{ fontSize: "12px", color: "var(--text-tertiary)", marginBottom: "2px" }}>
              Complexity:{" "}
              <span style={{ fontFamily: "var(--font)", color: "var(--text-primary)" }}>
                {item.complexity_score}/10
              </span>
            </p>
          )}
          {item.contribution_reason && (
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontStyle: "italic" }}>
              {item.contribution_reason}
            </p>
          )}
        </div>
      )}

      {/* Tech stack pills */}
      {techStack.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
            Tech Stack
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {techStack.map((tech, i) => (
              <Badge key={i}>{tech}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Skills demonstrated */}
      {skills.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
            Skills Demonstrated
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.map((skill, i) => (
              <Badge key={i} variant="outline">{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Repo link */}
      <a
        href={item.repo_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "var(--font)",
          fontSize: "11px",
          color: "var(--text-tertiary)",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          wordBreak: "break-all",
        }}
      >
        {item.repo_url}
      </a>
    </div>
  );
}
