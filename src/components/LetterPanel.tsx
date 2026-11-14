"use client";

import { useState } from "react";
import type { AnalyzeResult } from "@/lib/schemas";

export function LetterPanel({ result }: { result: AnalyzeResult }) {
  const [patientName, setPatientName] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [source, setSource] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result, patientName: patientName || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not write the letter.");
      setLetter(json.letter);
      setSource(json.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not write the letter.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Copy failed. Select the text and copy it manually.");
    }
  }

  function download() {
    if (!letter) return;
    const url = URL.createObjectURL(new Blob([letter], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "billback-dispute-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="letter">
      <h2>Your dispute letter</h2>
      <div className="row left">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          maxLength={120}
        />
        <button type="button" onClick={generate} disabled={loading}>
          {loading ? "Writing..." : letter ? "Regenerate letter" : "Draft my letter"}
        </button>
      </div>
      {error && <p className="status error">{error}</p>}
      {letter && (
        <>
          <textarea value={letter} onChange={(e) => setLetter(e.target.value)} rows={18} />
          <div className="row left">
            <button type="button" onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
            <button type="button" className="ghost" onClick={download}>Download .txt</button>
            <span className="muted">{source === "gemini" ? "Written by Gemini" : "Template draft"}</span>
          </div>
        </>
      )}
    </section>
  );
}
