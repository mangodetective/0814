/**
 * ═══════════════════════════════════════════════════════════════
 * 📊 useDashboardData - 대시보드 데이터 관리 훅
 * ═══════════════════════════════════════════════════════════════
 * 
 * 주요 기능:
 * - 센서 데이터 실시간 조회 및 상태 관리 (온도, 습도, 가스)
 * - 30초 주기 자동 폴링을 통한 데이터 업데이트
 * - 알림 데이터 관리 (개수, 목록, 읽음 상태)
 * - UI 상태 관리 (드롭다운, 메뉴 등)
 * - 에러 핸들링 및 로딩 상태 관리
 * 
 * API 연동:
 * - DashboardAPI.getSensorData(): 개별 센서 데이터 조회
 * - DashboardAPI.getNotifications(): 알림 데이터 조회
 * - 전체 센서 데이터 병렬 조회 및 동기화
 * 
 * 데이터 흐름:
 * 1. 컴포넌트 마운트 시 초기 데이터 로드
 * 2. 30초마다 자동 갱신 (setInterval)
 * 3. 센서 타입 변경 시 해당 데이터로 전환
 * 4. 외부 훅(useS3MintrendPoll)에서 allSensorData 업데이트 가능
 */

import { useEffect, useState } from 'react';
import {
  DashboardAPI,
  SensorData,
  SensorType,
  SENSOR_OPTIONS,
} from '../../../services/DashboardTypes';

/**
 * 🗂️ 타입 정의
 * 모든 센서 타입에 대한 데이터를 매핑하는 객체 타입
 */
type AllMap = Record<SensorType, SensorData | null>;

/**
 * 🎯 메인 대시보드 데이터 관리 훅
 * 센서 데이터, 알림, UI 상태를 통합 관리
 */
export function useDashboardData() {
  /**
   * 🎨 UI 상태 관리
   * 드롭다운, 메뉴 등의 표시/숨김 상태
   */
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);  // 알림 드롭다운 상태
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);        // 관리자 메뉴 상태

  /**
   * 🔔 알림 데이터 상태
   * 알림 개수, 목록, 읽음 상태 등을 관리
   */
  const [notificationData, setNotificationData] = useState({
    count: 0,                                                            // 읽지 않은 알림 개수
    notifications: [] as { id: string; message: string; timestamp: string; read?: boolean }[], // 알림 목록
  });

  /**
   * 📊 센서 데이터 상태
   * 현재 선택된 센서와 해당 데이터, 로딩/에러 상태
   */
  const [selectedSensor, setSelectedSensor] = useState<SensorType>('temperature'); // 현재 선택된 센서 타입
  const [sensorData, setSensorData] = useState<SensorData | null>(null);           // 선택된 센서의 데이터
  const [isLoading, setIsLoading] = useState(false);                               // 데이터 로딩 상태
  const [error, setError] = useState<string | null>(null);                         // 에러 메시지

  /**
   * 🌐 전체 센서 데이터 상태
   * 모든 센서 타입의 데이터를 저장하고 관리
   * S3 폴링 훅에서도 이 상태를 업데이트할 수 있음
   */
  const [allSensorData, setAllSensorData] = useState<AllMap>({
    temperature: null,  // 온도 센서 데이터
    humidity: null,     // 습도 센서 데이터
    gas: null,          // 가스 센서 데이터
  });

  // --- fetch helpers --------------------------------------------------------
  const fetchNotifications = async () => {
    try {
      const data = await DashboardAPI.getNotifications();
      setNotificationData(data);
    } catch (e) {
      console.error('알림 데이터 가져오기 실패:', e);
    }
  };

  const fetchSensorData = async (sensorType: SensorType) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await DashboardAPI.getSensorData(sensorType);
      if (data.success) {
        setSensorData(data as SensorData);
        setAllSensorData(prev => ({ ...prev, [sensorType]: data as SensorData }));
      } else {
        setError('데이터를 불러올 수 없습니다.');
      }
    } catch (e) {
      setError('데이터를 가져오는 중 오류가 발생했습니다.');
      console.error('센서 데이터 가져오기 실패:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSensorData = async () => {
    try {
      const results = await Promise.all(
        SENSOR_OPTIONS.map(opt => DashboardAPI.getSensorData(opt.value as SensorType))
      );

      const next: AllMap = { temperature: null, humidity: null, gas: null };
      results.forEach((res, i) => {
        if (res.success) {
          const st = SENSOR_OPTIONS[i].value as SensorType;
          next[st] = res as SensorData;
        }
      });
      setAllSensorData(next);
    } catch (e) {
      console.error('전체 센서 데이터 가져오기 실패:', e);
    }
  };

  // --- lifecycle / polling --------------------------------------------------
  useEffect(() => {
    // 초기 로딩
    fetchNotifications();
    fetchSensorData(selectedSensor);
    fetchAllSensorData();

    // 30초 주기
    const id = setInterval(() => {
      fetchNotifications();
      fetchSensorData(selectedSensor);
      fetchAllSensorData();
    }, 30000);

    return () => clearInterval(id);
  }, [selectedSensor]);

  // 선택 센서가 바뀌면 표정합과 단일 차트 동기화
  useEffect(() => {
    const v = allSensorData[selectedSensor];
    if (v) setSensorData(v);
  }, [selectedSensor, allSensorData]);

  // 외부에 필요한 것만 리턴
  return {
    // UI 토글
    isNotificationOpen, setIsNotificationOpen,
    isAdminMenuOpen, setIsAdminMenuOpen,

    // 센서/알림/에러 상태
    selectedSensor, setSelectedSensor,
    sensorData, isLoading, error,

    // 표용 전체 데이터 (S3 훅이 얘를 업데이트함)
    allSensorData, setAllSensorData,

    // 알림 뱃지/목록
    notificationData,
  };
}
