import { useTranslation } from "react-i18next";
import dossierData from "../../assets/dossierData.json";
import { formatCurrency } from "../../utils/formatters";

const MobilityContent = () => {
  const { t } = useTranslation("dossier_info");
  const transportOptions = dossierData.mobility.transport.options;
  const insuranceOptions = dossierData.mobility.auto_insurance.options;

  return (
    <div className="p-4 text-xs overflow-y-auto h-full">
      <div className="flex items-center gap-2 mb-4">
        <img src="/mobiliteit.svg" alt="" className="w-5 h-5" />
        <h2 className="font-black uppercase tracking-wide text-sm">
          {t("mobility.title")}
        </h2>
      </div>

      {/* Vervoersmiddelen label */}
      <div
        className="px-2 py-3 mb-2 text-xs font-bold tracking-[0.3em] text-center uppercase"
        style={{ backgroundColor: "#1ea798", color: "black" }}>
        {t("mobility.transport.title")}
      </div>

      <div className="rounded overflow-hidden mb-6">
        <table className="w-full border-collapse">
          <thead className="border-b-2 border-white">
            <tr>
              <th
                className="text-left p-2 text-black text-xs border-r-2 border-white"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("mobility.transport.headers.options")}
              </th>
              {transportOptions.map((option) => (
                <th
                  key={option.id}
                  className="text-left p-2 text-black text-xs border-r-2 border-white"
                  style={{ backgroundColor: "#F9BC2F" }}>
                  {t(option.nameKey)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr
              className="border-b-2 border-white"
              style={{ backgroundColor: "#FDF5D6" }}>
              <td
                className="p-2 border-r-2 border-white"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("mobility.transport.headers.purchase_price")}
              </td>
              {transportOptions.map((option) => (
                <td key={option.id} className="p-2 border-r-2 border-white">
                  {formatCurrency(option.purchasePrice)}
                </td>
              ))}
            </tr>
            <tr
              className="border-b-2 border-white"
              style={{ backgroundColor: "#FEF9E7" }}>
              <td
                className="p-2 border-r-2 border-white"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("mobility.transport.headers.info")}
              </td>
              {transportOptions.map((option) => (
                <td key={option.id} className="p-2 border-r-2 border-white">
                  {t(option.infoKey)}
                </td>
              ))}
            </tr>
            <tr
              className="border-b-2 border-white"
              style={{ backgroundColor: "#FDF5D6" }}>
              <td
                className="p-2 border-r-2 border-white"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("mobility.transport.headers.monthly_purchase")}
              </td>
              {transportOptions.map((option) => (
                <td key={option.id} className="p-2 border-r-2 border-white">
                  {formatCurrency(option.monthlyPurchase)}
                </td>
              ))}
            </tr>
            <tr
              className="border-b-2 border-white"
              style={{ backgroundColor: "#FEF9E7" }}>
              <td
                className="p-2 border-r-2 border-white"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("mobility.transport.headers.monthly_cost")}
              </td>
              {transportOptions.map((option) => (
                <td key={option.id} className="p-2 border-r-2 border-white">
                  {formatCurrency(option.monthlyCost)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Autoverzekering label */}
      <div
        className="px-2 py-3 mb-2 text-xs font-bold tracking-[0.3em] text-center uppercase"
        style={{ backgroundColor: "#1ea798", color: "black" }}>
        {t("mobility.auto_insurance.title")}
      </div>

      <div className="rounded overflow-hidden mb-4">
        <div className="grid grid-cols-3 gap-0">
          {/* Headers */}
          {insuranceOptions.map((opt) => (
            <div
              key={opt.id}
              className="p-2 text-black font-bold text-xs border-r-2 border-b-2 border-white"
              style={{ backgroundColor: "#F9BC2F" }}>
              {t(opt.nameKey)}
            </div>
          ))}

          {/* Beschrijving */}
          {insuranceOptions.map((opt) => (
            <div
              key={opt.id}
              className="p-2 text-xs border-r-2 border-b-2 border-white"
              style={{ backgroundColor: "#FDF5D6" }}>
              {t(opt.descKey)}
            </div>
          ))}

          {/* Dekking */}
          {insuranceOptions.map((opt) => (
            <div
              key={opt.id}
              className="p-2 text-xs border-r-2 border-b-2 border-white"
              style={{ backgroundColor: "#FEF9E7" }}>
              <p className="font-bold mb-1">
                {t("mobility.auto_insurance.labels.coverage")}
              </p>
              {t(`mobility.auto_insurance.options.${opt.id}.coverage`)
                .split("|")
                .map((item, i) => (
                  <p key={i}>· {item}</p>
                ))}
            </div>
          ))}

          {/* Franchise */}
          {insuranceOptions.map((opt) => (
            <div
              key={opt.id}
              className="p-2 text-xs border-r-2 border-b-2 border-white"
              style={{ backgroundColor: "#FDF5D6" }}>
              {t("mobility.auto_insurance.labels.franchise")}:{" "}
              {formatCurrency(opt.franchise)}
            </div>
          ))}

          {/* Kost/jaar */}
          {insuranceOptions.map((opt) => (
            <div
              key={opt.id}
              className="p-2 text-xs border-r-2 border-b-2 border-white"
              style={{ backgroundColor: "#FEF9E7" }}>
              {t("mobility.auto_insurance.labels.yearly_cost")}:{" "}
              {formatCurrency(opt.yearlyCost)}
            </div>
          ))}

          {/* Kost/maand kleine wagen/gezinswagen */}
          {insuranceOptions.map((opt) => (
            <div
              key={opt.id}
              className="p-2 text-xs border-r-2 border-b-2 border-white"
              style={{ backgroundColor: "#FDF5D6" }}>
              <p>
                <span className="font-bold">
                  {t("mobility.auto_insurance.labels.monthly_cost")}:
                </span>{" "}
                {formatCurrency(opt.monthlyCost)}
              </p>
              <p className="mt-1">
                <span className="font-bold">
                  {t("mobility.auto_insurance.labels.monthly_cost_sports")}:
                </span>{" "}
                {formatCurrency(opt.monthlyCostSports)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobilityContent;
