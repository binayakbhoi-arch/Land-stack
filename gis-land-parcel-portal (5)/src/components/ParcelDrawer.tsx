"use client";

import React, { useState } from "react";
import { Parcel } from "@/db/schema";
import { 
  X, ShieldCheck, AlertTriangle, FileText, Download, Share2, Printer, 
  MapPin, User, Building, Calendar, CheckCircle2, ChevronRight, Layers, 
  ExternalLink, Sparkles, Scale, Info
} from "lucide-react";

interface ParcelDrawerProps {
  parcel: Parcel | null;
  onClose: () => void;
  onFocusMap?: () => void;
  dict: any;
}

export function ParcelDrawer({ parcel, onClose, onFocusMap, dict }: ParcelDrawerProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "ror" | "mutation" | "satellite" | "documents">("summary");
  const [copied, setCopied] = useState(false);
  const [showPrintToast, setShowPrintToast] = useState(false);

  if (!parcel) return null;

  const docs = (parcel.documentsJson as any[]) || [];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    setShowPrintToast(true);
    setTimeout(() => setShowPrintToast(false), 3000);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden transform transition-transform duration-300">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-start justify-between relative overflow-hidden border-b border-slate-800">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                ULPIN ID
              </span>
              <span className="text-xs text-slate-300 font-mono">{parcel.ulpin}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Survey No. {parcel.surveyNumber}</span>
              <span className="text-sm font-normal text-slate-400">({parcel.village}, {parcel.district})</span>
            </h2>
            <p className="text-xs text-slate-300">
              Presumptive Title Holder: <strong className="text-white">{parcel.ownerName}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] font-medium leading-tight">
              <strong>Demonstration Prototype:</strong> Sample record for civic transparency & GIS navigation. Not an official legal title.
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold uppercase">
            Simulation
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-4 bg-slate-50 overflow-x-auto text-xs font-medium text-slate-600 no-scrollbar">
          <button
            onClick={() => setActiveTab("summary")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "summary"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Building className="w-3.5 h-3.5" /> Summary
          </button>
          <button
            onClick={() => setActiveTab("ror")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "ror"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> RoR / Jamabandi
          </button>
          <button
            onClick={() => setActiveTab("mutation")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "mutation"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> Mutation History
          </button>
          <button
            onClick={() => setActiveTab("satellite")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "satellite"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Satellite & AI
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "documents"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Docs ({docs.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
          
          {/* TAB 1: SUMMARY */}
          {activeTab === "summary" && (
            <div className="space-y-6">
              
              {/* Status badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Verification</span>
                  <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold text-xs mt-0.5">
                    {parcel.verificationStatus === "Verified" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>{parcel.verificationStatus}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Land Use</span>
                  <div className="text-slate-800 font-bold text-xs mt-0.5">
                    {parcel.landUse}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Title Clearance</span>
                  <div className="text-slate-800 font-bold text-xs mt-0.5 truncate">
                    {parcel.disputeStatus}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Tax Status</span>
                  <div className={`font-bold text-xs mt-0.5 ${parcel.taxStatus === "Paid" ? "text-emerald-700" : "text-amber-700"}`}>
                    {parcel.taxStatus}
                  </div>
                </div>
              </div>

              {/* Anomaly Notification */}
              {parcel.hasAnomaly && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-900">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide text-rose-800">
                      Automated Cadastral Flag Detected
                    </h4>
                    <p className="text-xs text-rose-700 mt-0.5">
                      {parcel.anomalyType || "Boundary discrepancy flagged by digital cadastral comparison."}
                    </p>
                  </div>
                </div>
              )}

              {/* Geo & Cadastral Metrics */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Cadastral Survey & Measurement
                </h3>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <dt className="text-slate-500 text-[11px]">Area in Acres</dt>
                    <dd className="font-semibold text-slate-900 text-sm">{parcel.areaAcres} Acres</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Area in Hectares</dt>
                    <dd className="font-semibold text-slate-900 text-sm">{parcel.areaHectares} Ha</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Area in Sq. Meters</dt>
                    <dd className="font-semibold text-slate-900 text-sm">{parcel.areaSqMeters.toLocaleString()} m²</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Sub-Division / Hissa</dt>
                    <dd className="font-semibold text-slate-900">{parcel.subDivision}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Village / Hobli</dt>
                    <dd className="font-semibold text-slate-900">{parcel.village}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Taluk / Tehsil</dt>
                    <dd className="font-semibold text-slate-900">{parcel.taluk}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">District & State</dt>
                    <dd className="font-semibold text-slate-900">{parcel.district}, {parcel.state}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Postal PIN Code</dt>
                    <dd className="font-semibold text-slate-900">{parcel.pinCode}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-[11px]">Guidance / Market Val.</dt>
                    <dd className="font-semibold text-emerald-700 font-mono text-sm">
                      ₹{parcel.marketValueInr.toLocaleString("en-IN")}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Ownership & Co-Owners */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Title & Khatedar Information
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500">Primary Registered Khatedar:</span>
                    <p className="font-semibold text-slate-900 text-sm">{parcel.ownerName}</p>
                  </div>
                  {parcel.coOwners && (
                    <div className="pt-2 border-t border-slate-200/80">
                      <span className="text-slate-500">Co-Owners / Joint Share:</span>
                      <p className="text-slate-800">{parcel.coOwners}</p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Sub-Registrar Office (SRO):</span>
                    <span className="font-semibold text-slate-800">{parcel.sroOffice}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Deed Type of Title:</span>
                    <span className="font-semibold text-slate-800">{parcel.deedType}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Registration Date:</span>
                    <span className="font-semibold text-slate-800">{parcel.registrationDate}</span>
                  </div>
                </div>
              </div>

              {/* Revenue & Tax Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Revenue Cess & Tax Compliance
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Annual Revenue Assessment</span>
                    <p className="font-mono font-bold text-slate-800">
                      {parcel.taxAmountAnnual ? `₹${parcel.taxAmountAnnual.toLocaleString("en-IN")}` : "Exempt"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Last Payment Recorded</span>
                    <p className="font-semibold text-slate-800">{parcel.lastTaxPaidDate || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Digital Record Update</span>
                    <p className="font-semibold text-slate-800">{parcel.lastUpdatedDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">GIS Geo-Centroid</span>
                    <p className="font-mono text-[11px] text-slate-600">{parcel.lat.toFixed(4)}° N, {parcel.lng.toFixed(4)}° E</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ROR (Jamabandi / Pahani) */}
          {activeTab === "ror" && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                <div className="bg-slate-800 text-white p-3 flex items-center justify-between text-xs">
                  <span className="font-bold">Digital Record of Rights (Pahani / Khasra-Khatauni)</span>
                  <span className="font-mono text-[11px] text-emerald-400 font-semibold">{parcel.rorNumber}</span>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-slate-500">Khata / Khatauni No.:</span>
                      <p className="font-bold text-slate-900">{parcel.surveyNumber}-KHT</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Cultivator / Occupant:</span>
                      <p className="font-bold text-slate-900">Self (Khatedar)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-slate-500">Source of Irrigation:</span>
                      <p className="text-slate-800">Borewell & Canal Tributary</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Crops Recorded (Rabi/Kharif):</span>
                      <p className="text-slate-800">Paddy, Groundnut / Horticulture</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 block">Encumbrance & Liability Remarks (Column 11):</span>
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-mono text-[11px]">
                      {parcel.disputeStatus === "Clear Title" 
                        ? "CLEAR TITLE: No active bank hypothecation, attachment, or civil court restrain registered against ULPIN."
                        : `CAVEAT: Subject to pending proceedings (${parcel.disputeStatus}). Refer District Revenue Court.`
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Need certified physical extract?</div>
                  <div className="text-[11px] text-slate-500">Citizens can request digitally signed extracts at nearest MeeSeva/CSC.</div>
                </div>
                <button 
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700"
                >
                  Request Extract (Demo)
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MUTATION HISTORY */}
          {activeTab === "mutation" && (
            <div className="space-y-4">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                
                {/* Current Active Entry */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-100" />
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Mutation Order: {parcel.mutationNumber || "MUT-2021-09"}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        {parcel.mutationStatus || "Approved"}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Attested by Revenue Inspector / Tahsildar. Ownership title updated under {parcel.deedType}.
                    </p>
                    <div className="text-[11px] text-slate-400 pt-1">Effective Date: {parcel.registrationDate}</div>
                  </div>
                </div>

                {/* Prior Ancestral Record */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-slate-400 border-2 border-white" />
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Prior Re-survey & Cadastral Mapping</span>
                      <span className="text-[10px] text-slate-500 font-mono">ARCHIVED</span>
                    </div>
                    <p className="text-slate-600">
                      Cadastral base survey polygon geo-referenced to WGS84 coordinate system with sub-meter GNSS ground truth markers.
                    </p>
                    <div className="text-[11px] text-slate-400 pt-1">Survey Year: 2012-13</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: SATELLITE & AI ANALYSIS */}
          {activeTab === "satellite" && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-purple-950 text-xs uppercase tracking-wider">
                      Sentinel-2 & Cartosat AI Engine
                    </span>
                  </div>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                    Change Score: {parcel.satelliteChangeScore}%
                  </span>
                </div>

                <p className="text-xs text-purple-900 leading-relaxed">
                  {parcel.satelliteSummary || "No critical multi-temporal changes detected in the last 180 days."}
                </p>

                {/* Simulated Before & After Satellite Radar Indicator */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/80 p-2.5 rounded-lg border border-purple-200/60 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Baseline (6 Mos Ago)</span>
                    <span className="text-xs font-mono font-semibold text-slate-800">NDVI: 0.72 (High Veg)</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-lg border border-purple-200/60 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Current Pass (Feb 2025)</span>
                    <span className="text-xs font-mono font-semibold text-purple-700">
                      {parcel.hasAnomaly ? "NDVI: 0.28 (Earthwork)" : "NDVI: 0.69 (Stable)"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong>How this works:</strong> The Land Stack AI engine continuously correlates ISRO Cartosat and ESA Sentinel-2 open multispectral observations against cadastral polygons to detect unapproved earthworks, wetland encroachments, or sudden boundary changes before disputes escalate.
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-3">
              {docs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">No documents on file for this demo parcel.</div>
              ) : (
                docs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        {doc.type}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-xs">{doc.name}</h4>
                        <div className="text-[10px] text-slate-400">
                          {doc.size} • Uploaded {doc.date}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
                    >
                      <Download className="w-3 h-3 text-slate-500" />
                      <span>Download</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 font-medium inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Extract</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 font-medium inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Copied Link!" : "Share ULPIN"}</span>
            </button>
          </div>

          {onFocusMap && (
            <button
              onClick={() => {
                onFocusMap();
                onClose();
              }}
              className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{dict.viewMap || "Center on Map"}</span>
            </button>
          )}
        </div>

        {/* Print Notification Toast */}
        {showPrintToast && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-lg shadow-xl border border-slate-700 z-50 animate-in fade-in">
            Demo Action: A sample certified Record of Rights (Pahani) PDF extraction initiated.
          </div>
        )}

      </div>
    </>
  );
}
