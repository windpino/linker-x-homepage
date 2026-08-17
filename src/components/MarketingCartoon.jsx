import React from 'react';
import { PhoneCall, AlertTriangle, Monitor, Sparkles, QrCode, ShieldCheck, TrendingUp, CheckCircle } from 'lucide-react';

const CARTOON_CUTS = [
  {
    id: 1,
    title: "1컷: 순리자의 늪 (문제 제기)",
    subtitle: "비용과 인력에 끌려다니는 노동 함정",
    bubbleText: "전화 주문받을 경리 뽑고, 팜플렛 찍어내고, 기사 바뀔 때마다 처음부터 다시 가르치다 하루가 다 갑니까?",
    caption: "비용과 인력에 끌려다니는 '순리자'의 노동 함정.",
    themeColor: "from-red-500 to-rose-600",
    glowColor: "rgba(239, 68, 68, 0.2)",
    icon: AlertTriangle,
    illustration: (
      <div className="w-full h-40 bg-slate-950 rounded-2xl border border-red-500/20 p-4 flex flex-col justify-between relative overflow-hidden font-mono text-[10px]">
        {/* Messy background effects */}
        <div className="absolute inset-0 bg-red-950/10 opacity-30 pointer-events-none" />
        <div className="flex justify-between items-center text-red-400 border-b border-red-950 pb-2">
          <div className="flex items-center gap-1.5 animate-pulse">
            <PhoneCall size={12} />
            <span className="font-extrabold text-[9px]">부재중 전화 (24건)</span>
          </div>
          <span className="text-red-500 font-extrabold">🚨 업무 마비</span>
        </div>
        <div className="my-2 space-y-1.5 text-slate-400">
          <div className="flex justify-between line-through text-slate-600">
            <span>[재고] 프레시 우유 1L</span>
            <span>수량 오차 발생 (-12 Box)</span>
          </div>
          <div className="flex justify-between text-rose-300">
            <span>[발주] (주)대성유통 수첩 메모</span>
            <span>판독 불가 (누락)</span>
          </div>
        </div>
        <div className="flex justify-start gap-1">
          <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-black text-[9px] uppercase">
            인력 의존형 수작업
          </span>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "2컷: 역행자의 무기 (솔루션 등장)",
    subtitle: "유통 자동화 치트키, 링커엑스",
    bubbleText: "사람에 의존하는 유통은 이제 끝. 사장님의 시간을 100% 돌려드릴 유통 자동화 치트키, 링커엑스!",
    caption: "주문부터 인수 확인까지 손끝 하나로 끝내는 실전형 SCM 플랫폼.",
    themeColor: "from-blue-500 to-indigo-650",
    glowColor: "rgba(59, 130, 246, 0.2)",
    icon: Monitor,
    illustration: (
      <div className="w-full h-40 bg-slate-900 rounded-2xl border border-blue-500/30 p-4 flex flex-col justify-between relative overflow-hidden font-mono text-[10px]">
        {/* Glow grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-25 pointer-events-none" />
        <div className="flex justify-between items-center text-blue-400 border-b border-slate-800 pb-2 z-10">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-cyan-400 animate-spin" />
            <span className="font-extrabold text-[9px]">LINKER X CORE</span>
          </div>
          <span className="text-emerald-400 font-extrabold">Active 🟢</span>
        </div>
        <div className="my-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 z-10 flex flex-col gap-1">
          <div className="flex justify-between text-slate-350">
            <span>시스템 연결 상태</span>
            <span className="text-blue-400 font-extrabold">100% 동기화</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-blue-500 rounded-full w-full animate-pulse" />
          </div>
        </div>
        <div className="flex justify-end gap-1 z-10">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-black text-[9px] uppercase shadow-lg shadow-blue-500/20">
            실시간 클라우드 ERP
          </span>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "3컷: 시스템의 지배 (기능 시연)",
    subtitle: "인건비·홍보비·교육 시간 완전 삭제",
    bubbleText: "거래처가 쇼핑몰처럼 담으면, 주문·배차·출고까지 즉시 자동화됩니다. 기사가 바뀌어도 시스템이 알아서 지시합니다!",
    caption: "인건비·홍보비·교육 시간 완전 삭제.",
    themeColor: "from-emerald-500 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.2)",
    icon: QrCode,
    illustration: (
      <div className="w-full h-40 bg-slate-900 rounded-2xl border border-emerald-500/30 p-4 flex flex-col justify-between relative overflow-hidden font-mono text-[10px]">
        {/* Scanner animation effect */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400 opacity-60 animate-bounce pointer-events-none" />
        <div className="flex justify-between items-center text-emerald-400 border-b border-slate-800 pb-2 z-10">
          <div className="flex items-center gap-1.5">
            <QrCode size={12} className="text-emerald-400" />
            <span className="font-extrabold text-[9px]">자동 상차 & 바코드 검수</span>
          </div>
          <span className="text-emerald-400 font-extrabold">0건 오배송</span>
        </div>
        <div className="my-2 flex items-center justify-between gap-2 z-10">
          <div className="flex-1 space-y-1">
            <p className="text-slate-400 text-[9px]">자동 전표 번호</p>
            <p className="text-white font-extrabold text-xs">TRK-20260817</p>
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl px-2.5 py-2 text-center">
            <p className="text-[8px] font-black uppercase">오배송률</p>
            <p className="text-sm font-black">0%</p>
          </div>
        </div>
        <div className="flex justify-start gap-1 z-10">
          <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[9px] uppercase shadow-lg shadow-emerald-500/10">
            오배송 0% 검증 필
          </span>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "4컷: 압도적 결과 (행동 유도)",
    subtitle: "통장 잔고만 확인하는 여유",
    bubbleText: "미수금 분쟁 0%, 재고 오차 0%. 복잡한 전표 정리는 이제 링커엑스에 맡기고 통장 잔고만 확인하세요!",
    caption: "유통의 차원을 바꾸는 이름, 링커엑스. 지금 30일 무료 체험 및 초기 세팅 지원!",
    themeColor: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.2)",
    icon: ShieldCheck,
    illustration: (
      <div className="w-full h-40 bg-slate-900 rounded-2xl border border-amber-500/30 p-4 flex flex-col justify-between relative overflow-hidden font-mono text-[10px]">
        {/* Trend chart illustration */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
        <div className="flex justify-between items-center text-amber-400 border-b border-slate-800 pb-2 z-10">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-amber-400" />
            <span className="font-extrabold text-[9px]">종합 미수금 & 현금 흐름</span>
          </div>
          <span className="text-amber-400 font-extrabold">최적화 완료</span>
        </div>
        <div className="my-2 flex justify-between items-end z-10">
          <div className="space-y-0.5 text-left">
            <span className="text-[8px] text-slate-400 block">회수 완료액</span>
            <span className="text-white text-base font-extrabold">₩ 124,560,000</span>
          </div>
          <div className="h-10 flex gap-1 items-end">
            <div className="w-2.5 bg-slate-850 h-3 rounded-sm" />
            <div className="w-2.5 bg-slate-800 h-5 rounded-sm" />
            <div className="w-2.5 bg-amber-600 h-8 rounded-sm animate-pulse" />
            <div className="w-2.5 bg-amber-500 h-10 rounded-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-1 z-10">
          <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded text-[9px] uppercase shadow-lg shadow-amber-500/20">
            미수금 분쟁 0%
          </span>
        </div>
      </div>
    )
  }
];

const MarketingCartoon = ({ onOpenInquiry }) => {
  return (
    <section id="marketing-cartoon" className="py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-4 animate-pulse">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Linker X 4컷 마케팅 카툰</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            순리자의 늪에서 역행자의 무기로
          </h2>
          <p className="text-slate-400 text-sm font-semibold leading-relaxed">
            비용과 인력에 끌려다니는 노동의 한계를 넘어, 시스템이 알아서 작동하는 링커엑스 물류 자동화 시나리오를 만나보세요.
          </p>
        </div>

        {/* 4-Cut Cartoon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARTOON_CUTS.map((cut) => {
            const IconComp = cut.icon;
            return (
              <div 
                key={cut.id}
                className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-[32px] p-6.5 shadow-lg flex flex-col justify-between relative group transition-all duration-300 transform hover:-translate-y-1.5"
                style={{
                  boxShadow: `0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
                }}
              >
                {/* Glow backdrop behind cut */}
                <div 
                  className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 10% 10%, ${cut.glowColor}, transparent 50%)`
                  }}
                />

                <div>
                  {/* Top Cut Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cut.title}</span>
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                      <IconComp size={14} />
                    </div>
                  </div>

                  {/* Cut Scene Illustration (CSS Drawing) */}
                  <div className="mb-5.5 relative">
                    {cut.illustration}
                  </div>

                  {/* Cartoon Speech Bubble (말풍선) */}
                  <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4.5 mb-5 shadow-sm text-left select-none text-[11px] font-bold text-slate-200 leading-relaxed">
                    {/* speech bubble triangle point */}
                    <div className="absolute top-[-7.5px] left-8 w-3.5 h-3.5 bg-slate-950 border-t border-l border-slate-800 transform rotate-45" />
                    <span className="relative z-10">"{cut.bubbleText}"</span>
                  </div>
                </div>

                {/* Caption text */}
                <div className="text-left">
                  <p className="text-xs font-black text-white group-hover:text-blue-400 transition-colors">
                    {cut.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action inside Cartoon */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onOpenInquiry('4컷 카툰을 통한 즉시 도입 문의')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs px-8 py-4.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>지금 30일 무료 체험 및 초기 세팅 지원받기 ➔</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default MarketingCartoon;
