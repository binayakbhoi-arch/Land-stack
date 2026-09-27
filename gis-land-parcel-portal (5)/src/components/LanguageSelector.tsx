"use client";

import React, { useState, useTransition } from "react";
import { SUPPORTED_LANGUAGES, LanguageDef } from "@/lib/languages";
import { Globe, Check, ChevronDown, Sparkles } from "lucide-react";

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (code: string) => void;
}

export function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [, startTransition] = useTransition();

  const selectedDef = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleSelect = (code: string) => {
    startTransition(() => {
      onLanguageChange(code);
    });
    setIsOpen(false);
    setFilterQuery("");
  };

  return (
    <div className="relative inline-block text-left z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
        <span className="font-semibold text-slate-800">{selectedDef.nativeName}</span>
        <span className="text-slate-400 hidden md:inline">({selectedDef.name})</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden divide-y divide-slate-100 border border-slate-200 animate-in fade-in zoom-in-95 duration-100">
            <div className="p-2.5 bg-slate-50/80">
              <div className="flex items-center justify-between pb-1.5 px-1">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> 22 Scheduled + Global
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
                  {SUPPORTED_LANGUAGES.length} Languages
                </span>
              </div>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search language / भाषा खोजें..."
                className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                autoFocus
              />
            </div>

            <div className="max-h-72 overflow-y-auto p-1 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Eighth Schedule of Constitution of India (22)
              </div>
              {filteredLanguages
                .filter((l) => l.category === "Scheduled Indian")
                .map((lang) => {
                  const isSelected = lang.code === currentLang;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-800 font-semibold"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm">{lang.nativeName}</span>
                        <span className="text-[11px] text-slate-400 font-normal">({lang.name})</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}

              <div className="px-2 pt-2.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 mt-1">
                Global Languages
              </div>
              {filteredLanguages
                .filter((l) => l.category === "Global")
                .map((lang) => {
                  const isSelected = lang.code === currentLang;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-800 font-semibold"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm">{lang.nativeName}</span>
                        <span className="text-[11px] text-slate-400 font-normal">({lang.name})</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
            </div>

            <div className="p-2 bg-slate-50 text-[11px] text-slate-500 text-center leading-tight">
              Prototype multi-lingual framework supporting ISO-639 regional scripts.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
