import { Page, TestInfo } from '@playwright/test';

export async function captureEvidence(page: Page, testInfo: TestInfo, stepName: string) {
  const screenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach(stepName, {
    body: screenshot,
    contentType: 'image/png',
  });
}