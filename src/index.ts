#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { sendSmsSchema, handleSendSms, getSmsStatusSchema, handleGetSmsStatus, makeCallSchema, handleMakeCall } from "./tools/sms.js";
import { handleGetBalance } from "./tools/balance.js";
import { getNumbersSchema, handleGetNumbers } from "./tools/numbers.js";
import { getCallHistorySchema, handleGetCallHistory } from "./tools/call-history.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "mts-exolve-mcp",
    version: "1.1.0",
  });

  // 1. Send SMS
  server.tool(
    "send_sms",
    "Отправить SMS через MTS Exolve. Требуются номер отправителя, получателя и текст.",
    sendSmsSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleSendSms(params) }] }),
  );

  // 2. Get SMS list / status
  server.tool(
    "get_sms_status",
    "Получить список SMS за период. Можно фильтровать по номеру отправителя/получателя.",
    getSmsStatusSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetSmsStatus(params) }] }),
  );

  // 3. Make callback call
  server.tool(
    "make_call",
    "Инициировать обратный звонок (callback) через MTS Exolve. Соединяет двух абонентов.",
    makeCallSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleMakeCall(params) }] }),
  );

  // 4. Get balance
  server.tool(
    "get_balance",
    "Получить текущий баланс аккаунта MTS Exolve. Данные обновляются раз в минуту.",
    {},
    async () => ({ content: [{ type: "text", text: await handleGetBalance() }] }),
  );

  // 5. Get purchased numbers
  server.tool(
    "get_numbers",
    "Получить список купленных номеров в аккаунте MTS Exolve.",
    getNumbersSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetNumbers(params) }] }),
  );

  // 6. Get call history
  server.tool(
    "get_call_history",
    "Получить историю звонков за период из MTS Exolve.",
    getCallHistorySchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetCallHistory(params) }] }),
  );

  return server;
}

async function main() {
  const args = process.argv.slice(2);
  const httpMode = args.includes("--http");

  const server = createServer();

  if (httpMode) {
    const port = parseInt(process.env.PORT || "3000", 10);
    const { StreamableHTTPServerTransport } = await import("@modelcontextprotocol/sdk/server/streamableHttp.js");
    const http = await import("node:http");

    const httpServer = http.createServer(async (req, res) => {
      if (req.method === "POST" && req.url === "/mcp") {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
        });
        res.setHeader("Content-Type", "application/json");
        await server.connect(transport);
        await transport.handleRequest(req, res);
      } else if (req.method === "GET" && req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", tools: 6, transport: "streamable-http" }));
      } else {
        res.writeHead(404);
        res.end("Not Found");
      }
    });

    httpServer.listen(port, () => {
      console.error(`[mts-exolve-mcp] HTTP-сервер запущен на порту ${port}. POST /mcp, GET /health`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[mts-exolve-mcp] Сервер запущен (stdio). 6 инструментов. Требуется MTS_EXOLVE_TOKEN.");
  }
}

main().catch((error) => {
  console.error("[mts-exolve-mcp] Ошибка:", error);
  process.exit(1);
});
