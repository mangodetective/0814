// // // // App.tsx - 메인 애플리케이션 컴포넌트
// // // import React, { useState, useEffect } from 'react';
// // // import RoleSelectionScreen from './pages/RoleSelection/RoleSelectionScreen';
// // // import AuthSystem from './pages/Login/LoginScreen';
// // // import UserCodeEntry from './pages/Login/UserCodeScreen'; // 새로 만들 사용자 코드 입력 화면
// // // import DashboardScreen from './pages/Dashboard/DashboardScreen';
// // // import { RoleSelectUtils } from './services/RoleSelectionTypes';


// // // // 애플리케이션 라우트 타입
// // // type AppRoute = 'role' | 'adminLogin' | 'userCode' | 'dashboard' | 'chatbot' | 'history';

// // // // 선택된 역할 타입
// // // type UserRole = 'admin' | 'user';

// // // // 애플리케이션 상태 인터페이스
// // // interface AppState {
// // //   currentRoute: AppRoute;
// // //   selectedRole: UserRole | null;
// // //   isAuthenticated: boolean;
// // //   activeMenu: string;
// // // }

// // // const App: React.FC = () => {
// // //   const [appState, setAppState] = useState<AppState>({
// // //     currentRoute: 'role',
// // //     selectedRole: null,
// // //     isAuthenticated: false,
// // //     activeMenu: 'Dashboard'
// // //   });

// // //   // 컴포넌트 마운트 시 저장된 상태 확인
// // //   useEffect(() => {
// // //     const savedRole = RoleSelectUtils.getSavedRole();
// // //     const isLoggedIn = sessionStorage.getItem('isAuthenticated') === 'true';
    
// // //     if (savedRole && isLoggedIn) {
// // //       // 이미 로그인된 상태라면 대시보드로 직접 이동
// // //       setAppState({
// // //         currentRoute: 'dashboard',
// // //         selectedRole: savedRole,
// // //         isAuthenticated: true,
// // //         activeMenu: 'Dashboard'
// // //       });
// // //     } else if (savedRole) {
// // //       // 역할은 선택되었지만 로그인이 안된 상태라면 해당 역할의 인증 화면으로
// // //       const authRoute = savedRole === 'admin' ? 'adminLogin' : 'userCode';
// // //       setAppState(prev => ({
// // //         ...prev,
// // //         currentRoute: authRoute,
// // //         selectedRole: savedRole
// // //       }));
// // //     }
// // //   }, []);

// // //   // 역할 선택 완료 핸들러
// // //   const handleRoleSelected = (role: UserRole, redirect: AppRoute) => {
// // //     console.log(`역할 선택됨: ${role}, 리다이렉트: ${redirect}`);
    
// // //     // 역할에 따라 다른 인증 화면으로 라우팅
// // //     const authRoute = role === 'admin' ? 'adminLogin' : 'userCode';
    
// // //     setAppState(prev => ({
// // //       ...prev,
// // //       selectedRole: role,
// // //       currentRoute: authRoute
// // //     }));
// // //   };

// // //   // 관리자 로그인 성공 핸들러
// // //   const handleAdminLoginSuccess = () => {
// // //     console.log('관리자 로그인 성공');
    
// // //     // 인증 상태를 세션에 저장
// // //     sessionStorage.setItem('isAuthenticated', 'true');
    
// // //     setAppState(prev => ({
// // //       ...prev,
// // //       isAuthenticated: true,
// // //       currentRoute: 'dashboard'
// // //     }));
// // //   };

// // //   // 사용자 코드 입력 성공 핸들러
// // //   const handleUserCodeSuccess = () => {
// // //     console.log('사용자 코드 입력 성공');
    
// // //     // 인증 상태를 세션에 저장
// // //     sessionStorage.setItem('isAuthenticated', 'true');
    
// // //     setAppState(prev => ({
// // //       ...prev,
// // //       isAuthenticated: true,
// // //       currentRoute: 'dashboard'
// // //     }));
// // //   };

