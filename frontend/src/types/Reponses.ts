export interface JoinTableResponse {
    playerId: string;
    nickName: string;
    tableNumber: number;
    currentPhase: string;
    isGameAlreadyStarted: boolean;
}
 
export interface LeaveTableResponse {
    playerId: string;
    nickName: string;
    tableNumber: number;
}
