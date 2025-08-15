import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import styles from './SensorChart.module.css';

// 내부 데이터 키(백엔드/상위 allSensorData 키)
type MetricKey = 'temperature' | 'humidity' | 'gas'; // gas == CO2

// 드롭다운에 보여줄 라벨과 내부 키 매핑
const METRIC_OPTIONS: { key: MetricKey; label: string }[] = [
  { key: 'temperature', label: 'Temperature' },
  { key: 'humidity',    label: 'Humidity' },
  { key: 'gas',         label: 'CO2 Concentration' },
];

// (선택) 제목의 꼬리말 - 현재/시간평균을 여기서 제어하고 싶으면 값만 바꿔주세요.
const DATA_KIND_TAIL = 'TIMEAVERAGED DATA'; // 'CURRENT DATA' 로 바꾸면 현재값용 타이틀이 됩니다.

interface SensorChartProps {
  sensorData?: ProcessedSensorData;
  onRefresh?: () => void;
}

/* ----------------- 헬퍼: 키 매핑 ----------------- */
// 선택 키로 allSensorData에서 실제 항목을 찾는다.
// gas ↔ co2, 대/소문자/TitleCase/별칭 모두 대응
function pickCurrent(
  all: Record<string, any> | undefined,
  selected: MetricKey
) {
  if (!all) return null;

  const aliases = [
    selected,                              // temperature / humidity / gas
    selected.toUpperCase(),                // TEMPERATURE / HUMIDITY / GAS
    selected === 'gas' ? 'co2' : selected, // gas -> co2
    selected === 'gas' ? 'CO2' : selected.toUpperCase(), // gas -> CO2
    selected.charAt(0).toUpperCase() + selected.slice(1), // Temperature 등
  ];

  for (const k of aliases) {
    if (k in all) return (all as any)[k];
  }
  return null;
}

/* ----------------- 헬퍼: 다양한 history 대응 ----------------- */
// history / avgHistory / timeAveraged / items 등 유연 대응
function toChartRowsFlexible(sd: any) {
  if (!sd) return [];

  // 1) 표준
  if (Array.isArray(sd.history)) {
    return sd.history
      .map((h: any) => ({
        time: h.timestamp?.slice?.(11, 16) ?? h.timestamp,
        value: Number(h.value),
      }))
      .filter((r: any) => Number.isFinite(r.value));
  }

  // 2) avgHistory
  if (Array.isArray(sd.avgHistory)) {
    return sd.avgHistory
      .map((h: any) => ({
        time: h.timestamp?.slice?.(11, 16) ?? h.timestamp,
        value: Number(h.value),
      }))
      .filter((r: any) => Number.isFinite(r.value));
  }

  // 3) timeAveraged / items
  const nested =
    sd.timeAveraged?.items ??
    sd.timeAveraged ??
    sd.items;

  if (Array.isArray(nested)) {
    return nested
      .map((h: any) => ({
        time: h.timestamp?.slice?.(11, 16) ?? h.timestamp,
        value: Number(h.value ?? h.avg ?? h.mean ?? h.y),
      }))
      .filter((r: any) => Number.isFinite(r.value));
  }

  return [];
}

/* ----------------- 포맷/라벨 ----------------- */
function unitOf(sel: MetricKey) {
  if (sel === 'gas') return 'ppm';
  if (sel === 'humidity') return '%';
  return '°C';
}
function headOf(sel: MetricKey) {
  if (sel === 'gas') return 'CO2 CONCENTRATION';
  if (sel === 'humidity') return 'HUMIDITY';
  return 'TEMPERATURE';
}

/* ----------------- 컴포넌트 ----------------- */
const SensorChart: React.FC<SensorChartProps> = ({
  allSensorData,
  defaultMetric = 'temperature',
  titleOverride,
}) => {
  // ▼ 드롭다운(Temperature / Humidity / CO2 Concentration)
  const [metric, setMetric] = useState<MetricKey>(defaultMetric);
  const [isOpen, setIsOpen] = useState(false);

  const current = useMemo(
    () => pickCurrent(allSensorData, metric),
    [allSensorData, metric]
  );
  const rows = useMemo(
    () => toChartRowsFlexible(current),
    [current]
  );

  const yUnit = unitOf(metric);
  const sectionTitle = titleOverride ?? `${headOf(metric)} ${DATA_KIND_TAIL}`;

  const toggleDropdown = () => setIsOpen((v) => !v);
  const handleSelect = (key: MetricKey) => {
    setMetric(key);
    setIsOpen(false);
  };

  // 현재 선택된 항목의 라벨
  const selectedLabel = METRIC_OPTIONS.find(o => o.key === metric)?.label ?? 'Temperature';


  return (
    <section className={styles.chartSection}>
      {/* 헤더: 제목 */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
        </div>

        {/* 제목과 약간 간격을 두고, 오른쪽 정렬된 ▼ 박스 */}
        <div className={styles.kindRow}>
          <div
            className={styles.dropdown}
            onClick={toggleDropdown}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span>{selectedLabel}</span>
            <ChevronDown size={16} className={isOpen ? styles.chevronOpen : ''} />
          </div>

          {isOpen && (
            <div className={styles.dropdownMenu} role="listbox">
              {METRIC_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  className={styles.dropdownItem}
                  onClick={() => handleSelect(opt.key)}
                  role="option"
                  aria-selected={metric === opt.key}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 차트 */}
      <div className={styles.chartCard}>
        {rows.length === 0 ? (
          <div className={styles.emptyState}>차트 데이터가 아직 없습니다.</div>
        ) : (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis tickFormatter={(v) => `${v}`} />
                <Tooltip
                  formatter={(v: any) => `${v} ${yUnit}`}
                  labelFormatter={(label: string) => `시간: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
};

const SensorChart: React.FC<SensorChartProps> = ({
  sensorData,
  onRefresh,
}) => {
  // 복잡한 데이터 매핑 로직 제거
  // 단순한 구조로 변경
  
  const chartData = useMemo(() => {
    if (!sensorData) return [];
    
    return [
      {
        name: 'Current',
        temperature: sensorData.temperature.value,
        humidity: sensorData.humidity.value,
        gas: sensorData.gas.value,
      }
    ];
  }, [sensorData]);

  return (
    <div className={styles.chartSection}>
      {/* 차트 렌더링 */}
    </div>
  );
};

export default SensorChart;
