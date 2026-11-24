"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteSecretSantaGroup } from "@/actions/gameActions";
import { saveEventToHistory, removeEventFromHistory } from "@/lib/localHistory";
import { PlusCircle, Trash2, Copy, Check } from "lucide-react";

interface AdminRoomControlsProps {
  adminToken: string;
  groupName: string;
}

export default function AdminRoomControls({
  adminToken,
  groupName,
}: AdminRoomControlsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);

  useEffect(() => {
    saveEventToHistory({
      id: adminToken,
      role: "admin",
      groupName,
      url: `/sala/${adminToken}`,
    });
  }, [adminToken, groupName]);

  const handleCopyAdminLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopiedAdmin(true);
    setTimeout(() => setCopiedAdmin(false), 2000);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta sala? Todos los enlaces de los participantes dejarán de funcionar.",
    );
    if (!confirmed) return;

    setDeleting(true);
    const res = await deleteSecretSantaGroup(adminToken);

    if (res.success) {
      removeEventFromHistory(adminToken);
      router.push("/");
    } else {
      alert(res.error || "Error al eliminar");
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
        >
          <PlusCircle className="h-4 w-4" />
          Nueva sala
        </Link>

        <button
          type="button"
          onClick={handleCopyAdminLink}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          {copiedAdmin ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600">Link de sala copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-500" />
              Guardar link de organizador
            </>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50 transition cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
        {deleting ? "Eliminando..." : "Eliminar sala"}
      </button>
    </div>
  );
}
