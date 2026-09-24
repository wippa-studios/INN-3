export interface EventCardChoice {
  cardId: string;
  conditionId: string | null;
}

export interface SaveEventCardsRequest {
  choices: EventCardChoice[];
}
