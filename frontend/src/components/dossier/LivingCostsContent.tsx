import { useTranslation } from "react-i18next";
import dossierData from "../../assets/dossierData.json";
import { formatCurrency } from "../../utils/formatters";

const LivingCostsContent = () => {
  const { t } = useTranslation("dossier_info");
  const livingOptions = dossierData.living_costs.options;

  const formatValue = (value: number | string) =>
    typeof value === "number" ? formatCurrency(value) : value;

  return (
    <div className="p-4 text-xs overflow-y-auto h-full">
      <div className="flex items-center gap-2 mb-4">
        <img src="/leefkosten.svg" alt="" className="w-5 h-5" />
        <h2 className="font-black uppercase tracking-wide text-sm">
          {t("living_costs.title")}
        </h2>
      </div>

      <p className="mb-4 text-slate-500 italic">{t("living_costs.subtitle")}</p>

      <div
        className="px-2 py-3 mb-2 text-xs font-bold text-center uppercase"
        style={{ backgroundColor: "#de7862", color: "black" }}>
        {t("living_costs.title")}
      </div>
      <div className="rounded overflow-hidden mb-4">
        <table className="w-full border-collapse">
          <thead className="border-b-2 border-white">
            <tr>
              <th
                className="text-left p-2 text-black text-xs border-r-2 border-white"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("living_costs.headers.situation")}
              </th>
              <th
                className="text-left p-2 text-black text-xs border-r-2 border-white"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("living_costs.headers.no_children")}
              </th>
              <th
                className="text-left p-2 text-black text-xs border-r-2 border-white"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("living_costs.headers.one_child")}
              </th>
              <th
                className="text-left p-2 text-black text-xs border-r-2 border-white"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("living_costs.headers.two_children")}
              </th>
              <th
                className="text-left p-2 text-black text-xs"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("living_costs.headers.three_children")}
              </th>
            </tr>
          </thead>
          <tbody>
            {livingOptions.map((option, i) => (
              <tr
                key={option.id}
                className="border-b-2 border-white"
                style={{
                  backgroundColor: i % 2 === 0 ? "#FDF5D6" : "#FEF9E7",
                }}>
                <td
                  className="p-2 border-r-2 border-white"
                  style={{ backgroundColor: "#F9BC2F" }}>
                  {t(option.nameKey)}
                </td>
                <td className="p-2 border-r-2 border-white">
                  {formatValue(option.no_children)}
                </td>
                <td className="p-2 border-r-2 border-white">
                  {formatValue(option.one_child)}
                </td>
                <td className="p-2 border-r-2 border-white">
                  {formatValue(option.two_children)}
                </td>
                <td className="p-2">{formatValue(option.three_children)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LivingCostsContent;
