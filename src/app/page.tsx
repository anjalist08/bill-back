"use client";

import { useState } from "react";
import { Results } from "@/components/Results";
import { Uploader } from "@/components/Uploader";
import { SAMPLE_RESULT } from "@/lib/sample";
import type { AnalyzeResult } from "@/lib/schemas";

type State =
  | { status: "idle" }
  | { status: "loading"; label: string }
  | { status: "done"; result: AnalyzeResult; isSample: boolean }
  | { status: "error"; message: string };

export default function Home() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function analyze(file: File) {
    setState({ status: "loading", label: "Reading your document and checking every charge..." });
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/analyze", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setState({ status: "done", result: json as AnalyzeResult, isSample: false });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  const busy = state.status === "loading";

  return (
    <main>
      <h1>BillBack</h1>
      <p className="lead">
        Upload a medical bill or insurance denial. We find likely errors, estimate your savings, and draft your
        dispute letter.
      </p>

      <Uploader
        disabled={busy}
        onFile={analyze}
        onSample={() => setState({ status: "done", result: SAMPLE_RESULT, isSample: true })}
      />

      {state.status === "loading" && <p className="status">{state.label}</p>}
      {state.status === "error" && <p className="status error">{state.message}</p>}
      {state.status === "done" && (
        <>
          {state.isSample && <p className="muted">This is a fictional sample bill.</p>}
          <Results result={state.result} />
        </>
      )}

      <footer className="disclaimer">
        BillBack provides information, not legal or medical advice. Results are potential issues to verify with your
        provider or insurer.
      </footer>
    </main>
  );
}
