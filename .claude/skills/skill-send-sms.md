---
name: skill-send-sms
trigger: "Отправь SMS через MTS Exolve"
tool: send_sms
---

# Отправка SMS через MTS Exolve

Используй инструмент `send_sms` для отправки SMS-сообщений.

## Параметры

- **number** — номер или имя отправителя (альфа-имя, например "MyCompany", или номер 7XXXXXXXXXX)
- **destination** — номер получателя в формате 7XXXXXXXXXX
- **text** — текст сообщения

## Пример

```
Отправь SMS на 79001234567 с текстом "Ваш код: 1234" от имени MyCompany
```

Вызов:
```json
{
  "number": "MyCompany",
  "destination": "79001234567",
  "text": "Ваш код: 1234"
}
```