// // //   // 대시보드에서 다른 화면으로 네비게이션
// // //   const handleNavigateToRoute = (route: AppRoute) => {
// // //     setAppState(prev => ({
// // //       ...prev,
// // //       currentRoute: route,
// // //       activeMenu: route === 'dashboard' ? 'Dashboard' : 
// // //                   route === 'chatbot' ? 'Chatbot' :
// // //                   route === 'history' ? 'History' : prev.activeMenu
// // //     }));
// // //   };

// // //   // 로그아웃 핸들러 (역할 선택 화면으로 돌아가기)
// // //   const handleLogout = () => {
// // //     // 모든 세션 데이터 클리어
// // //     RoleSelectUtils.clearSavedRole();
// // //     sessionStorage.removeItem('isAuthenticated');
    
// // //     setAppState({
// // //       currentRoute: 'role',
// // //       selectedRole: null,
// // //       isAuthenticated: false,
// // //       activeMenu: 'Dashboard'
// // //     });
// // //   };

// // //   // 메뉴 상태 업데이트
// // //   const handleSetActiveMenu = (menu: string) => {
// // //     setAppState(prev => ({
// // //       ...prev,
// // //       activeMenu: menu
// // //     }));
// // //   };

// // //   // 현재 라우트에 따른 컴포넌트 렌더링
// // //   const renderCurrentScreen = () => {
// // //     switch (appState.currentRoute) {
// // //       case 'role':
// // //         return (
// // //           <RoleSelectionScreen 
// // //             onRoleSelected={handleRoleSelected}
// // //           />
// // //         );
      
// // //       case 'adminLogin':
// // //         return (
// // //           <AuthSystem 
// // //             onLoginSuccess={handleAdminLoginSuccess}
// // //             selectedRole={appState.selectedRole}
// // //           />
// // //         );
      
// // //       case 'userCode':
// // //         return (
// // //           <UserCodeEntry 
// // //             onCodeSuccess={handleUserCodeSuccess}
// // //             onGoBack={() => setAppState(prev => ({ ...prev, currentRoute: 'role' }))}
// // //           />
// // //         );
      
// // //       case 'dashboard':
// // //         return (
// // //           <DashboardScreen
// // //             onNavigateToChatbot={() => handleNavigateToRoute('chatbot')}
// // //             onNavigateToHistory={() => handleNavigateToRoute('history')}
// // //             onNavigateToRole={handleLogout}
// // //             activeMenu={appState.activeMenu}
// // //             setActiveMenu={handleSetActiveMenu}
// // //           />
// // //         );
      
// // //       case 'chatbot':
// // //         return (
// // //           <div style={{ 
// // //             display: 'flex', 
// // //             justifyContent: 'center', 
// // //             alignItems: 'center', 
// // //             height: '100vh',
// // //             flexDirection: 'column',
// // //             gap: '20px'
// // //           }}>
// // //             <h1>챗봇 화면</h1>
// // //             <p>현재 역할: {appState.selectedRole}</p>
// // //             <button onClick={() => handleNavigateToRoute('dashboard')}>
// // //               대시보드로 돌아가기
// // //             </button>
// // //           </div>
// // //         );
      
// // //       case 'history':
// // //         return (
// // //           <div style={{ 
// // //             display: 'flex', 
// // //             justifyContent: 'center', 
// // //             alignItems: 'center', 
// // //             height: '100vh',
// // //             flexDirection: 'column',
// // //             gap: '20px'
// // //           }}>
// // //             <h1>히스토리 화면</h1>
// // //             <p>현재 역할: {appState.selectedRole}</p>
// // //             <button onClick={() => handleNavigateToRoute('dashboard')}>
// // //               대시보드로 돌아가기
// // //             </button>
// // //           </div>
// // //         );
      
// // //       default:
// // //         return (
// // //           <RoleSelectionScreen 
// // //             onRoleSelected={handleRoleSelected}
// // //           />
// // //         );
// // //     }
// // //   };

