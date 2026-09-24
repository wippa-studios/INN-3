import { useTranslation } from "react-i18next";
import dossierData from "../../assets/dossierData.json";
import { formatCurrency } from "../../utils/formatters";

const HousingContent = () => {
  const { t } = useTranslation("dossier_info");
  const rentOptions = dossierData.housing.rent.options;
  const buyOptions = dossierData.housing.buy.options;
  const conditions = dossierData.housing.rent.social_housing_conditions;

  return (
    <div className="p-4 text-xs overflow-y-auto h-full">
      <div className="flex items-center gap-2 mb-4">
        <img src="/huisvestiging.svg" alt="" className="w-5 h-5" />
        <h2 className="font-black uppercase tracking-wide text-sm">
          {t("housing.title")}
        </h2>
      </div>

      <p className="mb-4 text-slate-500 italic">{t("housing.subtitle")}</p>

      {/* Huren label */}
      <div
        className="px-2 py-3 mb-2 text-xs font-bold text-center uppercase"
        style={{ backgroundColor: "#F9BC2F", color: "black" }}>
        {t("housing.rent.title")}
      </div>
      <div className="rounded overflow-hidden mb-4">
        <table className="w-full border-collapse mb-4">
          <thead className="border-b-2 border-white">
            <tr>
              <th
                className="text-left p-2  text-xs border-r-2 border-white w-1/3"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("housing.rent.headers.choice")}
              </th>
              <th
                className="text-left p-2  text-xs border-r-2 border-white w-1/4"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("housing.rent.headers.monthly")}
              </th>
              <th
                className="text-left p-2  text-xs border-r-2 border-white w-1/4"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("housing.rent.headers.space")}
              </th>
              <th
                className="text-left p-2  text-xs border-r-2 border-white w-1/4"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("housing.rent.headers.mobility")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rentOptions.map((option, i) => (
              <tr
                key={option.id}
                className="border-b-2 border-white"
                style={{
                  backgroundColor: i % 2 === 0 ? "#FDF5D6" : "#FEF9E7",
                }}>
                <td
                  className="p-2 border-r-2 text-xs border-white"
                  style={{
                    backgroundColor:
                      option.id === "rent_social" ? "#ece3e9" : "#F9BC2F",
                  }}>
                  {t(option.nameKey)}
                </td>
                <td className="p-2 border-r-2 border-white">
                  {formatCurrency(option.monthly)}
                </td>
                <td className="p-2 border-r-2 border-white">
                  {t(option.spaceKey)}
                </td>
                <td className="p-2">{t(option.mobilityKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sociale woning voorwaarde */}
      <div
        className="p-3 mb-6 rounded text-xs"
        style={{ backgroundColor: "#b188ae" }}>
        <p className="font-bold mb-1">
          {t("housing.rent.social_housing_conditions.title")}
        </p>
        <p className="mb-1">
          {t("housing.rent.social_housing_conditions.text", {
            childDeduction: formatCurrency(conditions.childDeduction),
            maxIncome: formatCurrency(conditions.maxIncome),
          })}
        </p>
        <p className="italic">
          {t("housing.rent.social_housing_conditions.example", {
            exampleChildren: conditions.exampleChildren,
            exampleIncome: formatCurrency(conditions.exampleIncome),
            childDeduction: formatCurrency(conditions.childDeduction),
            maxIncome: formatCurrency(conditions.maxIncome),
          })}
        </p>
      </div>

      {/* Kopen label */}
      <div
        className="px-2 py-3 mb-2 mt-4 text-xs font-bold text-center uppercase"
        style={{ backgroundColor: "#F9BC2F", color: "black" }}>
        {t("housing.buy.title")}
      </div>

      <div className="rounded overflow-hidden mb-4">
        <table className="w-full border-collapse">
          <thead className="border-b-2 border-white">
            <tr>
              <th
                className="text-left p-2 text-xs border-r-2 border-white w-2/9"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("housing.buy.headers.choice")}
              </th>
              <th
                className="text-left p-2 text-xs border-r-2 border-white w-1/9"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("housing.buy.headers.price")}
              </th>
              <th
                className="text-left p-2  text-xs border-r-2 border-white w-1/9"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("housing.buy.headers.max_loan")}
              </th>
              <th
                className="text-left p-2  text-xs border-r-2 border-white w-1/9"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("housing.buy.headers.one_time")}
              </th>
              <th
                className="text-left p-2  text-xs border-r-2 border-white w-1/9"
                style={{ backgroundColor: "#ece3e9" }}>
                {t("housing.buy.headers.start_budget")}
              </th>
              <th
                className="text-left p-2  text-xs border-r-2 border-white w-1/9"
                style={{ backgroundColor: "#ece3e9" }}>
                {t("housing.buy.headers.monthly_loan")}
              </th>
              <th
                className="text-left p-2  text-xs border-r-2 border-white w-1/9"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("housing.buy.headers.space")}
              </th>
              <th
                className="text-left p-2  text-xs border-r-2 border-white w-1/9"
                style={{ backgroundColor: "#F9BC2F" }}>
                {t("housing.buy.headers.mobility")}
              </th>
            </tr>
          </thead>
          <tbody>
            {buyOptions.map((option, i) => (
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
                  {formatCurrency(option.price)}
                </td>
                <td className="p-2 border-r-2 border-white">
                  {formatCurrency(option.maxLoan)}
                </td>
                <td className="p-2 border-r-2 border-white">
                  {formatCurrency(option.oneTimeCosts)}
                </td>
                <td className="p-2 border-r-2 border-white">
                  {formatCurrency(option.startBudget)}
                </td>
                <td className="p-2 border-r-2 border-white">
                  {formatCurrency(option.monthlyLoan)}
                </td>
                <td className="p-2 border-r-2 border-white">
                  {t(option.spaceKey)}
                </td>
                <td className="p-2">{t(option.mobilityKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Voorwaarden kopen */}
      <div
        className="p-3 rounded text-xs"
        style={{ backgroundColor: "#b188ae" }}>
        <p className="font-bold mb-2">{t("housing.buy.conditions.title")}</p>
        <p className="mb-1">• {t("housing.buy.conditions.item_1")}</p>
        <p className="mb-1">• {t("housing.buy.conditions.item_2")}</p>
        <p className="mb-1">• {t("housing.buy.conditions.item_3")}</p>
      </div>
    </div>
  );
};

export default HousingContent;
