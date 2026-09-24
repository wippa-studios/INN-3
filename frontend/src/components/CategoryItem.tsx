import { useTranslation } from "react-i18next";
import type { CategoryData } from "../types/phaseTypes";


interface CategoryItemProps {
  category: CategoryData;
  userSelectionCount: number;
  onToggle: (
    categoryId: string,
    index: number,
    isPreFilled: boolean,
    preFilledSlots: number,
  ) => void;
  readOnly?: boolean;
}

const CategoryItem = ({
  category,
  userSelectionCount,
  onToggle,
  readOnly = false,
}: CategoryItemProps) => {
  const { t } = useTranslation();
  const totalChecked = category.preFilledSlots + userSelectionCount;

  return (
    <div className="grid-item category-block">
      <h3>{t(category.titleKey)}</h3>
      <p>{t(category.descriptionKey)}</p>

      {category.slotValues && (
        <div className="slot-values">
          {category.slotValues.map((val: number, i: number) => (
            <span key={i}>€{val.toLocaleString()}</span>
          ))}
        </div>
      )}

      <div className="checkbox-container">
        {[...Array(category.maxSlots)].map((_, index) => {
          const isChecked = index < totalChecked;
          const isPreFilled = index < category.preFilledSlots;
          return (
            <button
              key={index}
              className="circle-btn"
              onClick={() =>
                !readOnly &&
                onToggle(
                  category.id,
                  index,
                  isPreFilled,
                  category.preFilledSlots,
                )
              }
              disabled={isPreFilled || readOnly}
              style={
                readOnly ? { cursor: "default", pointerEvents: "none" } : {}
              }>
              {isChecked ? "X" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryItem;
