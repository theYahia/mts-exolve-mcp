const BASE_URL = process.env.MTS_EXOLVE_BASE_URL || "https://api.exolve.ru";
const TIMEOUT = 10_000;
const MAX_RETRIES = 3;

export function getBaseUrl(): string {
  return BASE_URL;
}

export async function exolvePost(path: string, body: Record<string, unknown> = {}): Promise<unknown> {
  const token = process.env.MTS_EXOLVE_TOKEN;
  if (!token) throw new Error("MTS_EXOLVE_TOKEN не задан");

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(`${BASE_URL}/${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        return await response.json();
      }

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[mts-exolve-mcp] ${response.status}, повтор через ${delay}мс (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      const errorBody = await response.text().catch(() => "");
      throw new Error(`MTS Exolve HTTP ${response.status}: ${response.statusText}${errorBody ? ` — ${errorBody}` : ""}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) {
        console.error(`[mts-exolve-mcp] Таймаут, повтор (${attempt}/${MAX_RETRIES})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("MTS Exolve API: все попытки исчерпаны");
}
