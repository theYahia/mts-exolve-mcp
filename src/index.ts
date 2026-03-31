#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { sendSmsSchema, handleSendSms, getSmsStatusSchema, handleGetSmsStatus, makeCallSchema, handleMakeCall } from "./tools/sms.js";

const server = new McpServer({
  name: "mts-exolve-mcp",
  version: "1.0.0",
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[mts-exolve-mcp] Сервер запущен. 3 инструмента. Требуется MTS_EXOLVE_TOKEN.");
}

main().catch((error) => {
  console.error("[mts-exolve-mcp] Ошибка:", error);
  process.exit(1);
});
