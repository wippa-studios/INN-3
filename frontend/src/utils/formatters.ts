export const formatCurrency = (amount: number) =>
  `€ ${amount.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;