import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { X, Lock, AlertCircle, User, Phone, Sparkles, UserPlus, ShieldCheck } from 'lucide-react';

const SignupModal = ({ onClose, onOpenLogin }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createOrGetUserDoc = async (user, company, manager, contact, id, rawPassword) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const now = new Date();
      // 1. Create client user info in homepage 'users'
      await setDoc(userDocRef, {
        uid: user.uid,
        loginId: id.trim(),
        password: rawPassword,
        companyName: company.trim(),
        managerName: manager.trim(),
        phone: contact.trim(),
        role: 'customer',
        status: 'active',
        createdAt: now.toISOString()
      });

      // 2. Create inquiry request for SuperAdmin approval
      const inquiryId = 'inq_' + Date.now();
      await setDoc(doc(db, 'agency_inquiries', inquiryId), {
        id: inquiryId,
        uid: user.uid,
        type: 'agency',
        status: 'pending',
        companyName: company.trim(),
        ceoName: manager.trim(),
        email: id.trim(),
        password: rawPassword,
        contact: contact.trim(),
        content: '홈페이지 회원가입 신청',
        appliedAt: now.toISOString()
      });
      return true;
    }
    return false;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginId || !password) {
      setErrorMsg('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자리 이상이어야 합니다.');
      return;
    }
    if (!companyName.trim()) {
      setErrorMsg('회사명(상호)을 입력해 주세요.');
      return;
    }
    if (!managerName.trim()) {
      setErrorMsg('담당자명을 입력해 주세요.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('전화번호(연락처)를 입력해 주세요.');
      return;
    }

    const trimmedId = loginId.trim().toLowerCase();
    const virtualEmail = `${trimmedId}@linkerx-user.local`;

    setIsLoading(true);
    try {
      // Create user inside Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, password);
      const user = userCredential.user;

      // Save user doc & inquiry doc
      await createOrGetUserDoc(user, companyName, managerName, phone, loginId, password);

      alert(
        '회원가입 및 도입 상담 신청이 성공적으로 접수되었습니다!\n슈퍼관리자의 가입 승인 후 링커엑스 시스템을 이용하실 수 있습니다.'
      );
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('이미 등록된 아이디입니다.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('유효하지 않은 아이디 형식입니다. (영문, 숫자 권장)');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('비밀번호가 너무 약합니다. 6자 이상 지정해주세요.');
      } else {
        setErrorMsg('회원가입 중 오류가 발생했습니다: ' + err.message);
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
      <div className="relative w-full max-w-[500px] bg-white rounded-[32px] shadow-[0_30px_70px_-15px_rgba(2,6,23,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200/50">
        
        {/* Top Accent Ribbon */}
        <div className="h-1.5 w-full bg-blue-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-700 p-2.5 rounded-2xl hover:bg-slate-50 transition-all z-20"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 flex flex-col justify-center">
          
          {/* Logo / Branding */}
          <div className="flex flex-col items-center mt-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md mb-2">
              <span className="font-black text-base text-white">LX</span>
            </div>
            <h2 className="text-xl font-black text-slate-950 tracking-tight">
              회원사 무료체험 신청
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1 text-center">
              가입 즉시 1개월 무료 혜택 제공! 상담 후 즉시 승인됩니다.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Top Welcome Banner */}
            <div className="bg-blue-50/70 border border-blue-100/60 rounded-2xl p-3 flex items-start gap-2">
              <Sparkles className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] text-blue-700 font-extrabold">가입 즉시 1개월 무료 혜택 제공!</p>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">링커엑스 물류통합 시스템을 제한 없이 체험해 보세요.</p>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 text-[12.5px] font-bold text-red-650 flex items-center gap-1.5">
                <AlertCircle size={14} className="shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* User ID Input */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                접속 아이디 설정
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="영문, 숫자 조합 권장"
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-slate-900 text-[14px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                비밀번호 설정
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자리 이상 비밀번호 입력"
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-slate-900 text-[14px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Company Name Input */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                회사명 (상호)
              </label>
              <div className="relative group">
                <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="상호명 입력"
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-slate-900 text-[14px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Manager Name & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  담당자명 (실명)
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="담당자 성함"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-slate-900 text-[14px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  전화번호 (연락처)
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-slate-900 text-[14px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all text-[15px] mt-2"
            >
              {isLoading ? '신청 처리 중...' : '무료 체험판 시작하기'}
            </button>

            {/* Navigation to Login */}
            <div className="text-center pt-2 text-xs font-bold text-slate-500">
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="text-blue-600 hover:text-blue-700 font-extrabold hover:underline"
              >
                로그인하기
              </button>
            </div>

            <hr className="border-slate-100/80 my-3" />

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>가입 정보는 개인정보 보호정책에 따라 안전하게 보관됩니다.</span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
