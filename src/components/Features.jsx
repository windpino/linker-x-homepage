import React, { useState } from 'react';
import { Check, ShieldCheck, ChevronDown, ChevronUp, BarChart3, TrendingUp, Sparkles, ShoppingBag, Eye, Zap, AlertCircle } from 'lucide-react';

const Features = ({ notices = [] }) => {
  const activeNotices = notices.filter(n => n.isActive).slice(0, 3);
  
  // Accordion states for detailed views
  const [showBuyerDetail, setShowBuyerDetail] = useState(false);
  const [showAgentDetail, setShowAgentDetail] = useState(false);

  return (
    <section id="features" className="py-24 bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 px-3.5 py-1.5 rounded-full font-black tracking-wider uppercase">
            LINKER X PROMISE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.3] text-white mt-5 mb-5">
            전표 입력도, 주문 전송도 없이<br/>
            업무 효율을 10배 극대화합니다
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold leading-relaxed">
            비교하느라 고민하지 마세요. 수작업이 완전히 소멸되어 얻어지는 인건비 및 운영 비용 절감 혜택을 직접 확인하세요.
          </p>
        </div>

        {/* 1. TOP HERO METRICS (재고 오류 99.9% 방지와 통합 대시보드 웅장하게 어필) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Metric 1: 재고오류 99.9% 방지 */}
          <div className="relative bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-[32px] p-8 sm:p-10 shadow-lg overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 shadow-md">
                  <ShieldCheck size={24} className="animate-pulse" />
                </div>
                <h3 className="text-slate-400 text-xs font-black uppercase tracking-wider mb-2">Inventory Control</h3>
                <h4 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  재고 오류 99.9% 완벽 차단<br/>
                  실시간 손실 비용 제로화
                </h4>
              </div>
              <div className="mt-8">
                <span className="text-5xl sm:text-6xl font-black text-emerald-400 tracking-tighter block mb-2">99.9%</span>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">
                  수기 기록과 재전송을 생략하고 바코드/RFID 스캔 즉시 클라우드에 반영하여, 분실 및 오차에 따른 재소 손실 비용을 완벽하게 차단합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Metric 2: 대시보드를 통한 한눈에 파악 */}
          <div className="relative bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-[32px] p-8 sm:p-10 shadow-lg overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 mb-6 shadow-md">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-slate-400 text-xs font-black uppercase tracking-wider mb-2">Real-time Visibility</h3>
                <h4 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  통합 관제 대시보드 하나로<br/>
                  모든 물류 흐름을 실시간 파악
                </h4>
              </div>
              <div className="mt-8">
                <span className="text-5xl sm:text-6xl font-black text-blue-400 tracking-tighter block mb-2">All-in-One</span>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">
                  거래처 주문 상태, 배송 일정, 차량별 물류 관제 및 전표 수정/삭제 이력까지 전체 가시성을 단 하나의 대시보드 화면에 모아 완벽히 통제합니다.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 2. INTERACTIVE ACCORDION (자세히 보기 클릭 전까지는 굵직하고 심플하게 제공) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          
          {/* 거래처(Buyer) 간소화 및 아코디언 */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-[32px] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400">
                  <ShoppingBag size={20} />
                </div>
                <h3 className="text-lg font-black text-white">🏢 거래처(바이어) 혜택 요약</h3>
              </div>
              <p className="text-sm font-extrabold text-slate-300 leading-relaxed mb-6">
                "온라인 쇼핑하듯 품목을 장바구니에 담아 발주하고, 실시간 배송 및 정산 상태를 명세서 없이 홈페이지에서 즉시 확인합니다."
              </p>
            </div>

            {/* Accordion Content for Buyer */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showBuyerDetail ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <div className="bg-slate-950/60 rounded-2xl p-5 space-y-4 border border-slate-850">
                <div className="flex gap-3">
                  <Check className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    **장바구니 원클릭 자동 배송:** 구매할 품목을 고르고 클릭하면 즉시 배송이 자동으로 매핑 접수됩니다.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Check className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    **실시간 오배송 & 미배송 모니터링:** 빠진 배송이나 일정 현황을 로그인 후 한눈에 추적합니다.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Check className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    **원하는 정렬 기준의 디지털 명세서:** 일방적 정렬에서 벗어나 거래처 입맛대로 품목/날짜를 필터해 조회합니다.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Check className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    **명세서 없는 실시간 입금 확인:** 주문한 상품의 합계 금액과 정산 잔액을 브라우저에서 투명하게 확인합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setShowBuyerDetail(!showBuyerDetail)}
              className="w-full bg-slate-900 hover:bg-blue-600/10 border border-slate-850 hover:border-blue-500/20 text-slate-300 hover:text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <span>{showBuyerDetail ? '상세 혜택 접기' : '자세히 보기'}</span>
              {showBuyerDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* 회원사(Agent) 간소화 및 아코디언 */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-[32px] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-600/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-lg font-black text-white">🏪 회원사(회원사) 혜택 요약</h3>
              </div>
              <p className="text-sm font-extrabold text-slate-300 leading-relaxed mb-6">
                "거래처가 직접 발주하고 전표를 전송하므로 타이핑 업무가 완전 소멸되며, 오배송과 미수 및 적정 재고관리를 실시간 관제합니다."
              </p>
            </div>

            {/* Accordion Content for Agent */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAgentDetail ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <div className="bg-slate-950/60 rounded-2xl p-5 space-y-4 border border-slate-850">
                <div className="flex gap-3">
                  <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    **전표/주문서 기입 완전 자동화:** 거래처가 직접 전표를 전송하므로 사무 인력의 입력 업무가 100% 생략됩니다.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    **자동 적정재고 예측 계산:** 창고 재고 및 손실을 정밀하게 다듬어 분실과 폐기율을 0%에 가깝게 유지합니다.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    **실시간 미수 및 수납 모니터링:** 각 회원사 직원들의 영업 매출 성과와 미수 결제 상태를 실시간 통합 정산합니다.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    **엄청난 인건비 및 경영 비용 절감:** 업무 간소화를 통해 최소한의 운영비로 최고의 경영 수익을 달성하게 돕습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setShowAgentDetail(!showAgentDetail)}
              className="w-full bg-slate-900 hover:bg-emerald-600/10 border border-slate-850 hover:border-emerald-500/20 text-slate-300 hover:text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <span>{showAgentDetail ? '상세 혜택 접기' : '자세히 보기'}</span>
              {showAgentDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

        </div>

        {/* Notices Section */}
        <div id="notice" className="border-t border-slate-900 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">최신 공지사항</h3>
              <p className="text-slate-500 text-sm mt-1">Linker X 플랫폼의 새로운 업데이트와 중요 안내를 확인하세요.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {activeNotices.length > 0 ? (
              activeNotices.map((notice) => (
                <div key={notice.id} className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
                  <div className="flex gap-4 items-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${notice.type === 'alert' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {notice.type === 'alert' ? '긴급' : '안내'}
                    </span>
                    <span className="font-bold text-white text-base">{notice.title}</span>
                  </div>
                  <span className="text-slate-500 text-xs font-semibold">{notice.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]}</span>
                </div>
              ))
            ) : (
              <div className="bg-slate-900/20 border border-slate-900/60 p-10 text-center text-slate-500 rounded-2xl">
                등록된 최신 공지사항이 없습니다.
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;

