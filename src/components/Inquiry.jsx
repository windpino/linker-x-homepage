import React, { useState } from 'react';
import { X, Send, Building2, User, Phone, Mail, MessageSquare, Package, KeyRound } from 'lucide-react';

const Inquiry = ({ onClose, onSubmitInquiry, initialContent = '' }) => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [contact, setContact] = useState('');
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !companyName || !applicantName || !contact) {
      alert('ID(이메일), 회사명, 신청자명, 연락처는 필수 입력 항목입니다.');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        id: String(Date.now()),
        type: 'general',
        companyName,
        ceoName: applicantName,
        email,
        contact,
        password: '',
        category: '',
        content,
        status: 'received',
        appliedAt: new Date().toISOString()
      };

      const success = await onSubmitInquiry(data);
      if (success) {
        alert('신청이 접수되었습니다!\n담당자가 영업일 기준 24시간 내 연락드리겠습니다.');
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('제출 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">

        {/* Top colorful gradient accent bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" />

        {/* Header */}
        <div className="px-8 pt-8 pb-5 border-b border-slate-100/85 bg-slate-50/50">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-slate-400 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-650 p-2.5 rounded-2xl text-white shadow-md shadow-blue-500/10">
              <Package className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Linker X 도입 신청</h3>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">1개월 무료 체험 및 정식 가입 신청 양식</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4.5 bg-white">

          {/* 1. ID (이메일) */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 tracking-wider uppercase flex items-center gap-1">
              <span>ID (이메일)</span>
              <span className="text-blue-600 font-bold">*</span>
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200/80 hover:border-slate-350 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-10.5 pr-4 text-slate-850 text-[13px] font-bold outline-none transition-all placeholder:text-slate-300 placeholder:font-normal focus:ring-4 focus:ring-blue-500/10"
                placeholder="사용하실 이메일 주소를 입력하세요"
                required
              />
            </div>
          </div>

          {/* 2. 회사명 */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 tracking-wider uppercase flex items-center gap-1">
              <span>회사명</span>
              <span className="text-blue-600 font-bold">*</span>
            </label>
            <div className="relative group">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200/80 hover:border-slate-350 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-10.5 pr-4 text-slate-855 text-[13px] font-bold outline-none transition-all placeholder:text-slate-300 placeholder:font-normal focus:ring-4 focus:ring-blue-500/10"
                placeholder="회사명 또는 상호를 입력하세요"
                required
              />
            </div>
          </div>

          {/* 3. 신청자명 + 4. 연락처 */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 tracking-wider uppercase flex items-center gap-1">
                <span>신청자명</span>
                <span className="text-blue-600 font-bold">*</span>
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  className="w-full bg-slate-50/60 border border-slate-200/80 hover:border-slate-350 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-10.5 pr-3 text-slate-855 text-[13px] font-bold outline-none transition-all placeholder:text-slate-300 placeholder:font-normal focus:ring-4 focus:ring-blue-500/10"
                  placeholder="성함"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 tracking-wider uppercase flex items-center gap-1">
                <span>연락처</span>
                <span className="text-blue-600 font-bold">*</span>
              </label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  className="w-full bg-slate-50/60 border border-slate-200/80 hover:border-slate-350 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-10.5 pr-3 text-slate-855 text-[13px] font-bold outline-none transition-all placeholder:text-slate-300 placeholder:font-normal focus:ring-4 focus:ring-blue-500/10"
                  placeholder="010-0000-0000"
                  required
                />
              </div>
            </div>
          </div>

          {/* 5. 기타 요청사항 */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 tracking-wider uppercase">
              기타 요청사항
            </label>
            <div className="relative group">
              <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={3}
                className="w-full bg-slate-50/60 border border-slate-200/80 hover:border-slate-350 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-10.5 pr-4 text-slate-855 text-[13px] font-bold outline-none transition-all resize-none placeholder:text-slate-300 placeholder:font-normal focus:ring-4 focus:ring-blue-500/10 h-24"
                placeholder="추가적인 요청사항이나 문의사항을 기재해 주세요."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 disabled:opacity-60 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 text-sm mt-3"
          >
            <Send className="h-4.5 w-4.5" />
            {isLoading ? '신청서 전송 중...' : '가입하기'}
          </button>

          <p className="text-center text-[10px] text-slate-400 font-bold">
            🔒 입력하신 모든 정보는 암호화 처리되어 안전하게 보관됩니다.
          </p>
        </form>

      </div>
    </div>
  );
};

export default Inquiry;

