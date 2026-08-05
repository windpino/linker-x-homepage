import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Check, ShoppingCart, Truck, Database, Printer, Heart } from 'lucide-react';

const PROCESS_STEPS = [
  {
    id: 1,
    title: "1. 스마트 주문 접수 (Order)",
    desc: "거래처가 발송한 종이 인수증, 문자, 카카오톡 발주서가 AI 엔진을 통해 단 1초 만에 전표로 자동 변환되어 시스템에 등록됩니다.",
    color: "from-emerald-500 to-teal-400",
    glowColor: "rgba(16,185,129,0.15)",
    icon: ShoppingCart,
    badge: "AI 발주 분석",
    uiPreview: (
      <div className="w-full h-full bg-slate-900 rounded-2xl border border-emerald-500/30 p-6 flex flex-col justify-between font-mono text-xs relative overflow-hidden">
        {/* Glow grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b_1px,transparent_1px),linear-gradient(to_bottom,#064e3b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-20 pointer-events-none" />
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-extrabold text-emerald-400">ORDER RECEIVED</span>
          </div>
          <span className="text-slate-500">01:56:04 PM</span>
        </div>

        <div className="my-4 flex-1 flex flex-col justify-center gap-3 relative z-10">
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-slate-500">FROM CLIENT</p>
              <p className="text-white font-bold text-sm">(주) 대성물류유통</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold text-[10px]">자동 파싱 완료</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>[품목] 프레시 우유 1L</span>
              <span className="text-emerald-400 font-bold">120 Box</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>[품목] 체다치즈 200g</span>
              <span className="text-emerald-400 font-bold">50 Box</span>
            </div>
            <div className="h-px bg-slate-800 my-2" />
            <div className="flex justify-between text-white font-bold">
              <span>총 전표 공급가액</span>
              <span className="text-emerald-400">₩ 3,450,000</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 relative z-10">
          <span className="bg-emerald-500 text-slate-950 font-black px-3.5 py-1.5 rounded-lg text-[10px] uppercase shadow-lg shadow-emerald-500/20">장부 자동 반영 완료</span>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "2. AI 최적 상차 배차 (Loading)",
    desc: "품목별 무게, 부피와 하차지 동선을 AI가 정밀 계산하여 트럭 적재율을 극대화하고 유류비와 배송 시간을 최소화합니다.",
    color: "from-blue-500 to-indigo-400",
    glowColor: "rgba(59,130,246,0.15)",
    icon: Truck,
    badge: "배송 효율 최적화",
    uiPreview: (
      <div className="w-full h-full bg-slate-900 rounded-2xl border border-blue-500/30 p-6 flex flex-col justify-between font-mono text-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-20 pointer-events-none" />
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-400" />
            <span className="font-extrabold text-blue-400">ROUTING & LOADING OPTIMIZER</span>
          </div>
          <span className="text-slate-500">차량 04호 (2.5T)</span>
        </div>

        <div className="my-4 flex-1 flex flex-col justify-center gap-3 relative z-10">
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500">RECOMMENDED LOAD RATE</span>
              <span className="text-blue-400 font-extrabold">94.8% (최적)</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-850 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full w-[94.8%]" />
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] text-slate-400">
            <div className="flex justify-between">
              <span>1코스: (주) 대성물류유통</span>
              <span className="text-white font-bold">AM 08:30 하차예정</span>
            </div>
            <div className="flex justify-between">
              <span>2코스: 한국유통 강남점</span>
              <span className="text-white font-bold">AM 09:15 하차예정</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center relative z-10 pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-500">배송 예상 소요 2.4시간 단축</span>
          <span className="bg-blue-500 text-slate-950 font-black px-3.5 py-1.5 rounded-lg text-[10px] uppercase shadow-lg shadow-blue-500/20">자동 배차 완료</span>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "3. 모바일 창고 재고 동기화 (Stock)",
    desc: "창고 내 바코드 및 QR 스캔과 동시에 데이터베이스가 실시간 갱신되어, PC 대시보드와 거래처 주문 시스템에 즉각 반영됩니다.",
    color: "from-purple-500 to-pink-400",
    glowColor: "rgba(168,85,247,0.15)",
    icon: Database,
    badge: "재고 오차 0%",
    uiPreview: (
      <div className="w-full h-full bg-slate-900 rounded-2xl border border-purple-500/30 p-6 flex flex-col justify-between font-mono text-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#581c87_1px,transparent_1px),linear-gradient(to_bottom,#581c87_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-20 pointer-events-none" />
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="font-extrabold text-purple-400">WAREHOUSE DATA LIVE</span>
          </div>
          <span className="text-slate-500">창고 A구역</span>
        </div>

        <div className="my-4 flex-1 flex flex-col justify-center gap-2 relative z-10">
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-[11px] space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">CURRENT POSITION</span>
              <span className="text-white font-bold">RACK-04-B3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400 font-extrabold">프레시 우유 1L</span>
            </div>
          </div>

          <div className="flex gap-2 text-[10px] text-slate-500 justify-between items-center bg-slate-950/40 p-2 rounded border border-slate-850">
            <span>스캔 바코드: 880104592031</span>
            <span className="text-emerald-400 font-bold">정상 일치</span>
          </div>
        </div>

        <div className="flex justify-between items-center relative z-10 pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-500">오차율: 0.00%</span>
          <span className="bg-purple-500 text-white font-black px-3.5 py-1.5 rounded-lg text-[10px] uppercase shadow-lg shadow-purple-500/20">재고실사 실시간 연동</span>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "4. 현장 영수증 즉시 출력 (Print)",
    desc: "현장에서 즉각 거래명세표와 세금계산서 영수증을 출력하고 모바일 서명을 받아, 미수금 분쟁과 전표 분실 가능성을 원천 차단합니다.",
    color: "from-amber-500 to-orange-400",
    glowColor: "rgba(245,158,11,0.15)",
    icon: Printer,
    badge: "현장 전산 즉시 완료",
    uiPreview: (
      <div className="w-full h-full bg-slate-900 rounded-2xl border border-amber-500/30 p-6 flex flex-col justify-between font-mono text-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#78350f_1px,transparent_1px),linear-gradient(to_bottom,#78350f_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-20 pointer-events-none" />
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-amber-400" />
            <span className="font-extrabold text-amber-400">MOBILE RECEIPT PRINTING</span>
          </div>
          <span className="text-amber-400 font-bold animate-pulse">OUTPUTTING</span>
        </div>

        <div className="my-3 flex-1 flex flex-col justify-center items-center relative z-10">
          {/* Simulated scrolling thermal receipt */}
          <div className="w-48 bg-white text-slate-950 p-3 rounded shadow-lg flex flex-col gap-1 text-[8px] transform -rotate-1 select-none animate-bounce">
            <p className="text-center font-black text-[10px] border-b border-slate-300 pb-1">거래명세표 (인수증)</p>
            <div className="flex justify-between mt-1">
              <span>상호: (주) 대성물류유통</span>
              <span>인수일: 2026.08.05</span>
            </div>
            <div className="h-[1px] bg-dashed border-t border-slate-300 my-1" />
            <div className="flex justify-between">
              <span>프레시 우유 1L x 120</span>
              <span>1,800,000 원</span>
            </div>
            <div className="flex justify-between">
              <span>체다치즈 200g x 50</span>
              <span>1,650,000 원</span>
            </div>
            <div className="border-t border-slate-300 pt-1 mt-1 flex justify-between font-black text-[9px]">
              <span>합계 금액:</span>
              <span>3,450,000 원</span>
            </div>
            <div className="mt-2 text-center text-slate-500 border border-slate-300 p-1 rounded font-sans font-bold">
              인수자 서명: (주) 대성대표 (인)
            </div>
          </div>
        </div>

        <div className="flex justify-end relative z-10 pt-1">
          <span className="bg-amber-500 text-slate-950 font-black px-3.5 py-1.5 rounded-lg text-[10px] uppercase shadow-lg shadow-amber-500/20">영수증 실시간 발급완료</span>
        </div>
      </div>
    )
  }
];

