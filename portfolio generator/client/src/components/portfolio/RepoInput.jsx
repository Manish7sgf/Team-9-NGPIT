import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Spinner from "../ui/Spinner";

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/([\w-]+)\/([\w.-]+)\/?$/;

/**
 * RepoInput — URL entry + validate + submit.
 * Validates format client-side before calling API.
 *
 * Props:
 *   onVerify(url) — async function that calls the API
 *   loading       — bool, shows loading state
 */
export default function RepoInput({ onVerify, loading }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function validate(value) {
    if (!value.trim()) return "Please enter a GitHub repository URL.";
    if (!GITHUB_URL_REGEX.test(value.trim()))
      return "Must be a valid GitHub repo URL (https://github.com/owner/repo)";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const cleanUrl = url.trim().replace(/\.git$/, "");
    const err = validate(cleanUrl);
    if (err) { setError(err); return; }
    setError("");
    onVerify(cleanUrl);
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "0.5px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
      }}
    >
      {/* Section label */}
      <p
        style={{
          fontFamily: "var(--font)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--text-tertiary)",
          marginBottom: "12px",
        }}
      >
        Portfolio Generator
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          marginBottom: "16px",
        }}
      >
        Paste a public GitHub repository URL. AI will analyse the project and
        assess your contribution level.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(validate(e.target.value.replace(/\.git$/, "")));
          }}
          placeholder="https://github.com/username/repository"
          error={error}
          disabled={loading}
          autoFocus
        />

        <Button type="submit" disabled={loading} fullWidth>
          {loading ? (
            <>
              <Spinner size={14} />
              Analysing with AI…
            </>
          ) : (
            "Verify & Analyse →"
          )}
        </Button>
      </form>

      {/* Loading status lines */}
      {loading && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {["Fetching repository data from GitHub…", "Analysing with Nvidia Nemotron AI…"].map(
            (line, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                  animation: `fadeIn 0.4s ease ${i * 0.5}s both`,
                }}
              >
                {line}
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
