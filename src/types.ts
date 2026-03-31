export interface SmsResponse {
  message_id?: string;
  status?: string;
  error?: string;
}

export interface SmsStatusResponse {
  message_id: string;
  status: string;
  delivered_at?: string;
}

export interface CallResponse {
  call_id?: string;
  callback_id?: string;
  status?: string;
  error?: string;
}

export interface BalanceResponse {
  balance: number;
  credit_limit: number;
}

export interface NumberInfo {
  number_name: string;
  type_name: string;
  region_name: string;
}

export interface CallHistoryEntry {
  call_id: string;
  direction: string;
  caller: string;
  callee: string;
  start_time: string;
  duration: number;
  status: string;
}
