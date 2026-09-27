"use client";

import React, { useState, useEffect } from "react";
import { Parcel, MutationApplication, AuditLog } from "@/db/schema";
import { 
  ShieldCheck, AlertTriangle, Users, FileCheck, Layers, TrendingUp, 
  Search, Filter, CheckCircle2, XCircle, ArrowUpRight, Clock, MapPin, 
  RefreshCw, Lock, Sparkles, Building2, BarChart3, SlidersHorizontal
} from "lucide-react";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  allParcels: Parcel[];
  onRefreshParcels: () => void;
  onSelectParcel: (parcel: Parcel) => void;
}

export function AdminDashboardModal({
  isOpen,
  onClose,
  allParcels,
  onRefreshParcels,
  onSelectParcel,
}: AdminDashboardModalProps) {
  // Authentication Mockup State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [govEmail, setGovEmail] = useState("rev.inspector.ka@gov.in");
  const [govPassword, setGovPassword] = useState("••••••••••••");
  const [twoFactorToken, setTwoFactorToken] = useState("849102");
  const [adminRole, setAdminRole] = useState("Authorized Revenue Inspector (Devanahalli)");
  const [loginError, setLoginError] = useState("");

  // Tab State
  const [currentTab, setCurrentTab] = useState<"overview" | "parcels" | "mutations" | "anomalies" | "audit">("overview");

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Verification Action Dialog
  const [selectedForReview, setSelectedForReview] = useState<Parcel | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Dynamic audit logs and mutations
  const [mutationsList, setMutationsList] = useState<MutationApplication[]>([]);
  const [auditList, setAuditList] = useState<AuditLog[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadStats();
    }
  }, [isOpen, isAuthenticated]);

  async function loadStats() {
    setIsLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success) {
        setMutationsList(json.recentMutations || []);
        setAuditList(json.recentAuditLogs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingStats(false);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!govEmail.trim()) {
      setLoginError("Please enter your designated .gov.in or .nic.in official credential.");
      return;
    }
    setLoginError("");
    setIsAuthenticated(true);
  };

  const handleUpdateStatus = async (ulpin: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/parcels/${encodeURIComponent(ulpin)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationStatus: newStatus,
          actorName: "S. K. Nambiar (Tahsildar)",
          actorRole: adminRole,
          notes: reviewNote || `Status modified to ${newStatus} after administrative verification.`,
        }),
      });

      if (res.ok) {
        setSelectedForReview(null);
        setReviewNote("");
        onRefreshParcels();
        await loadStats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  // Filtered Parcels
  const filteredParcels = allParcels.filter((p) => {
    const matchesSearch =
      p.ulpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const verifiedCount = allParcels.filter((p) => p.verificationStatus === "Verified").length;
  const underReviewCount = allParcels.filter((p) => p.verificationStatus === "Under Review").length;
  const anomalyCount = allParcels.filter((p) => p.hasAnomaly || p.verificationStatus === "Flagged Anomaly").length;
  const totalTax = allParcels
    .filter((p) => p.taxStatus === "Paid")
    .reduce((sum, p) => sum + (p.taxAmountAnnual || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-98 duration-150">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight">
                  Land Stack Internal Revenue Administration
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/60 uppercase">
                  Restricted Demo Enclave
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Department of Land Resources & Revenue Cadastral Control (Sample Environment)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-md hover:bg-slate-800 transition-colors border border-slate-700"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo Watermark Bar */}
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>⚠️ DEMO GOVERNANCE WORKFLOW: All records, sign-in tokens, and mutations are simulated for testing.</span>
          <span className="font-mono text-[11px] bg-amber-600/30 px-2 py-0.5 rounded">NIC Demo Mockup</span>
        </div>

        {/* MAIN BODY: SIGN IN SCREEN OR DASHBOARD */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-12 flex-1 overflow-y-auto flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
              
              <div className="text-center space-y-1.5">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-700 mb-1 border border-emerald-100">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Official Government Access</h4>
                <p className="text-xs text-slate-500">
                  Sign in with authorized Single-Sign-On (JanParichay / MeriPehchan Simulation)
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIC / Revenue Email</label>
                  <input
                    type="email"
                    value={govEmail}
                    onChange={(e) => setGovEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 text-xs"
                    placeholder="officer@revenue.gov.in"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Encrypted Access Credential</label>
                  <input
                    type="password"
                    value={govPassword}
                    onChange={(e) => setGovPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hardware Token / OTP (Simulated)</label>
                  <input
                    type="text"
                    value={twoFactorToken}
                    onChange={(e) => setTwoFactorToken(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono tracking-widest text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Jurisdictional Role</label>
                  <select
                    value={adminRole}
                    onChange={(e) => setAdminRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="Authorized Revenue Inspector (Devanahalli)">Authorized Revenue Inspector (Devanahalli)</option>
                    <option value="Sub-Divisional Magistrate / Tahsildar (South)">Sub-Divisional Magistrate / Tahsildar (South)</option>
                    <option value="District Cadastral Survey Officer (ADLR)">District Cadastral Survey Officer (ADLR)</option>
                    <option value="State GIS Spatial Auditor">State GIS Spatial Auditor</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate & Enter Portal (Demo)</span>
                </button>
              </form>

              <div className="pt-2 text-center text-[11px] text-slate-400 leading-tight">
                Quick test: Any inputs work for demonstration purposes. Click Authenticate to enter.
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
            
            {/* Top Stat Ribbon */}
            <div className="p-4 sm:p-5 bg-white border-b border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-xs text-slate-500">Jurisdiction Session Active</div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{adminRole}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadStats}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? "animate-spin text-emerald-600" : ""}`} />
                    <span>Refresh Stats</span>
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase">Total GIS Parcels</span>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">{allParcels.length}</div>
                  <span className="text-[10px] text-emerald-700 font-medium">100% Geo-referenced</span>
                </div>

                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-semibold text-emerald-800 block uppercase">Verified Records</span>
                  <div className="text-2xl font-bold text-emerald-900 mt-0.5">{verifiedCount}</div>
                  <span className="text-[10px] text-emerald-700 font-medium">Digital ROR active</span>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-semibold text-amber-800 block uppercase">Pending Mutations</span>
                  <div className="text-2xl font-bold text-amber-900 mt-0.5">{mutationsList.length}</div>
                  <span className="text-[10px] text-amber-700 font-medium">Public notices dispatched</span>
                </div>

                <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200">
                  <span className="text-[11px] font-semibold text-rose-800 block uppercase">Flagged Anomalies</span>
                  <div className="text-2xl font-bold text-rose-900 mt-0.5">{anomalyCount}</div>
                  <span className="text-[10px] text-rose-700 font-medium">AI satellite alerts</span>
                </div>
              </div>
            </div>

            {/* Dashboard Sub-navigation Tabs */}
            <div className="flex items-center gap-2 px-5 bg-white border-b border-slate-200 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setCurrentTab("overview")}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  currentTab === "overview"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Governance Overview
              </button>
              <button
                onClick={() => setCurrentTab("parcels")}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  currentTab === "parcels"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Parcel Verification Table ({allParcels.length})
              </button>
              <button
                onClick={() => setCurrentTab("mutations")}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  currentTab === "mutations"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" /> Mutation Workflow ({mutationsList.length})
              </button>
              <button
                onClick={() => setCurrentTab("anomalies")}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  currentTab === "anomalies"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> AI Sentinel Alerts ({anomalyCount})
              </button>
              <button
                onClick={() => setCurrentTab("audit")}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  currentTab === "audit"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> Audit Trail & Logs
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6">
              
              {/* TAB 1: OVERVIEW */}
              {currentTab === "overview" && (
                <div className="space-y-6">
                  {/* Land-use breakdown & revenue */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-600" /> Land-Use Distribution Analysis
                      </h4>
                      <div className="space-y-2 text-xs">
                        {[
                          { name: "Agricultural", pct: 40, color: "bg-emerald-500", count: "4 Parcels" },
                          { name: "Residential", pct: 25, color: "bg-amber-500", count: "3 Parcels" },
                          { name: "Commercial", pct: 20, color: "bg-sky-500", count: "2 Parcels" },
                          { name: "Industrial", pct: 10, color: "bg-purple-500", count: "1 Parcel" },
                          { name: "Ecological Buffer", pct: 5, color: "bg-teal-500", count: "1 Parcel" },
                        ].map((item) => (
                          <div key={item.name} className="space-y-1">
                            <div className="flex justify-between text-slate-700 text-[11px]">
                              <span>{item.name} ({item.count})</span>
                              <span className="font-semibold">{item.pct}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Revenue & Cess Compliance
                      </h4>
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                        <span className="text-[11px] text-emerald-800 font-medium">Estimated Annual Revenue Cess</span>
                        <div className="text-2xl font-mono font-bold text-emerald-950">
                          ₹{totalTax.toLocaleString("en-IN")}
                        </div>
                        <p className="text-[10px] text-emerald-700">
                          75% realization rate across demo administrative jurisdiction.
                        </p>
                      </div>

                      <div className="pt-2 text-xs text-slate-600 space-y-2">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span>Average Cadastral Survey Cycle Time</span>
                          <span className="font-bold text-slate-800">14 Days</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span>Auto-Mutation SLA Compliance</span>
                          <span className="font-bold text-emerald-700">92.4%</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span>Satellite Cloud-free Imagery Pass</span>
                          <span className="font-bold text-slate-800">Weekly (Sentinel-2)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary of Actionable Items */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      High Priority Officer Action Items
                    </h4>
                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-slate-800 font-medium">
                            Disputed boundary claim on <strong>IN-MH-PUN-411057-00206</strong> (Wagholi)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const p = allParcels.find((x) => x.ulpin === "IN-MH-PUN-411057-00206");
                            if (p) setSelectedForReview(p);
                          }}
                          className="px-2.5 py-1 bg-rose-50 text-rose-800 font-semibold rounded-md border border-rose-200 hover:bg-rose-100"
                        >
                          Review Flag
                        </button>
                      </div>

                      <div className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-slate-800 font-medium">
                            Unapproved sub-division earthwork flag on <strong>IN-KA-BLR-560064-00103</strong>
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const p = allParcels.find((x) => x.ulpin === "IN-KA-BLR-560064-00103");
                            if (p) setSelectedForReview(p);
                          }}
                          className="px-2.5 py-1 bg-amber-50 text-amber-800 font-semibold rounded-md border border-amber-200 hover:bg-amber-100"
                        >
                          Review Flag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PARCELS TABLE */}
              {currentTab === "parcels" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search parcels table by ULPIN, owner, or village..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Verified">Verified</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Flagged Anomaly">Flagged Anomaly</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/75 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-3">ULPIN</th>
                          <th className="p-3">Survey No.</th>
                          <th className="p-3">Khatedar (Owner)</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Land Use</th>
                          <th className="p-3">Area</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredParcels.map((parcel) => (
                          <tr key={parcel.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-mono font-medium text-slate-900">{parcel.ulpin}</td>
                            <td className="p-3 font-semibold text-slate-800">{parcel.surveyNumber}</td>
                            <td className="p-3">{parcel.ownerName}</td>
                            <td className="p-3 text-slate-500">{parcel.village}, {parcel.district}</td>
                            <td className="p-3">{parcel.landUse}</td>
                            <td className="p-3">{parcel.areaAcres} Ac</td>
                            <td className="p-3">
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
                            </td>
                            <td className="p-3 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedForReview(parcel)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-[11px]"
                              >
                                Manage
                              </button>
                              <button
                                onClick={() => {
                                  onSelectParcel(parcel);
                                  onClose();
                                }}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md font-semibold text-[11px]"
                              >
                                Map
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: MUTATIONS */}
              {currentTab === "mutations" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Active Revenue Mutation Register (Namantaran / Ferfar)
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      Section 149 / 150 MLRC & Regional Land Revenue Acts. Automatic synchronization with registration offices.
                    </p>

                    <div className="space-y-3">
                      {mutationsList.map((mut) => (
                        <div key={mut.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="font-mono font-bold text-slate-900">{mut.applicationNumber}</span>
                              <span className="text-slate-400 mx-2">•</span>
                              <span className="text-slate-600 font-mono text-[11px]">ULPIN: {mut.ulpin}</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              {mut.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-200/60">
                            <div>
                              <span className="text-slate-500">Applicant:</span>
                              <p className="font-semibold text-slate-800">{mut.applicantName} ({mut.mutationType})</p>
                            </div>
                            <div>
                              <span className="text-slate-500">From &rarr; To:</span>
                              <p className="text-slate-800">{mut.currentOwner} &rarr; {mut.proposedOwner}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Hearing / Notice Date:</span>
                              <p className="text-slate-800">{mut.hearingDate || "Scheduled"}</p>
                            </div>
                          </div>

                          {mut.revenueInspectorNote && (
                            <div className="text-[11px] bg-white p-2 rounded-md border border-slate-200 text-slate-600">
                              <strong>Inspector Note:</strong> {mut.revenueInspectorNote}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: AI SENTINEL ALERTS */}
              {currentTab === "anomalies" && (
                <div className="space-y-4">
                  <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 text-xs space-y-2 text-rose-950">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      <h4 className="font-bold uppercase tracking-wider text-rose-900">
                        GeoSentinel AI Anomaly Classifier
                      </h4>
                    </div>
                    <p className="leading-relaxed">
                      Multi-temporal machine learning model that flags discrepancies between legal cadastral boundaries, approved master plans, and recent satellite surface observations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {allParcels
                      .filter((p) => p.hasAnomaly)
                      .map((p) => (
                        <div key={p.id} className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-mono uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                                {p.anomalyType || "Discrepancy"}
                              </span>
                              <h5 className="font-bold text-slate-900 mt-1">{p.ulpin}</h5>
                              <p className="text-slate-500 text-[11px]">{p.village}, {p.taluk}</p>
                            </div>
                            <span className="font-mono text-rose-600 font-bold text-sm">
                              {p.satelliteChangeScore}% Dev.
                            </span>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700 leading-relaxed text-[11px]">
                            {p.satelliteSummary}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-[11px] text-slate-500">Khatedar: {p.ownerName}</span>
                            <button
                              onClick={() => setSelectedForReview(p)}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs"
                            >
                              Dispatch Notice
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 5: AUDIT LOGS */}
              {currentTab === "audit" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Revenue Electronic Audit Trail
                  </h4>
                  <div className="divide-y divide-slate-100 text-xs">
                    {auditList.map((log) => (
                      <div key={log.id} className="py-3 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{log.action}</span>
                            {log.ulpinTarget && (
                              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                {log.ulpinTarget}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">{log.timestampText}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{log.details}</p>
                        <div className="text-[10px] text-slate-400">
                          Actor: <strong className="text-slate-600">{log.actorName}</strong> ({log.actorRole}) • IP: {log.ipAddress}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* WORKFLOW MODAL FOR MANAGING PARCEL STATUS */}
        {selectedForReview && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-3">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 space-y-4 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Administrative Parcel Verification</h4>
                  <p className="text-slate-500 font-mono text-[11px]">{selectedForReview.ulpin}</p>
                </div>
                <button
                  onClick={() => setSelectedForReview(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div><strong>Khatedar:</strong> {selectedForReview.ownerName}</div>
                <div><strong>Location:</strong> {selectedForReview.surveyNumber}, {selectedForReview.village}</div>
                <div><strong>Current Status:</strong> {selectedForReview.verificationStatus}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit / Inspection Note</label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Record ground inspection verification findings or survey measurement confirmation..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs h-20"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedForReview(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus(selectedForReview.ulpin, "Flagged Anomaly")}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 font-semibold"
                >
                  Flag Anomaly
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus(selectedForReview.ulpin, "Under Review")}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-semibold"
                >
                  Mark Under Review
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus(selectedForReview.ulpin, "Verified")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-semibold shadow-xs"
                >
                  {isUpdating ? "Attesting..." : "Attest & Verify Title"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
