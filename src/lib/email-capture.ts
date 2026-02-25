/**
 * Email capture for viral growth. Stores locally now; swap for API when backend ready.
 * Structure prepared for future monetization (source, page, conversion tracking).
 */

export const LEADS_STORAGE_KEY = "streamhub_leads";

export interface LeadEntry {
  email: string;
  ts: string;
  source?: "popup_30s" | "exit_intent";
  page?: string;
}

function getStoredLeads(): LeadEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLeadsToStorage(leads: LeadEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // quota exceeded or private mode
  }
}

/**
 * Saves a lead. Local storage now; replace with fetch when API is ready.
 * @param email - Validated email
 * @param meta - Source and page for conversion attribution
 */
export async function saveLead(
  email: string,
  meta?: { source?: "popup_30s" | "exit_intent"; page?: string }
): Promise<void> {
  const entry: LeadEntry = {
    email: email.trim().toLowerCase(),
    ts: new Date().toISOString(),
    source: meta?.source,
    page: meta?.page,
  };
  const leads = getStoredLeads();
  // avoid duplicates
  if (leads.some((l) => l.email === entry.email)) return;
  leads.push(entry);
  saveLeadsToStorage(leads);

  // TODO: When backend ready, call: await fetch("/api/leads", { method: "POST", body: JSON.stringify(entry) });
}
