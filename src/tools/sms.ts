import { z } from "zod";
import { exolvePost } from "../client.js";

// --- send_sms ---
export const sendSmsSchema = z.object({
  number: z.string().describe("Номер отправителя или имя отправителя (альфа-имя)"),
  destination: z.string().describe("Номер получателя (формат 7XXXXXXXXXX)"),
  text: z.string().describe("Текст сообщения"),
});

export async function handleSendSms(params: z.infer<typeof sendSmsSchema>): Promise<string> {
  const result = await exolvePost("messaging/v1/SendSMS", {
    number: params.number,
    destination: params.destination,
    text: params.text,
  });
  return JSON.stringify(result, null, 2);
}

// --- get_sms_status ---
export const getSmsStatusSchema = z.object({
  date_from: z.string().describe("Начало периода (ISO 8601, например 2024-01-01T00:00:00Z)"),
  date_to: z.string().describe("Конец периода (ISO 8601)"),
  number: z.string().optional().describe("Фильтр по номеру отправителя"),
  destination: z.string().optional().describe("Фильтр по номеру получателя"),
  limit: z.number().optional().default(20).describe("Кол-во записей (по умолч. 20)"),
  offset: z.number().optional().default(0).describe("Смещение"),
});

export async function handleGetSmsStatus(params: z.infer<typeof getSmsStatusSchema>): Promise<string> {
  const body: Record<string, unknown> = {
    date_from: params.date_from,
    date_to: params.date_to,
    limit: params.limit,
    offset: params.offset,
  };
  if (params.number) body.number = params.number;
  if (params.destination) body.destination = params.destination;
  const result = await exolvePost("messaging/v1/GetList", body);
  return JSON.stringify(result, null, 2);
}

// --- make_call ---
export const makeCallSchema = z.object({
  line_1: z.string().describe("Номер первого абонента (оператор)"),
  line_2: z.string().describe("Номер второго абонента (клиент)"),
  request_description: z.string().optional().describe("Описание звонка (для логов)"),
});

export async function handleMakeCall(params: z.infer<typeof makeCallSchema>): Promise<string> {
  const result = await exolvePost("call/v1/MakeCallback", {
    request_description: params.request_description || "",
    line_1: { destinations: [params.line_1] },
    line_2: { destinations: [params.line_2] },
  });
  return JSON.stringify(result, null, 2);
}
