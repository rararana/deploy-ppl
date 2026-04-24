export interface AccountBrief {
  full_name: string;
  email: string;
}

export type RequestType = "trigger" | "action";
export type RequestStatus = "pending" | "approved" | "rejected";
export type ReviewAction = "approved" | "rejected";

export interface AppRequest {
  id: string;
  account_id: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  admin_note: string | null;
  created_at: string;
  account: AccountBrief | null;
}

export interface RequestFormData {
  type: RequestType;
  title: string;
  description: string;
}
