import { NextResponse } from "next/server";
import { db } from "@/db";
import { parcels, mutationApplications, auditLogs } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/db/seed";
import { desc, count } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseSeeded();

    const allParcels = await db.select().from(parcels);
    const allMutations = await db.select().from(mutationApplications);
    const recentLogs = await db.select().from(auditLogs).orderBy(desc(auditLogs.id)).limit(10);

    const totalParcels = allParcels.length;
    const verifiedParcels = allParcels.filter(p => p.verificationStatus === "Verified").length;
    const underReviewParcels = allParcels.filter(p => p.verificationStatus === "Under Review").length;
    const flaggedParcels = allParcels.filter(p => p.hasAnomaly || p.verificationStatus === "Flagged Anomaly").length;
    
    // Land use distribution
    const landUseMap: Record<string, number> = {};
    let totalAreaHectares = 0;
    let totalTaxCollectedInr = 0;

    allParcels.forEach(p => {
      landUseMap[p.landUse] = (landUseMap[p.landUse] || 0) + 1;
      totalAreaHectares += p.areaHectares;
      if (p.taxStatus === "Paid" && p.taxAmountAnnual) {
        totalTaxCollectedInr += p.taxAmountAnnual;
      }
    });

    const pendingMutations = allMutations.filter(m => m.status !== "Approved").length;

    return NextResponse.json({
      success: true,
      stats: {
        totalParcels,
        verifiedParcels,
        underReviewParcels,
        flaggedParcels,
        totalAreaHectares: Math.round(totalAreaHectares * 100) / 100,
        totalTaxCollectedInr,
        pendingMutations,
        landUseBreakdown: Object.entries(landUseMap).map(([name, count]) => ({ name, count })),
      },
      recentMutations: allMutations,
      recentAuditLogs: recentLogs,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
