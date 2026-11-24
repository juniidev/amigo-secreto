export interface SavedEvent {
  id: string; // adminToken o participantToken
  role: "admin" | "guest";
  groupName: string;
  participantName?: string;
  url: string;
  savedAt: number;
}

const STORAGE_KEY = "aquien_my_events";

export function saveEventToHistory(event: Omit<SavedEvent, "savedAt">) {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedEvents();
    const filtered = existing.filter((item) => item.id !== event.id);
    const updated: SavedEvent[] = [
      { ...event, savedAt: Date.now() },
      ...filtered,
    ].slice(0, 10); // Guarda los últimos 10 eventos

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignorar si el navegador bloquea storage (ej. modo privado estricto)
  }
}

export function getSavedEvents(): SavedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedEvent[]) : [];
  } catch {
    return [];
  }
}

export function removeEventFromHistory(id: string) {
  if (typeof window === "undefined") return;
  try {
    const updated = getSavedEvents().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}
