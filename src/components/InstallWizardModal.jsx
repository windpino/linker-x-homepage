import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Monitor, AlertCircle, CheckCircle2 } from 'lucide-react';

const InstallWizardModal = ({ onClose }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('프로그램 구성을 준비하는 중...');
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // 0% to 100% progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(interval);
          setStatusText('최종 파일 최적화 완료.');
          triggerPwaInstall();
          return 100;
        } else if (next > 20 && next < 60) {
          setStatusText('시스템 및 라이브러리 리소스 복사 중...');
        } else if (next >= 60 && next < 90) {
          setStatusText('보안 자격 증명 파일 및 서비스 구성 중...');
        } else if (next >= 90) {
          setStatusText('바탕화면 단축 실행 프로필 등록 중...');
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const triggerPwaInstall = async () => {
    const promptEvent = window.deferredPrompt;
    if (promptEvent) {
      try {
        // Trigger the real browser PWA prompt
        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === 'accepted') {
          setIsCompleted(true);
          // Nullify prompt so it doesn't prompt again
          window.deferredPrompt = null;
        } else {
          setErrorMsg('바탕화면 단축 아이콘 설치가 취소되었습니다.');
        }
      } catch (err) {
        console.error('PWA prompt error:', err);
        setErrorMsg('설치 팝업 호출 중 에러가 발생했습니다.');
      }
    } else {
      // Fallback if PWA is already installed or beforeinstallprompt hasn't fired yet
      // We will check if we are already in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsCompleted(true);
      } else {
        setErrorMsg('설치 마법사를 호출할 수 없습니다. 이미 설치되었거나 크롬 브라우저를 사용해 주세요.');
      }
    }
  };

  // Listen to the native appinstalled event in the background
  useEffect(() => {
    const handleAppInstalled = () => {
      setIsCompleted(true);
      setErrorMsg('');
      window.deferredPrompt = null;
    };
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in font-sans"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)' }}
    >
      <div className="relative w-[440px] bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Windows Style Title bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor size={14} className="text-blue-500" />
            <span className="text-xs font-black text-slate-350 tracking-tight">Linker X Setup Wizard</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-8 text-center flex flex-col items-center">
          
          {!isCompleted && !errorMsg ? (
            <>
              {/* Spinning install icon */}
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
              </div>

              <h3 className="text-lg font-black text-white mb-1.5">
                링커엑스 시스템 파일 구성 중
              </h3>
              <p className="text-xs text-slate-400 font-bold mb-6">
                데스크톱 및 모바일 독립 실행형 웹앱을 설치하고 있습니다.
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 border border-slate-800 h-3 rounded-full overflow-hidden mb-3.5 relative">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-650 to-blue-600 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status and Percentage */}
              <div className="w-full flex justify-between text-[11px] font-black text-slate-400">
                <span>{statusText}</span>
                <span className="text-blue-400 font-extrabold">{progress}%</span>
              </div>
            </>
          ) : isCompleted ? (
            <>
              {/* Success Visual */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={32} />
              </div>

              <h3 className="text-lg font-black text-white mb-2">
                바탕화면에 설치가 완료되었습니다.
              </h3>
              <p className="text-xs text-slate-400 font-bold mb-6 leading-relaxed max-w-xs mx-auto">
                이제 바탕화면 또는 홈 화면에 생성된 링커엑스 바로가기 아이콘을 더블클릭하여 간편하게 접속하세요.
              </p>

              <button
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-emerald-600/10"
              >
                마치기
              </button>
            </>
          ) : (
            <>
              {/* Error/Cancelled Visual */}
              <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-6">
                <AlertCircle size={32} />
              </div>

              <h3 className="text-lg font-black text-white mb-2">
                설치를 완료하지 못했습니다
              </h3>
              <p className="text-xs text-slate-400 font-bold mb-6 leading-relaxed max-w-xs mx-auto">
                {errorMsg}
              </p>

              <div className="flex gap-2 w-full">
                <button
                  onClick={() => {
                    setErrorMsg('');
                    setProgress(0);
                    setStatusText('프로그램 구성을 다시 준비하는 중...');
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-extrabold py-3.5 rounded-2xl text-xs border border-slate-700 transition-all"
                >
                  다시 시도
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-blue-600/10"
                >
                  닫기
                </button>
              </div>
            </>
          )}

          <hr className="border-slate-800/80 my-4.5 w-full" />
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
            <ShieldCheck size={11} className="text-emerald-500" />
            <span>Linker X 통합 보안 배포망 인증</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InstallWizardModal;
