import { exolvePost } from "../client.js";

export async function handleGetBalance(): Promise<string> {
  const result = await exolvePost("finance/v1/GetBalance", {});
  return JSON.stringify(result, null, 2);
}
