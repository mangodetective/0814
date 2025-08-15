// src/pages/Dashboard/components/SummaryTable.tsx
import React from 'react';
import styles from '../DashboardScreen.module.css';
import { DashboardUtils } from '../../../services/DashboardTypes';
import type { SensorType, SensorData } from '../../../services/DashboardTypes';

type AllMap = Record<SensorType, SensorData | null>;

export const SummaryTable: React.FC<{
  allSensorData: AllMap;
  timestampText: string; // s3CurrentTime ?? currentTime
}> = ({ allSensorData, timestampText }) => {
  return (
    <div className={styles.summaryCard}>
  <h3 className={styles.summaryTitle}>CURRENT DATA & PREDICTION DATA</h3>
  <table className={styles.summaryTable}>
        <thead>
          <tr>
            <th>TYPE</th>
            <th>TIMESTAMP</th>
            <th>TEMPERATURE</th>
            <th>HUMIDITY</th>
            <th>CO2 CONCENTRATION</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CURRENT DATA</td>
            <td>{timestampText}</td>
            <td>
              {allSensorData.temperature ? (
                <span className={DashboardUtils.getStatusClass(allSensorData.temperature.current.status)}>
                  {allSensorData.temperature.current.value.toFixed(1)}{allSensorData.temperature.unit}
                </span>
              ) : <span>로딩 중...</span>}
            </td>
            <td>
              {allSensorData.humidity ? (
                <span className={DashboardUtils.getStatusClass(allSensorData.humidity.current.status)}>
                  {allSensorData.humidity.current.value.toFixed(1)}{allSensorData.humidity.unit}
                </span>
              ) : <span>로딩 중...</span>}
            </td>
            <td>
              {allSensorData.gas ? (
                <span className={DashboardUtils.getStatusClass(allSensorData.gas.current.status)}>
                  {allSensorData.gas.current.value.toFixed(0)}{allSensorData.gas.unit}
                </span>
              ) : <span>로딩 중...</span>}
            </td>
          </tr>
          <tr>
            <td>PREDICTION DATA</td>
            <td>NEXT 1 HOUR (AVG)</td>
            <td>
              {allSensorData.temperature ? (
                <span>{allSensorData.temperature.prediction.value.toFixed(1)}{allSensorData.temperature.unit}</span>
              ) : <span>로딩 중...</span>}
            </td>
            <td>
              {allSensorData.humidity ? (
                <span>{allSensorData.humidity.prediction.value.toFixed(1)}{allSensorData.humidity.unit}</span>
              ) : <span>로딩 중...</span>}
            </td>
            <td>
              {allSensorData.gas ? (
                <span>{allSensorData.gas.prediction.value.toFixed(0)}{allSensorData.gas.unit}</span>
              ) : <span>로딩 중...</span>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
