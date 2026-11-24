import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import WhatsappShareBtn from "@/components/WhatsappShareBtn";
import { Gift, Calendar, Wallet, Eye, Clock, ShieldAlert } from "lucide-react";
import AdminRoomControls from "@/components/AdminRoomControls";

export const instant = false;

interface AdminRoomPageProps {
  params: Promise<{ adminToken: string }>;
}

export default async function AdminRoomPage({ params }: AdminRoomPageProps) {
  const { adminToken } = await params;

  if (!adminToken) {
    notFound();
  }

  const group = await prisma.group.findUnique({
    where: { adminToken },
    include: {
      participants: {
        orderBy: { name: "asc" },
      },
    },
  });

  if (!group) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminRoomControls adminToken={group.adminToken} />

      {/* Encabezado del grupo */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 mb-2">
              <Gift className="h-3.5 w-3.5" />
              Panel del organizador
            </span>
            <h1 className="text-2xl font-bold text-slate-900">{group.name}</h1>
          </div>
        </div>

        {(group.budget || group.eventDate) && (
          <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
            {group.budget && (
              <div className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-rose-500" />
                <span>
                  Presupuesto: <strong>{group.budget}</strong>
                </span>
              </div>
            )}
            {group.eventDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-rose-500" />
                <span>
                  Fecha: <strong>{group.eventDate}</strong>
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3.5 text-xs text-amber-800 border border-amber-200/70">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
          <p>
            <strong>Guarda esta página en tus favoritos.</strong> Desde aquí
            puedes enviar los enlaces privados y revisar quién ya descubrió su
            amigo secreto sin arruinar la sorpresa.
          </p>
        </div>
      </div>

      {/* Lista de envío por WhatsApp */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Enviar enlaces privados ({group.participants.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {group.participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">
                  {participant.name}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs">
                  {participant.hasViewed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <Eye className="h-3.5 w-3.5" />
                      Ya vio su resultado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      Pendiente de abrir
                    </span>
                  )}
                </div>
              </div>

              <WhatsappShareBtn
                participantName={participant.name}
                participantToken={participant.token}
                groupName={group.name}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
