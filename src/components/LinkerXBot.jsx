import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, RefreshCw, ChevronRight, Check } from 'lucide-react';

const QUICK_QUESTIONS = [
  { text: "🎁 1개월 무료 체험 신청 방법", type: "free_trial" },
  { text: "💰 월 3만원 외 추가 비용이 있나요?", type: "cost" },
  { text: "🧾 수기 장부/엑셀 이관이 번거로워요", type: "data_transfer" }
];

const BOT_RESPONSES = {
  free_trial: {
    answer: "링커엑스는 사장님들의 완벽한 확신을 위해 **가입비, 도입비, 위약금 0원**으로 모든 기능을 1개월간 100% 무료 체험하실 수 있는 기회를 제공합니다.\n\n아래의 버튼을 클릭하여 간단한 정보만 입력하시면 즉시 체험 신청이 완료됩니다!",
    showAction: true,
    actionText: "1:1 무료 상담 접수",
    actionTopic: "1개월 무료 체험 신청 (챗봇 접수)"
  },
  cost: {
    answer: "추가 비용은 **전혀 없습니다.**\n\n타사 ERP와 다르게 링커엑스는 **월 3만원** 단 하나의 요금제에 실시간 재고 연동, 모바일 수발주, AI 자동 배차 추천 등 프리미엄 기능까지 모두 포함되어 있습니다. 사용자 수 추가 비용도 전혀 발생하지 않으니 안심하세요!",
    showAction: true,
    actionText: "도입 요금 상담 받기",
    actionTopic: "비용/요금 관련 문의 (챗봇 접수)"
  },
  data_transfer: {
    answer: "기존에 쓰시던 엑셀 파일이나 심지어 수기 수첩의 사진만 전달해 주셔도 저희가 클라우드 시스템에 데이터 세팅을 완벽하게 마쳐 드립니다. 엔지니어가 **100% 무료로 대행**해 드리니 걱정 마세요!",
    showAction: true,
    actionText: "장부 이관 무상 대행 신청",
    actionTopic: "수기/엑셀 데이터 이관 문의 (챗봇 접수)"
  },
  default: {
    answer: "궁금하신 점을 남겨주시면 현장 10년 차 대표가 직접 검토한 후 즉시 답변해 드리겠습니다.\n\n아래 버튼을 눌러 상담 접수를 남겨주시거나, 직접 연락처를 적어 주셔도 됩니다!",
    showAction: true,
    actionText: "1:1 간편 도입 문의",
    actionTopic: "챗봇 직접 질문 및 상담 접수"
  }
};

