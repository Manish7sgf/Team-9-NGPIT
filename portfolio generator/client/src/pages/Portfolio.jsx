import { useState, useEffect, useRef } from "react";
import { portfolioApi } from "../api/index";
import RepoInput from "../components/portfolio/RepoInput";
import AnalysisResult from "../components/portfolio/AnalysisResult";
import PortfolioCard from "../components/portfolio/PortfolioCard";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../components/ui/Toast";

const DEMO_USER_ID = "demo"; // maps to fixed UUID on server

export default function Portfolio() {
  const [loading, setLoading]           = useState(false);
  const [analysisResult, setResult]     = useState(null);
  const [items, setItems]               = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [newItemId, setNewItemId]       = useState(null);
  const [verifyError, setVerifyError]   = useState("");
  const gridRef                         = useRef(null);
  const { toast, ToastContainer }       = useToast();

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setItemsLoading(true);
      const data = await portfolioApi.getAll(DEMO_USER_ID);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load items error:", err.message);
    } finally {
      setItemsLoading(false);
    }
  }

  async function handleVerify(url) {
    try {
      setLoading(true);
      setResult(null);
      setVerifyError("");
      const item = await portfolioApi.verify(url);
      setResult(item);
      setItems((prev) => [item, ...prev]);
      setNewItemId(item.id);
    } catch (err) {
      setVerifyError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToPassport() {
    setResult(null);
    setVerifyError("");
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleReset() {
    setResult(null);
    setVerifyError("");
  }

  async function handleRemove(id) {
    try {
      await portfolioApi.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Removed from portfolio.");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", gap: "32px" }}>
      <ToastContainer />

      {/* Page heading */}
      <div>
        <h1 style={{ fontFamily: "var(--font)", fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "4px" }}>
          Portfolio Generator
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          Paste a public GitHub repo URL. AI analyses the project and assesses your contribution.
        </p>
      </div>

      {/* Input */}
      <RepoInput onVerify={handleVerify} loading={loading} />

      {/* Inline API error */}
      {verifyError && !loading && (
        <div style={{
          background: "var(--red-bg)",
          border: "0.5px solid var(--red)",
          borderRadius: "var(--radius)",
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontSize: "13px", color: "var(--red)" }}>⚠ {verifyError}</span>
          <button
            onClick={() => setVerifyError("")}
            style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: "16px" }}
          >✕</button>
        </div>
      )}

      {/* AI result */}
      {analysisResult && (
        <AnalysisResult result={analysisResult} onAdd={handleAddToPassport} onReset={handleReset} />
      )}

      {/* Portfolio grid */}
      <div ref={gridRef}>
        <p style={{ fontFamily: "var(--font)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-tertiary)", marginBottom: "16px" }}>
          Your Verified Projects
          {items.length > 0 && (
            <span style={{ marginLeft: "8px", background: "var(--bg-secondary)", border: "0.5px solid var(--border)", borderRadius: "4px", padding: "1px 7px", fontSize: "11px", color: "var(--text-secondary)" }}>
              {items.length}
            </span>
          )}
        </p>

        {itemsLoading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <Spinner size={24} />
          </div>
        )}

        {!itemsLoading && items.length === 0 && (
          <div style={{ background: "var(--surface)", border: "0.5px dashed var(--border)", borderRadius: "var(--radius-lg)", padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font)", fontSize: "13px", color: "var(--text-tertiary)", marginBottom: "6px" }}>No projects yet</p>
            <p style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>Verify a GitHub repo above to get started.</p>
          </div>
        )}

        {!itemsLoading && items.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "16px" }}>
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} onRemove={handleRemove} highlight={item.id === newItemId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
