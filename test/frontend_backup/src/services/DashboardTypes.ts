/**
 * ═══════════════════════════════════════════════════════════════
 * 📊 DashboardTypes - 대시보드 관련 타입 정의 및 API 모듈
 * ═══════════════════════════════════════════════════════════════
 * 
 * 주요 내용:
 * - 센서 데이터 타입 정의 (온도, 습도, 가스 농도)
 * - UI 컴포넌트 Props 타입
 * - API 호출 클래스 및 유틸리티 함수
 * - 알림 시스템 타입
 * - 메뉴 및 네비게이션 타입
 * 
 * 센서 데이터 구조:
 * - 실시간 현재값 + 상태 (GOOD/WARNING/DANGER)
 * - 시간대별 히스토리 데이터 (차트 표시용)
 * - 예측값 (머신러닝 기반)
 * - 메타데이터 (단위, 타임스탬프 등)
 * 
 * API 통신:
 * - RESTful API 엔드포인트 정의
 * - 에러 핸들링 및 폴백 데이터
 * - 더미 데이터 생성기 (개발/테스트용)
 */

// Dashboard.ts - 타입 정의 및 API 로직
import React from 'react';
import { Bell, User, LayoutDashboard, MessageCircle, History, Settings, LogOut } from 'lucide-react';

/**
 * 🔔 알림 시스템 타입 정의
 * 실시간 알림 기능을 위한 데이터 구조
 */
export interface NotificationData {
  count: number;                    // 읽지 않은 알림 개수
  notifications: Array<{
    id: string;                     // 고유 알림 ID
    message: string;                // 알림 메시지 내용
    timestamp: string;              // 알림 발생 시간
    read: boolean;                  // 읽음 여부
  }>;
}

/**
 * 🧭 사이드바 메뉴 아이템 Props
 * 네비게이션 메뉴의 개별 항목 설정
 */
export interface SidebarItemProps {
  icon: React.ReactNode;            // 아이콘 컴포넌트
  label: string;                    // 메뉴 라벨 텍스트
  isActive: boolean;                // 현재 활성화 상태
  onClick: () => void;              // 클릭 이벤트 핸들러
}

/**
 * 📋 메뉴 아이템 정의
 * 전체 메뉴 구조의 기본 단위
 */
export interface MenuItem {
  icon: React.ReactNode;            // 메뉴 아이콘
  label: string;                    // 메뉴 이름
  path: string;                     // 라우팅 경로
}

/**
 * 📊 센서 데이터 관련 타입 정의
 * IoT 센서에서 수집되는 데이터의 표준 구조
 */

/** 센서 데이터 성공 응답 */
export interface SensorData {
  success: boolean;                                     // API 호출 성공 여부
  sensorType: 'temperature' | 'humidity' | 'gas';      // 센서 타입
  unit: string;                                         // 측정 단위 (°C, %, ppm 등)
  labels: string[];                                     // 시간 라벨 배열 (차트 X축용)
  values: number[];                                     // 측정값 배열 (차트 Y축용)
  current: {
    value: number;                                      // 현재 측정값
    status: 'GOOD' | 'WARNING' | 'DANGER';             // 현재 상태 (임계값 기반)
  };
  prediction: {
    value: number;                                      // 예측값 (머신러닝 기반)
  };
  timestamp: string;                                    // 데이터 생성 시간 (ISO 형식)
}

/** 센서 데이터 에러 응답 */
export interface SensorDataError {
  success: false;               // 실패 표시
  error: string;               // 에러 메시지
}

/** 센서 타입 열거형 */
export type SensorType = 'temperature' | 'humidity' | 'gas';

/** 센서 선택 옵션 */
export interface SensorOption {
  value: SensorType;           // 내부 식별값
  label: string;               // 영문 라벨 (UI 표시용)
  displayName: string;         // 한글 표시명 (사용자 친화적)
}

/**
 * 🌐 DashboardAPI - 대시보드 관련 API 호출 클래스
 * 센서 데이터와 알림 정보를 서버에서 조회하는 정적 메서드 모음
 */
export class DashboardAPI {
  private static baseURL = '/api/dashboard';    // API 베이스 URL

