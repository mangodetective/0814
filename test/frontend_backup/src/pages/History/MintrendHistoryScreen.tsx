// MinTrendHistoryScreen.tsx - ìƒˆë¡œìš´ MinTrend ížˆìŠ¤í† ë¦¬ í™”ë©´ ì»´í¬ë„ŒíŠ¸
import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  User,
  Filter,
  RotateCcw,
  ChevronRight,
  FileText,
  Search,
  Calendar
} from 'lucide-react';
import { Sidebar } from '../../components/common/Sidebar';
import {
  MinTrendHistoryState,
  MinTrendFilters,
  MinTrendFileData,
  MinTrendHistoryAPI,
  MinTrendHistoryUtils
} from '../../services/MintrendHistoryTypes';
import styles from './MinTrendHistory.module.css';

// ì•Œë¦¼ ë°ì´í„° ì¸í„°íŽ˜ì´ìŠ¤
interface NotificationData {
  count: number;
  notifications: Array<{
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>;
}

interface MinTrendHistoryScreenProps {
  onNavigateBack: () => void;
  onNavigateToChatbot: () => void;
  onNavigateToHistory: () => void;
  onNavigateToRole?: () => void;
  onNavigateToDashboard: () => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

// ì•Œë¦¼ ë“œë¡­ë‹¤ìš´ ì»´í¬ë„ŒíŠ¸
const NotificationDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationData['notifications'];
}> = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.dropdown}>
        <div className={styles.dropdownHeader}>
          <h3 className={styles.dropdownTitle}>ì•Œë¦¼</h3>
        </div>
        <div className={styles.notificationList}>
          {notifications.length === 0 ? (
            <div className={styles.emptyNotification}>ìƒˆë¡œìš´ ì•Œë¦¼ì´ ì—†ìŠµë‹ˆë‹¤</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${!notification.read ? styles.notificationItemUnread : ''}`}
              >
                <p className={styles.notificationMessage}>{notification.message}</p>
                <p className={styles.notificationTimestamp}>{notification.timestamp}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className={styles.dropdownOverlay}
        aria-label="ì•Œë¦¼ ë‹«ê¸°"
      />
    </>
  );
};

// ê´€ë¦¬ìž ë“œë¡­ë‹¤ìš´ ì»´í¬ë„ŒíŠ¸
const AdminDropdown: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.adminDropdown}>
        <div className={styles.adminDropdownContent}>
          <button className={styles.adminDropdownItem}>í”„ë¡œí•„ ì„¤ì •</button>
          <button className={styles.adminDropdownItem}>ê³„ì • ê´€ë¦¬</button>
          <div className={styles.adminDropdownDivider} />
          <button className={`${styles.adminDropdownItem} ${styles.adminDropdownLogout}`}>ë¡œê·¸ì•„ì›ƒ</button>
        </div>
      </div>
      <button
        onClick={onClose}
        className={styles.dropdownOverlay}
        aria-label="ê´€ë¦¬ìž ë©”ë‰´ ë‹«ê¸°"
      />
    </>
  );
};

// ì„¼ì„œ ì¹´ë“œ ì»´í¬ë„ŒíŠ¸
const SensorCard: React.FC<{
  sensor: 'mintemp' | 'minhum' | 'mingas';
  value: number;
  status: string;
}> = ({ sensor, value, status }) => {
  const sensorName = MinTrendHistoryUtils.getSensorName(sensor);
  const sensorUnit = MinTrendHistoryUtils.getSensorUnit(sensor);
  const statusClass = MinTrendHistoryUtils.getStatusClass(status);
  const statusText = MinTrendHistoryUtils.getStatusText(status);

  return (
    <div className={styles.sensorCard}>
      <div className={styles.sensorName}>{sensorName}</div>
      <div className={styles.sensorValue}>
        {value.toFixed(2)}{sensorUnit}
      </div>
      <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
        {statusText}
      </span>
    </div>
  );
};

// ë ˆì½”ë“œ ì•„ì´í…œ ì»´í¬ë„ŒíŠ¸
const RecordItem: React.FC<{ record: MinTrendFileData }> = ({ record }) => {
  const { data, filename } = record;

  return (
    <div className={styles.recordItem}>
      <div className={styles.recordHeader}>
        <div className={styles.recordTime}>
          {MinTrendHistoryUtils.formatTimeOnly(data.timestamp)}
        </div>
        <div className={styles.recordFilename}>{filename}</div>
      </div>
      
      <div className={styles.sensorGrid}>
        <SensorCard
          sensor="mintemp"
          value={data.mintemp}
          status={data.mintemp_status}
        />
        <SensorCard
          sensor="minhum"
          value={data.minhum}
          status={data.minhum_status}
        />
        <SensorCard
          sensor="mingas"
          value={data.mingas}
          status={data.mingas_status}
        />
      </div>
    </div>
  );
};

const MinTrendHistoryScreen: React.FC<MinTrendHistoryScreenProps> = ({
  onNavigateBack,
  onNavigateToChatbot,
  onNavigateToHistory,
  onNavigateToRole,
  onNavigateToDashboard,
  activeMenu,
  setActiveMenu
}) => {

  // ë©”ë‰´ í´ë¦­ í•¸ë“¤ëŸ¬
  const handleMenuClick = (label: string, path: string) => {
    setActiveMenu(label);
    
    switch (label) {
    case 'Dashboard':
      onNavigateToDashboard();
      break;
    case 'Chatbot':
      onNavigateToChatbot();
      break;
    case 'History':
      onNavigateToHistory();
      break;
    case 'Logout':
      onNavigateToRole?.();
      break;
    default:
      break;
    }
  };

  // í˜„ìž¬ ë‚ ì§œë¡œ ì´ˆê¸°í™”
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const [state, setState] = useState<MinTrendHistoryState>({
    data: [],
    isLoading: false,
    error: null,
    filters: {
      date: MinTrendHistoryUtils.getTodayString(),
      year: currentYear,
      month: currentMonth,
      day: currentDay
    },
    showFilters: true,
    showDatePicker: false,
    selectedDate: today,
    hasMore: false,
    page: 1
  });

  const [notificationData, setNotificationData] = useState<NotificationData>({
    count: 0,
    notifications: []
  });

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // ë°ì´í„° ë¡œë“œ í•¨ìˆ˜
  const loadHistoryData = useCallback(async (filters: MinTrendFilters, append: boolean = false) => {
    if (!filters.date) return;

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      data: append ? prev.data : []
    }));

    try {
      // ê°œë°œ ëª¨ë“œì—ì„œëŠ” ëª© ë°ì´í„° ì‚¬ìš©, í”„ë¡œë•ì…˜ì—ì„œëŠ” ì‹¤ì œ API í˜¸ì¶œ
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      let response;
      if (isDevelopment) {
        response = await MinTrendHistoryAPI.generateMockData(filters.date);
      } else {
        response = await MinTrendHistoryAPI.getHistoryByDate(filters.date);
      }

      setState(prev => ({
        ...prev,
        data: append ? [...prev.data, ...response.files] : response.files,
        isLoading: false,
        hasMore: response.files.length > 0
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'ë°ì´í„°ë¥¼ ë¶ˆëŸ¬ì˜¤ëŠ”ë° ì‹¤íŒ¨í–ˆìŠµë‹ˆë‹¤.'
      }));
    }
  }, []);

  // í•„í„° ì ìš© í•¨ìˆ˜
  const applyFilters = useCallback(() => {
    const { year, month, day } = state.filters;
    
    // ìœ íš¨í•œ ë‚ ì§œì¸ì§€ í™•ì¸
    if (!MinTrendHistoryUtils.isValidDate(year, month, day)) {
      setState(prev => ({
        ...prev,
        error: 'ìœ íš¨í•˜ì§€ ì•Šì€ ë‚ ì§œìž…ë‹ˆë‹¤.'
      }));
      return;
    }

    const dateString = MinTrendHistoryUtils.formatDateToString(new Date(year, month - 1, day));
    const updatedFilters = { ...state.filters, date: dateString };
    
    setState(prev => ({
      ...prev,
      filters: updatedFilters,
      selectedDate: new Date(year, month - 1, day),
      page: 1
    }));

    loadHistoryData(updatedFilters, false);
  }, [state.filters, loadHistoryData]);

  // í•„í„° ì´ˆê¸°í™” í•¨ìˆ˜
  const resetFilters = useCallback(() => {
    const today = new Date();
    const todayString = MinTrendHistoryUtils.getTodayString();
    
    const resetFilters: MinTrendFilters = {
      date: todayString,
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };

    setState(prev => ({
      ...prev,
      filters: resetFilters,
      selectedDate: today,
      page: 1,
      data: [],
      error: null
    }));

    loadHistoryData(resetFilters, false);
  }, [loadHistoryData]);

  // í•„í„° ë³€ê²½ í•¨ìˆ˜
  const updateFilter = useCallback((key: keyof MinTrendFilters, value: number | string | null) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value }
    }));
  }, []);

  // ì»´í¬ë„ŒíŠ¸ ë§ˆìš´íŠ¸ ì‹œ ë°ì´í„° ë¡œë“œ
  useEffect(() => {
    loadHistoryData(state.filters);
  }, []);

  // ë…„ë„, ì›”, ì¼ ì˜µì…˜ ìƒì„±
  const yearOptions = MinTrendHistoryUtils.getYearOptions();
  const monthOptions = MinTrendHistoryUtils.getMonthOptions();
  const dayOptions = MinTrendHistoryUtils.getDayOptions(state.filters.year, state.filters.month);

  return (
    <div className={styles.container}>
      {/* ì‚¬ì´ë“œë°” */}
      <Sidebar 
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
      />

      {/* ë©”ì¸ ì»¨í…ì¸  ì˜ì—­ */}
      <div className={styles.mainContent}>
        {/* ìƒë‹¨ í—¤ë” */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.headerTitle}>MinTrend History</h1>
              <p className={styles.headerSubtitle}>{new Date().toLocaleString('ko-KR')}</p>
            </div>

            <div className={styles.headerActions}>
              {/* ì•Œë¦¼ ì•„ì´ì½˜ */}
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

              {/* ê´€ë¦¬ìž í”„ë¡œí•„ */}
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

        {/* ížˆìŠ¤í† ë¦¬ ë©”ì¸ */}
        <main className={styles.historyMain}>
          <div className={styles.historyContent}>
            {/* í•„í„° ì„¹ì…˜ */}
            <section className={styles.filterSection}>
              <div className={styles.filterHeader}>
                <button
                  className={styles.filterToggle}
                  onClick={() => setState(prev => ({
                    ...prev,
                    showFilters: !prev.showFilters
                  }))}
                >
                  <Filter size={16} />
                  <span>Date Filter</span>
                  <ChevronRight
                    size={16}
                    className={`${styles.filterIcon} ${state.showFilters ? styles.open : ''}`}
                  />
                </button>

                <button
                  className={styles.resetButton}
                  onClick={resetFilters}
                >
                  <RotateCcw size={14} />
                  Reset to Today
                </button>
              </div>

              {state.showFilters && (
                <div className={styles.filterContent}>
                  {/* ë…„ë„ ì„ íƒ */}
                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Year</label>
                    <select
                      className={styles.filterSelect}
                      value={state.filters.year}
                      onChange={(e) => updateFilter('year', parseInt(e.target.value))}
                    >
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}ë…„</option>
                      ))}
                    </select>
                  </div>

                  {/* ì›” ì„ íƒ */}
                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Month</label>
                    <select
                      className={styles.filterSelect}
                      value={state.filters.month}
                      onChange={(e) => updateFilter('month', parseInt(e.target.value))}
                    >
                      {monthOptions.map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* ì¼ ì„ íƒ */}
                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Day</label>
                    <select
                      className={styles.filterSelect}
                      value={state.filters.day}
                      onChange={(e) => updateFilter('day', parseInt(e.target.value))}
                    >
                      {dayOptions.map(day => (
                        <option key={day} value={day}>{day}ì¼</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>&nbsp;</label>
                    <button
                      className={styles.applyButton}
                      onClick={applyFilters}
                      disabled={state.isLoading}
                    >
                      <Search size={14} />
                      Apply Filter
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* ì—ëŸ¬ ë©”ì‹œì§€ */}
            {state.error && (
              <div className={styles.error}>
                {state.error}
              </div>
            )}

            {/* ë ˆì½”ë“œ ì„¹ì…˜ */}
            <section className={styles.recordsSection}>
              <div className={styles.recordsHeader}>
                <h2 className={styles.recordsTitle}>Sensor Records</h2>
                <p className={styles.recordsSubtitle}>
                  {state.selectedDate 
                    ? `${MinTrendHistoryUtils.formatDateToString(state.selectedDate)} ì˜ ì„¼ì„œ ë°ì´í„°`
                    : ''
                  }
                </p>
              </div>

              {state.isLoading && state.data.length === 0 ? (
                <div className={styles.loading}>
                  <div className={styles.loadingSpinner}></div>
                  <span className={styles.loadingText}></span>
                </div>
              ) : state.data.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <FileText size={24} />
                  </div>
                  <div className={styles.emptyStateTitle}></div>
                  <div className={styles.emptyStateDescription}>
                  </div>
                </div>
              ) : (
                <div className={styles.recordsList}>
                  {state.data.map((record, index) => (
                    <RecordItem key={`${record.filename}-${index}`} record={record} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MinTrendHistoryScreen;