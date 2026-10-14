export interface ComponentRef {
  component_id: string;
  component_type: string;
  name?: string | null;
}

export interface FlowEvent {
  event_id?: string;
  flow_id: string;
  correlation_id?: string | null;
  parent_event_id?: string | null;
  timestamp?: string;
  source: ComponentRef;
  destination: ComponentRef;
  action: string;
  data_labels?: string[];
  metadata?: Record<string, unknown>;
  status?: string;
  duration_ms?: number | null;
}

export interface GraphNode {
  id: string;
  component: ComponentRef;
  label?: string | null;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  action: string;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  generated_at: string;
}

export type PolicyEffect = "ALLOW" | "BLOCK" | "REQUIRE_APPROVAL";

export type RuleResolutionAlgorithm =
  | "FIRST_APPLICABLE"
  | "BLOCK_OVERRIDES"
  | "ALLOW_OVERRIDES";

export interface RuleDefinition {
  id: string;
  name: string;
  description?: string | null;
  condition: unknown;
  effect: PolicyEffect;
  priority?: number;
  enabled?: boolean;
  target_actions?: string[] | null;
  target_resources?: string[] | null;
}

export interface PolicyCreate {
  id: string;
  name: string;
  description?: string | null;
  priority?: number;
  rules: RuleDefinition[];
  resolution_algorithm?: RuleResolutionAlgorithm;
  default_effect?: PolicyEffect;
  enabled?: boolean;
}

export interface PolicyRead extends PolicyCreate {
  version: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export type Policy = PolicyRead;

export type PolicyChangeType =
  | "CREATED"
  | "UPDATED"
  | "ACTIVATED"
  | "DEACTIVATED";

export interface PolicyHistoryEntry {
  policy_id: string;
  version: number;
  change_type: PolicyChangeType | string;
  timestamp?: string;
  actor?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown>;
}

export interface AuthorizationRequest {
  trace_id: string;
  subject: Record<string, unknown> | string;
  action: string;
  resource: string;
  context?: Record<string, unknown>;
}

export type ReasonCode =
  | "RULE_MATCHED"
  | "DEFAULT_FALLBACK"
  | "POLICY_DISABLED"
  | "MISSING_CONTEXT"
  | "INVALID_REQUEST"
  | "CONFLICT_RESOLVED";

export interface AuthorizationDecision {
  decision: PolicyEffect;
  policy_id?: string | null;
  policy_version?: number | null;
  matched_rule_id?: string | null;
  matched_rule_ids?: string[];
  matched_policy_ids?: string[];
  reason_code: ReasonCode | string;
  reason_message: string;
  missing_attributes?: string[];
  evaluated_at?: string;
}

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

export type ApprovalDecisionType = "APPROVE" | "REJECT";

export interface ApprovalDecisionSubmission {
  actor: string;
  decision: ApprovalDecisionType;
  reason?: string | null;
  is_ai_or_llm?: boolean;
}

export interface ApprovalRequest {
  id: string;
  trace_id: string;
  policy_id: string;
  policy_version: number;
  matched_rule_id?: string | null;
  original_decision: AuthorizationDecision;
  request_payload: AuthorizationRequest;
  status?: ApprovalStatus;
  created_at?: string;
  decided_at?: string | null;
  decided_by?: string | null;
  decision_reason?: string | null;
  final_effect?: PolicyEffect;
}

export interface OperatorScope {
  application_id: string;
  environment: string;
}

export interface OperatorChatRequest {
  message: string;
  conversation_id?: string | null;
  scope?: OperatorScope | null;
}

export type OperatorReferenceType = "graph_event" | "policy" | "decision";

export interface OperatorReference {
  reference_type: OperatorReferenceType;
  reference_id: string;
}

export interface ProposedAction {
  title: string;
  description: string;
  review_required: true;
}

export type OperatorResponseType =
  | "answer"
  | "clarification"
  | "proposal"
  | "error";

export interface OperatorResponseContent {
  assistant_message: string;
  references?: OperatorReference[] | null;
  proposed_actions?: ProposedAction[] | null;
}

export interface OperatorModelResponse extends OperatorResponseContent {
  response_type: Exclude<OperatorResponseType, "error">;
}

export interface OperatorChatResponse extends OperatorResponseContent {
  conversation_id: string;
  response_type: OperatorResponseType;
}
