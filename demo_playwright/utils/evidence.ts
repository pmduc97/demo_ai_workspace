import { Page, TestInfo } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Chụp ảnh màn hình, lưu vào thư mục riêng và đính kèm vào Playwright HTML Report
 * @param page Đối tượng Page của Playwright
 * @param testInfo Đối tượng TestInfo từ test context
 * @param stepName Tên bước để hiển thị (ví dụ: 'Truoc-Khi-Dang-Nhap')
 */
export async function captureEvidence(page: Page, testInfo: TestInfo, stepName: string) {
  // Lấy tên file spec (ví dụ: auth-login.spec.ts)
  const specName = path.basename(testInfo.file);
  
  // Lấy tên test case (ví dụ: TC_UI_01: Bỏ trống email) và làm sạch các ký tự đặc biệt
  const safeTestCaseName = testInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  
  // Tạo đường dẫn thư mục: evidence/[specName]/[testCaseName]/
  const evidenceDir = path.join(process.cwd(), 'evidence', specName, safeTestCaseName);
  
  // Đảm bảo thư mục tồn tại
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }
  
  // Đường dẫn file ảnh
  const filePath = path.join(evidenceDir, `${stepName}.png`);
  
  // Chụp ảnh và lưu trực tiếp vào file
  await page.screenshot({ path: filePath, fullPage: true });
  
  // Đính kèm ảnh từ file vào HTML report
  await testInfo.attach(`Evidence: ${stepName}`, {
    path: filePath,
    contentType: 'image/png',
  });
}
