import React, { useState } from 'react';
import { Package, Menu, X, Phone, HelpCircle, User, LogOut, Monitor, Download, AlertCircle } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = ({ onOpenInquiry, onNavigateToSupport, onNavigateToHome, user, subView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoteOpen, setIsRemoteOpen] = useState(false);

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

  const handleStartRemote = () => {
    // 1. Invoke Windows Quick Assist application
    window.location.href = 'ms-quickassist:';
    // 2. Open our instruction modal
    setIsRemoteOpen(true);
    setIsOpen(false); // Close mobile drawer if open
  };

  // If user is logged in, use dark theme to match dashboard ambient
  const navBgClass = user ? "bg-slate-950/80 border-slate-900 text-white backdrop-blur-md" : "bg-white border-slate-200 text-slate-650 shadow-sm";
  const brandTextClass = user ? "text-white" : "text-slate-900";
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

            {/* Remote Support Button (Orange badge) */}
            <button 
              onClick={handleStartRemote}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>원격지원</span>
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
              <button 
                onClick={handleStartRemote}
                className="w-full text-center py-2.5 rounded-lg bg-[#f97316] text-white font-bold hover:bg-[#ea580c]"
              >
                원격지원 (1566-8680)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Toss-style Remote Support Guide Modal */}
      {isRemoteOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(2, 6, 23, 0.75)', backdropFilter: 'blur(8px)' }}
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] p-8 text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top design strip */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" />
            
            {/* Close */}
            <button 
              onClick={() => setIsRemoteOpen(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all"
            >
              <X size={18} />
            </button>

            <div className="text-center mt-3">
              <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center text-orange-400 mx-auto mb-5">
                <Monitor size={28} />
              </div>
              <h3 className="text-lg font-black text-white">무료 원격지원 연결 가이드</h3>
              <p className="text-xs text-slate-400 font-bold mt-1.5">
                복잡한 설치 없이 윈도우 기본 기능으로 즉시 연결합니다.
              </p>
            </div>

            {/* Instruction Steps */}
            <div className="my-8 space-y-4">
              <div className="flex gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <span className="w-5 h-5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">1</span>
                <p className="text-xs text-slate-300 font-bold leading-relaxed">
                  고객님의 PC 화면에 윈도우 내장 프로그램인 **[빠른 지원(Quick Assist)]** 앱이 자동으로 구동 중입니다.
                </p>
              </div>

              <div className="flex gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <span className="w-5 h-5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">2</span>
                <p className="text-xs text-slate-300 font-bold leading-relaxed">
                  앱이 자동으로 켜지지 않았다면, 키보드의 <span className="text-amber-400 font-black">Ctrl + 윈도우 로고 키 + Q</span> 단축키를 직접 꾹 눌러주세요.
                </p>
              </div>

              <div className="flex gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <span className="w-5 h-5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">3</span>
                <p className="text-xs text-slate-300 font-bold leading-relaxed">
                  상담원이 전화로 제공하는 **6자리 보안 코드**를 입력하시고 [화면 공유/수락]을 누르시면 연결이 완료됩니다!
                </p>
              </div>
            </div>

            {/* Fallback Section */}
            <div className="border-t border-slate-800/80 pt-5 text-center">
              <p className="text-[10px] text-slate-500 font-bold flex items-center justify-center gap-1.5 mb-3.5">
                <AlertCircle size={12} className="text-slate-400 shrink-0" />
                맥북(macOS)이거나 빠른 지원 연결이 어려운 경우:
              </p>
              <button
                onClick={() => window.open('https://github.com/rustdesk/rustdesk/releases/download/1.2.3-2/rustdesk-1.2.3-2-x86_64.exe', '_blank')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Download size={14} />
                비상용 무설치 원격프로그램 다운로드
              </button>
              <p className="text-[9px] text-slate-600 font-bold mt-2">
                비상용 원격프로그램은 100% 영구 무료 오픈소스(RustDesk)입니다.
              </p>
            </div>

          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;

