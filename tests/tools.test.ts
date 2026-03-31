import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Set env before imports
process.env.MTS_EXOLVE_TOKEN = "test-token-123";

import { handleSendSms, handleGetSmsStatus, handleMakeCall } from "../src/tools/sms.js";
import { handleGetBalance } from "../src/tools/balance.js";
import { handleGetNumbers } from "../src/tools/numbers.js";
import { handleGetCallHistory } from "../src/tools/call-history.js";

function mockOkResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

function mockErrorResponse(status: number) {
  return {
    ok: false,
    status,
    statusText: "Error",
    text: () => Promise.resolve("error body"),
  };
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("send_sms", () => {
  it("calls messaging/v1/SendSMS with correct params", async () => {
    mockFetch.mockResolvedValueOnce(mockOkResponse({ message_id: "abc-123" }));

    const result = await handleSendSms({
      number: "MyCompany",
      destination: "79001234567",
      text: "Hello",
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain("messaging/v1/SendSMS");
    expect(JSON.parse(opts.body)).toEqual({
      number: "MyCompany",
      destination: "79001234567",
      text: "Hello",
    });
    expect(opts.headers.Authorization).toBe("Bearer test-token-123");

    const parsed = JSON.parse(result);
    expect(parsed.message_id).toBe("abc-123");
  });
});

describe("get_sms_status", () => {
  it("calls messaging/v1/GetList with date range", async () => {
    mockFetch.mockResolvedValueOnce(mockOkResponse({ messages: [] }));

    await handleGetSmsStatus({
      date_from: "2024-01-01T00:00:00Z",
      date_to: "2024-12-31T23:59:59Z",
      limit: 20,
      offset: 0,
    });

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain("messaging/v1/GetList");
    const body = JSON.parse(opts.body);
    expect(body.date_from).toBe("2024-01-01T00:00:00Z");
    expect(body.date_to).toBe("2024-12-31T23:59:59Z");
  });
});

describe("make_call", () => {
  it("calls call/v1/MakeCallback with line_1 and line_2", async () => {
    mockFetch.mockResolvedValueOnce(mockOkResponse({ callback_id: "call-1" }));

    await handleMakeCall({
      line_1: "79001111111",
      line_2: "79002222222",
    });

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain("call/v1/MakeCallback");
    const body = JSON.parse(opts.body);
    expect(body.line_1.destinations).toEqual(["79001111111"]);
    expect(body.line_2.destinations).toEqual(["79002222222"]);
  });
});

describe("get_balance", () => {
  it("calls finance/v1/GetBalance", async () => {
    mockFetch.mockResolvedValueOnce(mockOkResponse({ balance: 3520.38, credit_limit: 0 }));

    const result = await handleGetBalance();
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("finance/v1/GetBalance");

    const parsed = JSON.parse(result);
    expect(parsed.balance).toBe(3520.38);
  });
});

describe("get_numbers", () => {
  it("calls number/customer/v1/GetList", async () => {
    mockFetch.mockResolvedValueOnce(mockOkResponse({ numbers: [{ number_name: "79001234567" }] }));

    await handleGetNumbers({ limit: 50, offset: 0 });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("number/customer/v1/GetList");
  });
});

describe("get_call_history", () => {
  it("calls statistics/call-history/v2/GetList", async () => {
    mockFetch.mockResolvedValueOnce(mockOkResponse({ calls: [] }));

    await handleGetCallHistory({
      date_from: "2024-01-01T00:00:00Z",
      date_to: "2024-12-31T23:59:59Z",
      limit: 50,
      offset: 0,
    });

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain("statistics/call-history/v2/GetList");
    const body = JSON.parse(opts.body);
    expect(body.date_from).toBe("2024-01-01T00:00:00Z");
  });
});

describe("client auth", () => {
  it("sends Bearer token in Authorization header", async () => {
    mockFetch.mockResolvedValueOnce(mockOkResponse({}));
    await handleGetBalance();
    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.headers.Authorization).toBe("Bearer test-token-123");
    expect(opts.headers["Content-Type"]).toBe("application/json");
  });
});

describe("client error handling", () => {
  it("throws on 4xx error", async () => {
    mockFetch.mockResolvedValue(mockErrorResponse(403));
    await expect(handleGetBalance()).rejects.toThrow("MTS Exolve HTTP 403");
  });

  it("retries on 5xx then succeeds", async () => {
    mockFetch
      .mockResolvedValueOnce(mockErrorResponse(500))
      .mockResolvedValueOnce(mockOkResponse({ balance: 100 }));

    const result = await handleGetBalance();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(JSON.parse(result).balance).toBe(100);
  });

  it("retries on 429 rate limit", async () => {
    mockFetch
      .mockResolvedValueOnce(mockErrorResponse(429))
      .mockResolvedValueOnce(mockOkResponse({ balance: 50 }));

    const result = await handleGetBalance();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(JSON.parse(result).balance).toBe(50);
  });
});

describe("missing token", () => {
  it("throws when MTS_EXOLVE_TOKEN is unset", async () => {
    const saved = process.env.MTS_EXOLVE_TOKEN;
    delete process.env.MTS_EXOLVE_TOKEN;
    await expect(handleGetBalance()).rejects.toThrow("MTS_EXOLVE_TOKEN не задан");
    process.env.MTS_EXOLVE_TOKEN = saved;
  });
});
