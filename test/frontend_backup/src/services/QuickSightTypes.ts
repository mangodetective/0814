// src/services/QuickSightTypes.ts
// QuickSight 관련 타입 정의

export type QuickSightSensorType = 'TEMPERATURE' | 'HUMIDITY' | 'CO_CONCENTRATION';

export interface QuickSightDashboard {
  Arn: string;
  CreatedTime: string;
  DashboardId: string;
  LastPublishedTime: string;
  LastUpdatedTime: string;
  LinkEntities: string[];
  Name: string;
  Version: {
    CreatedTime: string;
    DataSetArns: string[];
    Errors: any[];
    Sheets: {
      Name: string;
      SheetId: string;
    }[];
    SourceEntityArn: string;
    Status: string;
    VersionNumber: number;
  };
}

export interface QuickSightDashboardResponse {
  dashboard: QuickSightDashboard;
  dashboardId: string;
  type: QuickSightSensorType;
  requestId: string;
  embedUrl?: string;
  embedExpirationTime?: string;
}

export interface QuickSightErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface QuickSightConfigResponse {
  awsAccountId: string;
  namespace: string;
  region: string;
}

// 센서 타입 매핑 (내부 타입 → QuickSight API 타입)
export const SENSOR_TYPE_MAPPING = {
  temperature: 'TEMPERATURE',
  humidity: 'HUMIDITY',
  gas: 'CO_CONCENTRATION', // gas → CO_CONCENTRATION
} as const;

export type InternalSensorType = keyof typeof SENSOR_TYPE_MAPPING;