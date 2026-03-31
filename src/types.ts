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
  status?: string;
  error?: string;
}
