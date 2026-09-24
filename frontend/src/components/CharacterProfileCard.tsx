import { useTranslation } from "react-i18next";
import "../styles/CharacterProfileCard.css";
import { useCharacter } from "../hooks/useCharacter";
import type { Job } from "../types/CharacterModel";


const CharacterProfileCard = ({
  hideChosenJob = false,
}: {
  hideChosenJob?: boolean;
}) => {
  const { t } = useTranslation();

  const { character } = useCharacter();

  if (!character) return <div>Personage niet gevonden</div>;

  const { profile, career } = character;
  const charId = profile.id;

  const formatCurrency = (amount: number) => {
    if (!amount) return "/";
    return `€ ${amount.toLocaleString("nl-BE")}`;
  };

  return (
    <div className="profile-wrapper">
      <div className="top-section">
        <div className="avatar-column">
          <div className="avatar-placeholder">
            <img
              src={`/${charId}.png`}
              alt={t(profile.nameKey)}
              className="character-avatar"
            />
          </div>

          <h1 className="character-name">
            {t(profile.nameKey)
              ? t(profile.nameKey)
              : `[Fout in JSON: ${profile.nameKey}]`}
          </h1>
        </div>

        <div className="info-column">
          <table className="info-table">
            <tbody>
              <tr>
                <td className="info-label">{t("profile_labels.age")}</td>
                <td className="info-value">
                  {profile.age} {t("profile_labels.years")}
                </td>
              </tr>
              <tr>
                <td className="info-label">{t("profile_labels.education")}</td>
                <td className="info-value">{t(profile.educationKey)}</td>
              </tr>
              <tr>
                <td className="info-label">{t("profile_labels.interests")}</td>
                <td className="info-value pre-line">
                  {profile.interestKey ? t(profile.interestKey) : "/"}
                </td>
              </tr>
              <tr>
                <td className="info-label">{t("profile_labels.info")}</td>
                <td className="info-value pre-line">{t(profile.infoKey)}</td>
              </tr>
              <tr>
                <td className="info-label highlight-label">
                  {t("profile_labels.experience")}
                </td>
                <td className="info-value highlight-value">
                  {t(profile.experienceKey)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="jobs-section">
        <table className="jobs-table">
          <thead>
            <tr>
              <th colSpan={1} className="empty-header"></th>
              <th colSpan={2} className="phase-header phase-1">
                {t("profile_labels.phase_1")}
              </th>
              <th colSpan={2} className="phase-header phase-2">
                {t("profile_labels.phase_2")}
              </th>
              <th className="empty-header"></th>
            </tr>
            <tr className="sub-header-row">
              <th className="job-title-col">
                {t("profile_labels.possible_jobs")}
              </th>
              <th className="money-col phase-1-light pre-line">
                {t("profile_labels.brut_start")}
              </th>
              <th className="money-col phase-1-light pre-line">
                {t("profile_labels.net_start")}
              </th>
              <th className="money-col phase-2-light pre-line">
                {t("profile_labels.avg_brut")}
              </th>
              <th className="money-col phase-2-light pre-line">
                {t("profile_labels.avg_net")}
              </th>
              <th className="money-col pension-col pre-line">
                {t("profile_labels.pension")}
              </th>
            </tr>
          </thead>
          <tbody>
            {career.jobs.map((job: Job, index: number) => {
            const isChosen =
              !hideChosenJob && job.titleKey === character.chosenJob?.titleKey;
              return (
                <tr
                  key={index}
                  style={
                    isChosen
                      ? {
                          backgroundColor: "#F9BC2F",
                          outline: "2px solid #b8860b",
                        }
                      : hideChosenJob
                        ? {}
                        : { opacity: 0.4 }
                  }>
                  <td className="job-title-cell">
                    {t(job.titleKey || `characters.${charId}.job${index + 1}`)}
                    {isChosen && " ✓"}
                  </td>
                  <td>{formatCurrency(job.startBrut)}</td>
                  <td>
                    <strong>{formatCurrency(job.startNet)}</strong>
                  </td>
                  <td>{formatCurrency(job.avgBrut)}</td>
                  <td>
                    <strong>{formatCurrency(job.avgNet)}</strong>
                  </td>
                  <td>{formatCurrency(job.pension)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bottom-section">
        <table className="extra-info-table">
          <tbody>
            <tr>
              <td className="extra-label">{t("profile_labels.perks")}</td>
              <td className="extra-value pre-line">
                {career.perksKey ? t(career.perksKey) : "/"}
              </td>
            </tr>
            <tr>
              <td className="extra-label phase-1-label pre-line">
                {t("profile_labels.parental_support")}
              </td>
              <td className="extra-value phase-1-value pre-line">
                {profile.parentalSupportKey
                  ? t(profile.parentalSupportKey)
                  : "/"}
              </td>
            </tr>
            <tr>
              <td className="extra-label phase-2-label pre-line">
                {t("profile_labels.children")}
              </td>
              <td className="extra-value phase-2-value"></td>
            </tr>
            <tr>
              <td className="extra-label phase-2-label pre-line">
                {t("profile_labels.partner_support")}
              </td>
              <td className="extra-value phase-2-value"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CharacterProfileCard;
