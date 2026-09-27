export interface LandTermGlossary {
  term: string;
  regionalTerms: string[];
  plainMeaning: string;
  significance: string;
  aiAdvice: string;
}

export const LAND_RECORD_TERMS: LandTermGlossary[] = [
  {
    term: "ULPIN (Unique Land Parcel Identification Number)",
    regionalTerms: ["Bhu-Aadhaar", "PIN (Cadastral)", "Geo-tag ID"],
    plainMeaning: "A 14-digit alphanumeric code generated based on the longitude and latitude coordinates of the parcel's corner polygon vertices.",
    significance: "Acts as a unique digital identity for the piece of earth, eliminating duplicate entries, fake registries, and conflicting boundaries.",
    aiAdvice: "Always verify that the ULPIN on your deed matches the digital survey polygon in the state revenue portal before undertaking any financial pledge."
  },
  {
    term: "Record of Rights (RoR)",
    regionalTerms: ["7/12 Utara (MH/GJ)", "Pahani / RTC (KA)", "Patta Chitta (TN)", "Khatuni / Khasra (UP/DL)", "Jamabandi (PB/HR)", "Khatian (WB)"],
    plainMeaning: "The primary legal register maintained by the village revenue officer recording who owns the land, who cultivates it, what crop is grown, and whether there are bank loans or court stays on it.",
    significance: "Crucial proof of presumptive ownership and agricultural classification.",
    aiAdvice: "Regularly check column 11 / Encumbrance section to ensure unauthorized bank charges or adverse possession entries are not posted."
  },
  {
    term: "Mutation (Dakhil Kharij / Ferfar)",
    regionalTerms: ["Namantaran", "Ferfar", "Transfer of Title", "Pattadhara Badili"],
    plainMeaning: "The process of changing the title ownership name in the local revenue department records after buying, inheriting, or gifting a property.",
    significance: "Having a registered deed is not enough; without mutation, the seller's name continues in the tax records, which could lead to fraudulent resale.",
    aiAdvice: "Apply for mutation within 30 days of registration. An auto-mutation trigger exists in modern ULPIN-integrated states."
  },
  {
    term: "Encumbrance Certificate (EC)",
    regionalTerms: ["Nil Encumbrance / Non-encumbrance", "Bhar Mukt Pramanpatra", "Villangam Sattrithazh"],
    plainMeaning: "A certificate issued by the Sub-Registrar indicating whether the property is free from mortgages, legal claims, liens, or long-term leases over a specified search period (typically 15 to 30 years).",
    significance: "Protects buyers from discovering prior mortgages taken by the seller from banks or NBFCs.",
    aiAdvice: "Insist on a minimum 30-year certified digital EC search before concluding sale agreements."
  },
  {
    term: "Survey Number & Hissa / Sub-division",
    regionalTerms: ["Survey No", "Khasra No", "Dag Number", "Gat No"],
    plainMeaning: "An identification number assigned to a specific tract of land during the government cadastral survey. The hissa or sub-division represents partitions of that original plot.",
    significance: "Determines physical boundary extents on official village survey maps (Tippan / FMB / Cadastral Sheet).",
    aiAdvice: "Ensure the physical boundary matches the official village map scale, not just the fence line."
  },
  {
    term: "Non-Agricultural (NA) / Land Use Conversion",
    regionalTerms: ["NA Order", "Diversion Order", "CLU (Change of Land Use)", "Section 95 Karnataka"],
    plainMeaning: "Formal permission granted by the District Collector / Revenue Authority to use agricultural land for residential, industrial, or commercial activity.",
    significance: "Building residential homes or factories on unconverted agricultural land is illegal and subject to demolition notices.",
    aiAdvice: "Ensure conversion premium receipt and master plan zoning concurrence are recorded with the ULPIN."
  }
];
