> ## 🗄 Репозиторий заархивирован
>
> Разработка переехала в **[theYahia/WWmcp](https://github.com/theYahia/WWmcp)** — монорепозиторий MCP-серверов для незападных API: СНГ, MENA, Африка, LATAM, Юго-Восточная Азия. Общее ядро `@theyahia/mcp-core`, единый CI, единый релизный конвейер.
>
> Актуальная версия того, что лежало здесь: [`servers/mts-exolve/`](https://github.com/theYahia/WWmcp/tree/main/servers/mts-exolve)
>
> Пакет в npm прежний — [`@theyahia/mts-exolve-mcp`](https://www.npmjs.com/package/@theyahia/mts-exolve-mcp), ставится и работает как раньше.
> Здесь больше ничего не обновляется. Задачи и pull request'ы — в WWmcp.
>
> **Archived — development moved to [theYahia/WWmcp](https://github.com/theYahia/WWmcp),** a monorepo of MCP servers for non-Western APIs.
> The current version of this package now lives at [`servers/mts-exolve/`](https://github.com/theYahia/WWmcp/tree/main/servers/mts-exolve).
> The npm package [`@theyahia/mts-exolve-mcp`](https://www.npmjs.com/package/@theyahia/mts-exolve-mcp) is unchanged.
> Please open issues and pull requests there.

# @theyahia/mts-exolve-mcp

MCP-сервер для MTS Exolve API -- SMS, звонки, записи звонков, номера, Viber. **8 инструментов.**

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

## Инструменты (8)

| Инструмент | Описание |
|------------|----------|
| `send_sms` | Отправить SMS |
| `get_sms_status` | Проверить статус SMS |
| `make_call` | Инициировать звонок |
| `get_call_status` | Проверить статус звонка |
| `get_call_recording` | Получить запись звонка |
| `list_numbers` | Список номеров на аккаунте |
| `buy_number` | Купить номер в регионе |
| `send_viber_message` | Отправить сообщение через Viber |

## Демо-промпты

```
Отправь SMS на +79001234567 с текстом "Привет"
Проверь статус сообщения abc-123
Позвони на +79001234567
Проверь статус звонка call-456
Получи запись звонка call-456
Покажи все номера на аккаунте
Купи номер в Москве
Отправь сообщение через Viber на +79001234567
```

## Лицензия

MIT

---

Telegram: [@vhodvai](https://t.me/vhodvai)
