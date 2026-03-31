import { z } from "zod";
import { exolvePost } from "../client.js";

export const getNumbersSchema = z.object({
  application_uuid: z.string().optional().describe("UUID приложения (опционально)"),
  limit: z.number().optional().default(50).describe("Кол-во записей"),
  offset: z.number().optional().default(0).describe("Смещение"),
});

export async function handleGetNumbers(params: z.infer<typeof getNumbersSchema>): Promise<string> {
  const body: Record<string, unknown> = {
    limit: params.limit,
    offset: params.offset,
  };
  if (params.application_uuid) body.application_uuid = params.application_uuid;
  const result = await exolvePost("number/customer/v1/GetList", body);
  return JSON.stringify(result, null, 2);
}
