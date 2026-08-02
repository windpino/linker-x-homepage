import React, { useState, useEffect } from 'react';
import { Package, Menu, X, Phone, User, LogOut, Monitor, Download, AlertCircle, Sparkles } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = ({ onOpenInquiry, onNavigateToSupport, onNavigateToHome, user, subView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [installStatusText, setInstallStatusText] = useState('');
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [installAlertMsg, setInstallAlertMsg] = useState('');

  // Capture PWA installation prompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleLinkClick = (e, link) => {
    if (link.label === '고객지원') {
      e.preventDefault();
      if (onNavigateToSupport) onNavigateToSupport();
      setIsOpen(false);
    } else {
      if (onNavigateToHome) onNavigateToHome();
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await signOut(auth);
    }
  };

  const startInstallAnimation = () => {
    setShowInstallGuide(false);
    setIsInstalling(true);
    setInstallProgress(0);
    setInstallStatusText('시스템 파일을 구성 중입니다...');

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setInstallProgress(100);
        setInstallStatusText('바탕화면 단축아이콘 생성 완료!');
        
        setTimeout(() => {
          setIsInstalling(false);
          setShowInstallSuccess(true);
        }, 800);
      } else {
        setInstallProgress(progress);
        if (progress > 30 && progress < 70) {
          setInstallStatusText('바탕화면 단축아이콘 생성 중...');
        } else if (progress >= 70) {
          setInstallStatusText('보안 프로필 등록 및 최종 설정 중...');
        }
      }
    }, 250);
  };

  // Open welcome marketing install modal first
  const handleInstallApp = () => {
    setShowInstallGuide(true);
    setIsOpen(false); // Close mobile drawer
  };

  // Perform actual PWA installation triggered from the welcome modal button
  const executePWAInstall = async () => {
    // 0) Check if already running inside standalone app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setInstallAlertMsg('이미 링커엑스 바탕화면 앱이 설치되어 실행 중입니다! 바탕화면의 아이콘을 이용해 주세요.');
      return;
    }

    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (promptEvent) {
      setInstallAlertMsg(''); // Clear alerts
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installation accepted by user.');
        setDeferredPrompt(null);
        window.deferredPrompt = null;
        startInstallAnimation();
      }
    } else {
      // PWA prompt not loaded or not supported by current browser (e.g. Chrome not fully loaded sw.js yet, or iOS Safari)
      setInstallAlertMsg('현재 브라우저가 자동 설치를 지원하지 않거나 준비 중입니다. 3초 대기 후 새로고침(F5) 해보시거나, 아래 [기기별 설치 안내]를 눌러 바로가기를 생성해 주세요!');
      setShowManualGuide(true); // Automatically open manual guide accordion to assist the user
    }
  };

  const navBgClass = user ? "bg-slate-950/80 border-slate-900 text-white backdrop-blur-md" : "bg-white border-slate-200 text-slate-650 shadow-sm";
  const linkTextClass = user ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-[#1d4ed8]";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 border-b transition-all duration-300 ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: Brand Identity Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateToHome}>
            <img 
              src="/images/logo.png" 
              alt="Linker X Logo" 
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* Center: Main Navigation links */}
          <div className="hidden lg:flex items-center gap-6 font-bold text-sm">
            {[
              { label: '제품소개', href: '#products' },
              { label: 'ERP솔루션', href: '#products' },
              { label: '하드웨어', href: '#products' },
              { label: '전산용지', href: '#products' },
              { label: '핵심기능', href: '#features' },
              { label: '고객지원', href: '#notice' }
            ].map((link, idx) => (
              <a 
                key={idx} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link)}
                className={`transition-colors duration-200 ${linkTextClass}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            
            {user ? (
              // Logged in UI
              <div className="flex items-center gap-3.5">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 py-1.5 px-3.5 rounded-xl text-xs font-bold text-slate-300">
                  <User size={13} className="text-blue-400" />
                  <span>{user.email.split('@')[0]}</span>
                </div>
                {subView !== 'dashboard' && (
                  <button
                    onClick={onOpenInquiry}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    대시보드
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-slate-400 hover:text-red-400 transition-colors py-2"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              // Logged out UI
              <button 
                onClick={onOpenInquiry}
                className="text-xs font-bold px-3 py-2 transition-all hover:text-[#1d4ed8]"
              >
                회원가입 / 로그인
              </button>
            )}

            {/* Linker X Installation Trigger Button */}
            <button 
              onClick={handleInstallApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>링커엑스 설치</span>
            </button>

            {/* Phone Hotline */}
            <div className="flex items-center gap-1 text-[#f97316] font-extrabold text-sm ml-2">
              <Phone className="h-4 w-4" />
              <span>1566-8680</span>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100/50 transition-all"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className={`lg:hidden border-t py-4 px-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200 ${
          user ? 'bg-slate-950 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <div className="flex flex-col gap-4 text-sm font-bold">
            <a href="#products" onClick={(e) => handleLinkClick(e, { label: '제품소개' })} className="py-1 transition-colors hover:text-[#1d4ed8]">제품소개</a>
            <a href="#products" onClick={(e) => handleLinkClick(e, { label: 'ERP솔루션' })} className="py-1 transition-colors hover:text-[#1d4ed8]">ERP솔루션</a>
            <a href="#products" onClick={(e) => handleLinkClick(e, { label: '하드웨어' })} className="py-1 transition-colors hover:text-[#1d4ed8]">하드웨어</a>
            <a href="#products" onClick={(e) => handleLinkClick(e, { label: '전산용지' })} className="py-1 transition-colors hover:text-[#1d4ed8]">전산용지</a>
            <a href="#features" onClick={(e) => handleLinkClick(e, { label: '핵심기능' })} className="py-1 transition-colors hover:text-[#1d4ed8]">핵심기능</a>
            <a href="#notice" onClick={(e) => handleLinkClick(e, { label: '고객지원' })} className="py-1 transition-colors hover:text-[#1d4ed8]">고객지원</a>
            
            <hr className={`${user ? 'border-slate-800' : 'border-slate-100'} my-1`} />
            
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <div className="text-center py-2.5 text-xs text-slate-400 font-extrabold bg-slate-900 rounded-lg">
                    접속 계정: {user.email}
                  </div>
                  {subView !== 'dashboard' && (
                    <button 
                      onClick={() => { setIsOpen(false); onOpenInquiry(); }}
                      className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500"
                    >
                      대시보드 바로가기
                    </button>
                  )}
                  <button 
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="w-full text-center py-2.5 rounded-lg border border-slate-850 text-red-400 font-bold hover:bg-slate-900"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { setIsOpen(false); onOpenInquiry(); }}
                  className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  회원가입 / 로그인
                </button>
              )}

              {/* Mobile app install trigger */}
              <button 
                onClick={handleInstallApp}
                className="w-full text-center py-2.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                링커엑스 모바일 앱 설치
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern PWA Install Welcome & Advertising Modal */}
      {showInstallGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div className="relative w-full max-w-md bg-white border border-slate-200/80 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(2,6,23,0.12)] p-8 text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top design strip */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600" />
            
            {/* Close */}
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-50 transition-all"
            >
              <X size={18} />
            </button>

            <div className="text-center mt-3">
              {/* App Icon Container */}
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <img src="/logo192.png" alt="Linker X App Icon" className="w-11 h-11 object-contain" />
              </div>
              <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full mb-2">웰컴 설치 혜택</span>
              <h3 className="text-xl font-black text-slate-950 tracking-tight leading-tight">링커엑스 바탕화면 앱 설치</h3>
              <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">
                클라우드 앱 서비스로 바탕화면에 전용 실행 아이콘을 생성하며, 매번 브라우저를 켤 필요 없이 다이렉트로 원클릭 로그인됩니다.
              </p>
            </div>

            {/* Install Alert Message */}
            {installAlertMsg && (
              <div className="mt-2 mb-4 bg-amber-50 border border-amber-250/60 rounded-2xl p-4 text-left flex items-start gap-2.5">
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span className="text-[11px] font-bold text-amber-800 leading-normal">{installAlertMsg}</span>
              </div>
            )}

            {/* Core Features Marketing Section */}
            <div className="my-6 space-y-3">
              <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100/60 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 text-xs font-black">1</div>
                <div>
                  <h4 className="text-xs font-black text-slate-950">완벽한 유통·물류 통합 관리</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5 leading-relaxed">판매, 실시간 재고 추적, 현장영업 및 대리점 수발주가 하나로 자동 연동됩니다.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100/60 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 text-xs font-black">2</div>
                <div>
                  <h4 className="text-xs font-black text-slate-950">인건비 & 고정비 즉시 절감</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5 leading-relaxed">직원 1인 이상의 분량을 클릭 몇 번으로 스마트하게 처리해 복잡한 유통 업무를 최적화합니다.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100/60 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 text-xs font-black">3</div>
                <div>
                  <h4 className="text-xs font-black text-slate-950">실시간 다바이스 동기화</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5 leading-relaxed">PC 프로그램은 물론, 현장용 스마트폰 앱 및 PDA, 바코드 스캐너와 실시간 동기화됩니다.</p>
                </div>
              </div>
            </div>

            {/* Quick Actions (Primary Run Button) */}
            <div className="border-t border-slate-100 pt-5 flex flex-col gap-2.5 text-center">
              <button
                onClick={() => {
                  setShowInstallGuide(false);
                  executePWAInstall();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-4 rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                링커엑스 1초 자동 설치 시작하기
              </button>

              {/* Accordion Toggle for manual guide */}
              <button
                type="button"
                onClick={() => setShowManualGuide(!showManualGuide)}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center gap-1 py-1"
              >
                <span>자동 설치가 안 될 경우 (기기별 설치 안내)</span>
                <span className="text-[9px] transition-transform duration-200" style={{ transform: showManualGuide ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </button>

              {/* Manual guides content showing under accordion */}
              {showManualGuide && (
                <div className="mt-2 space-y-3.5 text-left border-t border-slate-100 pt-3.5 animate-in fade-in duration-200">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-black text-emerald-600 shrink-0">PC:</span>
                    <p className="text-[10.5px] text-slate-500 font-bold leading-normal">
                      주소창 오른쪽 끝의 <span className="text-slate-900 font-black">[모니터 설치 모양]</span> 아이콘을 클릭하거나 브라우저 설정 메뉴에서 <span className="text-slate-900 font-black">[앱 설치]</span>를 선택하면 연두색 X 아이콘이 바탕화면에 생성됩니다.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-black text-emerald-600 shrink-0">아이폰:</span>
                    <p className="text-[10.5px] text-slate-500 font-bold leading-normal">
                      Safari 브라우저 하단의 <span className="text-slate-900 font-black">[공유하기 버튼 (네모 위 화살표)]</span>을 클릭하고 메뉴 아래로 내려 <span className="text-slate-900 font-black">[홈 화면에 추가]</span>를 눌러주세요.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-black text-emerald-600 shrink-0">안드로이드:</span>
                    <p className="text-[10.5px] text-slate-500 font-bold leading-normal">
                      삼성인터넷/크롬 브라우저 우측 하단 삼선 메뉴에서 <span className="text-emerald-600 font-black">[앱 추가] ➔ [홈 화면]</span>을 차례로 탭해 줍니다.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowInstallGuide(false)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold text-xs py-3.5 rounded-xl transition-all"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 링커엑스 전용 설치 마법사 모달 */}
      {isInstalling && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999
        }}>
          <div style={{
            width: '420px', backgroundColor: '#ffffff', borderRadius: '16px',
            padding: '32px 24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(226, 232, 240, 0.8)', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            animation: 'modalScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Install Icon with rotation animation */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: '20px', color: '#059669'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{
                animation: 'spin 2s linear infinite'
              }}>
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
            </div>

            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              링커엑스 프로그램 설치 중
            </h3>
            
            <p style={{ margin: '0 0 24px 0', fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
              데스크톱/모바일 단독 애플리케이션으로 구성하고 있습니다.
            </p>

            {/* Progress Bar Container */}
            <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '12px', position: 'relative' }}>
              <div style={{
                width: `${installProgress}%`, height: '100%',
                backgroundImage: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                borderRadius: '9999px', transition: 'width 0.2s ease-out'
              }} />
            </div>

            {/* Progress Percentage and Status Text */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
              <span>{installStatusText}</span>
              <span style={{ color: '#059669' }}>{installProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 설치 완료 팝업 모달 */}
      {showInstallSuccess && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999
        }}>
          <div style={{
            width: '400px', backgroundColor: '#ffffff', borderRadius: '16px',
            padding: '32px 24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(226, 232, 240, 0.8)', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            animation: 'modalScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Success Check Icon */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: '20px', color: '#10b981'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              링커엑스 프로그램 설치 완료
            </h3>

            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#475569', fontWeight: 600, lineHeight: 1.5 }}>
              바탕화면의 연두색 링커엑스 실행 아이콘을 확인해 주세요!
            </p>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 14px',
              textAlign: 'left',
              fontSize: '0.78rem',
              color: '#64748b',
              lineHeight: 1.6,
              fontWeight: 500,
              marginBottom: '24px',
              width: '100%'
            }}>
              <span style={{ fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '4px' }}>💡 바탕화면에 아이콘이 생성되지 않았나요?</span>
              설치된 링커엑스 창 우측 상단의 <span style={{ fontWeight: 700, color: '#0f172a' }}>[메뉴(점 3개)] ➔ [저장 및 공유] ➔ [바로가기 만들기]</span> 또는 <span style={{ fontWeight: 700, color: '#0f172a' }}>[도구 더보기 ➔ 바로가기 만들기]</span>를 누르시면 바탕화면에 링커엑스 로고 아이콘이 즉시 생성됩니다!
            </div>

            <button
              onClick={() => setShowInstallSuccess(false)}
              style={{
                width: '100%', padding: '12px', backgroundColor: '#10b981',
                color: '#ffffff', border: 'none', borderRadius: '8px',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes modalScaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

    </nav>
  );
};

export default Navbar;
