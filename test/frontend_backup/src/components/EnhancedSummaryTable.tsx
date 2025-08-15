// src/components/EnhancedSummaryTable.tsx
import React from 'react';
import { useMintrend } from '../pages/Dashboard/hooks/useMintrend';
import { SummaryTable } from '../pages/Dashboard/components/SummaryTable';

/**
 * EnhancedSummaryTable
 * - 대시보드 훅에서 받은 데이터를 SummaryTable에 전달
 * - 타입 차이는 일단 캐스팅으로 브릿지 (UI 확인/빌드 우선)
 */
const EnhancedSummaryTable: React.FC = () => {
  const { allSensorData, s3CurrentTime } = useMintrend();

  return (
    <SummaryTable
      // NOTE: 현재 allSensorData의 런타임 구조는 정상이나,
      // SummaryTable의 타입 정의(AllMap)과 다르므로 임시 캐스팅
      allSensorData={allSensorData as unknown as any}
      timestampText={s3CurrentTime || 'Loading...'}
    />
  );
};

export default EnhancedSummaryTable;
