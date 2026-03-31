# @theyahia/mts-exolve-mcp

MCP-сервер для MTS Exolve API — SMS, звонки, баланс, номера, история звонков. **6 инструментов.**

[![npm](https://img.shields.io/npm/v/@theyahia/mts-exolve-mcp)](https://www.npmjs.com/package/@theyahia/mts-exolve-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Часть серии [Russian API MCP](https://github.com/theYahia/russian-mcp) (50 серверов) by [@theYahia](https://github.com/theYahia).

## Установка

### Claude Desktop

```json
{
  "mcpServers": {
    "mts-exolve": {
      "command": "npx",
      "args": ["-y", "@theyahia/mts-exolve-mcp"],
      "env": { "MTS_EXOLVE_TOKEN": "your-token" }
    }
  }
}
```

### Claude Code

```bash
claude mcp add mts-exolve -e MTS_EXOLVE_TOKEN=your-token -- npx -y @theyahia/mts-exolve-mcp
```

### VS Code / Cursor

```json
{
  "servers": {
    "mts-exolve": {
      "command": "npx",
      "args": ["-y", "@theyahia/mts-exolve-mcp"],
      "env": { "MTS_EXOLVE_TOKEN": "your-token" }
    }
  }
}
```

### Smithery

```bash
npx -y @smithery/cli install @theyahia/mts-exolve-mcp --client claude
```

### Streamable HTTP (remote / multi-client)

```bash
MTS_EXOLVE_TOKEN=your-token npx @theyahia/mts-exolve-mcp --http
# Слушает POST /mcp на порту 3000 (PORT=8080 для другого)
# GET /health — проверка здоровья
```

> Требуется `MTS_EXOLVE_TOKEN`. Получите в [личном кабинете MTS Exolve](https://exolve.ru).

## Инструменты (6)

| Инструмент | Описание | API endpoint |
|------------|----------|--------------|
| `send_sms` | Отправить SMS | `messaging/v1/SendSMS` |
| `get_sms_status` | Список SMS за период | `messaging/v1/GetList` |
| `make_call` | Обратный звонок (callback) | `call/v1/MakeCallback` |
| `get_balance` | Баланс аккаунта | `finance/v1/GetBalance` |
| `get_numbers` | Купленные номера | `number/customer/v1/GetList` |
| `get_call_history` | История звонков | `statistics/call-history/v2/GetList` |

## Примеры

```
Отправь SMS на +79001234567 с текстом "Привет" от MyCompany
Проверь баланс MTS Exolve
Покажи мои номера Exolve
Покажи историю звонков за последнюю неделю
Позвони: соедини 79001111111 и 79002222222
```

## Skills (для Claude Code)

| Skill | Триггер |
|-------|---------|
| `skill-send-sms` | "Отправь SMS через MTS Exolve" |
| `skill-balance` | "Проверь баланс" |

## Транспорт

| Режим | Флаг | Порт |
|-------|------|------|
| stdio (по умолчанию) | — | — |
| Streamable HTTP | `--http` | `PORT` (3000) |

## Разработка

```bash
git clone https://github.com/theYahia/mts-exolve-mcp.git
cd mts-exolve-mcp
npm install
npm test          # Vitest
npm run dev       # stdio
npm run dev:http  # HTTP на :3000
```

## Лицензия

MIT
