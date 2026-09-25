import { useTranslation } from "react-i18next";
import { useCharacter } from "../hooks/useCharacter";

const LivingSituationCard = () => {
  const { t } = useTranslation();

  const { character } = useCharacter();
  if (!character)
    return <div className="p-10 text-center">{t("general.no_role")}</div>;

  if (!character.livingSituation.isShown)
    return (
      <div
        className="w-full overflow-hidden rounded-lg shadow-sm border border-slate-100 mb-8 overflow-x-auto
      text-white text-center bg-[#2a9d8f]"
      >
        {t("partner_wheel.firstphase")}
      </div>
    );

  const formatCurrency = (amount: number) =>
    `€ ${amount.toLocaleString("nl-BE")}`;

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-sm border border-slate-100 mb-8 overflow-x-auto">
      <table className="w-full text-sm min-w-[800px]">
        <thead>
          <tr className="text-white font-black text-center">
            <th className="bg-[#e07a5f] p-3 uppercase tracking-wider border-r border-white">
              {t("profile_labels.partner_wage", "Wage")}
            </th>
            <th className="bg-[#2a9d8f] p-3 uppercase tracking-wider border-r border-white">
              {t("profile_labels.partner_support", "Savings")}
            </th>
            <th className="bg-amber-400 text-shadow-black">
              {t("profile_labels.children", "Children")}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-amber-50 text-center text-slate-700">
            <td className="p-4 border-r border-white">
              {formatCurrency(character.livingSituation.partner.wage)}
            </td>
            <td className="p-4 border-r border-white ">
              {formatCurrency(character.livingSituation.partner.savings)}
            </td>
            <td className="p-4 border-r border-white">
              {character.livingSituation.children}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LivingSituationCard;
