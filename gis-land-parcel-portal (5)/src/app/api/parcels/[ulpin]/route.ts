import { NextResponse } from "next/server";
import { db } from "@/db";
import { parcels, mutationApplications, auditLogs } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/db/seed";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ulpin: string }> }
) {
  try {
    await ensureDatabaseSeeded();
    const resolvedParams = await params;
    const ulpin = decodeURIComponent(resolvedParams.ulpin);

    const result = await db.select().from(parcels).where(eq(parcels.ulpin, ulpin)).limit(1);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Parcel not found" },
        { status: 404 }
      );
    }

    const parcel = result[0];
    const mutations = await db.select().from(mutationApplications).where(eq(mutationApplications.ulpin, ulpin));
    const logs = await db.select().from(auditLogs).where(eq(auditLogs.ulpinTarget, ulpin));

    return NextResponse.json({
      success: true,
      data: {
        ...parcel,
        mutations,
        logs,
      },
    });
  } catch (error) {
    console.error("GET /api/parcels/[ulpin] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch parcel details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ulpin: string }> }
) {
  try {
    await ensureDatabaseSeeded();
    const resolvedParams = await params;
    const ulpin = decodeURIComponent(resolvedParams.ulpin);
    const body = await request.json();

    const updated = await db
      .update(parcels)
      .set({
        verificationStatus: body.verificationStatus,
        disputeStatus: body.disputeStatus,
        taxStatus: body.taxStatus,
        lastUpdatedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      })
      .where(eq(parcels.ulpin, ulpin))
      .returning();

    // Log the change
    await db.insert(auditLogs).values({
      actorName: body.actorName || "Admin Officer",
      actorRole: body.actorRole || "Authorized Revenue Inspector",
      action: body.action || `Updated status to ${body.verificationStatus}`,
      ulpinTarget: ulpin,
      timestampText: `${new Date().toISOString().replace("T", " ").substring(0, 19)} IST`,
      ipAddress: "10.24.180.55",
      details: body.notes || `Administrative status transition executed on portal.`,
    });

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error("PATCH /api/parcels/[ulpin] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update parcel" },
      { status: 500 }
    );
  }
}
