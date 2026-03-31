# @theyahia/mts-exolve-mcp

MCP-сервер для MTS Exolve API — отправка SMS, проверка статуса, звонки. **3 инструмента.**

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
{ "servers": { "mts-exolve": { "command": "npx", "args": ["-y", "@theyahia/mts-exolve-mcp"], "env": { "MTS_EXOLVE_TOKEN": "your-token" } } } }
```

> Требуется `MTS_EXOLVE_TOKEN`. Получите в [личном кабинете MTS Exolve](https://exolve.ru).

## Инструменты (3)

| Инструмент | Описание |
|------------|----------|
| `send_sms` | Отправить SMS |
| `get_sms_status` | Проверить статус SMS |
| `make_call` | Инициировать звонок |

## Примеры

```
Отправь SMS на +79001234567 с текстом "Привет"
Проверь статус сообщения abc-123
Позвони на +79001234567
```

## Лицензия

MIT
