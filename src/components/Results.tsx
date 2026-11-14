import type { AnalyzeResult } from "@/lib/schemas";
import { money } from "@/lib/format";

export function Results({ result }: { result: AnalyzeResult }) {
  const { extraction, analysis } = result;
  return (
    <section className="results">
      <div className="hero-stat">
        <div className="hero-label">Potential savings found</div>
        <div className="hero-number">{money(analysis.estimatedSavings)}</div>
        <div className="hero-sub">
          of {money(extraction.totalBilled)} billed &middot; {analysis.issues.length} issue
          {analysis.issues.length === 1 ? "" : "s"}
        </div>
      </div>
      <p className="summary">{analysis.summary}</p>

      <h2>Issues to dispute</h2>
      {analysis.issues.length === 0 && <p className="muted">No clear issues found. Double-check the extracted items below.</p>}
      <ul className="issues">
        {analysis.issues.map((issue) => (
          <li key={issue.id} className={`issue sev-${issue.severity}`}>
            <div className="issue-head">
              <span className="badge">{issue.severity}</span>
              <strong>{issue.title}</strong>
              <span className="save">{money(issue.estimatedSavings)}</span>
            </div>
            <p>{issue.explanation}</p>
            <p className="action">
              <em>Ask for:</em> {issue.suggestedAction}
            </p>
            <div className="conf">Confidence {Math.round(issue.confidence * 100)}%</div>
          </li>
        ))}
      </ul>

      <h2>What we read from your document</h2>
      <table>
        <thead>
          <tr><th>#</th><th>Code</th><th>Description</th><th className="num">Amount</th></tr>
        </thead>
        <tbody>
          {extraction.lineItems.map((item, i) => (
            <tr key={i}>
              <td>{i}</td>
              <td>{item.code ?? "-"}</td>
              <td>{item.description}</td>
              <td className="num">{money(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