const LinkerXBot = ({ onOpenInquiry }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "반갑습니다, 대표님!\n\n이것저것 비교하느라 **시간 낭비하지 마세요.** 저와 몇 마디 나누면서 어떤 제품이 우리 회사에 딱 맞을지 바로 판단하세요.\n\n복잡하고 귀찮은 건 전부 저한테 다 물어보시면 됩니다. 무엇부터 해결해 드릴까요? 😎",
      isWelcome: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Diagnostic State Machine
  const [diagStep, setDiagStep] = useState(0); // 0: Idle, 1: Industry, 2: PainPoint, 3: Hardware, 4: Done
  const [diagAnswers, setDiagAnswers] = useState({
    industry: '',
    painPoint: '',
    hardware: ''
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Handle standard responses (Non-diagnostic)
  const handleSendMessage = (text, type = null) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responseKey = type || 'default';
      const botReply = BOT_RESPONSES[responseKey] || BOT_RESPONSES.default;
      
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: botReply.answer,
        action: botReply.showAction ? {
          text: botReply.actionText,
          topic: botReply.actionTopic
        } : null
      }]);
    }, 800);
  };

  const handleQuickQuestion = (q) => {
    handleSendMessage(q.text.replace(/^[^\s]+\s/, ''), q.type);
  };

  // Start Diagnostic Process
  const startDiagnosis = () => {
    setDiagStep(1);
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: "🎯 맞춤 제품 추천 받아보기" },
      {
        sender: 'bot',
        text: "좋습니다! 딱 3가지 질문을 통해 가장 알맞은 솔루션을 진단해 드리겠습니다.\n\n**첫 번째 질문:** 어떤 업종의 비즈니스를 운영 중이신가요?",
        isDiagnosticOptions: true,
        options: [
          { text: "🏢 B2B 도소매 및 유통업", val: "B2B 도소매/유통", type: "industry" },
          { text: "🏭 제조업 및 생산 공장", val: "제조/생산", type: "industry" },
          { text: "🏪 일반 오프라인 소매 매장", val: "소매 매장", type: "industry" },
          { text: "❓ 기타 및 서비스 업종", val: "기타 업종", type: "industry" }
        ]
      }
    ]);
  };

  // Handle Diagnostic Option Clicking
  const handleSelectOption = (opt) => {
    // 1. Add user message
    setMessages(prev => [...prev, { sender: 'user', text: opt.text }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      // Update answers state
      const nextAnswers = { ...diagAnswers, [opt.type]: opt.val };
      setDiagAnswers(nextAnswers);

      if (diagStep === 1) {
        // Go to Step 2: PainPoint
        setDiagStep(2);
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: "접수되었습니다.\n\n**두 번째 질문:** 현재 비즈니스에서 가장 골치 아픈 점은 무엇인가요?",
            isDiagnosticOptions: true,
            options: [
              { text: "📦 수시로 틀어지는 창고 재고 오차", val: "재고 오차", type: "painPoint" },
              { text: "🧾 수발주 거래처 전표 누락 사고", val: "전표 누락", type: "painPoint" },
              { text: "🚚 비효율적인 차량 배차 및 배송 경로", val: "배차 비효율", type: "painPoint" },
              { text: "✍️ 엑셀 및 손장부 관리의 귀찮음", val: "장부 귀찮음", type: "painPoint" }
            ]
          }
        ]);
      } else if (diagStep === 2) {
        // Go to Step 3: Hardware
        setDiagStep(3);
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: "알겠습니다. 마지막 단계입니다!\n\n**세 번째 질문:** 시스템과 연동할 물류 하드웨어 장비(스캐너, POS, 프린터 등)도 필요하신가요?",
            isDiagnosticOptions: true,
            options: [
              { text: "💻 장비 필요 없음 (소프트웨어/ERP만)", val: "ERP 단독", type: "hardware" },
              { text: "⚙️ 장비 연동 패키지 필요 (스캐너 + POS)", val: "하드웨어 포함", type: "hardware" },
              { text: "🖨️ 전산용지 & 바코드 라벨만 대량 필요", val: "용지 대량", type: "hardware" }
            ]
          }
        ]);
      } else if (diagStep === 3) {
        // Process Recommendation Result
        setDiagStep(4);
        const recommendation = evaluateRecommendation(nextAnswers);
        
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `🎯 **진단이 완료되었습니다!**\n\n대표님의 비즈니스 조건에 따른 맞춤 추천 상품은 다음과 같습니다.\n\n----------------------------\n🎁 **추천 상품:**\n**[${recommendation.title}]**\n\n💡 **추천 이유:**\n${recommendation.reason}\n\n💸 **가입 혜택:**\n- 1개월 간 전 기능 100% 무상 제공\n- 엔지니어 1:1 무상 셋업 대행 지원`,
            isResult: true,
            resultData: recommendation
          }
        ]);
      }
    }, 800);
  };

  // Diagnostic Rule Engine
  const evaluateRecommendation = (answers) => {
    const { industry, painPoint, hardware } = answers;

    if (hardware === "용지 대량") {
      return {
        title: "Linker X 프리미엄 전산용지 & 소모품 실속 대량 패키지",
        reason: "시스템 소프트웨어보다는 소모품 대량 수급에 관심이 있으시군요! 번짐 없고 내구성이 뛰어난 프리미엄 전산용지와 라벨지를 회원사 도매 특가로 저렴하게 납품해 드립니다.",
        topic: "전산용지 및 라벨 대량 구매 견적 문의 (진단 결과)"
      };
    }

    if (hardware === "하드웨어 포함") {
      return {
        title: "Linker X 스마트 하드웨어 + 모바일 ERP 통합 풀패키지",
        reason: `${industry} 업종에서 발생하는 ${painPoint} 문제를 해결하기 위해, 전용 무선 바코드 스캐너와 POS 단말기를 모바일 ERP 앱과 실시간 자동 동기화하여 수동 입력 오차를 100% 차단해 주는 풀패키지를 강력 추천합니다.`,
        topic: "스마트 하드웨어 + 모바일 ERP 풀패키지 도입 문의 (진단 결과)"
      };
    }

    // Default or ERP 단독
    let erpDetails = "B2B ERP 소프트웨어 패키지";
    if (industry === "제조/생산") {
      erpDetails = "자재 소요량(BOM) 및 공정 모니터링 모듈이 가미된 제조 특화 ERP 패키지";
    } else if (painPoint === "배차 비효율") {
      erpDetails = "AI 자동 최적 배차 및 차량 관제 기능이 탑재된 물류특화 ERP 패키지";
    }

    return {
      title: `Linker X 프리미엄 통합 ERP 소프트웨어 단독 패키지`,
      reason: `장비 구매 없이 기존 PC 및 스마트폰만으로 구동 가능한 패키지입니다. ${industry} 환경에서 가장 치명적인 ${painPoint} 문제를 실시간 클라우드 장부 연동 및 자동화 필터링 기능으로 누수 없이 완벽히 해결해 드립니다.`,
      topic: `${erpDetails} 도입 및 1개월 무료 체험 신청 (진단 결과)`
    };
  };

  // Reset Diagnostic State
  const resetDiagnosis = () => {
    setDiagStep(0);
    setDiagAnswers({ industry: '', painPoint: '', hardware: '' });
    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: "진단을 초기화했습니다. 다시 시작해 볼까요? 🚀",
        isWelcome: true
      }
    ]);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 font-sans">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-tr from-blue-600 via-[#1d4ed8] to-indigo-650 rounded-full shadow-[0_10px_30px_rgba(29,78,216,0.45)] hover:shadow-[0_12px_35px_rgba(29,78,216,0.65)] flex items-center justify-center text-white hover:scale-105 transition-all duration-300 group"
        >
          <MessageSquare className="h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-black items-center justify-center">1</span>
          </span>
        </button>
      )}

      {/* Main Diagnostic Chat Box */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[580px] bg-slate-950/95 border border-slate-800 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 relative">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Linker X AI 진단봇</h4>
                <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                  <span>실시간 추천 가동 중</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Message List area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-xs font-black shrink-0">
                    봇
                  </div>
                )}
                <div className="flex flex-col gap-2 max-w-[80%]">
                  
                  {/* Bubble Message */}
                  <div 
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed font-semibold shadow-md whitespace-pre-line ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-slate-900 border border-slate-800/80 text-slate-300 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* 1. Welcome action buttons */}
                  {msg.isWelcome && diagStep === 0 && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      <button
                        onClick={startDiagnosis}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-black py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-200"
                      >
                        <Sparkles size={13} className="animate-pulse" />
                        <span>🚀 3초 만에 우리 맞춤 제품 진단하기</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  )}

                  {/* 2. Step selections buttons inside chatbot bubble */}
                  {msg.isDiagnosticOptions && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      {msg.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(opt)}
                          className="w-full bg-slate-900 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/30 text-slate-300 hover:text-white text-[11px] font-bold py-2.5 px-3.5 rounded-xl text-left transition-all duration-150 flex items-center justify-between group"
                        >
                          <span>{opt.text}</span>
                          <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 3. Final Recommendation Actions */}
                  {msg.isResult && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      <button
                        onClick={() => onOpenInquiry(msg.resultData.topic)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-black py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-200"
                      >
                        <Check size={13} />
                        <span>추천 상품 도입 & 1개월 무료 신청</span>
                      </button>
                      <button
                        onClick={resetDiagnosis}
                        className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                      >
                        <RefreshCw size={11} />
                        <span>처음부터 다시 진단하기</span>
                      </button>
                    </div>
                  )}

                  {/* 4. Ordinary default action buttons */}
                  {msg.action && !msg.isResult && (
                    <button
                      onClick={() => onOpenInquiry(msg.action.topic)}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-[11px] font-black py-2.5 px-4 rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 text-center"
                    >
                      {msg.action.text}
                    </button>
                  )}

                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">
                  봇
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-slate-400 text-xs flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Action tags at bottom */}
          <div className="p-3 bg-slate-950 border-t border-slate-900 flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-850 text-[10px] font-bold text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-full transition-all duration-200"
              >
                {q.text}
              </button>
            ))}
          </div>

          {/* User Chat Input Box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3.5 bg-slate-900/60 border-t border-slate-900/80 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="질문을 입력하세요..."
              className="flex-1 bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl shadow-lg shadow-blue-600/10 hover:shadow-blue-500/25 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default LinkerXBot;

