/**
 * Utility functions for condition-based waiting in Playwright tests.
 * Replaces arbitrary timeouts with intelligent polling.
 */

/**
 * Waits until a specific condition returns a truthy value.
 * 
 * @param condition A function that evaluates the condition. Returns the value if met, undefined/false otherwise.
 * @param timeoutMs Maximum time to wait in milliseconds.
 * @param description Description of what we are waiting for (for error messages).
 * @returns A promise that resolves with the condition's result.
 */
export async function waitUntil<T>(
  condition: () => T | undefined | Promise<T | undefined>,
  timeoutMs = 5000,
  description = 'condition'
): Promise<T> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = async () => {
      try {
        const result = await condition();

        if (result !== undefined && result !== false && result !== null) {
          resolve(result);
        } else if (Date.now() - startTime > timeoutMs) {
          reject(new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`));
        } else {
          setTimeout(check, 100); // Poll again soon
        }
      } catch (error) {
        if (Date.now() - startTime > timeoutMs) {
          reject(new Error(`Timeout waiting for ${description} after ${timeoutMs}ms. Last error: ${error}`));
        } else {
          setTimeout(check, 100);
        }
      }
    };

    check();
  });
}
