export function simulateDelay(ms: number = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function simulateEmailSend(): Promise<void> {
  await simulateDelay(2500);
}

export async function simulateCloudConnect(): Promise<void> {
  await simulateDelay(2000);
}

export async function simulateCloudSync(): Promise<void> {
  await simulateDelay(3000);
}

export async function simulateCloudDisconnect(): Promise<void> {
  await simulateDelay(1000);
}

export async function simulateGoogleSheetsSync(): Promise<void> {
  await simulateDelay(2500);
}

export async function simulateShareLinkGeneration(): Promise<void> {
  await simulateDelay(1500);
}

export function generateRandomStorageUsed(max: number): number {
  return Math.round(Math.random() * max * 0.3 * 10) / 10;
}