const Hero = ({ onOpenInquiry }) => {
  const [scrollY, setScrollY] = useState(0);
  const processRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);

  // Monitor scroll height
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      if (processRef.current) {
        const rect = processRef.current.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const totalHeight = rect.height - window.innerHeight;
        const scrolled = window.scrollY - elementTop;
        
        if (scrolled >= 0 && scrolled <= totalHeight) {
          const stepSize = totalHeight / PROCESS_STEPS.length;
          const currentStep = Math.min(
            PROCESS_STEPS.length,
            Math.max(1, Math.ceil(scrolled / stepSize))
          );
          setActiveStep(currentStep);
        } else if (scrolled < 0) {
          setActiveStep(1);
        } else {
          setActiveStep(PROCESS_STEPS.length);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Soft parallax / fade controls for Hero text based on scroll height
  const heroOpacity = Math.max(0, 1 - scrollY / 650);
  const heroScale = Math.max(0.95, 1 - scrollY / 5000);
  const heroTranslate = scrollY / 3.5;

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden">
      
      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. Cinematic Hero Section (시네마틱 히어로) */}
      {/* ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Futuristic glowing gradients background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-25 pointer-events-none" />
        
        {/* Soft radial aura lights */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-emerald-500/20 via-teal-600/10 to-transparent rounded-full blur-[130px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Floating cinematic grid ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] max-w-[1400px] aspect-square rounded-full border border-emerald-500/5 opacity-40 pointer-events-none rotate-12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] max-w-[1000px] aspect-square rounded-full border border-teal-500/5 opacity-30 pointer-events-none -rotate-12" />

        {/* Hero Interactive Container */}
        <div 
          className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center"
          style={{
            opacity: heroOpacity,
            transform: `scale(${heroScale}) translateY(${heroTranslate}px)`,
            transition: 'transform 0.05s ease-out, opacity 0.05s ease-out'
          }}
        >
          {/* Top AI Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 text-emerald-400 px-4.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-8 shadow-lg shadow-emerald-500/10 animate-bounce">
            <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-spin" />
            <span>최신 통합 B2B 물류 ERP 시스템 출시</span>
          </div>

          {/* Main Cinematic Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.18] text-white max-w-5xl mb-8 drop-shadow-2xl">
            노동의 함정에서 벗어나,<br className="hidden sm:inline" /> 
            유통 물류의 모든 것을 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 filter drop-shadow-[0_0_15px_rgba(52,211,153,0.35)]">자동화하다.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 font-medium leading-relaxed max-w-3xl mb-12">
            재고 오차 0%, 복잡한 전표 처리와 대리점 관리를<br className="hidden sm:inline" />
            가장 스마트하고 완벽한 오프라인-실시간 연동 시스템으로 경험해 보세요.
          </p>

          {/* Glowing CTA Button */}
          <div className="w-full flex flex-col items-center gap-6">
            <button 
              onClick={() => onOpenInquiry('signup')}
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg px-10 py-5 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_55px_rgba(16,185,129,0.55)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>이메일로 3초 만에 시작하기 (1달 무료)</span>
              <ArrowRight className="h-5 w-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Checklist benefits */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-bold pt-2 select-none">
              <span className="flex items-center gap-1.5"><Check className="h-4.5 w-4.5 text-emerald-400" /> 가입비·설치비 전액 면제</span>
              <span className="flex items-center gap-1.5"><Check className="h-4.5 w-4.5 text-emerald-400" /> 신규 가입 시 초기 마스터 세팅 무료 대행</span>
              <span className="flex items-center gap-1.5"><Check className="h-4.5 w-4.5 text-emerald-400" /> 소개만 해도 평생 10% 추가 할인</span>
            </div>
          </div>
        </div>

        {/* Bottom indicator mouse wheel */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 opacity-60">
          <span className="text-[10px] font-black tracking-widest uppercase animate-pulse">Scroll Down</span>
          <div className="w-5 h-8.5 border-2 border-slate-700 rounded-full flex justify-center p-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. Sticky Scroll Process Section (스티키 4단계 타임라인) */}
      {/* ───────────────────────────────────────────────────────── */}
      <section ref={processRef} className="relative h-[300vh] bg-slate-950 border-t border-slate-900">
        
        {/* Sticky viewport content container */}
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          
          {/* Subtle grid background for the sticky section */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-20 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Step Descriptions */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              
              {/* Step indicator tag */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-md uppercase">
                  Core Process
                </span>
                <span className="text-slate-400 font-bold text-sm">링커엑스 자동화 시스템</span>
              </div>

              {/* Progress Step Numbers Timeline */}
              <div className="flex gap-2.5 mb-8">
                {PROCESS_STEPS.map((step) => (
                  <div 
                    key={step.id}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeStep === step.id 
                        ? 'w-16 bg-gradient-to-r from-emerald-500 to-teal-400' 
                        : activeStep > step.id 
                          ? 'w-6 bg-emerald-800' 
                          : 'w-6 bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              {/* Changing Content Box with Transition */}
              <div className="min-h-[220px] flex flex-col justify-start">
                <span className="text-emerald-400 font-extrabold text-sm mb-2 font-mono uppercase tracking-widest">
                  Step 0{activeStep}
                </span>
                
                <h2 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight leading-snug">
                  {PROCESS_STEPS[activeStep - 1].title}
                </h2>
                
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-medium">
                  {PROCESS_STEPS[activeStep - 1].desc}
                </p>
              </div>

              {/* Floating micro benefits list */}
              <div className="mt-8 pt-6 border-t border-slate-900 flex gap-6 text-xs font-bold text-slate-500 select-none">
                <span>✓ 실시간 클라우드 백업</span>
                <span>✓ 모바일 완벽 반응형 앱 지원</span>
                <span>✓ 보안 통신 암호화</span>
              </div>

            </div>

            {/* Right Col: High-End Live UI Emulator Card Stack */}
            <div className="lg:col-span-6 flex justify-center items-center relative h-[380px] w-full">
              
              {/* Radial glow backdrop aligned to active step color */}
              <div 
                className="absolute w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full blur-[100px] pointer-events-none transition-all duration-700"
                style={{
                  backgroundColor: PROCESS_STEPS[activeStep - 1].glowColor,
                  opacity: 0.8
                }}
              />

              {/* Process card rendering and active/inactive depth styling */}
              {PROCESS_STEPS.map((step) => {
                const stepIcon = React.createElement(step.icon, {
                  className: "h-7 w-7 text-white"
                });

                // Compute relative scale and positioning in stack
                const isActive = activeStep === step.id;
                const isPast = activeStep > step.id;

                let cardStyle = {
                  transform: 'scale(0.85) translateY(40px)',
                  opacity: 0,
                  pointerEvents: 'none',
                  zIndex: 0
                };

                if (isActive) {
                  cardStyle = {
                    transform: 'scale(1) translateY(0)',
                    opacity: 1,
                    pointerEvents: 'auto',
                    zIndex: 20
                  };
                } else if (isPast) {
                  cardStyle = {
                    transform: 'scale(0.92) translateY(-25px) rotate(-1deg)',
                    opacity: 0.18,
                    pointerEvents: 'none',
                    zIndex: 10
                  };
                }

                return (
                  <div 
                    key={step.id}
                    className="absolute w-full max-w-[440px] h-[340px] transition-all duration-700 ease-out"
                    style={cardStyle}
                  >
                    {/* Top floating mini-icon badge */}
                    <div className="absolute -top-3.5 -left-3.5 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-2.5 rounded-xl shadow-xl z-30">
                      {stepIcon}
                    </div>

                    {/* Step badge pill top-right */}
                    <span className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md border border-slate-800 text-[9px] font-black tracking-widest text-slate-400 px-2.5 py-1 rounded-full z-30 uppercase">
                      {step.badge}
                    </span>

                    {/* Main UI Preview Slot */}
                    {step.uiPreview}
                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 3. Final Step Summary & Mini-CTA Section */}
      {/* ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Heart className="h-6 w-6 text-emerald-400 animate-pulse" />
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 tracking-tight">
            지금 링커엑스와 함께 물류 효율을 300% 극대화하세요.
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-10">
            기존에 사용하시던 품목 리스트와 거래처 데이터 엑셀 파일을 전달해 주시면,<br />
            무료체험 기간 중 즉시 업무에 투입할 수 있도록 마스터 DB 세팅을 100% 무료 지원합니다.
          </p>

          <button 
            onClick={() => onOpenInquiry('signup')}
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base px-8 py-4.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>무료 1개월 신청하고 마스터 세팅 지원받기</span>
            <ArrowRight className="h-5 w-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default Hero;
