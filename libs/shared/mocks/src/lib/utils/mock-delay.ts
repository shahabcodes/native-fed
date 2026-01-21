export const MOCK_DELAYS = {
  SHORT: 300,
  MEDIUM: 500,
  LONG: 700,
  AUTH: 800,
} as const;

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomDelay(min: number = MOCK_DELAYS.SHORT, max: number = MOCK_DELAYS.LONG): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay(ms);
}
