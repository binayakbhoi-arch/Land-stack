"use client";

import React, { useState } from "react";
import { LAND_RECORD_TERMS, LandTermGlossary } from "@/lib/glossary";
import { Sparkles, Sliders, ShieldAlert, Satellite, BarChart3, ChevronRight, HelpCircle, ArrowRightLeft, Layers, CheckCircle } from "lucide-react";

export function SmartFeaturesSection() {
  const [selectedTerm, setSelectedTerm] = useState<LandTermGlossary>(LAND_RECORD_TERMS[0]);
  const [satelliteSliderVal, setSatelliteSliderVal] = useState(50); // 0 to 100 for before/after comparison
  const [activeSimulationMode, setActiveSimulationMode] = useState<"vegetation" | "urbanization" | "encroachment">("urbanization");

  return (
    <section id="smart-features" className="py-12 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Geospatial Governance
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Smart Features & AI Cadastral Intelligence
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Integrating artificial intelligence, satellite multispectral time-series analysis, and natural-language civic explainers to make land governance transparent and fraud-proof.
          </p>
        </div>

        {/* Feature 1: Plain-Language AI Land Records Explainer */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Civic AI Explainer: Complex Land Terms Demystified</h3>
                <p className="text-xs text-slate-300">
                  Translating archaic legal jargon into plain citizen rights and actionable legal safeguards.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded-full">
              AI Plain Language Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Left selector */}
            <div className="p-3 bg-slate-50/70 space-y-1.5 max-h-[380px] overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block">
                Select Terminology to Explain
              </span>
              {LAND_RECORD_TERMS.map((t) => {
                const isSelected = t.term === selectedTerm.term;
                return (
                  <button
                    key={t.term}
                    onClick={() => setSelectedTerm(t)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-700 text-white font-semibold shadow-xs"
                        : "text-slate-700 hover:bg-slate-200/60"
                    }`}
                  >
                    <span className="truncate pr-2">{t.term.split("(")[0]}</span>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-emerald-200" : "text-slate-400"}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Card */}
            <div className="p-5 md:col-span-2 space-y-4">
              <div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                  Regional Equivalents
                </span>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-1.5">
                  {selectedTerm.regionalTerms.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 rounded-md text-slate-700 font-mono text-[11px]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedTerm.term}</h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {selectedTerm.plainMeaning}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-sky-800">Why It Matters</span>
                  <p className="text-sky-950 leading-relaxed text-[11px]">{selectedTerm.significance}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-800">AI Citizen Advice</span>
                  <p className="text-emerald-950 leading-relaxed text-[11px]">{selectedTerm.aiAdvice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Satellite Change Detection Simulator */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                <Satellite className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Interactive Satellite Change-Detection Simulator
                </h3>
                <p className="text-xs text-slate-500">
                  Sentinel-2 and Cartosat-3 multi-temporal comparison engine for automated boundary change detection.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveSimulationMode("urbanization")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeSimulationMode === "urbanization" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Layout / Urban Build
              </button>
              <button
                onClick={() => setActiveSimulationMode("vegetation")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeSimulationMode === "vegetation" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Crop / Vegetation Health
              </button>
              <button
                onClick={() => setActiveSimulationMode("encroachment")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeSimulationMode === "encroachment" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Boundary Shift Discrepancy
              </button>
            </div>
          </div>

          {/* Interactive Split Viewer Mockup */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-64 sm:h-80 bg-slate-900 select-none">
            {/* Background 1: "Before" Image (Year 2022) */}
            <div
              className="absolute inset-0 bg-cover bg-center flex items-end p-4 transition-all"
              style={{
                backgroundImage:
                  activeSimulationMode === "vegetation"
                    ? "radial-gradient(circle at 30% 40%, #15803d 0%, #064e3b 80%)"
                    : activeSimulationMode === "encroachment"
                    ? "radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)"
                    : "linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%)",
              }}
            >
              <div className="z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs border border-white/10">
                <span className="font-bold">Baseline: Jan 2023 Pass</span>
                <div className="text-[10px] text-emerald-300">Agricultural zoning intact • Zero earthwork</div>
              </div>
            </div>

            {/* Background 2: "After" Layer clipped by slider */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none transition-all"
              style={{ clipPath: `inset(0 0 0 ${satelliteSliderVal}%)` }}
            >
              <div
                className="w-full h-full bg-cover bg-center flex items-end justify-end p-4 relative"
                style={{
                  backgroundImage:
                    activeSimulationMode === "vegetation"
                      ? "radial-gradient(circle at 70% 60%, #b45309 0%, #78350f 80%)"
                      : activeSimulationMode === "encroachment"
                      ? "radial-gradient(circle at 50% 50%, #991b1b 0%, #450a0a 100%)"
                      : "linear-gradient(135deg, #475569 0%, #334155 50%, #1e293b 100%)",
                }}
              >
                {/* Simulated Cadastral Overlays */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                  <div className="w-48 h-48 border-2 border-dashed border-rose-400 rounded-lg flex items-center justify-center text-rose-300 font-mono text-xs">
                    ⚠️ AI Overlap Box (+38% Footprint)
                  </div>
                </div>

                <div className="z-10 bg-rose-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs border border-rose-500/40 text-right">
                  <span className="font-bold text-rose-200">Current: Jan 2025 Pass</span>
                  <div className="text-[10px] text-rose-300">
                    {activeSimulationMode === "encroachment"
                      ? "Boundary shift detected vs FMB cadastral sketch"
                      : activeSimulationMode === "vegetation"
                      ? "Drought / Soil moisture loss flag"
                      : "New masonry structure detected without NA diversion order"}
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none z-20 flex items-center justify-center"
              style={{ left: `${satelliteSliderVal}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-white text-slate-800 shadow-xl border border-slate-300 flex items-center justify-center text-[10px] font-bold">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Real Slider Input on top */}
            <input
              type="range"
              min="0"
              max="100"
              value={satelliteSliderVal}
              onChange={(e) => setSatelliteSliderVal(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            />
          </div>

          {/* Slider Instruction Note */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" /> Drag slider left or right to inspect multi-year satellite surface changes.
            </span>
            <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Split Position: {satelliteSliderVal}% (Baseline vs Current)
            </span>
          </div>
        </div>

        {/* Feature 3: Anomaly & Duplicate Record Simulation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Duplicate Survey Detection</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated hash comparison prevents fraudulent double-registration of the same survey sub-division across neighboring sub-registrar jurisdictions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Cadastral Polygon Snapping</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every parcel boundary is digitally snapped to adjacent khatedar polygons with zero gaps or overlaps, achieving seamless village-wide GIS mosaics.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Auto-Mutation Sync</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantaneous generation of digital mutation notices directly from registered deeds, reducing citizen grievance pendency from months to days.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