  /**
   * 📊 센서 데이터 조회 API
   * 
   * API 엔드포인트: GET /api/dashboard/sensor-data
   * 
   * @param sensorType - 조회할 센서 타입 (temperature, humidity, gas)
   * @param rangeHour - 조회할 시간 범위 (기본 10시간)
   * @returns Promise<SensorData | SensorDataError> - 센서 데이터 또는 에러
   */
  static async getSensorData(
    sensorType: SensorType, 
    rangeHour: number = 10
  ): Promise<SensorData | SensorDataError> {
    try {
      // 쿼리 파라미터를 포함한 API 호출
      const response = await fetch(
        `${this.baseURL}/sensor-data?sensorType=${sensorType}&rangeHour=${rangeHour}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // HTTP 상태 코드 검증
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // JSON 응답 반환
      return await response.json();
    } catch (error) {
      console.error('센서 데이터 API 호출 실패, 더미 데이터 반환:', error);
      // API 실패 시 개발용 더미 데이터 반환 (서비스 연속성 보장)
      return DashboardUtils.generateMockSensorData(sensorType);
    }
  }

  /**
   * 🔔 알림 데이터 조회 API
   * 
   * API 엔드포인트: GET /api/dashboard/notifications
   * 
   * @returns Promise<NotificationData> - 알림 목록 및 개수
   */
  static async getNotifications(): Promise<NotificationData> {
    try {
      // TODO: 실제 프로덕션에서는 아래 주석을 해제하고 더미 데이터 제거
      // const response = await fetch(`${this.baseURL}/notifications`);
      // return await response.json();

      // 개발용 더미 알림 데이터
      return {
        count: 3,
        notifications: [
          {
            id: '1',
            message: '온도 센서에서 임계값을 초과했습니다.',
            timestamp: '2025-08-07 19:30',
            read: false
          },
          {
            id: '2',
            message: '습도 센서 데이터가 업데이트되었습니다.',
            timestamp: '2025-08-07 19:25',
            read: false
          },
          {
            id: '3',
            message: '시스템 점검이 완료되었습니다.',
            timestamp: '2025-08-07 19:20',
            read: true
          }
        ]
      };
    } catch (error) {
      console.error('알림 데이터 가져오기 실패:', error);
      return { count: 0, notifications: [] };
    }
  }
}

// 유틸리티 함수들
export class DashboardUtils {
  // 현재 시간 포맷팅
  static getCurrentDateTime(): string {
    const now = new Date();
    return `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일 ${String(now.getHours()).padStart(2, '0')}시 ${String(now.getMinutes()).padStart(2, '0')}분`;
  }

  // 센서 상태에 따른 스타일 클래스 반환
  static getStatusClass(status: string): string {
    switch (status) {
      case 'GOOD':
        return 'statusGood';
      case 'WARNING':
        return 'statusWarning';
      case 'DANGER':
        return 'statusDanger';
      default:
        return 'statusGood';
    }
  }

  // 센서 타입에 따른 그래프 색상 반환
  static getChartColor(sensorType: SensorType): string {
    switch (sensorType) {
      case 'temperature':
        return '#ef4444'; // 빨간색
      case 'humidity':
        return '#3b82f6'; // 파란색
      case 'gas':
        return '#8b5cf6'; // 보라색
      default:
        return '#6b7280';
    }
  }

  // 더미 센서 데이터 생성 (개발용)
  static generateMockSensorData(sensorType: SensorType): SensorData {
    const labels = ['-10H', '-9H', '-8H', '-7H', '-6H', '-5H', '-4H', '-3H', '-2H', '-1H', 'NOW'];
    let values: number[];
    let unit: string;
    let currentValue: number;
    let predictionValue: number;

    switch (sensorType) {
      case 'temperature':
        values = [20.2, 21.5, 22.1, 21.8, 22.4, 23.1, 22.9, 23.5, 24.2, 24.8, 25.5];
        unit = '°C';
        currentValue = 25.5;
        predictionValue = 25.6;
        break;
      case 'humidity':
        values = [58.3, 59.1, 60.2, 59.8, 60.5, 61.2, 60.8, 61.5, 60.9, 60.3, 60.1];
        unit = '%';
        currentValue = 60.1;
        predictionValue = 60.0;
        break;
      case 'gas':
        values = [670, 672, 675, 673, 678, 680, 677, 682, 679, 676, 675];
        unit = 'ppm';
        currentValue = 675;
        predictionValue = 670;
        break;
      default:
        values = [];
        unit = '';
        currentValue = 0;
        predictionValue = 0;
    }

    return {
      success: true,
      sensorType,
      unit,
      labels,
      values,
      current: {
        value: currentValue,
        status: 'GOOD'
      },
      prediction: {
        value: predictionValue
      },
      timestamp: new Date().toISOString()
    };
  }
}

// 센서 옵션 상수
export const SENSOR_OPTIONS: SensorOption[] = [
  { value: 'temperature', label: 'TEMPERATURE', displayName: '온도' },
  { value: 'humidity', label: 'HUMIDITY', displayName: '습도' },
  { value: 'gas', label: 'GAS CONCENTRATION', displayName: '가스 농도' }
];

// 메뉴 아이템 상수
export const MENU_ITEMS: MenuItem[] = [
  { icon: React.createElement(LayoutDashboard, { size: 20 }), label: 'Dashboard', path: '/dashboard' },
  { icon: React.createElement(MessageCircle, { size: 20 }), label: 'Chatbot', path: '/chatbot' },
  { icon: React.createElement(History, { size: 20 }), label: 'History', path: '/history' },
  { icon: React.createElement(Settings, { size: 20 }), label: 'Settings', path: '/settings' },
  { icon: React.createElement(LogOut, { size: 20 }), label: 'Logout', path: '/logout' }
];