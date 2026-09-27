"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, QrCode, ExternalLink, X, Send } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://landstack.gov.in";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Land Stack — Land Parcel Information Portal",
          text: "Check out Land Stack: One parcel, one identity, transparent land governance.",
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Inspect Land Stack (Cadastral Land Parcel Portal): ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Land Stack Portal Demo Link");
    const body = encodeURIComponent(
      `Hello,\n\nPlease review the Land Stack GIS land-parcel information portal:\n${currentUrl}\n\nFeatures:\n- Interactive ULPIN cadastral map\n- Record of Rights (RoR) & Mutation workflows\n- Citizen AI plain-language terms explainer\n- Multi-lingual support (22 Scheduled Indian languages)\n- Authorized Revenue Administrator Portal (Simulation)`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-xs">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Share Land Stack</h3>
              <p className="text-slate-500 text-[11px]">Send live application preview link to someone</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Copyable URL field */}
        <div className="space-y-1.5">
          <label className="block text-slate-600 font-semibold text-[11px]">Direct App URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 select-all focus:outline-hidden"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Quick Send Options */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-slate-600 font-semibold text-[11px]">Quick Send Channels</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleWhatsApp}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-medium flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Send className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleEmail}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-medium flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-slate-600" />
              <span>Email</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="p-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-xl font-medium flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Share2 className="w-4 h-4 text-sky-600" />
              <span>Device Share</span>
            </button>
          </div>
        </div>

        {/* QR Code toggle */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowQr(!showQr)}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-medium"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>{showQr ? "Hide QR Code" : "Show QR Code for mobile scanning"}</span>
          </button>

          {showQr && (
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center text-center space-y-2 animate-in fade-in">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(currentUrl)}`}
                alt="QR Code to open Land Stack"
                className="w-36 h-36 rounded-lg bg-white p-1.5 border border-slate-200 shadow-2xs"
              />
              <span className="text-[11px] text-slate-500">Scan with any smartphone camera to open on mobile</span>
            </div>
          )}
        </div>

        {/* Help notice */}
        <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 text-center leading-relaxed">
          Anyone with this link can interact with the live map, sample ULPIN parcel profiles, AI explainer, and admin portal simulation.
        </div>

      </div>
    </div>
  );
}
