export interface CategoryType {
  label: string;
  key: string;
  counters?: CounterType[];
}

export interface CounterType {
  label: string;
  count: number;
}
