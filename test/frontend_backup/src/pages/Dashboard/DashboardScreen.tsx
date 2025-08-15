/**
 * ═══════════════════════════════════════════════════════════════
 * 📊 DashboardScreen - 메인 대시보드 화면 컴포넌트
 * ═══════════════════════════════════════════════════════════════
 * 
 * 주요 기능:
 * - 실시간 센서 데이터 시각화 (온도, 습도, 가스 농도)
 * - S3 기반 센서 데이터 폴링 (30초 간격)
 * - AWS QuickSight 대시보드 통합
 * - 센서 데이터 요약 테이블
 * - 시간대별 센서 데이터 차트
 * 
 * API 연동:
 * - useS3MintrendPoll: S3에서 최신 센서 데이터 주기적 조회
 * - QuickSightDashboard: AWS QuickSight 임베드 대시보드
 * - 실시간 데이터 업데이트 및 상태 관리
 * 
 * 컴포넌트 구조:
 * - SummaryTable: 센서 데이터 요약 표시
 * - SensorChart: 시간대별 센서 데이터 차트
 * - QuickSightDashboard: AWS 분석 대시보드
 */

// DashboardScreen.tsx - 메인 대시보드 컴포넌트 (QuickSight 추가)
import React from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import styles from "./DashboardScreen.module.css";
import { useDashboardData } from './hooks/useDashboardData';
import { useClock } from './hooks/useClock';
import SensorChart from './components/SensorChart';
import { SummaryTable } from './components/SummaryTable';
import DashboardHeader from '../../components/common/dashboard/Header';
import QuickSightDashboard from './components/QuickSightDashboard';

/**
 * 🎛️ 대시보드 화면 Props 타입 정의
 * 네비게이션과 메뉴 상태 관리를 위한 프로퍼티들
 */
interface DashboardScreenProps {
  onNavigateToChatbot: () => void;    // 챗봇 화면으로 이동
  onNavigateToHistory: () => void;    // 히스토리 화면으로 이동
  onNavigateToRole?: () => void;      // 역할 선택 화면으로 이동 (로그아웃)
  activeMenu: string;                 // 현재 활성화된 메뉴
  setActiveMenu: (menu: string) => void; // 메뉴 변경 함수
}

/**
 * 🎯 메인 대시보드 컴포넌트
 * 센서 데이터 실시간 모니터링과 AWS QuickSight 분석을 통합한 대시보드
 */
const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToChatbot,
  onNavigateToHistory,
  onNavigateToRole,
  activeMenu,
  setActiveMenu,
}) => {

  /**
   * 📊 대시보드 데이터 및 UI 상태 관리
   * - 센서 데이터 조회 및 상태 관리
   * - 알림 및 관리자 메뉴 상태
   * - 센서 선택 및 필터링 상태
   */
  const {
    isNotificationOpen, setIsNotificationOpen,    // 알림 드롭다운 상태
    isAdminMenuOpen, setIsAdminMenuOpen,          // 관리자 메뉴 상태
    selectedSensor, setSelectedSensor,            // 선택된 센서 타입
    sensorData, isLoading, error,                 // 센서 데이터 및 로딩 상태
    allSensorData, setAllSensorData,              // 전체 센서 데이터
    notificationData,                             // 알림 데이터
  } = useDashboardData();

  /**
   * ⏰ 실시간 시계 표시
   * 대시보드 헤더에 현재 시간을 실시간으로 표시
   */
  const currentTime = useClock();

  /**
   * 🔄 S3 센서 데이터 실시간 폴링 (30초 간격)
   * 
   * API 연동 상세:
   * - GET /s3/file/last/mintrend 엔드포인트 호출
   * - 최신 센서 데이터 자동 업데이트
   * - 폴링 실패 시 에러 핸들링
   * - 데이터 변경 시 UI 자동 반영
   */
  const DashboardScreen: React.FC<DashboardScreenProps> = ({ ... }) => {
  // 기존 복잡한 상태 관리 제거
  // const { s3CurrentTime } = useS3MintrendPoll(setAllSensorData);
  
  // 새로운 간단한 훅 사용
  const {
    data: sensorData,
    isLoading,
    error,
    lastUpdated,
    refresh,
  } = useDashboardSensorData();

  /**
   * 🧭 메뉴 네비게이션 핸들러
   * 사이드바 메뉴 클릭 시 적절한 화면으로 라우팅
   */
  const handleMenuClick = (label: string) => {
    setActiveMenu(label);

    switch (label) {
      case 'Chatbot':
        onNavigateToChatbot();        // 챗봇 화면으로 이동
        break;
      case 'History':
        onNavigateToHistory();        // 히스토리 화면으로 이동
        break;
      case 'Dashboard':
        // 현재 대시보드 화면이므로 아무 동작 없음
        break;
      case 'Logout':
        onNavigateToRole?.();         // 로그아웃 - 역할 선택 화면으로
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* 🔧 네비게이션 사이드바 */}
      <Sidebar
        activeMenu={activeMenu}      // 현재 활성화된 메뉴 표시
        onMenuClick={handleMenuClick} // 메뉴 클릭 이벤트 핸들러
      />

      {/* 📱 메인 컨텐츠 영역 */}
      <main className={styles.mainContent}>
        {/* 🎯 대시보드 헤더 (시간, 알림, 관리자 메뉴) */}
        <DashboardHeader
          activeMenu={activeMenu}
          currentTime={currentTime}
          notificationData={notificationData}
          isNotificationOpen={isNotificationOpen}
          isAdminMenuOpen={isAdminMenuOpen}
          setIsNotificationOpen={setIsNotificationOpen}
          setIsAdminMenuOpen={setIsAdminMenuOpen}
        />

        {/* 📊 메인 대시보드 컨텐츠 영역 */}
        <div className={styles.dashboardContent}>
          {activeMenu === 'Dashboard' ? (
            <>
              {/* 📋 센서 데이터 요약 테이블 */}
              <section className={styles.summarySection}>
                <SummaryTable
                  allSensorData={allSensorData}                     // 모든 센서 데이터
                  timestampText={s3CurrentTime ?? currentTime}      // S3 타임스탬프 또는 현재 시간
                />
              </section>

              {/* 📈 센서 데이터 차트 (시간대별 추이) */}
              <SensorChart 
                allSensorData={allSensorData}    // 차트에 표시할 센서 데이터
              />

              {/* 🔍 AWS QuickSight 분석 대시보드 */}
              <QuickSightDashboard
                defaultSensorType="temperature"              // 기본 센서 타입 (온도)
                title="QUICKSIGHT ANALYTICS DASHBOARD"       // 대시보드 제목
                height={650}                                 // 대시보드 높이
              />
            </>
          ) : (
            // 🔄 다른 메뉴 선택 시 표시되는 플레이스홀더
            <div className={styles.placeholderContent}>
              <h2 className={styles.placeholderTitle}>
                {activeMenu} 페이지
              </h2>
              <p className={styles.placeholderSubtitle}>
                현재 선택된 메뉴: {activeMenu}
              </p>
              <p className={styles.placeholderNote}>
                실제 페이지 컨텐츠를 여기에 구현하세요.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardScreen;