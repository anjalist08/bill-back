"use client";

import { useRef, useState } from "react";

type Props = {
  onFile: (file: File) => void;
  onSample: () => void;
  disabled?: boolean;
};

export function Uploader({ onFile, onSample, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function pick(files: FileList | null) {
    const file = files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      className={`dropzone${dragging ? " drag" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) pick(e.dataTransfer.files);
      }}
    >
      <p className="drop-title">Drop a bill, EOB or denial letter here</p>
      <p className="muted">PNG, JPG, WebP, HEIC or PDF, up to 10 MB</p>
      <div className="row">
        <button type="button" disabled={disabled} onClick={() => inputRef.current?.click()}>
          Choose file
        </button>
        <button type="button" className="ghost" disabled={disabled} onClick={onSample}>
          Try a sample bill
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/png,image/jpeg,image/webp,image/heic,application/pdf"
        onChange={(e) => pick(e.target.files)}
      />
    </div>
  );
}
