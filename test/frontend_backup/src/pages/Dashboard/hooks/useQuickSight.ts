// src/pages/Dashboard/hooks/useQuickSight.ts
// QuickSight 대시보드 관리 커스텀 훅

import { useState, useCallback, useEffect } from 'react';
import { QuickSightService } from '../../../services/QuickSightService';
import {
  QuickSightDashboardResponse,
  QuickSightErrorResponse,
  InternalSensorType,
} from '../../../services/QuickSightTypes';

interface UseQuickSightState {
  dashboardData: QuickSightDashboardResponse | null;
  embedUrl: string | null;
  isLoading: boolean;
  error: string | null;
  isEmbedUrlValid: boolean;
}

interface UseQuickSightReturn extends UseQuickSightState {
  loadDashboard: (sensorType: InternalSensorType) => Promise<void>;
  refreshEmbedUrl: (sensorType: InternalSensorType) => Promise<void>;
  clearError: () => void;
}

export function useQuickSight(): UseQuickSightReturn {
  const [state, setState] = useState<UseQuickSightState>({
    dashboardData: null,
    embedUrl: null,
    isLoading: false,
    error: null,
    isEmbedUrlValid: false,
  });

  /**
   * 대시보드 로드 (임베드 URL 포함)
   */
  const loadDashboard = useCallback(async (sensorType: InternalSensorType) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null 
    }));

    try {
      const result = await QuickSightService.getDashboardByType(sensorType, true);
      
      if ('statusCode' in result) {
        // 오류 응답
        const errorResult = result as QuickSightErrorResponse;
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorResult.message || 'Unknown error occurred',
          dashboardData: null,
          embedUrl: null,
          isEmbedUrlValid: false,
        }));
        return;
      }

      // 성공 응답
      const successResult = result as QuickSightDashboardResponse;
      const isValid = QuickSightService.isEmbedUrlValid(
        successResult.embedUrl, 
        successResult.embedExpirationTime
      );

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        dashboardData: successResult,
        embedUrl: successResult.embedUrl || null,
        isEmbedUrlValid: isValid,
      }));

      console.log(`QuickSight 대시보드 로드 완료: ${QuickSightService.getSensorDisplayName(sensorType)}`);
      
    } catch (error) {
      console.error('QuickSight 대시보드 로드 실패:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        dashboardData: null,
        embedUrl: null,
        isEmbedUrlValid: false,
      }));
    }
  }, []);

  /**
   * 임베드 URL 갱신 (기존 대시보드 정보는 유지)
   */
  const refreshEmbedUrl = useCallback(async (sensorType: InternalSensorType) => {
    if (!state.dashboardData) {
      await loadDashboard(sensorType);
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null 
    }));

    try {
      const result = await QuickSightService.getDashboardByType(sensorType, true);
      
      if ('statusCode' in result) {
        const errorResult = result as QuickSightErrorResponse;
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorResult.message || 'Failed to refresh embed URL',
        }));
        return;
      }

      const successResult = result as QuickSightDashboardResponse;
      const isValid = QuickSightService.isEmbedUrlValid(
        successResult.embedUrl, 
        successResult.embedExpirationTime
      );

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        embedUrl: successResult.embedUrl || null,
        isEmbedUrlValid: isValid,
        // 대시보드 데이터는 기존 것 유지하거나 새 것으로 업데이트
        dashboardData: successResult,
      }));

      console.log('QuickSight 임베드 URL 갱신 완료');
      
    } catch (error) {
      console.error('QuickSight 임베드 URL 갱신 실패:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh embed URL',
      }));
    }
  }, [state.dashboardData, loadDashboard]);

  /**
   * 오류 상태 초기화
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * 임베드 URL 유효성 주기적 확인 (5분마다)
   */
  useEffect(() => {
    if (!state.embedUrl || !state.dashboardData) return;

    const checkInterval = setInterval(() => {
      const isValid = QuickSightService.isEmbedUrlValid(
        state.embedUrl!,
        state.dashboardData!.embedExpirationTime
      );

      if (!isValid && state.isEmbedUrlValid) {
        setState(prev => ({ 
          ...prev, 
          isEmbedUrlValid: false 
        }));
        console.warn('QuickSight 임베드 URL이 만료되었습니다.');
      }
    }, 5 * 60 * 1000); // 5분마다 확인

    return () => clearInterval(checkInterval);
  }, [state.embedUrl, state.dashboardData, state.isEmbedUrlValid]);

  return {
    ...state,
    loadDashboard,
    refreshEmbedUrl,
    clearError,
  };
}