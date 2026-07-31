import React, { useState, useEffect } from 'react';
import { Package, Menu, X, Phone, User, LogOut, Monitor, Download, AlertCircle, Sparkles } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = ({ onOpenInquiry, onNavigateToSupport, onNavigateToHome, user, subView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

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

  // Trigger PWA installation
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installation accepted by user.');
        setDeferredPrompt(null);
      }
    } else {
      // Fallback: Show visual popup guide for browsers that don't support programmatic prompting (e.g. Safari, iOS)
      setShowInstallGuide(true);
    }
    setIsOpen(false); // Close mobile drawer
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
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-650 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all"
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
                className="w-full text-center py-2.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                링커엑스 모바일 앱 설치
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern PWA Install Guide Modal (iOS/Safari Fallbacks) */}
      {showInstallGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: 'rgba(2, 6, 23, 0.75)', backdropFilter: 'blur(10px)' }}
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] p-8 text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top design strip */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            
            {/* Close */}
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all"
            >
              <X size={18} />
            </button>

            <div className="text-center mt-3">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-5">
                <Monitor size={28} />
              </div>
              <h3 className="text-lg font-black text-white">링커엑스 바탕화면 앱 설치 가이드</h3>
              <p className="text-xs text-slate-400 font-bold mt-1.5">
                클라우드 앱 서비스로 바탕화면에 바로 가기 앱을 생성합니다.
              </p>
            </div>

            {/* Instruction Steps */}
            <div className="my-8 space-y-4">
              <div className="flex gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-xs text-slate-200 font-black">PC (크롬 / 웨일 / 엣지 브라우저)</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-1 leading-relaxed">
                    주소창 오른쪽 끝에 있는 <span className="text-emerald-400 font-black">[모니터 설치 모양]</span> 아이콘을 클릭하거나, 브라우저 메뉴에서 <span className="text-emerald-400 font-black">[설치]</span>를 누르시면 바탕화면에 연두색 링커엑스 앱이 즉시 생성됩니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-xs text-slate-200 font-black">아이폰 / iPad (Safari 브라우저)</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-1 leading-relaxed">
                    Safari 브라우저 하단의 <span className="text-emerald-400 font-black">[공유하기 버튼 (네모 위 화살표)]</span>을 누르고 목록을 내려 <span className="text-emerald-400 font-black">[홈 화면에 추가]</span>를 터치해 주세요.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-xs text-slate-200 font-black">안드로이드 (삼성 인터넷 / 크롬)</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-1 leading-relaxed">
                    브라우저 하단 삼선 메뉴 또는 더보기 목록에서 <span className="text-emerald-400 font-black">[앱 추가] ➔ [홈 화면]</span>을 선택해 주시면 홈 화면에 전용 앱 아이콘이 바로 생성됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-slate-800/80 pt-5 text-center">
              <button
                onClick={() => setShowInstallGuide(false)}
                className="w-full bg-slate-800 hover:bg-slate-750 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