// // //   return (
// // //     <div className="app">
// // //       {/* 개발용 디버그 정보 (프로덕션에서는 제거) */}
// // //       {process.env.NODE_ENV === 'development' && (
// // //         <div style={{
// // //           position: 'fixed',
// // //           top: 0,
// // //           right: 0,
// // //           background: 'rgba(0,0,0,0.8)',
// // //           color: 'white',
// // //           padding: '10px',
// // //           fontSize: '12px',
// // //           zIndex: 9999
// // //         }}>
// // //           <div>Route: {appState.currentRoute}</div>
// // //           <div>Role: {appState.selectedRole || 'None'}</div>
// // //           <div>Auth: {appState.isAuthenticated ? 'Yes' : 'No'}</div>
// // //           <div>Menu: {appState.activeMenu}</div>
// // //         </div>
// // //       )}
      
// // //       {renderCurrentScreen()}
// // //     </div>
// // //   );
// // // };

// // // export default App;

// // // // App.tsx - 메인 애플리케이션 컴포넌트
// // // import React, { useState, useEffect } from 'react';
// // // import RoleSelectionScreen from './pages/RoleSelection/RoleSelectionScreen';
// // // import AuthSystem from './pages/Login/LoginScreen';
// // // import DashboardScreen from './pages/Dashboard/DashboardScreen';
// // // import ChatbotScreen from './pages/Chatbot/ChatbotScreen';
// // // import HistoryScreen from './pages/History/HistoryScreen';
// // // import { RoleSelectUtils } from './services/RoleSelectionTypes';

// // // // 애플리케이션 라우트 타입
// // // type AppRoute = 'role' | 'adminLogin' | 'userCode' | 'dashboard' | 'chatbot' | 'history';

// // // // 선택된 역할 타입
// // // type UserRole = 'admin' | 'user';

// // // // 애플리케이션 상태 인터페이스
// // // interface AppState {
// // //   currentRoute: AppRoute;
// // //   selectedRole: UserRole | null;
// // //   isAuthenticated: boolean;
// // //   activeMenu: string;
// // // }

// // // // 임시 사용자 코드 입력 컴포넌트 (나중에 별도 파일로 분리)
// // // const TempUserCodeScreen: React.FC<{
// // //   onCodeSuccess: () => void;
// // //   onGoBack: () => void;
// // // }> = ({ onCodeSuccess, onGoBack }) => {
// // //   const [code, setCode] = useState('');
// // //   const [error, setError] = useState('');

// // //   const handleSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     // 간단한 코드 검증 (실제로는 서버 검증 필요)
// // //     if (code.toUpperCase() === 'USER001' || code.toUpperCase() === 'DEMO2024') {
// // //       onCodeSuccess();
// // //     } else {
// // //       setError('유효하지 않은 코드입니다.');
// // //     }
// // //   };

