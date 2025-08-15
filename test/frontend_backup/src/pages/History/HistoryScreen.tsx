/**
 * ═══════════════════════════════════════════════════════════════
 * 📜 HistoryScreen - 센서 데이터 이력 조회 화면 컴포넌트
 * ═══════════════════════════════════════════════════════════════
 * 
 * 주요 기능:
 * - 날짜별 센서 데이터 이력 조회 및 표시
 * - 센서 타입별 필터링 (온도, 습도, 가스)
 * - 센서 상태별 필터링 (정상, 경고, 위험)
 * - 페이지네이션을 통한 대용량 데이터 처리
 * - 달력을 통한 직관적인 날짜 선택
 * 
 * API 연동:
 * - useHistoryData: S3 이력 데이터 조회 및 상태 관리
 * - GET /s3/history/{date}: 특정 날짜의 센서 데이터 조회
 * - 날짜, 센서 타입, 상태별 필터링 지원
 * 
 * 컴포넌트 구조:
 * - HistoryFilter: 날짜 선택 및 필터 옵션
 * - HistoryTable: 센서 데이터 테이블 및 페이지네이션
 */

// HistoryScreen.tsx - 간소화된 히스토리 화면 컴포넌트
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, User } from 'lucide-react';
import { Sidebar } from '../../components/common/Sidebar';
import NotificationDropdown from '../../components/common/dropdown/NotificationDropdown';
import AdminDropdown from '../../components/common/dropdown/AdminDropdown';
import { HistoryUtils } from '../../services/HistoryTypes';
import { HistoryScreenProps, NotificationData } from '../../services/HistoryTypes';
import styles from './HistoryScreen.module.css';
import useHistoryData from './hooks/UseHistoryData';
import HistoryFilter from '../../components/history/HistoryFilter';
import HistoryTable from '../../components/history/HistoryTable';


/**
 * 🎯 히스토리 화면 메인 컴포넌트
 * 센서 데이터 이력을 조회하고 필터링할 수 있는 화면을 제공
 */
