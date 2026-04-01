#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { sendSmsSchema, handleSendSms, getSmsStatusSchema, handleGetSmsStatus } from "./tools/sms.js";
import { makeCallSchema, handleMakeCall, getCallStatusSchema, handleGetCallStatus, getCallRecordingSchema, handleGetCallRecording } from "./tools/calls.js";
import { handleListNumbers, buyNumberSchema, handleBuyNumber } from "./tools/numbers.js";
import { sendViberMessageSchema, handleSendViberMessage } from "./tools/viber.js";

const server = new McpServer({
  name: "mts-exolve-mcp",
  version: "2.0.0",
});

server.tool(
  "send_sms",
  "Отправить SMS через MTS Exolve.",
  sendSmsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleSendSms(params) }] }),
);

server.tool(
  "get_sms_status",
  "Проверить статус отправленного SMS.",
  getSmsStatusSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetSmsStatus(params) }] }),
);

server.tool(
  "make_call",
  "Инициировать телефонный звонок через MTS Exolve.",
  makeCallSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleMakeCall(params) }] }),
);

server.tool(
  "get_call_status",
  "Проверить статус звонка.",
  getCallStatusSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetCallStatus(params) }] }),
);

server.tool(
  "get_call_recording",
  "Получить запись звонка по ID.",
  getCallRecordingSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetCallRecording(params) }] }),
);

server.tool(
  "list_numbers",
  "Список номеров телефонов на аккаунте.",
  {},
  async () => ({ content: [{ type: "text", text: await handleListNumbers() }] }),
);

server.tool(
  "buy_number",
  "Купить новый телефонный номер в указанном регионе.",
  buyNumberSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleBuyNumber(params) }] }),
);

server.tool(
  "send_viber_message",
  "Отправить сообщение через Viber.",
  sendViberMessageSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleSendViberMessage(params) }] }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[mts-exolve-mcp] Сервер запущен. 8 инструментов. Требуется MTS_EXOLVE_TOKEN.");
}

main().catch((error) => {
  console.error("[mts-exolve-mcp] Ошибка:", error);
  process.exit(1);
});
