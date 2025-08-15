/**
 * ═══════════════════════════════════════════════════════════════
 * 🔐 LoginScreen - 2단계 인증 로그인 시스템
 * ═══════════════════════════════════════════════════════════════
 * 
 * 주요 기능:
 * - 이메일/비밀번호 기반 1차 인증
 * - 이메일 인증 코드를 통한 2차 인증 (6자리 숫자)
 * - 역할 기반 접근 제어 (관리자/사용자)
 * - 자동 로그인 유지 옵션
 * - 반응형 UI 및 접근성 지원
 * 
 * API 연동:
 * - loginApi: 이메일/비밀번호 1차 인증
 * - verifyCodeApi: 인증 코드 2차 검증
 * - requestCodeApi: 새 인증 코드 요청
 * 
 * 인증 흐름:
 * 1. 사용자가 이메일/비밀번호 입력
 * 2. 1차 인증 성공 시 이메일로 6자리 코드 발송
 * 3. 사용자가 인증 코드 입력
 * 4. 2차 인증 성공 시 메인 시스템 접근 허용
 */

import React, { useState, useEffect } from "react";
import styles from "./AuthSystem.module.css";
import {
  loginApi,
  verifyCodeApi,
  requestCodeApi,
  LoginFormData,
  CodeFormData,
} from "./authApi";

/**
 * 🎭 인증 시스템 Props 타입 정의
 * 부모 컴포넌트에서 역할 정보와 성공 콜백을 전달받음
 */
interface AuthSystemProps {
  onLoginSuccess?: () => void;              // 로그인 성공 시 호출될 콜백 함수
  selectedRole?: 'admin' | 'user' | null;  // 사전 선택된 사용자 역할
}

/**
 * 🎯 메인 인증 시스템 컴포넌트
 * 2단계 인증 흐름을 관리하는 중앙 컴포넌트
 */
