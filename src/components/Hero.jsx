import React, { useState, useEffect } from 'react';
import { Check, ShieldAlert, ArrowRight, Sparkles, Zap, Lock } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    badge: '비용 누수 방지',
    badgeIcon: ShieldAlert,
    mainTitle: "복잡한 재고 관리,\n노동의 함정에서 벗어나세요.",
    subTitle: "가입 즉시 1개월 무료 + 신규 고객 초기 세팅 무료 지원. 지인에게 소개만 해도 평생 10% 할인, 10명 소개 시 평생 무료!",
    tag: 'Cost Control'
  },
  {
    id: 2,
    badge: '완벽한 통제력',
    badgeIcon: Zap,
    mainTitle: "사장님의 눈이 닿지 않는 현장,\n대시보드 하나로 완벽하게 통제하십시오.",
    subTitle: "자동화된 전표 처리와 한눈에 파악되는 재고 흐름. 사람의 실수와 오류를 0%로 만드는 가장 전문적인 유통 ERP.",
    tag: 'Total Control'
  },
  {
    id: 3,
    badge: '투명성과 신뢰',
    badgeIcon: Lock,
    mainTitle: "사람은 실수하지만,\n시스템은 누락하지 않습니다.",
    subTitle: "거래처와 실시간 공유되는 투명한 장부 시스템. 사라지는 재고를 즉각 잡아내는 압도적인 효율을 경험해 보세요.",
    tag: 'Transparency & Trust'
  }
];

const Hero = ({ onOpenInquiry }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        setIsFading(false);
      }, 300); // 300ms fade transition
    }, 5000); // 5초 간격 전환

    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    if (index === currentSlide) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsFading(false);
    }, 300);
  };

  const slide = HERO_SLIDES[currentSlide];
  const BadgeIcon = slide.badgeIcon;

  return (
    <section className="relative bg-slate-950 pt-36 pb-24 lg:pt-44 lg:pb-32 overflow-hidden text-white border-b border-slate-800/80">
      
      {/* 1. Dark Theme Radial Glow & Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-25" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left / Center Main Content */}
        <div className="lg:col-span-8 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">

          {/* Top Pill Category Tag with Fade */}
          <div 
            className={`inline-flex items-center gap-2 bg-slate-900/80 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase mb-6 shadow-lg shadow-blue-500/10 transition-all duration-300 ${
              isFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            <BadgeIcon className="h-3.5 w-3.5 text-orange-400" />
            <span>{slide.badge}</span>
            <span className="w-1 h-1 rounded-full bg-blue-400/50" />
            <span className="text-slate-400 font-semibold">{slide.tag}</span>
          </div>

          {/* 3초/5초 로테이션 메인 카피 & 서브 카피 영역 */}
          <div className="min-h-[220px] sm:min-h-[200px] flex flex-col justify-start">
            
            {/* 메인 카피 */}
            <h1 
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.25] mb-6 text-white drop-shadow-md transition-all duration-300 ${
                isFading ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
              }`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {slide.mainTitle.split("'").map((part, i) => 
                i === 1 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">' {part} '</span> : part
              )}
            </h1>

            {/* 서브 카피 */}
            <p 
              className={`text-base sm:text-lg lg:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mb-8 transition-all duration-300 delay-75 ${
                isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {slide.subTitle}
            </p>
          </div>

          {/* Slider Controls / Indicators */}
          <div className="flex items-center gap-3 mb-10">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx 
                    ? 'w-10 bg-gradient-to-r from-orange-500 to-amber-400 shadow-md shadow-orange-500/30' 
                    : 'w-2.5 bg-slate-800 hover:bg-slate-700'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
            <span className="text-[0.68rem] font-bold text-slate-400 ml-2 font-mono">
              0{currentSlide + 1} / 0{HERO_SLIDES.length}
            </span>
          </div>

          {/* CTA (행동 유도) 버튼 & 보조 혜택 문구 */}
          <div className="w-full flex flex-col items-center lg:items-start gap-4">
            
            {/* 메인 CTA 버튼 */}
            <button 
              onClick={() => onOpenInquiry("도입비 0원, 내 돈 새는 구멍 막기 (1개월 무료 체험)")}
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg px-9 py-4.5 rounded-2xl shadow-[0_10px_35px_rgba(249,115,22,0.35)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Sparkles className="h-5 w-5 text-slate-950 animate-pulse" />
              <span>도입비 0원, 내 돈 새는 구멍 막기 (1개월 무료)</span>
              <ArrowRight className="h-5 w-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Sub Benefits Checklist */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-400 font-bold pt-2">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> 가입비·설치비 0원</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> 1개월 무료체험 & 세팅비 0원</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-amber-400" /> 소개 시 10% 평생 할인 (10명 평생무료)</span>
            </div>

          </div>

        </div>

        {/* Right Side Spacer for floating widgets desktop view */}
        <div className="hidden lg:block lg:col-span-4 h-[380px] pointer-events-none" />

      </div>
    </section>
  );
};

export default Hero;

