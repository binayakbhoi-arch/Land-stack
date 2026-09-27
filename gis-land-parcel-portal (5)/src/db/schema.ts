import { pgTable, text, serial, timestamp, doublePrecision, jsonb, boolean, integer } from "drizzle-orm/pg-core";

export const parcels = pgTable("parcels", {
  id: serial("id").primaryKey(),
  ulpin: text("ulpin").notNull().unique(), // e.g. "IN-KA-BLR-560064-00429"
  surveyNumber: text("survey_number").notNull(), // e.g. "42/3A"
  subDivision: text("sub_division").default("1"),
  ownerName: text("owner_name").notNull(),
  coOwners: text("co_owners"), // comma-separated or description
  landUse: text("land_use").notNull(), // "Agricultural", "Residential", "Commercial", "Industrial", "Public/Institutional", "Ecological Buffer"
  areaHectares: doublePrecision("area_hectares").notNull(),
  areaAcres: doublePrecision("area_acres").notNull(),
  areaSqMeters: doublePrecision("area_sq_meters").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  taluk: text("taluk").notNull(),
  village: text("village").notNull(),
  pinCode: text("pin_code").notNull(),
  marketValueInr: integer("market_value_inr").notNull(),
  taxStatus: text("tax_status").notNull().default("Paid"), // "Paid", "Pending", "Exempt", "Under Review"
  taxAmountAnnual: integer("tax_amount_annual").default(4500),
  lastTaxPaidDate: text("last_tax_paid_date"),
  verificationStatus: text("verification_status").notNull().default("Verified"), // "Verified", "Under Review", "Flagged Anomaly", "Mutation Pending"
  disputeStatus: text("dispute_status").notNull().default("Clear Title"), // "Clear Title", "Civil Dispute Pending", "Encumbrance Noted"
  hasAnomaly: boolean("has_anomaly").default(false),
  anomalyType: text("anomaly_type"), // e.g. "Boundary Overlap Detected", "Vegetation Loss Flag", "Duplicate Owner Identity"
  // Coordinates for centroid and geojson polygon
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  coordinatesJson: jsonb("coordinates_json").notNull(), // Array of [lat, lng] points for polygon
  // Record of Rights (ROR) / Jamabandi details
  rorNumber: text("ror_number").notNull(),
  registrationDate: text("registration_date").notNull(),
  sroOffice: text("sro_office").notNull(),
  deedType: text("deed_type").notNull().default("Sale Deed"),
  mutationNumber: text("mutation_number"),
  mutationStatus: text("mutation_status").default("Approved"),
  lastUpdatedDate: text("last_updated_date").notNull(),
  satelliteChangeScore: doublePrecision("satellite_change_score").default(0.0), // 0 to 100% change
  satelliteSummary: text("satellite_summary"),
  documentsJson: jsonb("documents_json"), // Array of sample document links & names
  createdAt: timestamp("created_at").defaultNow(),
});

export const mutationApplications = pgTable("mutation_applications", {
  id: serial("id").primaryKey(),
  applicationNumber: text("application_number").notNull().unique(),
  ulpin: text("ulpin").notNull(),
  applicantName: text("applicant_name").notNull(),
  mutationType: text("mutation_type").notNull(), // "Succession", "Sale/Transfer", "Gift", "Partition"
  currentOwner: text("current_owner").notNull(),
  proposedOwner: text("proposed_owner").notNull(),
  status: text("status").notNull().default("Pending Inspection"), // "Pending Inspection", "Notice Issued", "Approved", "Rejected"
  filedDate: text("filed_date").notNull(),
  hearingDate: text("hearing_date"),
  revenueInspectorNote: text("revenue_inspector_note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actorName: text("actor_name").notNull(),
  actorRole: text("actor_role").notNull(),
  action: text("action").notNull(),
  ulpinTarget: text("ulpin_target"),
  timestampText: text("timestamp_text").notNull(),
  ipAddress: text("ip_address").default("10.24.180.44"),
  details: text("details").notNull(),
});

export type Parcel = typeof parcels.$inferSelect;
export type MutationApplication = typeof mutationApplications.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
