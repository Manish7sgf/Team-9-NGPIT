import Badge from "../ui/Badge";
import Button from "../ui/Button";

/**
 * AnalysisResult — appears after AI analyses a repo.
 * Shows the AI's full breakdown before it gets added to the grid.
 *
 * Props:
 *   result   — the portfolio item returned from /api/portfolio/verify
 *   onAdd    — callback to scroll to grid (item is already saved)
 *   onReset  — callback to clear and analyse another
 */
export default function AnalysisResult({ result, onAdd, onReset }) {
  const levelVariant = {
    high: "green",
    medium: "amber",
    low: "red",
  }[result.contribution_level] || "default";

  const techStack = Array.isArray(result.tech_stack)
    ? result.tech_stack
    : JSON.parse(result.tech_stack || "[]");

  const skills = Array.isArray(result.skills_demonstrated)
    ? result.skills_demonstrated
    : JSON.parse(result.skills_demonstrated || "[]");

  return (
    <div
      className="fade-in"
      style={{
        background: "var(--surface)",
        border: "0.5px solid var(--green)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        marginTop: "16px",
      }}
    >
      {/* Section label */}
      <p style={{
        fontFamily: "var(--font)",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--text-tertiary)",
        marginBottom: "14px",
      }}>
        AI Analysis Complete
      </p>

      {/* Title + badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
        <h2 style={{ fontFamily: "var(--font)", fontSize: "18px", color: "var(--text-primary)" }}>
          {result.title}
        </h2>
        <Badge variant={levelVariant}>{result.contribution_level} contribution</Badge>
        <Badge variant="green">✓ Verified</Badge>
      </div>

      {/* Description */}
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
        {result.description}
      </p>

      {/* Complexity */}
      {result.complexity_score && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
            Complexity Score
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, height: "6px", background: "var(--bg-secondary)", borderRadius: "3px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${(result.complexity_score / 10) * 100}%`,
                  background: "var(--accent)",
                  borderRadius: "3px",
                  transition: "width 0.8s ease",
                }}
              />
            </div>
            <span style={{ fontFamily: "var(--font)", fontSize: "13px", color: "var(--text-primary)", minWidth: "40px" }}>
              {result.complexity_score}/10
            </span>
          </div>
        </div>
      )}

      {/* Contribution reason */}
      {result.contribution_reason && (
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontStyle: "italic", marginBottom: "16px", paddingLeft: "12px", borderLeft: "2px solid var(--border)" }}>
          {result.contribution_reason}
        </p>
      )}

      {/* Tech stack */}
      {techStack.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Tech Stack
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {techStack.map((t, i) => <Badge key={i}>{t}</Badge>)}
          </div>
        </div>
      )}

      {/* Skills demonstrated */}
      {skills.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Skills Demonstrated
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.map((s, i) => <Badge key={i} variant="outline">{s}</Badge>)}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <Button onClick={onAdd}>
          Add to Passport →
        </Button>
        <Button variant="secondary" onClick={onReset}>
          Analyse Another
        </Button>
      </div>
    </div>
  );
}
