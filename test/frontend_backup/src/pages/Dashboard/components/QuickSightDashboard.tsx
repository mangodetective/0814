// src/pages/Dashboard/components/QuickSightDashboard.tsx
// QuickSight 대시보드 임베드 컴포넌트

import React, { useState, useEffect } from 'react';
import { ChevronDown, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
// 예: QuickSightDashboard.tsx
import { useQuickSight } from '../hooks/useQuickSight';
import { QuickSightService } from '../../../services/QuickSightService';
import { InternalSensorType } from '../../../services/QuickSightTypes';
import styles from './QuickSightDashboard.module.css';

// 센서 옵션 (기존 SensorChart와 동일)
const SENSOR_OPTIONS: { key: InternalSensorType; label: string }[] = [
  { key: 'temperature', label: 'Temperature' },
  { key: 'humidity', label: 'Humidity' },
  { key: 'gas', label: 'CO2 Concentration' },
];

interface QuickSightDashboardProps {
  /** 초기 선택 센서 타입 */
  defaultSensorType?: InternalSensorType;
  /** 컴포넌트 제목 */
  title?: string;
  /** 높이 설정 (기본값: 600px) */
  height?: number;
}

const QuickSightDashboard: React.FC<QuickSightDashboardProps> = ({
  defaultSensorType = 'temperature',
  title = 'QUICKSIGHT ANALYTICS DASHBOARD',
  height = 600,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<InternalSensorType>(defaultSensorType);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    dashboardData,
    embedUrl,
    isLoading,
    error,
    isEmbedUrlValid,
    loadDashboard,
    refreshEmbedUrl,
    clearError,
  } = useQuickSight();

  // 초기 로드 및 센서 타입 변경 시 대시보드 로드
  useEffect(() => {
    loadDashboard(selectedSensor);
  }, [selectedSensor, loadDashboard]);

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // 센서 타입 선택
  const handleSensorSelect = (sensorType: InternalSensorType) => {
    setSelectedSensor(sensorType);
    setIsDropdownOpen(false);
    clearError();
  };

  // 임베드 URL 새로고침
  const handleRefresh = () => {
    refreshEmbedUrl(selectedSensor);
  };

  // 외부 링크로 열기 (새 탭)
  const handleOpenInNewTab = () => {
    if (embedUrl && isEmbedUrlValid) {
      window.open(embedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // 현재 선택된 센서의 라벨
  const selectedLabel = SENSOR_OPTIONS.find(opt => opt.key === selectedSensor)?.label || 'Temperature';

  return (
    <section className={styles.dashboardSection}>
      {/* 헤더 */}
      <div className={styles.sectionHeader}>
        <div className={styles.titleRow}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <div className={styles.headerActions}>
            {/* 새로고침 버튼 */}
            <button
              className={styles.actionButton}
              onClick={handleRefresh}
              disabled={isLoading}
              title="대시보드 새로고침"
            >
              <RefreshCw size={16} className={isLoading ? styles.spinning : ''} />
            </button>
            
            {/* 외부 링크 버튼 */}
            <button
              className={styles.actionButton}
              onClick={handleOpenInNewTab}
              disabled={!embedUrl || !isEmbedUrlValid}
              title="새 탭에서 열기"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* 센서 타입 선택 드롭다운 */}
        <div className={styles.controlRow}>
          <div className={styles.dropdownContainer}>
            <div
              className={styles.dropdown}
              onClick={toggleDropdown}
              role="button"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <span>{selectedLabel}</span>
              <ChevronDown 
                size={16} 
                className={isDropdownOpen ? styles.chevronOpen : styles.chevron} 
              />
            </div>

            {isDropdownOpen && (
              <div className={styles.dropdownMenu} role="listbox">
                {SENSOR_OPTIONS.map(option => (
                  <button
                    key={option.key}
                    className={`${styles.dropdownItem} ${
                      selectedSensor === option.key ? styles.dropdownItemActive : ''
                    }`}
                    onClick={() => handleSensorSelect(option.key)}
                    role="option"
                    aria-selected={selectedSensor === option.key}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 대시보드 콘텐츠 */}
      <div className={styles.dashboardCard}>
        {/* 로딩 상태 */}
        {isLoading && (
          <div className={styles.loadingState} style={{ height: `${height}px` }}>
            <div className={styles.loadingSpinner}></div>
            <p>QuickSight 대시보드를 로드하는 중...</p>
          </div>
        )}

        {/* 오류 상태 */}
        {error && !isLoading && (
          <div className={styles.errorState} style={{ height: `${height}px` }}>
            <AlertTriangle size={48} className={styles.errorIcon} />
            <h3>대시보드 로드 실패</h3>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={handleRefresh}>
              다시 시도
            </button>
          </div>
        )}

        {/* 임베드 URL 만료 경고 */}
        {!isLoading && !error && embedUrl && !isEmbedUrlValid && (
          <div className={styles.warningState} style={{ height: `${height}px` }}>
            <AlertTriangle size={48} className={styles.warningIcon} />
            <h3>세션이 만료되었습니다</h3>
            <p>대시보드 세션이 만료되었습니다. 새로고침하여 다시 로드해주세요.</p>
            <button className={styles.refreshButton} onClick={handleRefresh}>
              새로고침
            </button>
          </div>
        )}

        {/* 대시보드 임베드 */}
        {!isLoading && !error && embedUrl && isEmbedUrlValid && (
          <div className={styles.dashboardWrapper} style={{ height: `${height}px` }}>
            <iframe
              src={embedUrl}
              className={styles.dashboardIframe}
              title={`QuickSight Dashboard - ${selectedLabel}`}
              frameBorder="0"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        )}

        {/* 대시보드 정보 표시 (개발용) */}
        {dashboardData && !isLoading && (
          <div className={styles.dashboardInfo}>
            <small>
              Dashboard: {dashboardData.dashboard.Name} | 
              ID: {dashboardData.dashboardId} | 
              Type: {dashboardData.type}
              {dashboardData.embedExpirationTime && (
                <> | Expires: {new Date(dashboardData.embedExpirationTime).toLocaleString()}</>
              )}
            </small>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuickSightDashboard;