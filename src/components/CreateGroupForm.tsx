"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSecretSantaGroup } from "@/actions/gameActions";
import {
  Gift,
  Plus,
  Trash2,
  ShieldBan,
  Sparkles,
  Calendar,
  Wallet,
  Users,
} from "lucide-react";

interface PlayerRow {
  tempId: string;
  name: string;
  excludedTempIds: string[];
  showExclusions: boolean;
}

export default function CreateGroupForm() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [budget, setBudget] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [players, setPlayers] = useState<PlayerRow[]>([
    { tempId: "1", name: "", excludedTempIds: [], showExclusions: false },
    { tempId: "2", name: "", excludedTempIds: [], showExclusions: false },
    { tempId: "3", name: "", excludedTempIds: [], showExclusions: false },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPlayer = () => {
    setPlayers((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        name: "",
        excludedTempIds: [],
        showExclusions: false,
      },
    ]);
  };

  const removePlayer = (tempId: string) => {
    if (players.length <= 3) return;
    setPlayers((prev) =>
      prev
        .filter((p) => p.tempId !== tempId)
        .map((p) => ({
          ...p,
          excludedTempIds: p.excludedTempIds.filter((id) => id !== tempId),
        })),
    );
  };

  const updateName = (tempId: string, name: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, name } : p)),
    );
  };

  const toggleExclusionPanel = (tempId: string) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.tempId === tempId ? { ...p, showExclusions: !p.showExclusions } : p,
      ),
    );
  };

  const toggleExclusion = (playerId: string, targetId: string) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.tempId !== playerId) return p;
        const exists = p.excludedTempIds.includes(targetId);
        return {
          ...p,
          excludedTempIds: exists
            ? p.excludedTempIds.filter((id) => id !== targetId)
            : [...p.excludedTempIds, targetId],
        };
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await createSecretSantaGroup({
      name: groupName,
      budget,
      eventDate,
      players: players.map(({ tempId, name, excludedTempIds }) => ({
        tempId,
        name,
        excludedTempIds,
      })),
    });

    if (!res.success) {
      setError(res.error || "Error al crear el grupo");
      setLoading(false);
      return;
    }

    router.push(`/sala/${res.adminToken}`);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Gift className="h-5 w-5 text-rose-500" />
          <h2>Detalles del intercambio</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nombre del grupo *
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Navidad Familia Pérez, Oficina 2026..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1">
              <Wallet className="h-4 w-4 text-slate-400" />
              Presupuesto (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. ₡15,000 o $25"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1">
              <Calendar className="h-4 w-4 text-slate-400" />
              Fecha del evento (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. 24 de diciembre"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <Users className="h-5 w-5 text-rose-500" />
            <h2>Participantes ({players.length})</h2>
          </div>
          <span className="text-xs text-slate-500">Mínimo 3 personas</span>
        </div>

        <div className="space-y-3">
          {players.map((player, index) => {
            const otherPlayers = players.filter(
              (p) => p.tempId !== player.tempId && p.name.trim() !== "",
            );

            return (
              <div
                key={player.tempId}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                    {index + 1}
                  </span>

                  <input
                    type="text"
                    required
                    placeholder={`Nombre del participante ${index + 1}`}
                    value={player.name}
                    onChange={(e) => updateName(player.tempId, e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => toggleExclusionPanel(player.tempId)}
                    title="Configurar exclusiones"
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium transition ${
                      player.excludedTempIds.length > 0
                        ? "bg-amber-100 text-amber-800"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <ShieldBan className="h-4 w-4" />
                    <span className="hidden sm:inline">Evitar</span>
                    {player.excludedTempIds.length > 0 && (
                      <span>({player.excludedTempIds.length})</span>
                    )}
                  </button>

                  {players.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removePlayer(player.tempId)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Eliminar participante"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {player.showExclusions && (
                  <div className="mt-3 border-t border-slate-200 pt-2.5 pl-9">
                    <p className="text-xs font-medium text-slate-600 mb-2">
                      ¿A quién NO puede regalarle{" "}
                      {player.name || "esta persona"}?
                    </p>
                    {otherPlayers.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">
                        Escribe los nombres de otros participantes primero.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {otherPlayers.map((other) => {
                          const isExcluded = player.excludedTempIds.includes(
                            other.tempId,
                          );
                          return (
                            <button
                              key={other.tempId}
                              type="button"
                              onClick={() =>
                                toggleExclusion(player.tempId, other.tempId)
                              }
                              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                isExcluded
                                  ? "bg-amber-500 text-white"
                                  : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {isExcluded ? "✕ " : "+ "}
                              {other.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addPlayer}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-600 hover:border-rose-400 hover:bg-rose-50/50 hover:text-rose-600 transition"
        >
          <Plus className="h-4 w-4" />
          Agregar otro participante
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700 disabled:opacity-60 transition cursor-pointer"
      >
        <Sparkles className="h-5 w-5" />
        {loading
          ? "Haciendo el sorteo..."
          : "Realizar sorteo y generar enlaces"}
      </button>
    </form>
  );
}
