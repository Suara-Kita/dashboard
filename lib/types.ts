export interface Layer {
  name: string;
  icon: string;
  active: boolean;
}

export interface DashboardMetrics {
  total_raw_inputs: number;
  total_approved: number;
  total_voters: number;
  high_urgency_pending: number;
  queue_voter_inputs_depth: number;
  queue_approved_actions_depth: number;
}

export interface Issue {
  ingestion_id: string;
  source_channel: string;
  raw_text: string;
  cleaned_summary: string;
  constituency: string | null;
  primary_category: string;
  intent_type: string;
  scope: string;
  urgency: string;
  voter_sentiment: string;
  status: string;
  raw_language: string;
  rejection_reason: string | null;
  ingested_at: string;
  processed_at: string | null;
  voter: {
    client_identifier: string;
    display_name: string | null;
    inferred_constituency: string | null;
  } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
