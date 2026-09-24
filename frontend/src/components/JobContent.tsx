import { Wheel } from "react-custom-roulette";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import mockJobData from "../assets/mockJobData.json";
import ResultPane from "./ResultPane";
import type { Job } from "../types/jobTypes";
import "../styles/General.css";

const JobPage = () => {
  const { t } = useTranslation();

  // Importing possible jobs
  const jobs = [mockJobData[0].job1, mockJobData[0].job2, mockJobData[0].job3];

  // Names segments
  const data = jobs.map((job) => ({
    option: t(job.nameKey),
  }));

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showPane, setShowPane] = useState(false);

  //For this mock example, we want job2
  const spinToJob2 = () => {
    setPrizeIndex(1); // force second job
    setMustSpin(true);
  };

  return (
    <div className="job-page-container">
      <h1 className="h1">{t("profile_labels.possible_jobs")}</h1>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeIndex}
        data={data}
        backgroundColors={["#f9bc2f", "#f08666", "#11b0a5"]}
        textColors={["#000000"]}
        perpendicularText={true}
        onStopSpinning={() => {
          setMustSpin(false);

          const job = jobs[prizeIndex];
          setSelectedJob(job);
          setShowPane(true);
        }}
      />

      <button className="button" onClick={spinToJob2}>
        Spin
      </button>

      <ResultPane
        job={selectedJob}
        isOpen={showPane}
        onClose={() => setShowPane(false)}
        t={t}
      />
    </div>
  );
};

export default JobPage;
