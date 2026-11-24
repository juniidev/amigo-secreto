import Link from "next/link";
import { Gift, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
        <Gift className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">
          Enlace no encontrado
        </h1>
        <p className="max-w-sm text-sm text-slate-600">
          Este sorteo no existe o el enlace está incompleto. Verifica que lo
          hayas copiado completo.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Crear un nuevo Amigo Secreto
      </Link>
    </div>
  );
}
