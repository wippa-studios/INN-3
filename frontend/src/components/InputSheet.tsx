import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik, type FormikProps } from "formik";
import { useCharacter } from "../hooks/useCharacter";
import type {
  BudgetFormValues,
  TopTableValues,
  FlowStep,
} from "../types/inputsheet";
import axios from "axios";
import PartnerWheelOverlay from "./PartnerWheelOverlay";
import ChildrenWheelOverlay from "./ChildrenWheelOverlay";

// API 1: Controleert invoer van de bovenste tabellen
const apiCheckInputs = async (
  phase: 1 | 2,
  data: TopTableValues,
): Promise<boolean> => {
  const roomCode = localStorage.getItem("roomCode");
  const playerId = localStorage.getItem("playerId");

  if (!roomCode || !playerId) return false;

  // Als een veld een lege string is, verander naar null, anders backend helemaal flippen
  const payload = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === "" ? null : value,
    ]),
  );

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/game/${roomCode}/player/${playerId}/check-dossier-monthly`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error(`Fout bij checken inputs fase ${phase}:`, error);
    return false;
  }
};

const apiCompleteFirstWorkPhase = async (): Promise<void> => {
  const roomCode = localStorage.getItem("roomCode");
  const playerId = localStorage.getItem("playerId");
  if (!roomCode || !playerId) return;
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/game/${roomCode}/player/${playerId}/first-work-phase`,
    );
  } catch (err) {
    console.error("Fout bij melden eerste werkfase voltooid:", err);
  }
};

// API 2: Controleert berekeningen van de onderste tabellen
const apiCheckCalculations = async (
  phase: 1 | 2,
  data: BudgetFormValues,
): Promise<boolean> => {
  const roomCode = localStorage.getItem("roomCode");
  const playerId = localStorage.getItem("playerId");

  if (!roomCode || !playerId) return false;

  const payload = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === "" ? null : value,
    ]),
  );

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/game/${roomCode}/player/${playerId}/check-dossier-total`,
      payload,
    );

    return response.data;
  } catch (error) {
    console.error(`Fout bij checken calculaties fase ${phase}:`, error);
    return false;
  }
};

const SectionLabel = ({ label }: { label: string }) => (
  <div
    className="px-2 py-1 mb-3 mt-3 text-xs font-bold tracking-[0.3em] text-center border border-slate-300 "
    style={{ backgroundColor: "#FEF9E7", color: "#8B7A3A" }}
  >
    {label}
  </div>
);

const CategoryHeader = ({ icon, label }: { icon: string; label: string }) => (
  <div
    className="flex items-center gap-2 mb-1 mt-2 rounded px-2 py-1"
    style={{ backgroundColor: "#F9BC2F" }}
  >
    <img src={icon} alt="" className="w-4 h-4" />
    <span className="text-xs font-black text-white uppercase tracking-wide">
      {label}
    </span>
  </div>
);

const InputRow = ({
  label,
  namePhase1,
  namePhase2,
  formik,
  col1ReadOnly,
  col2ReadOnly,
  col2Blurred,
  placeholder,
}: {
  label: string;
  namePhase1: keyof TopTableValues;
  namePhase2: keyof TopTableValues;
  formik: FormikProps<BudgetFormValues>;
  col1ReadOnly: boolean;
  col2ReadOnly: boolean;
  col2Blurred: boolean;
  placeholder?: string;
}) => (
  <div
    className="flex gap-0 mb-1 text-xs"
    style={{ backgroundColor: "#FEF9E7" }}
  >
    <span className="flex-1 text-slate-600 py-1 pl-2">{label}</span>

    <input
      name={namePhase1}
      type="number"
      placeholder={placeholder}
      onChange={formik.handleChange}
      value={formik.values[namePhase1]}
      readOnly={col1ReadOnly}
      className={`w-32 text-center py-1 outline-none ${
        col1ReadOnly ? "opacity-70 pointer-events-none" : ""
      }`}
      style={{ backgroundColor: "#FDE8DF" }}
    />

    <input
      name={namePhase2}
      type="number"
      onChange={formik.handleChange}
      value={formik.values[namePhase2]}
      readOnly={col2ReadOnly}
      className={`w-32 text-center py-1 outline-none ${
        col2Blurred
          ? "blur-[1px] pointer-events-none"
          : col2ReadOnly
            ? "opacity-70 pointer-events-none"
            : ""
      }`}
      style={{ backgroundColor: "#E8F7F5" }}
    />
  </div>
);

const CalcInput = ({
  name,
  formik,
  readOnly,
  prefix,
}: {
  name: keyof BudgetFormValues;
  formik: FormikProps<BudgetFormValues>;
  readOnly: boolean;
  prefix?: string;
}) => (
  <div className="flex items-center w-full gap-1">
    {prefix && <span className="whitespace-nowrap">{prefix}</span>}
    <input
      name={name}
      type="number"
      onChange={formik.handleChange}
      value={formik.values[name]}
      readOnly={readOnly}
      className={`flex-1 min-w-0 text-right bg-transparent outline-none border-b ${
        readOnly
          ? "border-transparent opacity-70 pointer-events-none"
          : "border-slate-400"
      }`}
    />
  </div>
);

const CalcRow = ({
  label,
  sub,
  children,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-0 border-b border-white text-xs">
    <div className="flex-1 px-2 py-2 pr-2 border-r border-white">
      <p className="font-bold">{label}</p>
      {sub && <p className="text-slate-500">{sub}</p>}
    </div>
    <span className="w-1/3 px-2 py-2 bg-white/30 flex items-center justify-end gap-1">
      {children}
    </span>
  </div>
);

const PhaseButton = ({
  onClick,
  label,
  color,
  disabled = false,
  type = "button",
}: {
  onClick?: () => void;
  label: string;
  color: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) => (
  <div className="flex justify-center my-3">
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-3 text-xs font-black text-white rounded-lg shadow-md tracking-wide uppercase transition-transform ${
        disabled
          ? "opacity-80 cursor-default"
          : "hover:scale-105 active:scale-95"
      }`}
      style={{ backgroundColor: color }}
    >
      {label}
    </button>
  </div>
);

