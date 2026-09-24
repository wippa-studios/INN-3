import { useTranslation } from "react-i18next";
import dossierData from "../../assets/dossierData.json";
import { formatCurrency } from "../../utils/formatters";

const InsuranceContent = () => {
  const { t } = useTranslation("dossier_info");
  const insuranceOptions = dossierData.general_insurance.options;

  // 1. FIX: We voegen expliciet '| undefined' toe aan het type
  const getFormattedCosts = (costs: Record<string, number | undefined>) => {
    const formattedCosts: Record<string, string> = {};

    // Filter undefined waardes eruit
    Object.entries(costs).forEach(([key, value]) => {
      if (value !== undefined) {
        formattedCosts[key] = formatCurrency(Number(value));
      }
    });

    // 2. FIX: We checken of de waarde niet undefined is voordat we hem verwerken
    if (costs.rent_shared_5y !== undefined)
      formattedCosts.tenantOption5 = formatCurrency(
        Number(costs.rent_shared_5y),
      );
    if (costs.rent_shared !== undefined)
      formattedCosts.tenantShared = formatCurrency(Number(costs.rent_shared));
    if (costs.rent_apt_city !== undefined)
      formattedCosts.tenantCityApt = formatCurrency(
        Number(costs.rent_apt_city),
      );
    if (costs.rent_house_country !== undefined)
      formattedCosts.tenantHouse = formatCurrency(
        Number(costs.rent_house_country),
      );
    if (costs.buy_apt_city !== undefined)
      formattedCosts.ownerApt = formatCurrency(Number(costs.buy_apt_city));

    return formattedCosts;
  };

  return (
    <div className="p-4 text-xs overflow-y-auto h-full">
      <div className="flex items-center gap-2 mb-4 text-center">
        <img src="/verzekering.svg" alt="" className="w-5 h-5" />
        <h2 className="font-black uppercase tracking-wide text-sm">
          {t("general_insurance.title")}
        </h2>
      </div>

      {insuranceOptions.map((option) => (
        <div key={option.id} className="mb-6 rounded overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th
                  colSpan={2}
                  className="text-center uppercase p-2 text-xs border-b-2 border-white"
                  style={{ backgroundColor: "#F9BC2F" }}
                >
                  {t(option.nameKey)}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-white">
                <td
                  className="p-2 font-bold border-r-2 border-white w-1/4"
                  style={{ backgroundColor: "#F9BC2F" }}
                >
                  {t("general_insurance.options.costs")}
                </td>
                <td className="p-2" style={{ backgroundColor: "#FDF5D6" }}>
                  {/* 3. FIX: We casten de JSON output expliciet, zodat TypeScript niet in de war raakt over de missende keys in je JSON data */}
                  {t(
                    option.costsKey,
                    getFormattedCosts(
                      option.costs as Record<string, number | undefined>,
                    ),
                  )
                    .split("|")
                    .map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                </td>
              </tr>
              <tr className="border-b-2 border-white">
                <td
                  className="p-2 font-bold border-r-2 border-white"
                  style={{ backgroundColor: "#F9BC2F" }}
                >
                  {t("general_insurance.labels.franchise")}
                </td>
                <td className="p-2" style={{ backgroundColor: "#FEF9E7" }}>
                  {formatCurrency(option.franchise)}
                </td>
              </tr>
              <tr className="border-b-2 border-white">
                <td
                  className="p-2 font-bold border-r-2 border-white"
                  style={{ backgroundColor: "#F9BC2F" }}
                >
                  {t("general_insurance.labels.info")}
                </td>
                <td className="p-2" style={{ backgroundColor: "#FDF5D6" }}>
                  {t(option.infoKey)}
                </td>
              </tr>
              <tr className="border-b-2 border-white">
                <td
                  className="p-2 font-bold border-r-2 border-white"
                  style={{ backgroundColor: "#F9BC2F" }}
                >
                  {t("general_insurance.labels.coverage")}
                </td>
                <td className="p-2" style={{ backgroundColor: "#FEF9E7" }}>
                  {t(`general_insurance.options.${option.id}.coverage`)
                    .split("|")
                    .map((item, i) => (
                      <p key={i}>· {item}</p>
                    ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <div
        className="p-3 rounded text-xs mt-2"
        style={{ backgroundColor: "#E8E0F0" }}
      >
        <p>
          ➜{" "}
          <a
            href="https://www.wikifin.be"
            target="_blank"
            rel="noreferrer"
            className="underline font-bold"
          >
            {t("general_insurance.more_info")}
          </a>
        </p>
      </div>
    </div>
  );
};

export default InsuranceContent;
