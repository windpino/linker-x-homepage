import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { 
  X, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  FileText,
  User
} from 'lucide-react';

const MyDashboardModal = ({ onClose, user }) => {
  const [activeTab, setActiveTab] = useState('contract'); // 'contract' | 'billing' | 'inquiry'
  const [userData, setUserData] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState('기능문의');
  const [inquiryContent, setInquiryContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Calculate remaining D-Days
  const getRemainingDays = (endDateStr) => {
    if (!endDateStr) return 0;
    const end = new Date(endDateStr);
    const today = new Date();
    // Clear hours to calculate pure days
    end.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Fetch Firestore details
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
        // 1) Fetch user specific trial parameters
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }

        // 2) Fetch user inquiries
        await fetchInquiries();
      } catch (err) {
        console.error('Failed to load user contract info:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Fetch inquiries helper
  const fetchInquiries = async () => {
    try {
      const q = query(
        collection(db, 'inquiries'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setInquiries(list);
    } catch (e) {
      console.error('Failed to fetch inquiries:', e);
    }
  };

  // Handle Inquiry Submit
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquirySubject.trim() || !inquiryContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        uid: user.uid,
        email: user.email,
        category: inquiryCategory,
        subject: inquirySubject.trim(),
        content: inquiryContent.trim(),
        status: '답변대기',
        answer: '',
        createdAt: new Date().toISOString()
      });

      // Clear fields and refresh
      setInquirySubject('');
      setInquiryContent('');
      await fetchInquiries();
      alert('1:1 문의가 정상적으로 등록되었습니다. 확인 후 메일 및 대시보드로 답변해 드리겠습니다.');
    } catch (err) {
      console.error('Failed to register inquiry:', err);
      alert('문의 등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingDays = userData ? getRemainingDays(userData.trialEndDate) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.65)', backdropFilter: 'blur(10px)' }}
    >
      <div className="relative w-full max-w-4xl bg-slate-50 border border-slate-200/80 rounded-[32px] shadow-[0_30px_70px_-15px_rgba(2,6,23,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header Ribbon */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 z-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-700 p-2.5 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100 transition-all z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-white border-b border-slate-100 px-8 pt-8 pb-4 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600">
              <User size={16} />
            </div>
            <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Linker X Client Hub</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
            <div>
              <h2 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                마이 비즈니스 대시보드
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-1">계약 현황, 구매 내역 및 1:1 고객지원을 신속하게 확인하세요.</p>
            </div>
            {/* User identity strip */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black text-slate-600">{user.email} 계정</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'contract', label: '계약 및 서비스 현황', icon: Calendar },
              { id: 'billing', label: '구매 및 결제 내역', icon: CreditCard },
              { id: 'inquiry', label: '1:1 고객지원 문의', icon: MessageSquare }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border ${
                    activeTab === tab.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                      : 'bg-white border-slate-200/80 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <IconComp size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="flex-grow p-8 overflow-y-auto min-h-[350px]">
          {isLoadingData ? (
            <div className="h-full flex items-center justify-center flex-col gap-3 py-16">
              <div className="w-8 h-8 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin" />
              <p className="text-xs font-bold text-slate-500">대시보드 데이터를 실시간 로드 중입니다...</p>
            </div>
          ) : (
            <>
              {/* Tab 1: Contract Status */}
              {activeTab === 'contract' && (
                <div className="space-y-6">
                  {/* Highlight card */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full">정상 사용 중</span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full">클라우드 ERP 체험판</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-950 mt-3.5 tracking-tight">
                        링커엑스 클라우드 ERP 솔루션 패키지
                      </h3>
                      <div className="mt-3 flex flex-col sm:flex-row gap-4 text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          계약 개시일: {userData ? new Date(userData.createdAt).toLocaleDateString() : '-'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400" />
                          만료 예정일: {userData ? new Date(userData.trialEndDate).toLocaleDateString() : '-'}
                        </span>
                      </div>
                    </div>
                    {/* Remaining Display */}
                    <div className="bg-blue-600 text-white rounded-[24px] px-6 py-4 shrink-0 text-center shadow-lg shadow-blue-600/10 min-w-[140px]">
                      <p className="text-[10px] font-black uppercase text-blue-200 tracking-wider">남은 체험 기간</p>
                      <p className="text-2xl font-black mt-1">D-{remainingDays}</p>
                      <p className="text-[9.5px] font-bold text-blue-100/90 mt-1">총 30일 중 {remainingDays}일 남음</p>
                    </div>
                  </div>

                  {/* License Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-sm">
                      <h4 className="text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">계약 상세 코드</h4>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between text-xs font-bold text-slate-650">
                        <span>라이선스 키</span>
                        <span className="font-mono text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-lg">LX-TRIAL-{user.uid.slice(0, 8).toUpperCase()}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between text-xs font-bold text-slate-650 mt-2">
                        <span>연동 회사 ID 코드</span>
                        <span className="font-mono text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-lg">{userData?.companyId || '-'}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between text-xs font-bold text-slate-650 mt-2">
                        <span>상호 (회사명)</span>
                        <span className="text-slate-900">{userData?.companyName || '-'}</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-sm">
                      <h4 className="text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">추천인 혜택 현황</h4>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between text-xs font-bold text-slate-650">
                        <span>초대한 친구 수</span>
                        <span className="text-slate-900">{userData?.referralCount || 0}명</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between text-xs font-bold text-slate-650 mt-2">
                        <span>월 이용료 누적 할인율</span>
                        <span className="text-emerald-600 font-extrabold">{userData?.discountRate || 0}% 평생 할인</span>
                      </div>
                    </div>
                  </div>

                  {/* Info alert */}
                  <div className="bg-slate-100/50 border border-slate-200/60 rounded-3xl p-5 text-[11px] font-bold text-slate-600 leading-relaxed flex gap-2.5">
                    <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-slate-950 font-black">정식 버전 전환 및 결제 정보 연동 안내</p>
                      <p className="mt-0.5">체험 기간 종료 3일 전 이메일 및 문자로 안내서가 발송되며, 이후 정식 요금제 선택 시 사용 중인 모든 데이터(재고, 판매 내역)가 유실 없이 그대로 승계됩니다.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Billing History */}
              {activeTab === 'billing' && (
                <div className="space-y-4">
                  {/* Table list */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-bold">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[9.5px] border-b border-slate-100 tracking-wider">
                          <tr>
                            <th className="py-4 px-6">주문/결제 일시</th>
                            <th className="py-4 px-6">상품 및 패키지명</th>
                            <th className="py-4 px-6">결제 금액</th>
                            <th className="py-4 px-6">결제 수단</th>
                            <th className="py-4 px-6 text-right">진행 상태</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {/* We simulate the initial free trial transaction */}
                          <tr>
                            <td className="py-4.5 px-6 font-medium text-slate-500">
                              {userData ? new Date(userData.createdAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="py-4.5 px-6 font-extrabold text-slate-900">
                              링커엑스 ERP 30일 무료 체험 프로모션
                            </td>
                            <td className="py-4.5 px-6 font-extrabold text-blue-600">
                              0원
                            </td>
                            <td className="py-4.5 px-6 text-slate-500">
                              웰컴 혜택 자동 적용
                            </td>
                            <td className="py-4.5 px-6 text-right">
                              <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-100">
                                지급 완료
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Empty statement */}
                  <p className="text-[10px] text-center text-slate-400 font-bold py-6">
                    ※ 현재 무료 체험 프로모션 혜택이 적용 중이므로 별도 유료 구매 내역이 존재하지 않습니다.
                  </p>
                </div>
              )}

              {/* Tab 3: 1:1 Inquiries */}
              {activeTab === 'inquiry' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left: Inquiry submit Form */}
                  <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm">
                    <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                      <Send size={14} className="text-blue-600" />
                      새 1:1 문의 접수
                    </h3>

                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      {/* Category select */}
                      <div>
                        <label className="block text-[9.5px] font-extrabold text-slate-500 uppercase mb-1.5">문의 유형</label>
                        <select
                          value={inquiryCategory}
                          onChange={(e) => setInquiryCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all"
                        >
                          <option value="기능문의">기능 작동 문의</option>
                          <option value="기술지원">바탕화면 설치 및 연동 장애</option>
                          <option value="결제/해지">결제 및 요금 문의</option>
                          <option value="기타">기타 파트너십 제안</option>
                        </select>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-[9.5px] font-extrabold text-slate-500 uppercase mb-1.5">문의 제목</label>
                        <input
                          type="text"
                          value={inquirySubject}
                          onChange={(e) => setInquirySubject(e.target.value)}
                          placeholder="제목을 입력하세요"
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:font-normal"
                          required
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <label className="block text-[9.5px] font-extrabold text-slate-500 uppercase mb-1.5">상세 내용</label>
                        <textarea
                          value={inquiryContent}
                          onChange={(e) => setInquiryContent(e.target.value)}
                          placeholder="문의하실 장애 상황 또는 기능 건의사항을 구체적으로 기재해 주시면 신속하게 답변 드리겠습니다."
                          rows={5}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:font-normal leading-relaxed resize-none"
                          required
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10 transition-all active:scale-98"
                      >
                        {isSubmitting ? '전송 중...' : '1:1 문의 전송하기'}
                      </button>
                    </form>
                  </div>

                  {/* Right: Inquiry List */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                      <MessageSquare size={14} className="text-blue-600" />
                      나의 문의 내역
                      <span className="bg-slate-100 text-slate-650 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                        {inquiries.length}건
                      </span>
                    </h3>

                    {inquiries.length === 0 ? (
                      <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center text-slate-400 font-bold flex flex-col items-center gap-2 shadow-sm">
                        <MessageSquare size={28} className="text-slate-300" />
                        <p className="text-xs">작성하신 1:1 문의 내역이 없습니다.</p>
                        <p className="text-[10px] text-slate-400 font-normal">왼쪽 접수처를 통해 문의해 주세요.</p>
                      </div>
                    ) : (
                      <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                        {inquiries.map((item) => (
                          <div 
                            key={item.id} 
                            className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-sm space-y-3.5"
                          >
                            {/* Header metadata */}
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="bg-slate-150 text-slate-750 text-[9.5px] font-extrabold px-2 py-0.5 rounded-md">
                                  {item.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">
                                  {new Date(item.createdAt).toLocaleString()}
                                </span>
                              </div>
                              {/* Status badge */}
                              {item.status === '답변완료' ? (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                  <CheckCircle size={10} /> 답변 완료
                                </span>
                              ) : (
                                <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                  <Clock size={10} /> 답변 대기
                                </span>
                              )}
                            </div>

                            {/* Inquiry content */}
                            <div>
                              <h4 className="text-xs font-black text-slate-900">{item.subject}</h4>
                              <p className="text-[11px] text-slate-650 font-bold mt-1.5 leading-relaxed whitespace-pre-wrap">
                                {item.content}
                              </p>
                            </div>

                            {/* Response content if exists */}
                            {item.status === '답변완료' && item.answer && (
                              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5 mt-2">
                                <p className="text-[9.5px] font-extrabold text-blue-600 tracking-wider flex items-center gap-1 uppercase">
                                  <span>↳ Customer Support Reply</span>
                                </p>
                                <p className="text-[11px] text-slate-800 font-bold leading-relaxed whitespace-pre-wrap">
                                  {item.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-100 px-8 py-5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400 font-bold">
          <span>🛡️ SSL 보안 암호화 상태로 정보가 처리되고 있습니다.</span>
          <span>링커엑스 대표 지원망: 1588-2220</span>
        </div>

      </div>
    </div>
  );
};

export default MyDashboardModal;
