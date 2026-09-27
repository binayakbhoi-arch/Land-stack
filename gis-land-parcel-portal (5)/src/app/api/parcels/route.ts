import { NextResponse } from "next/server";
import { db } from "@/db";
import { parcels, mutationApplications, auditLogs } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/db/seed";
import { ilike, or, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    await ensureDatabaseSeeded();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const landUse = searchParams.get("landUse")?.trim() || "";
    const state = searchParams.get("state")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    const allParcels = await db.select().from(parcels);

    let filtered = allParcels;

    if (query) {
      const qLower = query.toLowerCase();
      filtered = filtered.filter(p => 
        p.ulpin.toLowerCase().includes(qLower) ||
        p.ownerName.toLowerCase().includes(qLower) ||
        p.village.toLowerCase().includes(qLower) ||
        p.district.toLowerCase().includes(qLower) ||
        p.surveyNumber.toLowerCase().includes(qLower) ||
        p.state.toLowerCase().includes(qLower)
      );
    }

    if (landUse && landUse !== "All") {
      filtered = filtered.filter(p => p.landUse === landUse);
    }

    if (state && state !== "All") {
      filtered = filtered.filter(p => p.state === state);
    }

    if (status && status !== "All") {
      filtered = filtered.filter(p => p.verificationStatus === status);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/parcels error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch parcels" },
      { status: 500 }
    );
  }
}