const AuthSystem: React.FC<AuthSystemProps> = ({ 
  onLoginSuccess,     // 로그인 성공 시 콜백
  selectedRole        // 선택된 사용자 역할
}) => {
  /**
   * 📋 인증 상태 관리
   * 2단계 인증 과정과 폼 데이터를 관리
   */
  const [currentStep, setCurrentStep] = useState<"login" | "code">("login");  // 현재 인증 단계
  
  // 1차 인증 폼 데이터 (이메일/비밀번호)
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "esteban_schiller@gmail.com",    // 개발용 기본값
    password: "",
    rememberMe: false,
  });
  
  // 2차 인증 폼 데이터 (6자리 코드)
  const [codeForm, setCodeForm] = useState<CodeFormData>({ code: "" });
  
  /**
   * 🔄 UI 상태 관리
   * 로딩, 에러, 성공 메시지 상태
   */
  const [loading, setLoading] = useState(false);    // API 호출 로딩 상태
  const [error, setError] = useState("");           // 에러 메시지
  const [success, setSuccess] = useState("");       // 성공 메시지

  /**
   * 🎭 역할 기반 UI 메시지 생성 함수들
   * 선택된 역할(관리자/사용자)에 따라 적절한 메시지를 표시
   */
  
  /** 역할별 환영 메시지 */
  const getRoleWelcomeMessage = () => {
    if (selectedRole === 'admin') {
      return '관리자 로그인';
    } else if (selectedRole === 'user') {
      return '사용자 로그인';
    }
    return 'Login';
  };

  /** 역할별 설명 메시지 */
  const getRoleSubtitle = () => {
    if (selectedRole === 'admin') {
      return 'Please enter your admin credentials to continue';
    } else if (selectedRole === 'user') {
      return 'Please enter your user credentials to continue';
    }
    return 'Please enter your email and password to continue';
  };

  /**
   * 📝 폼 검증 함수들
   * 사용자 입력의 유효성을 실시간으로 검증
   */
  
  /** 로그인 폼 유효성 검증 */
  const isLoginValid =
    loginForm.email.trim() !== "" &&        // 이메일 필드가 비어있지 않음
    loginForm.password.trim() !== "" &&     // 비밀번호 필드가 비어있지 않음
    loginForm.email.includes("@");          // 기본적인 이메일 형식 검증

  /** 인증 코드 유효성 검증 (6자리 숫자) */
  const isCodeValid = codeForm.code.length === 6 && /^\d{6}$/.test(codeForm.code);

  /**
   * 🔐 1차 인증 처리 함수 (이메일/비밀번호)
   * 
   * API 연동 상세:
   * - POST /auth/login 엔드포인트 호출
   * - 성공 시 이메일로 6자리 인증 코드 발송
   * - 실패 시 사용자에게 에러 메시지 표시
   */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginValid) return;    // 폼 검증 실패 시 중단

    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // 1차 인증 API 호출
      await loginApi(loginForm);
      setCurrentStep("code");     // 2차 인증 단계로 전환
      setSuccess("인증 코드가 이메일로 전송되었습니다.");
    } catch (err) {
      setError("이메일 또는 비밀번호가 잘못되었습니다.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔢 2차 인증 처리 함수 (6자리 코드)
   * 
   * API 연동 상세:
   * - POST /auth/verify-code 엔드포인트 호출
   * - 성공 시 메인 시스템 접근 권한 부여
   * - 성공 후 1.5초 딜레이 후 대시보드로 이동
   */
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeValid) return;     // 코드 형식 검증 실패 시 중단

    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // 2차 인증 API 호출
      await verifyCodeApi(codeForm);
      
      // 로그인 성공 처리
      setSuccess("로그인 성공! 대시보드로 이동합니다.");
      
      // 성공 메시지 표시 후 메인 화면으로 이동
      setTimeout(() => {
        onLoginSuccess?.();       // 부모 컴포넌트의 성공 콜백 호출
      }, 1500);
      
    } catch (err) {
      setError("코드가 유효하지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📨 새 인증 코드 요청 함수
   * 
   * API 연동 상세:
   * - POST /auth/request-code 엔드포인트 호출
   * - 새로운 6자리 코드를 이메일로 재발송
   * - 기존 코드 입력 필드 초기화
   */
  const handleRequestCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // 새 코드 요청 API 호출
      await requestCodeApi();
      setSuccess("새로운 인증 코드가 전송되었습니다.");
      setCodeForm({ code: "" });  // 입력 필드 초기화
    } catch (err) {
      setError("코드 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ⬅️ 역할 선택 화면으로 돌아가기
   * 로그인 화면에서 이전 단계로 돌아가는 기능
   */
  const handleBackToRoleSelection = () => {
    // TODO: 실제 프로덕션에서는 라우터를 통한 네비게이션 구현 필요
    // 현재는 페이지 새로고침으로 임시 처리
    window.location.reload();
  };

  const renderLoginForm = () => (
    <div className={styles.authContainer}>
      <div className={styles.authPanel}>
        {/* 뒤로가기 버튼 */}
        <button 
          type="button"
          className={styles.backButton}
          onClick={handleBackToRoleSelection}
          disabled={loading}
        >
          ← 역할 선택으로 돌아가기
        </button>

        <h2 className={styles.authTitle}>{getRoleWelcomeMessage()}</h2>
        <p className={styles.authSubtitle}>{getRoleSubtitle()}</p>

        {selectedRole && (
          <div className={styles.roleIndicator}>
            <span className={styles.roleLabel}>선택된 역할:</span>
            <span className={`${styles.roleValue} ${styles[selectedRole]}`}>
              {selectedRole === 'admin' ? '관리자' : '사용자'}
            </span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email address:</label>
            <input
              type="email"
              className={`${styles.formInput} ${loginForm.email ? styles.filled : ""}`}
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Password
              <a href="#" className={styles.forgotPassword}>Forget Password?</a>
            </label>
            <input
              type="password"
              className={`${styles.formInput} ${loginForm.password ? styles.filled : ""}`}
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="rememberMe"
              className={styles.checkbox}
              checked={loginForm.rememberMe}
              onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
            />
            <label htmlFor="rememberMe" className={styles.checkboxLabel}>Remember Password</label>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={!isLoginValid || loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className={styles.createAccount}>
          Don't have an account? <a href="#">Create Account</a>
        </div>
      </div>

      <div className={styles.sidePanel}></div>
    </div>
  );

  const renderCodeForm = () => (
    <div className={styles.authContainer}>
      <div className={styles.sidePanel}></div>

      <div className={styles.authPanel}>
        <h2 className={styles.authTitle}>ENTER THE CODE</h2>
        <p className={styles.authSubtitle}>Please input the authentication code to continue</p>

        {selectedRole && (
          <div className={styles.roleIndicator}>
            <span className={styles.roleLabel}>로그인 중:</span>
            <span className={`${styles.roleValue} ${styles[selectedRole]}`}>
              {selectedRole === 'admin' ? '관리자' : '사용자'}
            </span>
          </div>
        )}

        <form onSubmit={handleCodeSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Code</label>
            <input
              type="text"
              className={`${styles.formInput} ${styles.codeInput} ${codeForm.code ? styles.filled : ""}`}
              value={codeForm.code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCodeForm({ code: value });
              }}
              placeholder="000000"
              maxLength={6}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <button type="submit" className={`${styles.btn} ${styles.btnSecondary}`} disabled={!isCodeValid || loading}>
            {loading ? "Verifying..." : "Verification"}
          </button>
        </form>

        <div className={styles.requestCode}>
          Don't have a code? <a href="#" onClick={handleRequestCode}>Request Code</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${styles.container} ${loading ? styles.loading : ""}`}>
      {/* 배경 패턴 */}
      <div className={styles.backgroundPattern} aria-hidden="true">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geometric" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20,20 L80,20 L50,80 Z" fill="none" stroke="#f39c12" strokeWidth="1" opacity="0.1"/>
              <circle cx="80" cy="80" r="15" fill="none" stroke="#3498db" strokeWidth="1" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geometric)"/>
          <path d="M100,500 Q300,300 500,500 T900,500" stroke="#f39c12" strokeWidth="2" fill="none" opacity="0.2"/>
          <path d="M200,200 L400,300 L600,200 L800,300" stroke="#e67e22" strokeWidth="1" fill="none" opacity="0.3"/>
        </svg>
      </div>

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>AWS²</span>
          <div className={styles.logoGiot}>
            GIOT
            <div className={styles.wifiIcon}></div>
          </div>
        </div>
        <div className={styles.subtitle}>Air Watch System</div>
      </header>

      {currentStep === "login" ? renderLoginForm() : renderCodeForm()}

      <footer className={styles.footer}>2025 GBSA AWS</footer>
    </div>
  );
};

export default AuthSystem;