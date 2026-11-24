import CreateGroupForm from "@/components/CreateGroupForm";
import { Gift } from "lucide-react";
import MyEventsList from "@/components/MyEventsList";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/20">
          <Gift className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Amigo Secreto
        </h1>
        <p className="mx-auto max-w-md text-sm text-slate-600 sm:text-base">
          Crea tu grupo sin registros, configura quién no puede regalarle a
          quién y envía los resultados directos por WhatsApp.
        </p>
      </header>
      <MyEventsList />
      <CreateGroupForm />
    </div>
  );
}
