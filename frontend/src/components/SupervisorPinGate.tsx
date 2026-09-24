import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import InputField from "./InputField";

interface Props {
  onSuccess: () => void;
}

export default function SupervisorPinGate({ onSuccess }: Props) {
  const { t } = useTranslation();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/supervisor/verify-pin`,
        { pin },
      );
      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError(t("supervisor_page.pin_invalid", "Incorrect PIN."));
      } else {
        setError(t("supervisor_page.pin_error_generic", "Something went wrong. Try again."));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-sm border-2 border-teal-50 p-8 text-center">
        <h1 className="text-4xl font-black text-teal-800 mb-2 tracking-tight">
          LIV<span className="text-amber-500">€</span> YOUR LIF
          <span className="text-amber-500">€</span>
        </h1>
        <p className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-8">
          {t("supervisor_page.pin_subtitle", "Supervisor Access")}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            type="password"
            placeholder={t("supervisor_page.pin_placeholder", "Enter PIN")}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            autoFocus
            autoComplete="off"
          />

          {error && (
            <p className="text-red-500 font-semibold text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length === 0}
            className={`font-extrabold py-4 px-10 rounded-full shadow-lg transition-transform text-lg uppercase tracking-wider ${
              loading || pin.length === 0
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600 text-white hover:scale-105 active:scale-95 shadow-teal-500/30"
            }`}
          >
            {t("supervisor_page.pin_submit", "Confirm")}
          </button>
        </form>
      </div>
    </div>
  );
}
