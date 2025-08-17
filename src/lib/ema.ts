// Exponential Moving Average for adaptive difficulty
export function ema(prev: number, value: number, alpha = 0.2){
  if (Number.isNaN(prev) || prev <= 0) return value;
  return (alpha * value) + ((1 - alpha) * prev);
}
