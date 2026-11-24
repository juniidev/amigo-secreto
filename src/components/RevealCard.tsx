"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { markParticipantAsViewed, updateWishlist } from "@/actions/gameActions";
import {
  Gift,
  Sparkles,
  Heart,
  Check,
  Calendar,
  Wallet,
  EyeOff,
} from "lucide-react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { saveEventToHistory } from "@/lib/localHistory";

interface RevealCardProps {
  participantToken: string;
  participantName: string;
  groupName: string;
  budget: string | null;
  eventDate: string | null;
  initialHasViewed: boolean;
  initialWishlist: string | null;
  assignedToName: string;
  assignedToWishlist: string | null;
}

export default function RevealCard({
  participantToken,
  participantName,
  groupName,
  budget,
  eventDate,
  initialHasViewed,
  initialWishlist,
  assignedToName,
  assignedToWishlist,
}: RevealCardProps) {
  const [isRevealed, setIsRevealed] = useState(initialHasViewed);
  const [wishlist, setWishlist] = useState(initialWishlist || "");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    saveEventToHistory({
      id: participantToken,
      role: "guest",
      groupName,
      participantName,
      url: `/revelar/${participantToken}`,
    });
  }, [participantToken, groupName, participantName]);

  const handleReveal = async () => {
    setIsRevealed(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (!initialHasViewed) {
      await markParticipantAsViewed(participantToken);
    }
  };

  const handleSaveWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const res = await updateWishlist(participantToken, wishlist);
    setSaving(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };
  return (
    <div className="space-y-6">
      {/* Encabezado del evento */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1 text-xs font-semibold text-rose-700">
          <Gift className="h-3.5 w-3.5" />
          {groupName}
        </span>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          ¡Hola, {participantName}!
        </h1>
        {(budget || eventDate) && (
          <div className="flex flex-wrap justify-center gap-4 pt-1 text-xs text-slate-600 sm:text-sm">
            {budget && (
              <span className="flex items-center gap-1">
                <Wallet className="h-4 w-4 text-rose-500" />
                Presupuesto: <strong>{budget}</strong>
              </span>
            )}
            {eventDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-rose-500" />
                Fecha: <strong>{eventDate}</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tarjeta de revelación */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
        {!isRevealed ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <Gift className="h-10 w-10 animate-bounce" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-slate-900">
                Tu amigo secreto está listo
              </h2>
              <p className="max-w-xs text-sm text-slate-500">
                Asegúrate de que nadie esté mirando tu pantalla antes de abrir
                el sobre.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReveal}
              className="flex items-center gap-2 rounded-2xl bg-rose-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-700 transition cursor-pointer"
            >
              <Sparkles className="h-5 w-5" />
              Descubrir a quién le regalo
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center space-y-5 py-4"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
              Te toca regalarle a
            </p>
            <div className="rounded-2xl bg-linear-br from-rose-500 to-rose-600 px-6 py-8 text-white shadow-inner">
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {assignedToName}
              </p>
            </div>

            {/* Deseos de la persona asignada */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                <Heart className="h-3.5 w-3.5 text-rose-500" />
                Ideas de regalo de {assignedToName}:
              </p>
              {assignedToWishlist ? (
                <p className="whitespace-pre-line text-sm text-slate-700">
                  {assignedToWishlist}
                </p>
              ) : (
                <p className="text-xs italic text-slate-400">
                  Aún no ha escrito ideas de regalo. ¡Vuelve a revisar más
                  tarde!
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsRevealed(false)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <EyeOff className="h-3.5 w-3.5" />
              Ocultar nombre
            </button>
          </motion.div>
        )}
      </div>

      {/* Formulario para que el participante escriba sus propios deseos */}
      <form
        onSubmit={handleSaveWishlist}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
      >
        <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
          <Heart className="h-5 w-5 text-rose-500" />
          <h2>Tu lista de deseos (opcional)</h2>
        </div>
        <p className="text-xs text-slate-500">
          Dale pistas anónimas a quien le tocó regalarte (talla, colores,
          libros, cafés, etc.).
        </p>

        <textarea
          rows={3}
          placeholder="Ej. Talla M en camisetas, me encanta el café de especialidad, chocolates oscuros..."
          value={wishlist}
          onChange={(e) => setWishlist(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        />

        <div className="flex items-center justify-between">
          {savedSuccess ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <Check className="h-4 w-4" />
              ¡Guardado! Tu amigo secreto ya puede verlo.
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer"
          >
            {saving ? "Guardando..." : "Guardar mis ideas"}
          </button>
        </div>
      </form>
      {/* Invitación viral para que el participante cree su propio sorteo */}
      <div className="rounded-2xl border border-rose-100 bg-linear-br from-rose-50 to-white p-5 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-800">
          ¿Quieres organizar tu propio intercambio?
        </p>
        <p className="text-xs text-slate-500">
          Arma tu grupo con familia, amigos o en la oficina en menos de un
          minuto. Gratis y sin registros.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition"
        >
          <Sparkles className="h-4 w-4" />
          Crear mi propio sorteo gratis
        </Link>
      </div>
    </div>
  );
}
