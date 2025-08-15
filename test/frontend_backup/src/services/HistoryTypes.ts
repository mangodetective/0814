// src/services/HistoryTypes.ts

// ---------- Types ----------
export type Status = 'GOOD' | 'NORMAL' | 'WARNING';

/** Calendar.tsx */
export interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
}
export interface CalendarProps {
  selectedDate?: Date | null;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  onCheckNow: () => void;
}

/** 공통 필터/상태 */
export interface HistoryFilters {
  date?: string | null;
  sensorType?: string | null;
  status?: Status | null;
}

export interface HistoryState {
  isLoading: boolean;
  error: string | null;
  showFilters: boolean;
  showDatePicker: boolean;         // ← 훅 초기값에 꼭 넣어주세요
  selectedDate: Date | null;
  filters: HistoryFilters;
  events: any[];
  totalPages: number;
  currentPage: number;
}

/** HistoryFilter.tsx */
export interface HistoryFilterProps {
  historyState: HistoryState;
  activeDropdown: string | null;
  setActiveDropdown: (key: string | null) => void;
  updateFilter: (key: keyof HistoryFilters, value: string | null) => void;
  resetFilters: () => void;
  handleDateSelect: (date: Date) => void;
  applyFilters: () => void;
  toggleFilters: () => void;
}

/** HistoryTable.tsx */
export interface HistoryTableProps {
  historyState: {
    isLoading: boolean;
    events: any[];
    totalPages: number;
    currentPage: number;
  };
  changePage: (page: number) => void;
}

/** HistoryScreen.tsx */
export interface HistoryScreenProps {
  onNavigateBack: () => void;
  onNavigateToChatbot: () => void;
  onNavigateToHistory: () => void;
  onNavigateToRole?: () => void;
  onNavigateToDashboard: () => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

/** 공통 알림 */
export interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}
export interface NotificationData {
  count: number;
  notifications: NotificationItem[];
}

// ---------- Utils ----------
// (선택) 유틸 타입 정의를 쓰고 있다면 이렇게 넓혀주세요
export interface HistoryUtilsType {
  formatDate: (input?: Date | string | number | null) => string;
  formatDateToString: (date?: Date | string | number | null) => string;
  formatTimestamp: (input?: Date | string | number | null) => string;
  getSensorUnit: (sensorType?: string | null) => '°C' | '%' | 'ppm' | '';
  getStatusClass: (status?: string | null) => 'good' | 'warning' | 'normal';
}

// 공용: 안전하게 Date로 바꿔주는 헬퍼
const toDate = (input?: Date | string | number | null): Date | null => {
  if (input == null) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d;
};

export const HistoryUtils: HistoryUtilsType = {
  /** 'YYYY-MM-DD' */
  formatDate(input) {
    const d = toDate(input);
    if (!d) return ''; // ← 안전 가드
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  /** 날짜 라벨용 */
  formatDateToString(date) {
    return this.formatDate(date) || '-';
  },

  /** 'YYYY-MM-DD HH:mm' */
  formatTimestamp(input) {
    const d = toDate(input);
    if (!d) return '-'; // ← 안전 가드
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}`;
  },

  getSensorUnit(sensorType) {
    switch ((sensorType || '').toUpperCase()) {
      case 'TEMP':
      case 'TEMPERATURE':
        return '°C';
      case 'HUMI':
      case 'HUMIDITY':
        return '%';
      case 'GAS':
      case 'VOC':
      case 'GASCONCENTRATION':
        return 'ppm';
      default:
        return '';
    }
  },

  getStatusClass(status) {
    const s = (status || '').toUpperCase();
    if (s === 'GOOD') return 'good';
    if (s === 'WARNING') return 'warning';
    return 'normal';
  },
};



// ---------- API (mock) ----------
export const HistoryAPI = {
  async fetchEvents(filters: HistoryFilters, page: number): Promise<{ events: any[]; totalPages: number }> {
    // TODO: 실제 API 연동 시 교체
    // 필터/페이지를 사용하여 서버에서 조회하는 형태를 가정
    const events = [
      { id: 'e1', date: filters.date ?? '2025-08-14', type: filters.sensorType ?? 'TEMP', status: filters.status ?? 'GOOD' },
      { id: 'e2', date: filters.date ?? '2025-08-14', type: filters.sensorType ?? 'HUMI', status: filters.status ?? 'NORMAL' },
    ];
    return { events, totalPages: 5 };
  },
};