const HistoryScreen: React.FC<HistoryScreenProps> = ({ 
  onNavigateBack,           // 뒤로가기 (사용하지 않음 - 향후 확장용)
  onNavigateToChatbot,      // 챗봇 화면으로 이동
  onNavigateToHistory,      // 히스토리 화면으로 이동 (현재 화면)
  onNavigateToRole,         // 역할 선택 화면으로 이동 (로그아웃)
  onNavigateToDashboard,    // 대시보드 화면으로 이동
  activeMenu,               // 현재 활성화된 메뉴
  setActiveMenu             // 메뉴 변경 함수
}) => {
  /**
   * 📊 히스토리 데이터 관리 커스텀 훅
   * - S3 API를 통한 센서 이력 데이터 조회
   * - 필터링 및 페이지네이션 상태 관리
   * - 날짜, 센서 타입, 상태별 필터링 지원
   */
  const {
    historyState,         // 전체 히스토리 상태 (데이터, 필터, 페이징 등)
    loadHistoryData,      // API를 통한 히스토리 데이터 로딩
    updateFilter,         // 필터 조건 업데이트
    resetFilters,         // 모든 필터 초기화
    changePage,           // 페이지 변경
    updateHistoryState    // 상태 직접 업데이트
  } = useHistoryData();

  /**
   * 🔔 UI 상태 관리 (알림, 드롭다운 등)
   * API 연동과는 별개의 로컬 UI 상태들
   */
  const [notificationData, setNotificationData] = useState<NotificationData>({
    count: 0,
    notifications: []
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);   // 알림 드롭다운 상태
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);         // 관리자 메뉴 상태
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // 활성화된 드롭다운 추적

  /**
   * 🧭 메뉴 네비게이션 핸들러
   * 사이드바 메뉴 클릭 시 적절한 화면으로 라우팅
   */
  const handleMenuClick = (label: string, path: string) => {
    setActiveMenu(label);
    
    switch (label) {
    case 'Dashboard':
      onNavigateToDashboard();     // 대시보드 화면으로 이동
      break;
    case 'Chatbot':
      onNavigateToChatbot();       // 챗봇 화면으로 이동
      break;
    case 'History':
      onNavigateToHistory();       // 현재 히스토리 화면 (새로고침)
      break;
    case 'Logout':
      onNavigateToRole?.();        // 로그아웃 - 역할 선택 화면으로
      break;
    default:
      break;
    }
  };

  /**
   * 🔍 필터 적용 함수
   * 필터 조건이 변경될 때 첫 페이지로 이동하고 데이터를 다시 로드
   */
  const applyFilters = useCallback(() => {
    updateHistoryState({ currentPage: 1 });   // 첫 페이지로 이동
    loadHistoryData(1);                       // API 호출하여 필터된 데이터 로드
  }, [loadHistoryData, updateHistoryState]);

  /**
   * 📅 날짜 선택 핸들러
   * 달력에서 날짜를 선택했을 때 필터에 반영
   */
  const handleDateSelect = useCallback((date: Date) => {
    const dateString = HistoryUtils.formatDateToString(date);
    updateHistoryState({
      selectedDate: date,
      filters: { ...historyState.filters, date: dateString }
    });
  }, [historyState.filters, updateHistoryState]);

  /**
   * 🔧 필터 표시/숨김 토글
   * 필터 섹션의 확장/축소 상태 관리
   */
  const toggleFilters = useCallback(() => {
    updateHistoryState({ showFilters: !historyState.showFilters });
  }, [historyState.showFilters, updateHistoryState]);

  /**
   * 🎬 컴포넌트 초기화
   * 화면 진입 시 최초 히스토리 데이터 로드
   */
  useEffect(() => {
    loadHistoryData();  // 초기 데이터 로드 (필터 없이 전체 데이터)
  }, []);

  /**
   * 🔄 필터 변경 감지 및 자동 적용
   * 날짜, 센서 타입, 상태 필터가 변경될 때마다 자동으로 데이터 갱신
   */
  useEffect(() => {
    if (historyState.filters.date || historyState.filters.sensorType || historyState.filters.status) {
      applyFilters();
    }
  }, [historyState.filters, applyFilters]);

  return (
    <div className={styles.container}>
      {/* 사이드바 */}
      <Sidebar 
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className={styles.mainContent}>
        {/* 상단 헤더 */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.headerTitle}>History</h1>
              <p className={styles.headerSubtitle}>{new Date().toLocaleString('ko-KR')}</p>
            </div>

            <div className={styles.headerActions}>
              {/* 알림 아이콘 */}
              <div className={styles.notificationContainer}>
                <button
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsAdminMenuOpen(false);
                  }}
                  className={styles.notificationButton}
                >
                  <Bell size={24} />
                  {notificationData.count > 0 && (
                    <span className={styles.notificationBadge}>
                      {notificationData.count > 99 ? '99+' : notificationData.count}
                    </span>
                  )}
                </button>

                <NotificationDropdown
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  notifications={notificationData.notifications}
                />
              </div>

              {/* 관리자 프로필 */}
              <div className={styles.adminContainer}>
                <button
                  onClick={() => {
                    setIsAdminMenuOpen(!isAdminMenuOpen);
                    setIsNotificationOpen(false);
                  }}
                  className={styles.adminButton}
                >
                  <div className={styles.adminAvatar}>
                    <User size={18} style={{ color: 'white' }} />
                  </div>
                  <span className={styles.adminLabel}>Admin</span>
                </button>

                <AdminDropdown
                  isOpen={isAdminMenuOpen}
                  onClose={() => setIsAdminMenuOpen(false)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* 히스토리 메인 */}
        <main className={styles.historyMain}>
          <div className={styles.historyContent}>
            {/* 필터 섹션 */}
            <HistoryFilter
              historyState={historyState}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              handleDateSelect={handleDateSelect}
              applyFilters={applyFilters}
              toggleFilters={toggleFilters}
            />

            {/* 에러 메시지 */}
            {historyState.error && (
              <div className={styles.error}>
                {historyState.error}
              </div>
            )}

            {/* 테이블 섹션 */}
            <section className={styles.tableSection}>
              <HistoryTable
                historyState={historyState}
                changePage={changePage}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HistoryScreen;