import { z } from "zod";
import { exolvePost } from "../client.js";

export const getCallHistorySchema = z.object({
  date_from: z.string().describe("Начало периода (ISO 8601)"),
  date_to: z.string().describe("Конец периода (ISO 8601)"),
  limit: z.number().optional().default(50).describe("Кол-во записей"),
  offset: z.number().optional().default(0).describe("Смещение"),
});

export async function handleGetCallHistory(params: z.infer<typeof getCallHistorySchema>): Promise<string> {
  const result = await exolvePost("statistics/call-history/v2/GetList", {
    date_from: params.date_from,
    date_to: params.date_to,
    limit: params.limit,
    offset: params.offset,
  });
  return JSON.stringify(result, null, 2);
}
