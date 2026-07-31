import React from 'react';
import { ShieldCheck, Cpu, Printer, ChevronRight, Sparkles } from 'lucide-react';

const PRODUCTS_DATA = [
  {
    id: 'erp',
    category: 'ERP 솔루션',
    title: 'Linker X 통합 ERP 패키지',
    subtitle: '월 3만원 대의 가성비 스마트 ERP 솔루션',
    description: '판매·재고·현장영업·수발주·도매몰까지 하나로 통합 관리하는 클라우드 기반 ERP 소프트웨어 패키지입니다.',
    image: '/images/product_erp.png',
    badge: 'BEST SELLER',
    badgeColor: 'bg-blue-600',
    icon: ShieldCheck,
    features: [
      '모바일 & PC 실시간 재고·출고 연동',
      'AI 기반 차량별 자동 배차 및 물류 예측',
      '1개월 무료 체험 제공 (가입비/위약금 0원)'
    ],
    inquiryTopic: 'Linker X ERP 솔루션 도입 문의'
  },
  {
    id: 'hardware',
    category: '하드웨어 장비',
    title: '스마트 POS & 바코드 패키지',
    subtitle: '현장 업무 속도를 2배 높이는 하드웨어',
    description: '초고속 무선 바코드 스캐너, 오프라인 POS 단말기, 블루투스 라벨 프린터 등 전산 연동에 최적화된 하드웨어 세트입니다.',
    image: '/images/product_hw.png',
    badge: 'HARDWARE',
    badgeColor: 'bg-indigo-600',
    icon: Cpu,
    features: [
      '무선 2D/1D 바코드 스캐너 세트',
      'Linker X ERP 전용 원클릭 자동 연동',
      '무상 A/S 1년 지원 및 원격 기술 지원'
    ],
    inquiryTopic: '스마트 하드웨어 장비 구매 문의'
  },
  {
    id: 'paper',
    category: '전산용지 & 소모품',
    title: '프리미엄 전산용지 & 라벨 패키지',
    subtitle: '선명한 인쇄 품질과 번짐 없는 선도',
    description: '영수증용 감열지, 거래명세서 전산용지, 바코드 물류 라벨지 등 최고급 품질의 전산 소모품 전용 패키지입니다.',
    image: '/images/product_paper.png',
    badge: 'SUPPLIES',
    badgeColor: 'bg-emerald-600',
    icon: Printer,
    features: [
      'BPA Free 친환경 최고급 감열지 롤',
      '규격별 맞춤 라벨지 & 전산 인쇄 용지',
      '회원사 전용 도매 특가 공급 패키지'
    ],
    inquiryTopic: '전산용지 및 라벨 소모품 구매 문의'
  }
];

const Products = ({ onOpenInquiry }) => {
  return (
    <section id="products" className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      
      {/* Background Accent Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#1d4ed8] px-3.5 py-1.5 rounded-full text-xs font-bold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Linker X Official Products</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            회원사 & 고객사를 위한 3대 핵심 제품 라인업
          </h2>
          <p className="text-slate-600 text-base font-medium leading-relaxed">
            실제 실물 패키징과 완벽한 시스템 연동을 자랑하는 링커엑스의 3가지 주요 카테고리 제품을 만나보세요.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PRODUCTS_DATA.map((product) => {
            const IconComponent = product.icon;
            return (
              <div 
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Product Packaging Image Area */}
                <div className="relative bg-slate-900 h-64 overflow-hidden flex items-center justify-center p-6">
                  {/* Glowing backdrop circle */}
                  <div className="absolute w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                  
                  {/* Badge */}
                  <div className={`absolute top-4 left-4 ${product.badgeColor} text-white text-[0.68rem] font-black tracking-wider px-3 py-1 rounded-full shadow-md z-10`}>
                    {product.badge}
                  </div>

                  {/* 3D Product Box Image */}
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="max-h-52 max-w-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500 relative z-10"
                  />
                </div>

                {/* Product Info Content */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category Header */}
                    <div className="flex items-center gap-2 text-[#1d4ed8] text-xs font-extrabold uppercase tracking-wider mb-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{product.category}</span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-xl font-extrabold text-slate-900 mb-1 tracking-tight">
                      {product.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mb-4">
                      {product.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                      {product.description}
                    </p>

                    {/* Key Features List */}
                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                      <div className="text-[0.72rem] font-bold text-slate-400 uppercase tracking-wider mb-2.5">주요 특장점</div>
                      <ul className="space-y-2">
                        {product.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onOpenInquiry(product.inquiryTopic)}
                    className="w-full bg-slate-900 hover:bg-[#1d4ed8] text-white font-extrabold py-3.5 px-5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/20 text-sm"
                  >
                    <span>제품 상세 및 도입 문의</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Products;

