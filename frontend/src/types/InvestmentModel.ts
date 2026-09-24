export type InvestmentProfile = "conservative" | "neutral" | "dynamic";

export interface InvestmentConfigDto {
  timeHorizonYears: number;
  inflationRate: number;
  savingsRate: number;
}

export interface InvestmentTableRow {
  principal: number;
  inflationImpact: number;
  savingsReturn: number;
  returns: Record<InvestmentProfile, number>;
}

export interface InvestmentTableResponse {
  playerProfile: InvestmentProfile;
  config: InvestmentConfigDto;
  table: InvestmentTableRow[];
}
