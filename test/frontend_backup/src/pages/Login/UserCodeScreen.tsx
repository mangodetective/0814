// // UserCodeScreen.tsx - 사용자 코드 입력 화면
// import React, { useState } from 'react';

// interface UserCodeScreenProps {
//   onCodeSuccess: () => void;
//   onGoBack: () => void;
// }

// const UserCodeScreen: React.FC<UserCodeScreenProps> = ({ onCodeSuccess, onGoBack }) => {
//   const [code, setCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   // 유효한 코드 목록 (실제로는 서버에서 검증해야 함)
//   const validCodes = ['USER001', 'USER002', 'USER003', 'DEMO2024'];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!code.trim()) {
//       setError('코드를 입력해주세요.');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     // 코드 검증 시뮬레이션 (실제로는 API 호출)
//     setTimeout(() => {
//       if (validCodes.includes(code.toUpperCase())) {
//         // 코드가 유효한 경우
//         onCodeSuccess();
//       } else {
//         // 코드가 유효하지 않은 경우
//         setError('유효하지 않은 코드입니다. 다시 시도해주세요.');
//       }
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCode(e.target.value.toUpperCase());
//     setError('');
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//     }}>
//       <div style={{
//         background: 'white',
//         borderRadius: '16px',
//         padding: '48px',
//         boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//         maxWidth: '400px',
//         width: '100%',
//         margin: '20px'
//       }}>
//         {/* 헤더 */}
//         <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//           <div style={{
//             width: '64px',
//             height: '64px',
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             borderRadius: '16px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             margin: '0 auto 16px auto',
//             fontSize: '24px'
//           }}>
//             🔑
//           </div>
//           <h1 style={{
//             fontSize: '24px',
//             fontWeight: '700',
//             color: '#1a202c',
//             margin: '0 0 8px 0'
//           }}>
//             사용자 코드 입력
//           </h1>
//           <p style={{
//             color: '#718096',
//             fontSize: '14px',
//             margin: 0
//           }}>
//             관리자로부터 받은 접근 코드를 입력해주세요
//           </p>
//         </div>

//         {/* 코드 입력 폼 */}
//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: '24px' }}>
//             <label style={{
//               display: 'block',
//               fontSize: '14px',
//               fontWeight: '500',
//               color: '#374151',
//               marginBottom: '8px'
//             }}>
//               접근 코드
//             </label>
//             <input
//               type="text"
//               value={code}
//               onChange={handleInputChange}
//               placeholder="코드를 입력하세요 (예: USER001)"
//               style={{
//                 width: '100%',
//                 padding: '12px 16px',
//                 border: '2px solid #e2e8f0',
//                 borderRadius: '8px',
//                 fontSize: '16px',
//                 fontFamily: 'monospace',
//                 letterSpacing: '2px',
//                 textAlign: 'center',
//                 textTransform: 'uppercase',
//                 outline: 'none',
//                 transition: 'border-color 0.2s',
//                 ...(error && { borderColor: '#e53e3e' })
//               }}
//               onFocus={(e) => {
//                 e.target.style.borderColor = '#667eea';
//               }}
//               onBlur={(e) => {
//                 if (!error) {
//                   e.target.style.borderColor = '#e2e8f0';
//                 }
//               }}
//             />
//             {error && (
//               <p style={{
//                 color: '#e53e3e',
//                 fontSize: '12px',
//                 marginTop: '4px',
//                 margin: '4px 0 0 0'
//               }}>
//                 {error}
//               </p>
//             )}
//           </div>

//           {/* 버튼들 */}
//           <div style={{ display: 'flex', gap: '12px' }}>
//             <button
//               type="button"
//               onClick={onGoBack}
//               disabled={isLoading}
//               style={{
//                 flex: 1,
//                 padding: '12px',
//                 border: '2px solid #e2e8f0',
//                 borderRadius: '8px',
//                 background: 'white',
//                 color: '#374151',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 cursor: isLoading ? 'not-allowed' : 'pointer',
//                 opacity: isLoading ? 0.6 : 1,
//                 transition: 'all 0.2s'
//               }}
//               onMouseEnter={(e) => {
//                 if (!isLoading) {
//                   e.currentTarget.style.backgroundColor = '#f7fafc';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = 'white';
//               }}
//             >
//               뒤로가기
//             </button>
            
//             <button
//               type="submit"
//               disabled={isLoading || !code.trim()}
//               style={{
//                 flex: 2,
//                 padding: '12px',
//                 border: 'none',
//                 borderRadius: '8px',
//                 background: isLoading || !code.trim() 
//                   ? '#a0aec0' 
//                   : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 color: 'white',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 cursor: isLoading || !code.trim() ? 'not-allowed' : 'pointer',
//                 transition: 'all 0.2s',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '8px'
//               }}
//             >
//               {isLoading ? (
//                 <>
//                   <div style={{
//                     width: '16px',
//                     height: '16px',
//                     border: '2px solid rgba(255,255,255,0.3)',
//                     borderTop: '2px solid white',
//                     borderRadius: '50%',
//                     animation: 'spin 1s linear infinite'
//                   }} />
//                   확인 중...
//                 </>
//               ) : (
//                 '접속하기'
//               )}
//             </button>
//           </div>
//         </form>