// // //   return (
// // //     <div style={{
// // //       minHeight: '100vh',
// // //       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// // //       display: 'flex',
// // //       alignItems: 'center',
// // //       justifyContent: 'center',
// // //       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
// // //     }}>
// // //       <div style={{
// // //         background: 'white',
// // //         borderRadius: '16px',
// // //         padding: '40px',
// // //         boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
// // //         maxWidth: '400px',
// // //         width: '100%'
// // //       }}>
// // //         <h1 style={{ textAlign: 'center', marginBottom: '24px', color: '#1a202c' }}>
// // //           사용자 코드 입력
// // //         </h1>
// // //         <form onSubmit={handleSubmit}>
// // //           <div style={{ marginBottom: '16px' }}>
// // //             <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
// // //               접근 코드
// // //             </label>
// // //             <input
// // //               type="text"
// // //               value={code}
// // //               onChange={(e) => {
// // //                 setCode(e.target.value.toUpperCase());
// // //                 setError('');
// // //               }}
// // //               placeholder="코드를 입력하세요"
// // //               style={{
// // //                 width: '100%',
// // //                 padding: '12px',
// // //                 border: '2px solid #e2e8f0',
// // //                 borderRadius: '8px',
// // //                 fontSize: '16px',
// // //                 textAlign: 'center',
// // //                 letterSpacing: '2px',
// // //                 ...(error && { borderColor: '#e53e3e' })
// // //               }}
// // //             />
// // //             {error && (
// // //               <p style={{ color: '#e53e3e', fontSize: '14px', marginTop: '4px' }}>
// // //                 {error}
// // //               </p>
// // //             )}
// // //           </div>
// // //           <div style={{ display: 'flex', gap: '12px' }}>
// // //             <button
// // //               type="button"
// // //               onClick={onGoBack}
// // //               style={{
// // //                 flex: 1,
// // //                 padding: '12px',
// // //                 border: '2px solid #e2e8f0',
// // //                 borderRadius: '8px',
// // //                 background: 'white',
// // //                 cursor: 'pointer'
// // //               }}
// // //             >
// // //               뒤로가기
// // //             </button>
// // //             <button
// // //               type="submit"
// // //               style={{
// // //                 flex: 2,
// // //                 padding: '12px',
// // //                 border: 'none',
// // //                 borderRadius: '8px',
// // //                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// // //                 color: 'white',
// // //                 cursor: 'pointer'
// // //               }}
// // //             >
// // //               접속하기
// // //             </button>
// // //           </div>
// // //         </form>
// // //         <p style={{ fontSize: '12px', color: '#718096', marginTop: '16px', textAlign: 'center' }}>
// // //           테스트 코드: USER001, DEMO2024
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const App: React.FC = () => {
// // //   const [appState, setAppState] = useState<AppState>({
// // //     currentRoute: 'role',
// // //     selectedRole: null,
// // //     isAuthenticated: false,
// // //     activeMenu: 'Dashboard'
// // //   });

// // //   // 컴포넌트 마운트 시 저장된 상태 확인
// // //   useEffect(() => {
// // //     const savedRole = RoleSelectUtils.getSavedRole();
// // //     const isLoggedIn = sessionStorage.getItem('isAuthenticated') === 'true';
    
// // //     if (savedRole && isLoggedIn) {
// // //       // 이미 로그인된 상태라면 대시보드로 직접 이동
// // //       setAppState({
// // //         currentRoute: 'dashboard',
// // //         selectedRole: savedRole,
// // //         isAuthenticated: true,
// // //         activeMenu: 'Dashboard'
// // //       });
// // //     } else if (savedRole) {
// // //       // 역할은 선택되었지만 로그인이 안된 상태라면 해당 역할의 인증 화면으로
// // //       const authRoute = savedRole === 'admin' ? 'adminLogin' : 'userCode';
// // //       setAppState(prev => ({
// // //         ...prev,
// // //         currentRoute: authRoute,
// // //         selectedRole: savedRole
// // //       }));
// // //     }
// // //   }, []);

// // //   // 역할 선택 완료 핸들러
// // //   const handleRoleSelected = (role: UserRole, redirect: AppRoute) => {
// // //     console.log(`🎯 역할 선택됨: ${role}, 리다이렉트: ${redirect}`);
    
// // //     // 역할에 따라 다른 인증 화면으로 라우팅
// // //     const authRoute = role === 'admin' ? 'adminLogin' : 'userCode';
// // //     console.log(`🚀 ${role} → ${authRoute} 라우팅`);
    
// // //     setAppState(prev => ({
// // //       ...prev,
// // //       selectedRole: role,
// // //       currentRoute: authRoute
// // //     }));
// // //   };

// // //   // 관리자 로그인 성공 핸들러
// // //   const handleAdminLoginSuccess = () => {
// // //     console.log('✅ 관리자 로그인 성공');
    
// // //     // 인증 상태를 세션에 저장
// // //     sessionStorage.setItem('isAuthenticated', 'true');
    
// // //     setAppState(prev => ({
// // //       ...prev,
// // //       isAuthenticated: true,
// // //       currentRoute: 'dashboard'
// // //     }));
// // //   };

// // //   // 사용자 코드 입력 성공 핸들러
// // //   const handleUserCodeSuccess = () => {
// // //     console.log('✅ 사용자 코드 입력 성공');
    
// // //     // 인증 상태를 세션에 저장
// // //     sessionStorage.setItem('isAuthenticated', 'true');
    
// // //     setAppState(prev => ({
// // //       ...prev,
// // //       isAuthenticated: true,
// // //       currentRoute: 'dashboard'
// // //     }));
// // //   };

// // //   // 대시보드에서 다른 화면으로 네비게이션
// // //   const handleNavigateToRoute = (route: AppRoute) => {
// // //     setAppState(prev => ({
// // //       ...prev,
// // //       currentRoute: route,
// // //       activeMenu: route === 'dashboard' ? 'Dashboard' : 
// // //                   route === 'chatbot' ? 'Chatbot' :
// // //                   route === 'history' ? 'History' : prev.activeMenu
// // //     }));
// // //   };

// // //   // 로그아웃 핸들러 (역할 선택 화면으로 돌아가기)
// // //   const handleLogout = () => {
// // //     // 모든 세션 데이터 클리어
// // //     RoleSelectUtils.clearSavedRole();
// // //     sessionStorage.removeItem('isAuthenticated');
    
// // //     setAppState({
// // //       currentRoute: 'role',
// // //       selectedRole: null,
// // //       isAuthenticated: false,
// // //       activeMenu: 'Dashboard'
// // //     });
// // //   };

// // //   // 메뉴 상태 업데이트
// // //   const handleSetActiveMenu = (menu: string) => {
// // //     setAppState(prev => ({
// // //       ...prev,
// // //       activeMenu: menu
// // //     }));
// // //   };

// // //   // 현재 라우트에 따른 컴포넌트 렌더링
// // //   const renderCurrentScreen = () => {
// // //     console.log(`🖥️ 렌더링: ${appState.currentRoute} (역할: ${appState.selectedRole})`);
    
// // //     switch (appState.currentRoute) {
// // //       case 'role':
// // //         return (
// // //           <RoleSelectionScreen 
// // //             onRoleSelected={handleRoleSelected}
// // //           />
// // //         );
      
// // //       case 'adminLogin':
// // //         console.log('📋 관리자 로그인 화면 표시');
// // //         return (
// // //           <AuthSystem 
// // //             onLoginSuccess={handleAdminLoginSuccess}
// // //             selectedRole={appState.selectedRole}
// // //           />
// // //         );
      
// // //       case 'userCode':
// // //         console.log('🔑 사용자 코드 입력 화면 표시');
// // //         return (
// // //           <TempUserCodeScreen 
// // //             onCodeSuccess={handleUserCodeSuccess}
// // //             onGoBack={() => setAppState(prev => ({ ...prev, currentRoute: 'role' }))}
// // //           />
// // //         );
      
// // //       case 'dashboard':
// // //         return (
// // //           <DashboardScreen
// // //             onNavigateToChatbot={() => handleNavigateToRoute('chatbot')}
// // //             onNavigateToHistory={() => handleNavigateToRoute('history')}
// // //             onNavigateToRole={handleLogout}
// // //             activeMenu={appState.activeMenu}
// // //             setActiveMenu={handleSetActiveMenu}
// // //           />
// // //         );
      
// // //       case 'chatbot':
// // //         return (
// // //           <ChatbotScreen
// // //             onNavigateToHistory={() => handleNavigateToRoute('history')}
// // //             onNavigateToRole={handleLogout}
// // //             onNavigateToDashboard={() => handleNavigateToRoute('dashboard')}
// // //             activeMenu={appState.activeMenu}
// // //             setActiveMenu={handleSetActiveMenu}
// // //           />
// // //         );
      
// // //       case 'history':
// // //         return (
// // //           <HistoryScreen
// // //             onNavigateBack={() => handleNavigateToRoute('dashboard')}
// // //             onNavigateToChatbot={() => handleNavigateToRoute('chatbot')}
// // //             onNavigateToHistory={() => handleNavigateToRoute('history')}
// // //             onNavigateToDashboard={() => handleNavigateToRoute('dashboard')}
// // //             onNavigateToRole={handleLogout}
// // //             activeMenu={appState.activeMenu}
// // //             setActiveMenu={handleSetActiveMenu}
// // //           />
// // //         );
      
// // //       default:
// // //         return (
// // //           <RoleSelectionScreen 
// // //             onRoleSelected={handleRoleSelected}
// // //           />
// // //         );
// // //     }
// // //   };

// // //   return (
// // //     <div className="app">
// // //       {/* 개발용 디버그 정보 (프로덕션에서는 제거) */}
// // //       {process.env.NODE_ENV === 'development' && (
// // //         <div style={{
// // //           position: 'fixed',
// // //           top: 0,
// // //           right: 0,
// // //           background: 'rgba(0,0,0,0.8)',
// // //           color: 'white',
// // //           padding: '10px',
// // //           fontSize: '12px',
// // //           zIndex: 9999
// // //         }}>
// // //           <div>Route: {appState.currentRoute}</div>
// // //           <div>Role: {appState.selectedRole || 'None'}</div>
// // //           <div>Auth: {appState.isAuthenticated ? 'Yes' : 'No'}</div>
// // //           <div>Menu: {appState.activeMenu}</div>
// // //         </div>
// // //       )}
      
// // //       {renderCurrentScreen()}
// // //     </div>
// // //   );
// // // };

// // // export default App;


// // // App.tsx - 메인 애플리케이션 컴포넌트 (리팩토링됨)
// // import React from 'react';
// // import AppRouter from './components/AppRouter/AppRouter';
// // import { useAppRouter } from './hooks/useAppRouter';
// // import './App.css';

// // /**
// //  * 메인 애플리케이션 컴포넌트
// //  * 
// //  * 애플리케이션의 전체 라우팅과 상태를 관리합니다.
// //  * 
// //  * 흐름:
// //  * 1. 역할 선택 (admin/user)
// //  * 2. 인증 (admin: 로그인, user: 코드 입력)
// //  * 3. 대시보드 진입
// //  * 4. 각 기능 화면 (chatbot/history) 이동
// //  */
// // const App: React.FC = () => {
// //   // 커스텀 훅으로 상태 관리 및 라우팅 로직 분리
// //   const { appState, handlers, navigation } = useAppRouter();

// //   return (
// //     <div className="app">
// //       {/* 라우터 컴포넌트로 화면 렌더링 */}
// //       <AppRouter 
// //         appState={appState}
// //         handlers={handlers}
// //         navigation={navigation}
// //       />
// //     </div>
// //   );
// // };

// // // export default App;

// // // App.tsx - 메인 애플리케이션 컴포넌트 (완전 리팩토링됨)
// // import React from 'react';
// // import AppRouter from './components/AppRouter/AppRouter';
// // import { useAppRouter } from './hooks/useAppRouter';
// // import './App.css';

// // /**
// //  * 메인 애플리케이션 컴포넌트
// //  * 
// //  * 애플리케이션의 전체 라우팅과 상태를 관리합니다.
// //  * 
// //  * 흐름:
// //  * 1. 로딩 화면 (3초)
// //  * 2. 메인 화면 (시작 버튼)
// //  * 3. 역할 선택 (admin/user)
// //  * 4. 인증 (admin: 로그인, user: 코드 입력)
// //  * 5. 대시보드 진입
// //  * 6. 각 기능 화면 (chatbot/history) 이동
// //  */
// // const App: React.FC = () => {
// //   // 커스텀 훅으로 상태 관리 및 라우팅 로직 분리
// //   const { appState, handlers, navigation } = useAppRouter();

// //   return (
// //     <div className="app">
// //       {/* 라우터 컴포넌트로 화면 렌더링 */}
// //       <AppRouter
// //   appState={appState}
// //   handlers={{
// //     onLoadingComplete: () => navigation.navigateToRoute('main'),
// //     onNavigateToRoleSelect: () => navigation.navigateToRoute('role'),
// //     onRoleSelected: handleRoleSelected,
// //     onAdminLoginSuccess: handleAdminLoginSuccess,
// //     onUserCodeSuccess: handleUserCodeSuccess,
// //     onLogout: handleLogout,
// //     onGoBackToRole: () => navigation.navigateToRoute('role'),
// //   }}
// //   navigation={navigation}
// // />

// // const navigation = {
// //   navigateToRoute: (route: AppRoute) =>
// //     setAppState(prev => ({ ...prev, currentRoute: route })),
// //   setActiveMenu: (menu: string) =>
// //     setAppState(prev => ({ ...prev, activeMenu: menu })),
// // };


// //     </div>
// //   );
// // };

// // export default App;

// // // App.tsx - 메인 애플리케이션 컴포넌트 (완전 리팩토링됨)
// // import React from 'react';
// // import AppRouter from './components/AppRouter/AppRouter';
// // import { useAppRouter } from './hooks/useAppRouter';
// // import './App.css';

// // /**
// //  * 메인 애플리케이션 컴포넌트
// //  * 
// //  * 애플리케이션의 전체 라우팅과 상태를 관리합니다.
// //  * 
// //  * 흐름:
// //  * 1. 로딩 화면 (3초)
// //  * 2. 메인 화면 (시작 버튼)
// //  * 3. 역할 선택 (admin/user)
// //  * 4. 인증 (admin: 로그인, user: 코드 입력)
// //  * 5. 대시보드 진입
// //  * 6. 각 기능 화면 (chatbot/history) 이동
// //  */
// // const App: React.FC = () => {
// //   // 커스텀 훅으로 상태 관리 및 라우팅 로직 분리
// //   const { appState, handlers, navigation } = useAppRouter();

// //   return (
// //     <div className="app">
// //       {/* 라우터 컴포넌트로 화면 렌더링 */}
// //       <AppRouter 
// //         appState={appState}
// //         handlers={handlers}
// //         navigation={navigation}
// //       />
// //     </div>
// //   );
// // };

// // export default App;

// // App.tsx - 메인 애플리케이션 컴포넌트 (완전 리팩토링됨)
// import React from 'react';
// import AppRouter from './components/AppRouter/AppRouter';
// import { useAppRouter } from './hooks/useAppRouter';
// import './App.css';

// /**
//  * 메인 애플리케이션 컴포넌트
//  * 
//  * 애플리케이션의 전체 라우팅과 상태를 관리합니다.
//  * 
//  * 흐름:
//  * 1. 로딩 화면 (3초)
//  * 2. 메인 화면 (시작 버튼)
//  * 3. 역할 선택 (admin/user)
//  * 4. 인증 (admin: 로그인, user: 코드 입력)
//  * 5. 대시보드 진입
//  * 6. 각 기능 화면 (chatbot/history) 이동
//  */
// const App: React.FC = () => {
//   // 커스텀 훅으로 상태 관리 및 라우팅 로직 분리
//   const { appState, handlers, navigation } = useAppRouter();

//   return (
//     <div className="app">
//       {/* 개발 환경에서만 디버그 정보 표시 */}
//       {process.env.NODE_ENV === 'development' && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           right: 0,
//           background: 'rgba(0,0,0,0.8)',
//           color: 'white',
//           padding: '10px',
//           fontSize: '12px',
//           zIndex: 9999,
//           borderRadius: '0 0 0 8px'
//         }}>
//           <div>Route: {appState.currentRoute}</div>
//           <div>Role: {appState.selectedRole || 'None'}</div>
//           <div>Auth: {appState.isAuthenticated ? 'Yes' : 'No'}</div>
//           <div>Menu: {appState.activeMenu}</div>
//         </div>
//       )}
      
//       {/* 라우터 컴포넌트로 화면 렌더링 */}
//       <AppRouter 
//         appState={appState}
//         handlers={handlers}
//         navigation={navigation}
//       />
//     </div>
//   );
// };

// export default App;

/**
 * ═══════════════════════════════════════════════════════════════
 * 🚀 App - 메인 애플리케이션 컴포넌트
 * ═══════════════════════════════════════════════════════════════
 * 
 * 주요 기능:
 * - 전체 애플리케이션의 라우팅 및 상태 관리
 * - 사용자 인증 플로우 제어
 * - 역할 기반 접근 제어 (관리자/사용자)
 * - 세션 관리 및 지속성
 * 
 * 애플리케이션 플로우:
 * 1. 🔄 로딩 화면 (3초 스플래시)
 * 2. 🏠 메인 화면 (시작 버튼)
 * 3. 🎭 역할 선택 (admin/user)
 * 4. 🔐 인증 단계:
 *    - 관리자: 이메일/비밀번호 + 2단계 인증
 *    - 사용자: 접근 코드 입력
 * 5. 📊 대시보드 진입 (실시간 센서 모니터링)
 * 6. 🔄 기능 화면 이동:
 *    - 대시보드: 센서 데이터 시각화
 *    - 챗봇: AI 기반 질의응답
 *    - 히스토리: 센서 데이터 이력 조회
 * 
 * 상태 관리:
 * - useAppRouter 훅을 통한 중앙 집중식 상태 관리
 * - 세션 스토리지를 통한 인증 상태 지속성
 * - 로컬 스토리지를 통한 역할 선택 기억
 * 
 * 개발 도구:
 * - 개발 환경에서 실시간 상태 디버그 정보 표시
 * - 라우트, 역할, 인증 상태, 활성 메뉴 추적
 */

// App.tsx - 메인 애플리케이션 컴포넌트
import React from 'react';
import AppRouter from './components/AppRouter/AppRouter';
import { useAppRouter } from './hooks/useAppRouter';
import './App.css';

/**
 * 🎯 메인 애플리케이션 컴포넌트
 * 
 * 최상위 컴포넌트로서 전체 애플리케이션의 상태와 라우팅을 관리합니다.
 * 모든 화면 전환과 사용자 인증 플로우가 이곳에서 제어됩니다.
 */
const App: React.FC = () => {
  /**
   * 🔧 애플리케이션 상태 및 라우터 훅
   * - appState: 현재 라우트, 사용자 역할, 인증 상태 등
   * - handlers: 각종 이벤트 핸들러 함수들
   * - navigation: 라우트 변경 및 네비게이션 함수들
   */
  const { appState, handlers, navigation } = useAppRouter();

  return (
    <div className="app">
      {/* 🛠️ 개발 환경 전용 디버그 패널 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <div>Route: {appState.currentRoute}</div>         {/* 현재 활성 라우트 */}
          <div>Role: {appState.selectedRole || 'None'}</div> {/* 선택된 사용자 역할 */}
          <div>Auth: {appState.isAuthenticated ? 'Yes' : 'No'}</div> {/* 인증 상태 */}
          <div>Menu: {appState.activeMenu}</div>             {/* 활성 메뉴 */}
        </div>
      )}
      
      {/* 🧭 중앙 라우터 컴포넌트 */}
      {/* 
        AppRouter가 현재 상태에 따라 적절한 화면 컴포넌트를 렌더링
        - 상태 기반 조건부 렌더링
        - 이벤트 핸들러 Props 전달
        - 네비게이션 함수 제공
      */}
      <AppRouter 
        appState={appState}       // 현재 애플리케이션 상태
        handlers={handlers}       // 이벤트 핸들러 모음
        navigation={navigation}   // 네비게이션 함수 모음
      />
    </div>
  );
};

export default App;