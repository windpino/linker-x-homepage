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
import { X, Mail, Lock, Gift, UserPlus, LogIn, Sparkles, AlertCircle, ShieldCheck, Package, BadgeCheck } from 'lucide-react';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referredByInput, setReferredByInput] = useState('');
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

  // Safe user doc creation helper for social logins
  const createOrGetUserDoc = async (user, referredByCode = '') => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // Setup user trial date
      const now = new Date();
      const trialEnd = new Date();
      trialEnd.setDate(now.getDate() + 30);

      // Generate unique referral code for this new user
      const newReferralCode = generateReferralCode();
      let referredByClean = referredByCode.trim().toUpperCase();

      // Process referral reward if code is provided
      let isReferralValid = false;
      let inviterUid = null;
      let inviterCurrentCount = 0;

      if (referredByClean) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('referralCode', '==', referredByClean));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const inviterDoc = querySnapshot.docs[0];
          inviterUid = inviterDoc.id;
          const inviterData = inviterDoc.data();
          inviterCurrentCount = inviterData.referralCount || 0;
          isReferralValid = true;
        } else {
          referredByClean = '';
        }
      }

      // Create new user document
      await setDoc(userDocRef, {
        email: user.email,
        createdAt: now.toISOString(),
        trialEndDate: trialEnd.toISOString(),
        referralCode: newReferralCode,
        referredBy: referredByClean || null,
        discountRate: 0,
        referralCount: 0
      });

      // Update inviter's referral rewards if valid
      if (isReferralValid && inviterUid) {
        const inviterDocRef = doc(db, 'users', inviterUid);
        const newCount = inviterCurrentCount + 1;
        const newDiscount = Math.min(newCount * 10, 100);

        await updateDoc(inviterDocRef, {
          referralCount: increment(1),
          discountRate: newDiscount
        });
      }
      return true; // New registration
    }
    return false; // Existing user login
  };

  // 1. Google OAuth Signup/Login
  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setInfoMsg('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection popup
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const isNewUser = await createOrGetUserDoc(result.user, referredByInput);
      
      if (isNewUser) {
        alert('구글 계정으로 링커엑스 1개월 무료 회원가입이 완료되었습니다!');
      } else {
        alert('구글 계정으로 로그인되었습니다!');
      }
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('구글 로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };


  // 3. Regular Email signup/login with email verification link trigger
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자리 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === 'signup') {
        // Firebase Auth User Creation
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user profile in Firestore
        await createOrGetUserDoc(user, referredByInput);

        // Send Email Verification Link
        try {
          await sendEmailVerification(user);
          setInfoMsg('💌 입력하신 메일로 인증 링크를 발송했습니다. 인증을 완료해 주세요!');
          alert('회원가입 완료!\n전송된 메일함에서 링크를 클릭하여 인증을 완료해 주세요.');
        } catch (mailErr) {
          console.warn('Mail send error:', mailErr);
          alert('회원가입이 완료되었습니다! (마이 대시보드로 이동합니다.)');
        }
      } else {
        // Login flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          // Warn but still allow logging in during testing phase
          setInfoMsg('⚠️ 아직 이메일 인증이 완료되지 않았습니다. 메일함에서 인증 메일을 클릭해 주세요.');
        } else {
          alert('로그인되었습니다!');
        }
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('이미 사용 중인 이메일 주소입니다.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('유효하지 않은 이메일 형식입니다.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('비밀번호가 너무 약합니다. 6자 이상 지정해주세요.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
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
          <div className="hidden md:flex md:w-[360px] bg-slate-950 text-white p-10 flex-col justify-between relative shrink-0">
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
                  <h4 className="text-[11.5px] font-black text-slate-200">1,200+ 유통사 실시간 파트너</h4>
                  <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5 leading-relaxed">검증된 대규모 트래픽 및 오차 없는 판매 정산 엔진 탑재</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Package size={16} />
                </div>
                <div>
                  <h4 className="text-[11.5px] font-black text-slate-200">평균 업무 리소스 35% 감소</h4>
                  <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5 leading-relaxed">단순 입출고부터 회계 마감까지 클릭 한 번으로 완전 자동화</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <BadgeCheck size={16} />
                </div>
                <div>
                  <h4 className="text-[11.5px] font-black text-slate-200">모바일 / 스캐너 무선 연동</h4>
                  <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5 leading-relaxed">현장 주문 등록 및 창고 스캔 즉시 대시보드 실시간 동기화</p>
                </div>
              </div>
            </div>

            {/* Footer Trust Details */}
            <div className="z-10 border-t border-slate-800/80 pt-5 flex items-center justify-between text-[9px] text-slate-500 font-bold">
              <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-500" /> SSL 보안 인증망</span>
              <span>1566-8680</span>
            </div>
          </div>

          {/* Right Panel: Clean form sheet */}
          <div className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-center">
            
            {/* Header Tabs */}
            <div className="flex border-b border-slate-100 mb-8">
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setErrorMsg(''); setInfoMsg(''); }}
                className={`flex-1 pb-4 text-sm transition-all border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'signup' 
                    ? 'border-blue-600 text-slate-950 font-black' 
                    : 'border-transparent text-slate-400 hover:text-slate-600 font-bold'
                }`}
              >
                <UserPlus size={16} />
                3초 회원가입
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMsg(''); setInfoMsg(''); }}
                className={`flex-1 pb-4 text-sm transition-all border-b-2 flex items-center justify-center gap-2 ${
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
                    <p className="text-[11px] text-blue-700 font-extrabold">가입 즉시 1개월 무료 혜택 제공!</p>
                    <p className="text-[9.5px] text-slate-500 font-bold mt-0.5">추가로 친구 초대 시 평생 10% 요금 할인이 누적됩니다.</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 text-[11px] font-bold text-red-650 flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Info/Verification Message */}
              {infoMsg && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-3.5 text-[11px] font-bold leading-relaxed flex gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                  <span>{infoMsg}</span>
                </div>
              )}

              {/* Email input */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">이메일 계정</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-[13px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                    required
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">비밀번호</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="6자리 이상 입력"
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-[13px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                    required
                  />
                </div>
              </div>

              {/* Referral Code Input (Signup Only) */}
              {activeTab === 'signup' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">추천인 초대코드 (선택)</label>
                    <span className="text-[9px] font-bold text-amber-600 flex items-center gap-0.5">
                      <Gift size={10} className="text-amber-500" /> 평생 요금 누적 할인
                    </span>
                  </div>
                  <div className="relative group">
                    <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      value={referredByInput}
                      onChange={e => setReferredByInput(e.target.value)}
                      placeholder="초대 코드 입력 시 10% 추가 할인 적용"
                      className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-[13px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all text-sm mt-3"
              >
                {isLoading ? '요청 처리 중...' : activeTab === 'signup' ? '무료 체험판 시작하기' : '로그인'}
              </button>

              {/* Social Sign-In Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-slate-100" />
                <span className="px-3 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest select-none">또는 간편 통합계정 로그인</span>
                <div className="flex-grow border-t border-slate-100" />
              </div>

              {/* Social Sign-In Buttons */}
              <div className="w-full">
                {/* Google button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 font-black text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-98"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>{activeTab === 'signup' ? 'Google 계정으로 3초 빠른 가입' : 'Google 계정으로 로그인'}</span>
                </button>
              </div>

              {/* Guide text */}
              <p className="text-center text-[10px] text-slate-400 font-bold">
                {activeTab === 'signup' 
                  ? '가입 시 개인정보 수집 및 링커엑스 무료체험 약관에 동의하게 됩니다.' 
                  : '비밀번호 분실 등 계정 관련 문의는 고객센터(1566-8680)로 연락해 주세요.'
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
