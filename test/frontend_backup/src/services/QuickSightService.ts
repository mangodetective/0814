/**
 * ═══════════════════════════════════════════════════════════════
 * 📊 QuickSight Service - AWS QuickSight 대시보드 통합 서비스
 * ═══════════════════════════════════════════════════════════════
 * 
 * 주요 기능:
 * - AWS QuickSight 대시보드 조회 및 임베드 URL 생성
 * - 센서 타입별 대시보드 관리 (온도, 습도, 가스 농도)
 * - QuickSight 서비스 설정 정보 조회
 * - 임베드 URL 유효성 검증
 * 
 * API 엔드포인트:
 * - GET /quicksight/dashboards/{sensorType}: 센서별 대시보드 조회
 * - GET /quicksight/config: QuickSight 설정 정보 조회
 * 
 * 센서 타입 매핑:
 * - temperature → temp (QuickSight API 타입)
 * - humidity → humid (QuickSight API 타입)  
 * - gas → gas (QuickSight API 타입)
 */

// src/services/QuickSightService.ts
// QuickSight API 호출 서비스

import {
  QuickSightSensorType,
  QuickSightDashboardResponse,
  QuickSightErrorResponse,
  QuickSightConfigResponse,
  SENSOR_TYPE_MAPPING,
  InternalSensorType,
} from './QuickSightTypes';

/**
 * 🏗️ QuickSightService 클래스
 * AWS QuickSight와의 통신을 담당하는 정적 메서드 모음
 */
export class QuickSightService {
  private static baseURL = '/quicksight';  // QuickSight API 베이스 경로

  /**
   * 📊 센서 타입별 QuickSight 대시보드 조회 및 임베드 URL 생성
   * 
   * API 엔드포인트: GET /quicksight/dashboards/{sensorType}
   * 
   * 처리 과정:
   * 1. 내부 센서 타입을 QuickSight API 타입으로 변환 (SENSOR_TYPE_MAPPING 사용)
   * 2. URL 파라미터 구성 (includeEmbedUrl 옵션)
   * 3. QuickSight API 호출
   * 4. 임베드 URL과 대시보드 메타데이터 반환
   * 
   * @param sensorType - 내부 센서 타입 (temperature, humidity, gas)
   * @param includeEmbedUrl - 임베드 URL 포함 여부 (기본값: true)
   * @returns Promise<QuickSightDashboardResponse | QuickSightErrorResponse> - 대시보드 정보
   */
  static async getDashboardByType(
    sensorType: InternalSensorType,
    includeEmbedUrl: boolean = true
  ): Promise<QuickSightDashboardResponse | QuickSightErrorResponse> {
    try {
      // 내부 센서 타입을 QuickSight API 타입으로 변환
      // 예: 'temperature' → 'temp', 'humidity' → 'humid'
      const quicksightType: QuickSightSensorType = SENSOR_TYPE_MAPPING[sensorType];
      
      // URL 파라미터 구성
      const params = new URLSearchParams();
      if (includeEmbedUrl) {
        params.append('includeEmbedUrl', 'true');
      }
      
      // 최종 API URL 생성
      const url = `${this.baseURL}/dashboards/${quicksightType}${params.toString() ? '?' + params.toString() : ''}`;
      
      console.log(`📊 QuickSight API 호출: ${url}`);
      
      // HTTP 요청 실행
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      // JSON 응답 파싱
      const data = await response.json();

      // HTTP 상태 코드 검증
      if (!response.ok) {
        console.error('❌ QuickSight API 오류:', data);
        return data as QuickSightErrorResponse;
      }

      console.log('✅ QuickSight 대시보드 조회 성공:', data);
      return data as QuickSightDashboardResponse;
      
    } catch (error) {
      console.error('❌ QuickSight API 호출 실패:', error);
      return {
        message: 'QuickSight API 호출 중 오류가 발생했습니다.',
        error: 'Network Error',
        statusCode: 500,
      };
    }
  }

  /**
   * ⚙️ QuickSight 서비스 설정 정보 조회
   * 
   * API 엔드포인트: GET /quicksight/config
   * AWS 계정 정보, 권한 설정, 서비스 가용성 등을 확인합니다.
   * 
   * @returns Promise<QuickSightConfigResponse | QuickSightErrorResponse> - 설정 정보
   */
  static async getConfig(): Promise<QuickSightConfigResponse | QuickSightErrorResponse> {
    try {
      const response = await fetch(`${this.baseURL}/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ QuickSight Config API 오류:', data);
        return data as QuickSightErrorResponse;
      }

      return data as QuickSightConfigResponse;
      
    } catch (error) {
      console.error('❌ QuickSight Config API 호출 실패:', error);
      return {
        message: 'QuickSight Config API 호출 중 오류가 발생했습니다.',
        error: 'Network Error',
        statusCode: 500,
      };
    }
  }

  /**
   * ⏰ 임베드 URL 유효성 검증
   * 
   * QuickSight 임베드 URL은 시간 제한이 있어 주기적으로 갱신이 필요합니다.
   * 이 메서드는 현재 시간과 만료 시간을 비교하여 URL의 유효성을 판단합니다.
   * 
   * @param embedUrl - 확인할 임베드 URL
   * @param expirationTime - 만료 시간 (ISO 문자열 형식)
   * @returns boolean - URL 유효성 (true: 유효, false: 만료 또는 무효)
   */
  static isEmbedUrlValid(embedUrl?: string, expirationTime?: string): boolean {
    // URL 또는 만료 시간이 없으면 무효
    if (!embedUrl || !expirationTime) {
      return false;
    }

    const expiration = new Date(expirationTime);
    const now = new Date();
    
    // 현재 시간이 만료 시간보다 이전이면 유효
    return expiration > now;
  }

  /**
   * 🏷️ 센서 타입 표시명 반환
   * 
   * 내부 센서 타입을 사용자에게 표시할 친화적인 이름으로 변환합니다.
   * UI에서 센서 타입을 표시할 때 사용됩니다.
   * 
   * @param sensorType - 내부 센서 타입 (temperature, humidity, gas)
   * @returns string - 표시용 센서명
   */
  static getSensorDisplayName(sensorType: InternalSensorType): string {
    const displayNames = {
      temperature: 'Temperature',      // 온도
      humidity: 'Humidity',           // 습도
      gas: 'CO2 Concentration',       // 가스 농도
    };
    
    return displayNames[sensorType] || sensorType;
  }
}