"use client";

import { useState } from "react";
import { renderShareCard } from "@/lib/shareCard";
import type { AnalyzeResult } from "@/lib/schemas";

export function ShareCard({ result }: { result: AnalyzeResult }) {
  const [error, setError] = useState<string | null>(null);
  const { analysis, extraction } = result;

  async function make(): Promise<Blob> {
    return renderShareCard(analysis.estimatedSavings, extraction.totalBilled, analysis.issues.length);
  }

  async function download() {
    setError(null);
    try {
      const url = URL.createObjectURL(await make());
      const a = document.createElement("a");
      a.href = url;
      a.download = "billback-savings.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not make the card.");
    }
  }

  async function share() {
    setError(null);
    try {
      const file = new File([await make()], "billback-savings.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: "I checked my medical bill with BillBack." });
      } else {
        await download();
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Could not share.");
    }
  }

  return (
    <section className="share">
      <h2>Share your result</h2>
      <p className="muted">The card shows only the savings numbers, never your documents or name.</p>
      <div className="row left">
        <button type="button" onClick={share}>Share</button>
        <button type="button" className="ghost" onClick={download}>Download image</button>
      </div>
      {error && <p className="status error">{error}</p>}
    </section>
  );
}
