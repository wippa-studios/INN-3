import { useTranslation } from "react-i18next";

interface NavigationBlockedModalProps {
  open: boolean;
  onDismiss: () => void;
}

const NavigationBlockedModal = ({
  open,
  onDismiss,
}: NavigationBlockedModalProps) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Modal */}
      <div className="relative bg-white max-w-sm w-full mx-4 rounded-[2.5rem] shadow-xl border-2 border-teal-50 p-8 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center text-3xl shadow-inner border-4 border-teal-100">
          🔒
        </div>

        <h2 className="text-xl font-black text-slate-800">
          {t("navigation_blocked.title")}
        </h2>

        <p className="text-slate-500 font-medium text-sm leading-relaxed">
          {t("navigation_blocked.message")}
        </p>

        <button
          onClick={onDismiss}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 text-base uppercase tracking-wide">
          {t("navigation_blocked.dismiss")}
        </button>
      </div>
    </div>
  );
};

export default NavigationBlockedModal;