//         {/* 도움말 */}
//         <div style={{
//           marginTop: '24px',
//           padding: '16px',
//           background: '#f7fafc',
//           borderRadius: '8px',
//           border: '1px solid #e2e8f0'
//         }}>
//           <p style={{
//             fontSize: '12px',
//             color: '#718096',
//             margin: 0,
//             lineHeight: '1.5'
//           }}>
//             💡 <strong>도움말:</strong><br />
//             • 접근 코드는 시스템 관리자로부터 받을 수 있습니다<br />
//             • 코드는 대문자로 입력해주세요<br />
//             • 문제가 있다면 관리자에게 문의하세요
//           </p>
//         </div>
//       </div>

//       {/* CSS 애니메이션을 위한 스타일 */}
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default UserCodeScreen;

// pages/UserCode/UserCodeScreen.tsx - 사용자 코드 입력 화면
import React, { useState } from 'react';
import styles from './UserCodeScreen.module.css';

interface UserCodeScreenProps {
  onCodeSuccess: () => void;
  onGoBack: () => void;
}

const UserCodeScreen: React.FC<UserCodeScreenProps> = ({ onCodeSuccess, onGoBack }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 유효한 코드 목록 (실제로는 서버에서 검증해야 함)
  const validCodes = ['USER001', 'USER002', 'USER003', 'DEMO2024'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    // 코드 검증 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      if (validCodes.includes(code.toUpperCase())) {
        onCodeSuccess();
      } else {
        setError('유효하지 않은 코드입니다. 다시 시도해주세요.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase());
    setError('');
  };

  return (
    <div className={styles.container}>
      {/* 배경 패턴 */}
      <div className={styles.backgroundPattern} aria-hidden="true">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geometric" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20,20 L80,20 L50,80 Z" fill="none" stroke="#667eea" strokeWidth="1" opacity="0.1"/>
              <circle cx="80" cy="80" r="15" fill="none" stroke="#764ba2" strokeWidth="1" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geometric)"/>
          <path d="M100,500 Q300,300 500,500 T900,500" stroke="#667eea" strokeWidth="2" fill="none" opacity="0.2"/>
        </svg>
      </div>

      {/* 헤더 */}
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

      {/* 메인 카드 */}
      <div className={styles.card}>
        {/* 뒤로가기 버튼 */}
        <button 
          type="button"
          className={styles.backButton}
          onClick={onGoBack}
          disabled={isLoading}
        >
          ← 역할 선택으로 돌아가기
        </button>

        {/* 역할 표시기 */}
        <div className={styles.roleIndicator}>
          <span className={styles.roleLabel}>선택된 역할:</span>
          <span className={styles.roleValue}>사용자</span>
        </div>

        {/* 헤더 */}
        <div className={styles.cardHeader}>
          <div className={styles.iconContainer}>
            <span className={styles.icon}>🔑</span>
          </div>
          <h1 className={styles.title}>사용자 코드 입력</h1>
          <p className={styles.subtitle}>관리자로부터 받은 접근 코드를 입력해주세요</p>
        </div>

        {/* 코드 입력 폼 */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>접근 코드</label>
            <input
              type="text"
              value={code}
              onChange={handleInputChange}
              placeholder="코드를 입력하세요 (예: USER001)"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              disabled={isLoading}
            />
            {error && (
              <p className={styles.errorMessage}>{error}</p>
            )}
          </div>

          {/* 버튼들 */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onGoBack}
              disabled={isLoading}
              className={styles.secondaryButton}
            >
              뒤로가기
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className={styles.primaryButton}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  확인 중...
                </>
              ) : (
                '접속하기'
              )}
            </button>
          </div>
        </form>

        {/* 도움말 */}
        <div className={styles.helpSection}>
          <h3 className={styles.helpTitle}>💡 도움말</h3>
          <ul className={styles.helpList}>
            <li>접근 코드는 시스템 관리자로부터 받을 수 있습니다</li>
            <li>코드는 대문자로 입력해주세요</li>
            <li>문제가 있다면 관리자에게 문의하세요</li>
            <li><strong>테스트 코드:</strong> USER001, DEMO2024</li>
          </ul>
        </div>
      </div>

      {/* 푸터 */}
      <footer className={styles.footer}>2025 GBSA AWS</footer>
    </div>
  );
};

export default UserCodeScreen;