"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getSavedEvents,
  removeEventFromHistory,
  SavedEvent,
} from "@/lib/localHistory";
import { Crown, Ticket, ArrowUpRight, X } from "lucide-react";

const EMPTY_EVENTS: SavedEvent[] = [];
let cachedRaw: string | null = null;
let cachedList: SavedEvent[] = EMPTY_EVENTS;

function getSnapshot(): SavedEvent[] {
  const raw = localStorage.getItem("aquien_my_events");
  if (raw === cachedRaw) return cachedList;
  cachedRaw = raw;
  cachedList = raw ? getSavedEvents() : EMPTY_EVENTS;
  return cachedList;
}

function getServerSnapshot(): SavedEvent[] {
  return EMPTY_EVENTS;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("aquien-history-updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("aquien-history-updated", callback);
  };
}

export default function MyEventsList() {
  const events = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (events.length === 0) return null;

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeEventFromHistory(id);
    window.dispatchEvent(new Event("aquien-history-updated"));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">
          Tus intercambios guardados ({events.length})
        </h2>
        <span className="text-[11px] text-slate-400">En este dispositivo</span>
      </div>

      <div className="space-y-2">
        {events.map((ev) => (
          <Link
            key={ev.id}
            href={ev.url}
            className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5 hover:border-rose-200 hover:bg-rose-50/40 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  ev.role === "admin"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-600"
                }`}
              >
                {ev.role === "admin" ? (
                  <Crown className="h-4 w-4" />
                ) : (
                  <Ticket className="h-4 w-4" />
                )}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {ev.groupName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {ev.role === "admin"
                    ? "Organizador de la sala"
                    : `Participante: ${ev.participantName}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-rose-600 group-hover:underline">
                Abrir
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
              <button
                type="button"
                onClick={(e) => handleRemove(e, ev.id)}
                title="Quitar de mi lista"
                className="rounded-md p-1 text-slate-400 hover:bg-slate-200/70 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
