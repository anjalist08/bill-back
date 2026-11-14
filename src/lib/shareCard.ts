import { money } from "./format";

/** Draws a 1200x630 savings card to a canvas and returns a PNG blob. No document details are included. */
export async function renderShareCard(savings: number, billed: number, issues: number): Promise<Blob> {
  const w = 1200;
  const h = 630;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#0b1020");
  bg.addColorStop(1, "#16224a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = "center";
  ctx.fillStyle = "#9aa4bf";
  ctx.font = "600 38px system-ui, sans-serif";
  ctx.fillText("My medical bill had potential errors worth", w / 2, 150);

  ctx.fillStyle = "#4ade80";
  ctx.font = "800 190px system-ui, sans-serif";
  ctx.fillText(money(savings), w / 2, 360);

  ctx.fillStyle = "#e8ecf6";
  ctx.font = "600 40px system-ui, sans-serif";
  ctx.fillText(`found in 60 seconds, across ${issues} flagged issue${issues === 1 ? "" : "s"}`, w / 2, 440);
  ctx.fillStyle = "#9aa4bf";
  ctx.font = "400 32px system-ui, sans-serif";
  ctx.fillText(`out of ${money(billed)} billed`, w / 2, 490);

  ctx.fillStyle = "#e8ecf6";
  ctx.font = "800 44px system-ui, sans-serif";
  ctx.fillText("BillBack", w / 2, 580);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create image."))), "image/png"),
  );
}
