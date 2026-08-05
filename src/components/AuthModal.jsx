import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendEmailVerification 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';
import { X, Mail, Lock, Gift, UserPlus, LogIn, Sparkles, AlertCircle, ShieldCheck, Package, BadgeCheck, User, Phone } from 'lucide-react';

const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const AuthModal = ({ onClose, initialTab = 'signup' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'signup' or 'login'
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [referredByInput, setReferredByInput] = useState('');
  const [companyIdInput, setCompanyIdInput] = useState('');
  const [companyNameInput, setCompanyNameInput] = useState('');
  const [managerNameInput, setManagerNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Parse URL query parameters to check for referral code automatically
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setReferredByInput(refCode.toUpperCase());
    }
  }, []);

  // Safe user doc creation helper for custom register
  const createOrGetUserDoc = async (user, companyName = '', managerName = '', phone = '', loginId = '', rawPassword = '') => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const now = new Date();
      // 1. Create client user info in homepage 'users' (Does not touch Linker X companies directly)
      await setDoc(userDocRef, {
        uid: user.uid,
        loginId: loginId.trim(),
        password: rawPassword, // 보존용 패스워드
        companyName: companyName.trim(),
        managerName: managerName.trim(),
        phone: phone.trim(),
        status: 'pending_approve',
        createdAt: now.toISOString()
      });

      // 2. Create inquiry request so SuperAdmin can approve
      const inquiryId = 'inq_' + Date.now();
      await setDoc(doc(db, 'agency_inquiries', inquiryId), {
        id: inquiryId,
        uid: user.uid,
        type: 'agency',
        status: 'pending',
        companyName: companyName.trim(),
        ceoName: managerName.trim(),
        email: loginId.trim(), // ID를 email 필드로 매핑하여 SuperAdmin 연동
        password: rawPassword,
        contact: phone.trim(),
        content: '홈페이지 회원가입 신청',
        appliedAt: now.toISOString()
      });
      return true; // New registration
    }
    return false; // Existing login
  };




  // 3. Custom ID signup/login using virtual email mapping
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    if (!loginId || !password) {
      setErrorMsg('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자리 이상이어야 합니다.');
      return;
    }

    const trimmedId = loginId.trim().toLowerCase();
    const virtualEmail = `${trimmedId}@linkerx-user.local`;

    setIsLoading(true);
    try {
      if (activeTab === 'signup') {
        // 0. Company details validation
        if (!companyNameInput.trim()) {
          setErrorMsg('상호(회사명)를 입력해 주세요.');
          setIsLoading(false);
          return;
        }
        if (!managerNameInput.trim()) {
          setErrorMsg('담당자명을 입력해 주세요.');
          setIsLoading(false);
          return;
        }
        if (!phoneInput.trim()) {
          setErrorMsg('전화번호(연락처)를 입력해 주세요.');
          setIsLoading(false);
          return;
        }

        // Firebase Auth User Creation using virtual email
        const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, password);
        const user = userCredential.user;

        // Save signup information locally inside users and agency_inquiries collections only (approval-required)
        await createOrGetUserDoc(user, companyNameInput, managerNameInput, phoneInput, loginId, password);
        
        alert('회원가입 및 도입 상담 신청이 성공적으로 접수되었습니다!\n슈퍼관리자의 가입 승인 후 링커엑스 시스템을 이용하실 수 있습니다.');
      } else {
        // Login flow using virtual email
        await signInWithEmailAndPassword(auth, virtualEmail, password);
        alert('로그인되었습니다!');
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('이미 등록된 아이디입니다.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('유효하지 않은 아이디 형식입니다. (영문, 숫자 권장)');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('비밀번호가 너무 약합니다. 6자 이상 지정해주세요.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setErrorMsg('처리 중 오류가 발생했습니다: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.65)', backdropFilter: 'blur(10px)' }}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_30px_70px_-15px_rgba(2,6,23,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200/50">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-700 p-2.5 rounded-2xl hover:bg-slate-50 transition-all z-20"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row min-h-[580px]">
          
          {/* Left Panel: SaaS Premium Branding & trust indications */}
          <div className="hidden md:flex md:w-[360px] bg-slate-900 text-white p-10 flex-col justify-between relative shrink-0">
            {/* Elegant dark grid background */}
            <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />

            {/* Branding Top */}
            <div className="z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                  <span className="font-black text-sm text-white">LX</span>
                </div>
                <span className="font-extrabold text-sm tracking-tight text-white uppercase">Linker X System</span>
              </div>
              <h2 className="text-2xl font-black leading-tight text-slate-100 tracking-tight">
                유통·물류 ERP의<br />
                새로운 패러다임
              </h2>
              <p className="text-[11px] text-slate-400 font-bold mt-3 leading-relaxed">
                복잡한 재고 계산부터 자동 수발주 연동까지, 단 하나의 강력한 클라우드 솔루션으로 통합 제어하세요.
              </p>
            </div>

            {/* Middle Marketing Value list */}
            <div className="space-y-5 z-10 my-auto">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-black text-slate-200">실시간 판매·재고 통합 관리</h4>
                  <p className="text-[11.5px] text-slate-400 font-semibold mt-0.5 leading-relaxed">판매 등록과 동시에 재고가 즉시 차감되며 창고별 흐름을 실시간 추적합니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Package size={16} />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-black text-slate-200">도매몰 주문 & 자동 발주</h4>
                  <p className="text-[11.5px] text-slate-400 font-semibold mt-0.5 leading-relaxed">거래처 주문 수집부터 출하 관리, 자동 발주까지 업무 리소스를 대폭 줄여줍니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <BadgeCheck size={16} />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-black text-slate-200">모바일 앱 & 무선 바코드 연동</h4>
                  <p className="text-[11.5px] text-slate-400 font-semibold mt-0.5 leading-relaxed">스마트폰 주문 즉시 대시보드에 연동되며, 무선 스캐너 및 PDA 입력도 호환됩니다.</p>
                </div>
              </div>
            </div>

            {/* Footer Trust Details */}
            <div className="z-10 border-t border-slate-800/80 pt-5 flex items-center justify-between text-[11px] text-slate-500 font-bold">
              <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-500" /> SSL 보안 인증망</span>
              <span>1588-2220</span>
            </div>
          </div>

          {/* Right Panel: Clean form sheet */}
          <div className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-center">
            
            {/* Header Tabs */}
            <div className="flex border-b border-slate-100 mb-8">
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setErrorMsg(''); setInfoMsg(''); }}
                className={`flex-1 pb-4 text-[16px] transition-all border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'signup' 
                    ? 'border-blue-600 text-slate-950 font-black' 
                    : 'border-transparent text-slate-400 hover:text-slate-600 font-bold'
                }`}
              >
                <UserPlus size={16} />
                회원가입
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMsg(''); setInfoMsg(''); }}
                className={`flex-1 pb-4 text-[16px] transition-all border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'login' 
                    ? 'border-blue-600 text-slate-950 font-black' 
                    : 'border-transparent text-slate-400 hover:text-slate-600 font-bold'
                }`}
              >
                <LogIn size={16} />
                로그인
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAuth} className="space-y-5">
              
              {/* Tagline Info */}
              {activeTab === 'signup' && (
                <div className="bg-blue-50/70 border border-blue-100/60 rounded-2xl p-4 flex items-start gap-2.5">
                  <Sparkles className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] text-blue-700 font-extrabold">가입 즉시 1개월 무료 혜택 제공!</p>
                    <p className="text-[11.5px] text-slate-500 font-bold mt-0.5">링커엑스 물류통합 시스템을 제한 없이 체험해 보세요.</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 text-[13px] font-bold text-red-650 flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Info/Verification Message */}
              {infoMsg && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-3.5 text-[13px] font-bold leading-relaxed flex gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                  <span>{infoMsg}</span>
                </div>
              )}

              {/* Login ID input (Always first) */}
              <div>
                <label className="block text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">접속 아이디</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    value={loginId}
                    onChange={e => setLoginId(e.target.value)}
                    placeholder="아이디 입력"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-[15px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                    required
                  />
                </div>
              </div>

              {/* Password input (Always second) */}
              <div>
                <label className="block text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">비밀번호</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="6자리 이상 입력"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-[15px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                    required
                  />
                </div>
              </div>

              {/* Company Name input (Signup Only) */}
              {activeTab === 'signup' && (
                <>
                  <div>
                    <label className="block text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">회사명 (상호)</label>
                    <div className="relative group">
                      <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        value={companyNameInput}
                        onChange={e => setCompanyNameInput(e.target.value)}
                        placeholder="상호명 입력"
                        className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-[15px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">담당자명 (실명)</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="text"
                          value={managerNameInput}
                          onChange={e => setManagerNameInput(e.target.value)}
                          placeholder="담당자 성함"
                          className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-[15px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">전화번호 (연락처)</label>
                      <div className="relative group">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="text"
                          value={phoneInput}
                          onChange={e => setPhoneInput(e.target.value)}
                          placeholder="예: 010-1234-5678"
                          className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-[15px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all text-[16px] mt-3"
              >
                {isLoading ? '요청 처리 중...' : activeTab === 'signup' ? '무료 체험판 시작하기' : '로그인'}
              </button>



              {/* Guide text */}
              <p className="text-center text-[12px] text-slate-400 font-bold">
                {activeTab === 'signup' 
                  ? '가입 시 개인정보 수집 및 링커엑스 무료체험 약관에 동의하게 됩니다.' 
                  : '비밀번호 분실 등 계정 관련 문의는 고객센터(1588-2220)로 연락해 주세요.'
                }
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
