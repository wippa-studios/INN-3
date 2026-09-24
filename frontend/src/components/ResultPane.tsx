import React, { useEffect } from "react";
import "../styles/ResultPane.css";
import "../styles/General.css";
import type { Job } from "../types/jobTypes";
import { createPortal } from "react-dom";

type ResultPaneProps = {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string; // from i18next
};

const ResultPane: React.FC<ResultPaneProps> = ({ job, isOpen, onClose, t }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !job) return null;

  return createPortal(
    <div className="pane-overlay" onClick={onClose}>
      <div className="pane-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t(job.nameKey)}</h2>

        <p>
          <strong>{t("profile_labels.phase_1_small")}:</strong>
          <br />
          {t("profile_labels.brut_start")}: €{job.firstSalaryGrossKey}
          <br />
          {t("profile_labels.brut_start")}: €{job.firstSalaryNetKey}
        </p>

        <p>
          <strong>{t("profile_labels.phase_2_small")}</strong>
          <br />
          {t("profile_labels.avg_brut")}: €{job.secondSalaryGrossKey}
          <br />
          {t("profile_labels.avg_net")}: €{job.secondSalaryNetKey}
        </p>

        <p>
          <strong>{t("profile_labels.pension")}:</strong> €{job.pensionKey}
        </p>

        <p>
          <strong>{t("profile_labels.perks")}:</strong>
          <br />
          {t(job.benefitsKey)}
        </p>

        <button onClick={onClose}>{t("studentPhase.next_button")}</button>
      </div>
    </div>,
    document.body,
  );
};

export default ResultPane;
