import { Page, TestInfo } from '@playwright/test';

/**
 * Chụp ảnh màn hình và đính kèm vào Playwright HTML Report
 * @param page Đối tượng Page của Playwright
 * @param testInfo Đối tượng TestInfo từ test context (chứa thông tin về test case hiện tại)
 * @param stepName Tên bước để hiển thị trong report (ví dụ: 'Truoc-Khi-Dang-Nhap')
 */
export async function captureEvidence(page: Page, testInfo: TestInfo, stepName: string) {
  // Chụp ảnh toàn bộ trang (fullPage: true)
  const screenshot = await page.screenshot({ fullPage: true });
  
  // Đính kèm ảnh vào HTML report
  await testInfo.attach(`Evidence: ${stepName}`, {
    body: screenshot,
    contentType: 'image/png',
  });
}
