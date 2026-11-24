"use client";

import { useState } from "react";
import { MessageCircle, Copy, Check } from "lucide-react";

interface WhatsappShareBtnProps {
  participantName: string;
  participantToken: string;
  groupName: string;
}

export default function WhatsappShareBtn({
  participantName,
  participantToken,
  groupName,
}: WhatsappShareBtnProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return `${window.location.origin}/revelar/${participantToken}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsapp = () => {
    const raw =
      "¡Hola " +
      participantName +
      "! Ya se hizo el sorteo de Amigo Secreto para *" +
      groupName +
      "*. Descubre a quién le regalas aquí: " +
      getShareUrl();

    const url = new URL("https://wa.me");
    url.searchParams.set("text", raw);
    window.location.assign(url.toString());
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        title="Copiar enlace secreto"
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            <span className="text-emerald-600">Copiado</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Copiar</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleWhatsapp}
        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
      >
        <MessageCircle className="h-4 w-4" />
        <span>Enviar</span>
      </button>
    </div>
  );
}
