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
import { X, Mail, Lock, Gift, UserPlus, LogIn, Sparkles, AlertCircle } from 'lucide-react';

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

  // 2. Naver OAuth Sign-in Flow (Federated/Direct Custom Gateway popup mock)
  const handleNaverAuth = async () => {
    setErrorMsg('');
    setInfoMsg('');
    setIsLoading(true);
    
    // Naver login authentication popup mimic (Vercel subview integration)
    const mockEmail = prompt("네이버 계정 연동을 위해 네이버 이메일 주소를 입력해 주세요:", "naver_user@naver.com");
    if (!mockEmail || !mockEmail.includes('@')) {
      setErrorMsg('유효한 이메일을 입력해야 네이버 연동이 가능합니다.');
      setIsLoading(false);
      return;
    }

    try {
      // Mimic federated authentication password
      const tempPassword = "NaverOAuthPassword_1234!";
      let user;
      
      try {
        // Try logging in first
        const userCredential = await signInWithEmailAndPassword(auth, mockEmail, tempPassword);
        user = userCredential.user;
      } catch (loginErr) {
        // If not found, create new user
        if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
          const userCredential = await createUserWithEmailAndPassword(auth, mockEmail, tempPassword);
          user = userCredential.user;
          await createOrGetUserDoc(user, referredByInput);
          alert('네이버 계정으로 간편 가입이 완료되었습니다!\n(최초 가입 1개월 무료 자동 적용)');
        } else {
          throw loginErr;
        }
      }

      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('네이버 로그인 처리 중 문제가 발생했습니다: ' + err.message);
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
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.75)', backdropFilter: 'blur(10px)' }}
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glowing aura at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 blur-sm" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-slate-800/80 px-8 pt-8">
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); setInfoMsg(''); }}
            className={`flex-1 pb-4 text-sm font-black transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'signup' 
                ? 'border-blue-500 text-white' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <UserPlus size={16} />
            3초 회원가입
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setInfoMsg(''); }}
            className={`flex-1 pb-4 text-sm font-black transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'login' 
                ? 'border-blue-500 text-white' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <LogIn size={16} />
            로그인
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAuth} className="p-8 space-y-5">
          
          {/* Tagline Info */}
          {activeTab === 'signup' && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3.5 flex items-start gap-2.5">
              <Sparkles className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-blue-300 font-extrabold">가입 즉시 1개월 무료 제공!</p>
                <p className="text-[9.5px] text-slate-400 font-bold mt-0.5">추가로 친구 초대 시 평생 10% 요금 할인이 누적됩니다.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-3 text-[11px] font-bold text-red-400">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Info/Verification Message */}
          {infoMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl p-3.5 text-[11px] font-bold leading-relaxed flex gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">이메일</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:bg-slate-950/40 rounded-2xl py-3.5 pl-10.5 pr-4 text-white text-[13px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-500/5 placeholder:text-slate-600 placeholder:font-normal"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">비밀번호</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="6자리 이상 비밀번호"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:bg-slate-950/40 rounded-2xl py-3.5 pl-10.5 pr-4 text-white text-[13px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-500/5 placeholder:text-slate-600 placeholder:font-normal"
                required
              />
            </div>
          </div>

          {/* Referral Code Input (Signup Only) */}
          {activeTab === 'signup' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">추천인 코드 (선택)</label>
                <span className="text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                  <Gift size={10} /> 할인 적용
                </span>
              </div>
              <div className="relative group">
                <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  value={referredByInput}
                  onChange={e => setReferredByInput(e.target.value)}
                  placeholder="예: LX9D8F (초대링크 자동 반영)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:bg-slate-950/40 rounded-2xl py-3.5 pl-10.5 pr-4 text-white text-[13px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-500/5 placeholder:text-slate-600 placeholder:font-normal"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 disabled:opacity-60 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all text-sm mt-3"
          >
            {isLoading ? '요청 처리 중...' : activeTab === 'signup' ? '가입하고 1개월 혜택 받기' : '로그인'}
          </button>

          {/* Social Sign-In Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-slate-800/80" />
            <span className="px-3 text-[10px] text-slate-500 font-extrabold uppercase tracking-widest select-none">또는 간편 로그인</span>
            <div className="flex-grow border-t border-slate-800/80" />
          </div>

          {/* Social Sign-In Buttons */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white font-black text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            {/* Naver button */}
            <button
              type="button"
              onClick={handleNaverAuth}
              disabled={isLoading}
              className="bg-[#03c75a] hover:bg-[#02b34f] text-white font-black text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              {/* Naver N Logo */}
              <span className="font-extrabold text-[13px] tracking-tighter leading-none shrink-0" style={{ fontFamily: 'Georgia, serif' }}>N</span>
              네이버로 가입
            </button>
          </div>

          {/* Guide text */}
          <p className="text-center text-[10px] text-slate-500 font-bold">
            {activeTab === 'signup' 
              ? '가입 시 개인정보 수집 및 링커엑스 무료체험 약관에 동의하게 됩니다.' 
              : '비밀번호를 잃어버리셨나요? 고객지원 센터(1566-8680)로 문의해 주세요.'
            }
          </p>
        </form>

      </div>
    </div>
  );
};

export default AuthModal;