const InputSheet = ({
  onPhase2Complete,
}: {
  onPhase2Complete?: () => void;
}) => {
  const { t } = useTranslation("input_sheet");

  const [step, setStep] = useState<FlowStep>("PHASE1_INPUT");
  const [hasError, setHasError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [phase1Collapsed, setPhase1Collapsed] = useState(false);

  const [showPartnerWheel, setShowPartnerWheel] = useState(false);
  const [showChildrenWheel, setShowChildrenWheel] = useState(false);

  const col1ReadOnly = step !== "PHASE1_INPUT";
  const col2ReadOnly = step !== "PHASE2_INPUT";
  const col2Blurred = step === "PHASE1_INPUT" || step === "PHASE1_CALC";

  // klaarzetten children en partner
  const { character } = useCharacter();
  if (!character)
    return <div className="p-10 text-center">{t("general.no_role")}</div>;
  const partnerIndex =
    character.livingSituation.allPartners.findIndex(
      (p) => p.id === character.livingSituation.partner?.id,
    ) ?? 0;
  const chosenPartnerIndex = partnerIndex >= 0 ? partnerIndex : 0;
  const chosenChildrenIndex = character?.livingSituation.children ?? 0;

  const handlePartnerAssigned = () => {
    setShowPartnerWheel(false);
    setShowChildrenWheel(true);
  };

  const handleChildrenAssigned = () => {
    setShowChildrenWheel(false);
    character.livingSituation.isShown = true;
    setStep("PHASE2_INPUT");
    setPhase1Collapsed(true);
  };

  // bepalen of berekeningsvelden readonly zijn
  const p1CalcReadOnly = step !== "PHASE1_CALC";
  const p2CalcReadOnly = step !== "PHASE2_CALC";

  const formik = useFormik<
    BudgetFormValues & {
      remaining_budget_phase1: string;
      remaining_budget_phase2: string;
    }
  >({
    initialValues: {
      net_salary_phase1: "",
      net_salary_phase2: "",
      partner_salary_phase1: "",
      partner_salary_phase2: "",
      monthly_rent_phase1: "",
      monthly_rent_phase2: "",
      living_costs_phase1: "",
      living_costs_phase2: "",
      purchase_monthly_phase1: "",
      purchase_monthly_phase2: "",
      monthly_cost_phase1: "",
      monthly_cost_phase2: "",
      car_insurance_phase1: "",
      car_insurance_phase2: "",
      fire_insurance_phase1: "",
      fire_insurance_phase2: "",
      family_insurance_phase1: "",
      family_insurance_phase2: "",
      hospital_insurance_phase1: "",
      hospital_insurance_phase2: "",
      accident_insurance_phase1: "",
      accident_insurance_phase2: "",
      remaining_budget_phase1: "",
      remaining_budget_phase2: "",

      // fase 1 Berekeningen
      calc_p1_remaining: "",
      calc_p1_student: "",
      calc_p1_parental: "",
      calc_p1_housing: "",
      calc_p1_factor: "",
      calc_p1_total1: "",

      // fase 2 Berekeningen
      calc_p2_total1_carry: "",
      calc_p2_partner_savings: "",
      calc_p2_total2: "",
      calc_p2_housing: "",
      calc_p2_total3: "",
      calc_p2_checking: "",
      calc_p2_savings: "",
      calc_p2_investment: "",
      calc_p2_total3_age50: "",
      calc_p2_remaining: "",
      calc_p2_event1: "",
      calc_p2_event2: "",
      calc_p2_event3: "",
      calc_p2_total4: "",
      calc_p2_return_savings: "",
      calc_p2_return_investment: "",
      calc_p2_inflation: "",
      calc_p2_total5: "",
    },
    onSubmit: async (values) => {
      console.log("Submit getriggerd. Actieve stap:", step);
      setHasError(false);
      setIsChecking(true);

      try {
        if (step === "PHASE1_INPUT") {
          const isValid = await apiCheckInputs(1, values);
          if (isValid) setStep("PHASE1_CALC");
          else setHasError(true);
        } else if (step === "PHASE1_CALC") {
          const isValid = await apiCheckCalculations(1, values);
          if (isValid) {
            await apiCompleteFirstWorkPhase();
            setShowPartnerWheel(true);
            // setStep("PHASE2_INPUT");
            // setPhase1Collapsed(true);
          } else {
            setHasError(true);
          }
        } else if (step === "PHASE2_INPUT") {
          const isValid = await apiCheckInputs(2, values);
          if (isValid) {
            setStep("PHASE2_CALC");
            if (onPhase2Complete) onPhase2Complete();
          } else setHasError(true);
        } else if (step === "PHASE2_CALC") {
          const isValid = await apiCheckCalculations(2, values);
          if (isValid) {
            setStep("DONE");
          } else {
            setHasError(true);
          }
        }
      } catch (error) {
        console.error("Fout tijdens validatie:", error);
        setHasError(true);
      } finally {
        setIsChecking(false);
      }
    },
  });

  const getTopButtonProps = () => {
    if (step === "PHASE1_INPUT") {
      return {
        label: isChecking
          ? t("checking")
          : hasError
            ? t("error_retry")
            : t("check_phase1_input"),
        color: hasError ? "#991a00" : "#076b67",
        disabled: isChecking,
      };
    }
    if (step === "PHASE1_CALC") {
      return {
        label: t("phase1_saved"),
        color: "#DE7862",
        disabled: true,
      };
    }
    if (step === "PHASE2_INPUT") {
      return {
        label: isChecking
          ? t("checking")
          : hasError
            ? t("error_retry")
            : t("check_phase2_input"),
        color: hasError ? "#991a00" : "#076b67",
        disabled: isChecking,
      };
    }
    return {
      label: t("phase2_saved"),
      color: "#11B0A5",
      disabled: true,
    };
  };

  const topBtn = getTopButtonProps();

  return (
    <div className="flex">
      <div className="flex-1">
        <form onSubmit={formik.handleSubmit} className="h-full overflow-y-auto">
          <div className="flex justify-start mb-1">
            <img
              src="/Logo_Langwerpig.svg"
              alt="Live Your Life"
              className="w-60 opacity-60"
            />
          </div>

          <div className="flex mb-2 sticky top-0 bg-white pb-1 border-b border-slate-100 z-10">
            <div className="flex-1" />
            <div
              className={`w-32 text-center text-xs font-black text-white py-1 ${col1ReadOnly ? "opacity-70 pointer-events-none" : ""}`}
              style={{ backgroundColor: "#DE7862" }}
            >
              {t("work_phase_1")}
            </div>
            <div
              className={`w-32 text-center text-xs font-black text-white py-1 ${col2Blurred ? "blur-[1px] pointer-events-none" : ""}`}
              style={{ backgroundColor: "#11B0A5" }}
            >
              {t("work_phase_2")}
            </div>
          </div>

          {/* Inkomsten */}
          <SectionLabel label={t("income_label")} />
          <CategoryHeader icon="/Loon.svg" label={t("salary")} />
          <InputRow
            label={t("net_salary")}
            namePhase1="net_salary_phase1"
            namePhase2="net_salary_phase2"
            formik={formik}
            col1ReadOnly={col1ReadOnly}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
          />
          <InputRow
            label={t("partner_salary")}
            namePhase1="partner_salary_phase1"
            namePhase2="partner_salary_phase2"
            formik={formik}
            col1ReadOnly={true}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
            placeholder="XXX"
          />

          {/* Uitgaven */}
          <SectionLabel label={t("expenses_label")} />
          <CategoryHeader icon="/huisvestiging.svg" label={t("housing")} />
          <InputRow
            label={t("monthly_rent")}
            namePhase1="monthly_rent_phase1"
            namePhase2="monthly_rent_phase2"
            formik={formik}
            col1ReadOnly={col1ReadOnly}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
          />

          <CategoryHeader icon="/leefkosten.svg" label={t("living_costs")} />
          <InputRow
            label={t("living_costs")}
            namePhase1="living_costs_phase1"
            namePhase2="living_costs_phase2"
            formik={formik}
            col1ReadOnly={col1ReadOnly}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
          />

          <CategoryHeader icon="/mobiliteit.svg" label={t("mobility")} />
          <InputRow
            label={t("purchase_monthly")}
            namePhase1="purchase_monthly_phase1"
            namePhase2="purchase_monthly_phase2"
            formik={formik}
            col1ReadOnly={col1ReadOnly}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
          />
          <InputRow
            label={t("monthly_cost")}
            namePhase1="monthly_cost_phase1"
            namePhase2="monthly_cost_phase2"
            formik={formik}
            col1ReadOnly={col1ReadOnly}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
          />
          <InputRow
            label={t("car_insurance")}
            namePhase1="car_insurance_phase1"
            namePhase2="car_insurance_phase2"
            formik={formik}
            col1ReadOnly={col1ReadOnly}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
          />

          <CategoryHeader icon="/verzekering.svg" label={t("insurance")} />
          <InputRow
            label={t("fire_insurance")}
            namePhase1="fire_insurance_phase1"
            namePhase2="fire_insurance_phase2"
            formik={formik}
            col1ReadOnly={col1ReadOnly}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
          />
          <InputRow
            label={t("family_insurance")}
            namePhase1="family_insurance_phase1"
            namePhase2="family_insurance_phase2"
            formik={formik}
            col1ReadOnly={col1ReadOnly}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
          />
          <InputRow
            label={t("hospital_insurance")}
            namePhase1="hospital_insurance_phase1"
            namePhase2="hospital_insurance_phase2"
            formik={formik}
            col1ReadOnly={col1ReadOnly}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
          />
          <InputRow
            label={t("accident_insurance")}
            namePhase1="accident_insurance_phase1"
            namePhase2="accident_insurance_phase2"
            formik={formik}
            col1ReadOnly={col1ReadOnly}
            col2ReadOnly={col2ReadOnly}
            col2Blurred={col2Blurred}
          />

          <div
            className="flex gap-0 mt-4 text-xs font-black uppercase items-stretch"
            style={{ backgroundColor: "#F9BC2F" }}
          >
            <span className="flex-1 text-slate-600 px-2 py-2 flex items-center">
              {t("remaining_budget")}
            </span>
            <div
              className="w-32 flex items-center justify-between px-2 py-1"
              style={{ backgroundColor: "#FDE8DF" }}
            >
              <span>=</span>
              <input
                name="remaining_budget_phase1"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.remaining_budget_phase1}
                readOnly={col1ReadOnly}
                className={`w-full mx-1 bg-transparent text-center outline-none font-black ${
                  col1ReadOnly ? "opacity-70 pointer-events-none" : ""
                }`}
              />
              <span>▲</span>
            </div>
            <div
              className="w-32 flex items-center justify-between px-2 py-1"
              style={{ backgroundColor: "#E8F7F5" }}
            >
              <span>=</span>
              <input
                name="remaining_budget_phase2"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.remaining_budget_phase2}
                readOnly={col2ReadOnly}
                className={`w-full mx-1 bg-transparent text-center outline-none font-black ${
                  col2Blurred
                    ? "blur-[1px] pointer-events-none"
                    : col2ReadOnly
                      ? "opacity-70 pointer-events-none"
                      : ""
                }`}
              />
              <span>■</span>
            </div>
          </div>

          <PhaseButton
            type="submit"
            label={topBtn.label}
            color={topBtn.color}
            disabled={topBtn.disabled}
          />

          {/* berekening fase 1 */}
          {(step === "PHASE1_CALC" ||
            step === "PHASE2_INPUT" ||
            step === "PHASE2_CALC" ||
            step === "DONE") && (
            <div className="mt-4 rounded overflow-hidden">
              <div
                className="flex px-2 py-2 cursor-pointer"
                style={{ backgroundColor: "#DE7862" }}
                onClick={() =>
                  col1ReadOnly && setPhase1Collapsed(!phase1Collapsed)
                }
              >
                <span className="flex-1 text-xs font-black text-white uppercase">
                  {t("calculation_phase1")}
                </span>
                <span className="text-xs font-black text-white uppercase">
                  {col1ReadOnly
                    ? phase1Collapsed
                      ? "▶"
                      : "▼"
                    : t("calculation")}
                </span>
              </div>

              {!phase1Collapsed && (
                <div style={{ backgroundColor: "#FBE2D5" }}>
                  <CalcRow
                    label={t("remaining_budget_phase1")}
                    sub={t("remaining_budget_phase1_sub")}
                  >
                    <CalcInput
                      name="calc_p1_remaining"
                      formik={formik}
                      readOnly={p1CalcReadOnly}
                      prefix="▲"
                    />
                  </CalcRow>
                  <CalcRow
                    label={t("student_job_income")}
                    sub={t("student_job_income_sub")}
                  >
                    <CalcInput
                      name="calc_p1_student"
                      formik={formik}
                      readOnly={p1CalcReadOnly}
                      prefix="+"
                    />
                  </CalcRow>
                  <CalcRow label={t("factor")} sub={t("factor_sub")}>
                    <CalcInput
                      name="calc_p1_factor"
                      formik={formik}
                      readOnly={p1CalcReadOnly}
                      prefix="/2 ="
                    />
                  </CalcRow>
                  <CalcRow
                    label={t("parental_support")}
                    sub={t("parental_support_sub")}
                  >
                    <CalcInput
                      name="calc_p1_parental"
                      formik={formik}
                      readOnly={p1CalcReadOnly}
                      prefix="+"
                    />
                  </CalcRow>
                  <CalcRow
                    label={t("housing_purchase_cost")}
                    sub={t("housing_purchase_cost_sub")}
                  >
                    <CalcInput
                      name="calc_p1_housing"
                      formik={formik}
                      readOnly={true}
                      prefix=""
                    />
                  </CalcRow>

                  <div
                    className="flex gap-0 text-xs font-black items-center"
                    style={{ backgroundColor: "#DE7862" }}
                  >
                    <div className="flex-1 px-2 py-2 pr-2">
                      <span className="text-white uppercase">
                        {t("total1")}
                      </span>
                    </div>
                    <div className="w-1/3 px-2 py-2 flex items-center gap-1">
                      <span className="text-white whitespace-nowrap">= ●</span>
                      <input
                        name="calc_p1_total1"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.calc_p1_total1}
                        readOnly={p1CalcReadOnly}
                        className={`flex-1 min-w-0 text-right bg-transparent outline-none border-b ${p1CalcReadOnly ? "border-transparent opacity-70 pointer-events-none text-white" : "border-white text-white"}`}
                      />
                    </div>
                  </div>

                  {step === "PHASE1_CALC" && (
                    <div className="bg-white pt-2">
                      <PhaseButton
                        type="submit"
                        label={
                          isChecking
                            ? t("checking")
                            : hasError
                              ? t("error_calc")
                              : t("check_calc_phase1")
                        }
                        color={hasError ? "#991a00" : "#076b67"}
                        disabled={isChecking}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* berekening fase 2 */}
          {(step === "PHASE2_CALC" || step === "DONE") && (
            <div className="mt-4 rounded overflow-hidden">
              <div
                className="flex px-2 py-2"
                style={{ backgroundColor: "#11B0A5" }}
              >
                <span className="flex-1 text-xs font-black text-white uppercase">
                  {t("calculation_phase2")}
                </span>
                <span className="text-xs font-black text-white uppercase">
                  {t("calculation")}
                </span>
              </div>
              <div style={{ backgroundColor: "#D8F1EF" }}>
                <CalcRow label={t("total1_carry")}>
                  <CalcInput
                    name="calc_p2_total1_carry"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="●"
                  />
                </CalcRow>
                <CalcRow label={t("partner_savings")}>
                  <CalcInput
                    name="calc_p2_partner_savings"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="+"
                  />
                </CalcRow>
                <CalcRow label={t("total2")} sub={t("total2_sub")}>
                  <CalcInput
                    name="calc_p2_total2"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="="
                  />
                </CalcRow>
                <CalcRow
                  label={t("housing_purchase_cost")}
                  sub={t("housing_purchase_cost_phase2_sub")}
                >
                  <CalcInput
                    name="calc_p2_housing"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="-"
                  />
                </CalcRow>
                <CalcRow label={t("total3")} sub={t("total3_sub")}>
                  <CalcInput
                    name="calc_p2_total3"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="★ ="
                  />
                </CalcRow>

                <div className="grid grid-cols-3 border-b border-white text-xs">
                  {[
                    { label: t("checking_account") },
                    {
                      label: t("savings_account"),
                      sub: t("savings_account_sub"),
                    },
                    { label: t("investment"), sub: t("investment_sub") },
                  ].map(({ label, sub }) => (
                    <div
                      key={label}
                      className="p-2 border-r border-white font-bold text-center flex flex-col items-center justify-center last:border-r-0"
                      style={{ backgroundColor: "#11B0A5", color: "white" }}
                    >
                      <p>{label}</p>
                      {sub && (
                        <p className="font-normal text-[10px] text-center">
                          {sub}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 border-b border-white text-xs">
                  {[
                    "calc_p2_checking",
                    "calc_p2_savings",
                    "calc_p2_investment",
                  ].map((name) => (
                    <div
                      key={name}
                      className="p-2 border-r border-white flex justify-center last:border-r-0"
                      style={{ backgroundColor: "#E8F7F5" }}
                    >
                      <input
                        name={name}
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values[name as keyof BudgetFormValues]}
                        readOnly={p2CalcReadOnly}
                        className={`w-full text-center bg-transparent outline-none border-b ${p2CalcReadOnly ? "border-transparent opacity-70 pointer-events-none" : "border-slate-400"}`}
                      />
                    </div>
                  ))}
                </div>

                <CalcRow label={t("total3_age50")}>
                  <CalcInput
                    name="calc_p2_total3_age50"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="★"
                  />
                </CalcRow>
                <CalcRow
                  label={t("remaining_budget_phase2")}
                  sub={t("remaining_budget_phase2_sub")}
                >
                  <CalcInput
                    name="calc_p2_remaining"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="■"
                  />
                </CalcRow>
                <CalcRow label={t("event_cards_impact")}>
                  <CalcInput
                    name="calc_p2_event1"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="±"
                  />
                </CalcRow>
                <CalcRow label={t("event_cards_impact")}>
                  <CalcInput
                    name="calc_p2_event2"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="±"
                  />
                </CalcRow>
                <CalcRow label={t("event_cards_impact")}>
                  <CalcInput
                    name="calc_p2_event3"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="±"
                  />
                </CalcRow>
                <CalcRow label={t("total4")}>
                  <CalcInput
                    name="calc_p2_total4"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="="
                  />
                </CalcRow>
                <CalcRow label={t("return_savings")}>
                  <CalcInput
                    name="calc_p2_return_savings"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="+"
                  />
                </CalcRow>
                <CalcRow label={t("return_investment")}>
                  <CalcInput
                    name="calc_p2_return_investment"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="+"
                  />
                </CalcRow>
                <CalcRow label={t("impact_inflation")}>
                  <CalcInput
                    name="calc_p2_inflation"
                    formik={formik}
                    readOnly={p2CalcReadOnly}
                    prefix="-"
                  />
                </CalcRow>

                <div
                  className="flex gap-0 text-xs font-black items-center"
                  style={{ backgroundColor: "#11B0A5" }}
                >
                  <div className="flex-1 px-2 py-2 pr-2">
                    <span className="text-white uppercase">{t("total5")}</span>
                  </div>
                  <div className="w-1/3 px-2 py-2 flex items-center gap-1">
                    <span className="text-white whitespace-nowrap">=</span>
                    <input
                      name="calc_p2_total5"
                      type="number"
                      onChange={formik.handleChange}
                      value={formik.values.calc_p2_total5}
                      readOnly={p2CalcReadOnly}
                      className={`flex-1 min-w-0 text-right bg-transparent outline-none border-b ${p2CalcReadOnly ? "border-transparent opacity-70 pointer-events-none text-white" : "border-white text-white"}`}
                    />
                  </div>
                </div>

                <div className="bg-white pt-2">
                  <PhaseButton
                    type={step === "DONE" ? "button" : "submit"}
                    label={
                      step === "DONE"
                        ? t("done")
                        : isChecking
                          ? t("checking")
                          : hasError
                            ? t("error_calc")
                            : t("check_calc_phase2")
                    }
                    color={
                      step === "DONE"
                        ? "#11B0A5"
                        : hasError
                          ? "#991a00"
                          : "#076b67"
                    }
                    disabled={step === "DONE" || isChecking}
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      <PartnerWheelOverlay
        isOpen={showPartnerWheel}
        partners={character.livingSituation.allPartners}
        predeterminedPartnerIndex={chosenPartnerIndex}
        onPartnerAssigned={handlePartnerAssigned}
      />

      <ChildrenWheelOverlay
        isOpen={showChildrenWheel}
        predeterminedChildrenIndex={chosenChildrenIndex}
        onChildrenAssigned={handleChildrenAssigned}
      />
    </div>
  );
};

export default InputSheet;
