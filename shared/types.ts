export type AssetStatus = 'healthy' | 'warning' | 'critical';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'investigating' | 'resolved';
export type UserRole = 'ADMIN' | 'ENGINEER' | 'OPERATOR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  zone: string;
  type: string;
  health: number;
  riskScore: number;
  temperature: number;
  vibration: number;
  status: AssetStatus;
  nextMaintenance: string;
  recommendation: string;
  description?: string;
  gridX: number;
  gridY: number;
  gridW: number;
  gridH: number;
  createdAt: string;
  updatedAt: string;
  manuals?: ManualDocument[];
  incidents?: Incident[];
  telemetryHistory?: TelemetryRecord[];
}

export interface TelemetryRecord {
  id: string;
  assetId: string;
  temperature: number;
  vibration: number;
  healthScore: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  assetId?: string;
  assetName?: string;
  title: string;
  type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  date: string;
  description: string;
  rootCause?: string;
  resolution?: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  type: string;
  notes: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ManualDocument {
  id: string;
  assetId?: string;
  title: string;
  category: string;
  content: string;
  fileUrl?: string;
  createdAt: string;
}

export interface GraphNode {
  id: string;
  name: string;
  type: 'asset' | 'engineer' | 'document' | 'failure' | 'supplier';
  x?: number;
  y?: number;
  r?: number;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface KPIMetrics {
  totalAssets: number;
  healthyAssets: number;
  healthyPercentage: number;
  criticalAssets: number;
  pendingMaintenance: number;
  incidentsToday: number;
  incidentsResolvedToday: number;
  knowledgeDocs: number;
  aiQueriesToday: number;
  efficiency: number;
}

export interface RULPrediction {
  assetId: string;
  assetName: string;
  remainingDays: number;
  failureProbability: number;
  riskColor: string;
  trend: number[];
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  sources?: string[];
  confidence?: number;
  timestamp: string;
}
