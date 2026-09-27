"use client";

import React, { useState, useEffect, useTransition } from "react";
import dynamic from "next/dynamic";
import { Parcel } from "@/db/schema";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ParcelDrawer } from "@/components/ParcelDrawer";
import { AdminDashboardModal } from "@/components/AdminDashboardModal";
import { SmartFeaturesSection } from "@/components/SmartFeaturesSection";
import { ShareModal } from "@/components/ShareModal";
import { getDictionary } from "@/lib/languages";
import { 
  Search, Shield, MapPin, Layers, Sparkles, Filter, ExternalLink, 
  CheckCircle2, ArrowRight, Info, AlertTriangle, Eye, Compass,
  Landmark, RefreshCw, ChevronDown, Check, Download, Users, Share2
} from "lucide-react";

// Dynamically import GisMap to avoid SSR Leaflet `window` reference
const GisMap = dynamic(() => import("@/components/GisMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] lg:min-h-[640px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3 border border-slate-200">
      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-500">Loading OpenStreetMap Cadastral Engine...</span>
    </div>
  ),
});

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState("en");
  const dict = getDictionary(currentLang);

  // Parcels Data
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  // Map Controls
  const [activeLayer, setActiveLayer] = useState<"osm" | "satellite" | "topo">("osm");
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [landUseFilter, setLandUseFilter] = useState("All");

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Admin Modal & Share Modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Fetch Parcels
  const fetchParcels = async (query = "") => {
    setIsLoading(true);
    try {
      const url = query ? `/api/parcels?q=${encodeURIComponent(query)}` : "/api/parcels";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setParcels(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch parcels:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchParcels(searchQuery);
  };

  const handleSelectQuickSearch = (ulpinCode: string) => {
    setSearchQuery(ulpinCode);
    const found = parcels.find((p) => p.ulpin === ulpinCode);
    if (found) {
      setSelectedParcel(found);
    } else {
      fetchParcels(ulpinCode);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. TOP OFFICIAL CIVIC HEADER / BANNER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        {/* National Emblem & Civic Notice Strip */}
        <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-[11px] font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-slate-300">
              National Land Records Modernization & Geospatial Transparency Initiative (Demo Framework)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400">
            <span>Standard: ISO 19152 (LADM)</span>
            <span>•</span>
            <span>CRS: EPSG:4326 (WGS 84)</span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
            {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-sky-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 shrink-0 font-extrabold text-sm tracking-tight">
              LS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-none">
                  {dict.portalTitle || "Land Stack"}
                </h1>
                <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold hidden md:inline">
                  ULPIN 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
                {dict.tagline || "One parcel, one identity, transparent land governance."}
              </p>
            </div>
          </div>

          {/* Right Actions: Share, Language Selector & Admin Portal Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Share App Button */}
            <button
              onClick={() => setIsShareOpen(true)}
              title="Share app link or QR code"
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Share App</span>
            </button>

            {/* Language Selector */}
            <LanguageSelector currentLang={currentLang} onLanguageChange={setCurrentLang} />

            {/* Admin Dashboard CTA */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5 border border-slate-800 focus:ring-2 focus:ring-slate-900/20"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{dict.adminPortal || "Govt Admin Portal"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. DEMO SIMULATION DISCLAIMER BAR */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              <strong>Demonstration Prototype Notice:</strong> {dict.disclaimerDemo || "All parcels, ownerships, and mutation histories are simulated demo data. Not for legal transactions."}
            </span>
          </div>
          <span className="hidden md:inline-block text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded uppercase">
            NIC Reference Architecture
          </span>
        </div>
      </div>

      {/* 3. HERO & SEARCH SECTION */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>National Geospatial Land Information Framework</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Locate, verify, and monitor any cadastral land parcel in seconds.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every parcel is designated with a geo-referenced <strong>Unique Land Parcel Identification Number (ULPIN)</strong>, ensuring unambiguous ownership boundaries and tamper-proof Record of Rights (RoR).
            </p>
          </div>

          {/* Search Form Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-3xl">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl shadow-md border border-slate-200 p-2 gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dict.searchPlaceholder || "Search by ULPIN (e.g. IN-KA-BLR-560064-00101), Owner name, or Village..."}
                  className="w-full pl-11 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      fetchParcels("");
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>{dict.searchBtn || "Search Parcel"}</span>
                </button>
              </div>
            </div>

            {/* Quick Suggestions / Sample ULPINs */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Sample Records:</span>
              <button
                type="button"
                onClick={() => handleSelectQuickSearch("IN-KA-BLR-560064-00101")}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] transition-colors"
              >
                Agricultural (Karnataka)
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickSearch("IN-KA-BLR-560064-00102")}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] transition-colors"
              >
                Industrial KIADB
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickSearch("IN-KA-BLR-560064-00103")}
                className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-mono text-[11px] transition-colors font-medium"
              >
                ⚠️ Anomaly Flagged
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickSearch("IN-DL-SWD-110037-00301")}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] transition-colors"
              >
                Ridge Ecological Buffer (Delhi)
              </button>
            </div>
          </form>

        </div>
      </section>

      {/* 4. MAIN GIS INTERACTIVE MAP & PARCEL SELECTION AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        
        {/* Map Control Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Base Layer Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase px-2 hidden sm:inline">Layer:</span>
            <button
              onClick={() => setActiveLayer("osm")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeLayer === "osm" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              OpenStreetMap
            </button>
            <button
              onClick={() => setActiveLayer("satellite")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeLayer === "satellite" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Satellite Imagery
            </button>
            <button
              onClick={() => setActiveLayer("topo")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeLayer === "topo" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Topographic
            </button>
          </div>

          {/* Land-use category filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Land Use:</span>
            <select
              value={landUseFilter}
              onChange={(e) => setLandUseFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Ecological Buffer">Ecological Buffer</option>
            </select>
          </div>

          {/* Polygon / Label Toggles */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
              <input
                type="checkbox"
                checked={showBoundaries}
                onChange={(e) => setShowBoundaries(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Cadastral Polygons</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none ml-2">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Survey Labels</span>
            </label>
          </div>

          {/* Refresh / Results Count */}
          <div className="flex items-center gap-2 text-slate-500">
            <span>Showing <strong>{parcels.length}</strong> Parcels</span>
            <button
              onClick={() => fetchParcels(searchQuery)}
              title="Refresh Layer Data"
              className="p-1 rounded-md hover:bg-slate-100 text-slate-600"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* GIS Map Canvas */}
        <div className="relative">
          <GisMap
            parcels={parcels}
            selectedParcel={selectedParcel}
            onSelectParcel={setSelectedParcel}
            activeLayer={activeLayer}
            showBoundaries={showBoundaries}
            showLabels={showLabels}
            filterLandUse={landUseFilter}
          />

          {/* Floating Selected Parcel Quick Summary Card */}
          {selectedParcel && (
            <div className="absolute top-4 left-4 z-10 max-w-sm w-full bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200/90 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    Active Selection
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{selectedParcel.ulpin}</h4>
                  <div className="text-slate-500 text-[11px]">
                    Survey No: <strong>{selectedParcel.surveyNumber}</strong> ({selectedParcel.village})
                  </div>
                </div>
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 py-1 border-y border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400">Khatedar (Owner):</span>
                  <div className="font-semibold text-slate-800 truncate">{selectedParcel.ownerName}</div>
                </div>
                <div>
                  <span className="text-slate-400">Area:</span>
                  <div className="font-semibold text-slate-800">{selectedParcel.areaAcres} Acres ({selectedParcel.landUse})</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {selectedParcel.verificationStatus}
                </span>
                <button
                  onClick={() => {
                    // Open full drawer (drawer renders automatically when selectedParcel is non-null)
                  }}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs flex items-center gap-1"
                >
                  <span>Open Full RoR Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Parcel Cards Grid below map for accessible keyboard / mobile browsing */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cadastral Parcels in Current View</h3>
              <p className="text-xs text-slate-500">Click any card to inspect the Record of Rights and satellite change timeline.</p>
            </div>
            <span className="text-xs text-slate-400">{parcels.length} Registered Polygons</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {parcels.map((parcel) => (
              <div
                key={parcel.id}
                onClick={() => setSelectedParcel(parcel)}
                className={`p-4 rounded-xl border bg-white transition-all cursor-pointer hover:shadow-md ${
                  selectedParcel?.ulpin === parcel.ulpin
                    ? "border-emerald-600 ring-2 ring-emerald-600/20 shadow-md"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {parcel.ulpin}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      Survey {parcel.surveyNumber}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      parcel.verificationStatus === "Verified"
                        ? "bg-emerald-100 text-emerald-800"
                        : parcel.verificationStatus === "Under Review"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {parcel.verificationStatus}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Owner:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">{parcel.ownerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-700">{parcel.village}, {parcel.state}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Land Use / Area:</span>
                    <span className="font-medium text-slate-800">{parcel.landUse} • {parcel.areaAcres} Ac</span>
                  </div>
                </div>

                {parcel.hasAnomaly && (
                  <div className="mt-2.5 p-1.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{parcel.anomalyType || "Discrepancy detected"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 5. SMART FEATURES & AI SECTION */}
      <SmartFeaturesSection />

      {/* 6. ULPIN CIVIC EXPLAINER SECTION */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {dict.ulpinExplainer || "What is ULPIN (Bhu-Aadhaar)?"}
            </h3>
            <p className="text-sm text-slate-600">
              The Unique Land Parcel Identification Number is the foundation of modern, transparent digital land administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">1</div>
              <h4 className="font-bold text-slate-900 text-sm">Coordinate-Based Hash</h4>
              <p className="text-slate-600 leading-relaxed">
                ULPIN is algorithmically computed from the longitude and latitude coordinates of the parcel’s polygon vertices.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">2</div>
              <h4 className="font-bold text-slate-900 text-sm">Universal Interoperability</h4>
              <p className="text-slate-600 leading-relaxed">
                Connects sub-registrar property registration, bank mortgage lien creation, and municipal tax databases under one ID.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">3</div>
              <h4 className="font-bold text-slate-900 text-sm">Dispute Elimination</h4>
              <p className="text-slate-600 leading-relaxed">
                Disallows multiple registrations of overlapping physical coordinates, preventing fraudulent double-sale of properties.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">4</div>
              <h4 className="font-bold text-slate-900 text-sm">Citizen Empowerment</h4>
              <p className="text-slate-600 leading-relaxed">
                Allows any landowner to verify their title status, tax receipts, and mutation history anytime from a mobile device.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                LS
              </div>
              <div>
                <span className="font-bold text-white text-sm">Land Stack GIS Portal</span>
                <p className="text-[11px] text-slate-400">One parcel, one identity, transparent land governance.</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-[11px]">
              <span className="hover:text-white cursor-pointer">Open Geospatial Consortium (OGC) Standards</span>
              <span className="hover:text-white cursor-pointer">WGS 84 Cadastre</span>
              <span className="hover:text-white cursor-pointer">Accessibility (WCAG 2.1 AA)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>
              &copy; 2025 Land Stack Geospatial Platform. Simulated data for demonstration and civic technology evaluation only.
            </p>
            <p>
              Compliant with Digital India Land Records Modernization Programme (DILRMP) guidelines.
            </p>
          </div>
        </div>
      </footer>

      {/* SELECTED PARCEL PROFILE DRAWER */}
      <ParcelDrawer
        parcel={selectedParcel}
        onClose={() => setSelectedParcel(null)}
        dict={dict}
      />

      {/* GOVT ADMIN DASHBOARD MODAL */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        allParcels={parcels}
        onRefreshParcels={() => fetchParcels(searchQuery)}
        onSelectParcel={(p) => setSelectedParcel(p)}
      />

      {/* SHARE APP MODAL */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

    </div>
  );
}
