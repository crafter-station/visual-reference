"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SubmitModalProps {
  open: boolean;
  onClose: () => void;
}

export function SubmitModal({ open, onClose }: SubmitModalProps) {
  const [url, setUrl] = useState("");

  if (!open) return null;

  const ghIssueUrl = `https://github.com/crafter-station/visual-reference/issues/new?title=${encodeURIComponent(`Hunt Request: ${url}`)}&body=${encodeURIComponent(`**URL:** ${url}\n\n_Submitted via visual-reference.crafter.run_`)}&labels=hunt-request`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    window.open(ghIssueUrl, "_blank");
    setUrl("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-white/[0.1] bg-[#111] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-white">Submit a site</h2>
            <p className="mt-1 text-[12px] text-white/40">
              We'll extract its design tokens and add it to the library.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/30 transition-colors hover:text-white/60"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-3 py-2.5 font-mono text-[13px] text-white placeholder-white/25 outline-none focus:border-white/[0.2]"
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="rounded-md bg-white px-4 py-2.5 text-[13px] font-medium text-black transition-opacity disabled:opacity-40"
          >
            Submit via GitHub
          </button>
        </form>

        <p className="mt-3 text-[11px] text-white/25">
          Opens a GitHub issue. We review and process within 48h.
        </p>
      </div>
    </div>
  );
}
