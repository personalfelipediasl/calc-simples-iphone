
export type Operator = '+' | '-' | '×' | '÷' | null;

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operator: Operator;
  waitingForNext: boolean;
}
