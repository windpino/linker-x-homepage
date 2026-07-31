import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';
import { X, Mail, Lock, Gift, UserPlus, LogIn, Sparkles } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);

  // Parse URL query parameters to check for referral code automatically
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setReferredByInput(refCode.toUpperCase());
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
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
        // 1. Firebase Auth User Creation
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Setup user dates (Trial for 30 days)
        const now = new Date();
        const trialEnd = new Date();
        trialEnd.setDate(now.getDate() + 30);

        // Generate unique referral code for this new user
        const newReferralCode = generateReferralCode();
        let referredByClean = referredByInput.trim().toUpperCase();

        // 3. Process referral reward if code is provided
        let isReferralValid = false;
        let inviterUid = null;
        let inviterCurrentCount = 0;

        if (referredByClean) {
          // Check if this referral code exists in users collection
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('referralCode', '==', referredByClean));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Find the inviter user document
            const inviterDoc = querySnapshot.docs[0];
            inviterUid = inviterDoc.id;
            const inviterData = inviterDoc.data();
            inviterCurrentCount = inviterData.referralCount || 0;
            isReferralValid = true;
          } else {
            // If invalid code, we just clear referredBy for data integrity
            referredByClean = '';
          }
        }

        // 4. Create new user document in Firestore
        const newUserDocRef = doc(db, 'users', user.uid);
        await setDoc(newUserDocRef, {
          email: user.email,
          createdAt: now.toISOString(),
          trialEndDate: trialEnd.toISOString(),
          referralCode: newReferralCode,
          referredBy: referredByClean || null,
          discountRate: 0,
          referralCount: 0
        });

        // 5. Update inviter's referral rewards if valid
        if (isReferralValid && inviterUid) {
          const inviterDocRef = doc(db, 'users', inviterUid);
          const newCount = inviterCurrentCount + 1;
          const newDiscount = Math.min(newCount * 10, 100); // 10% per invite, max 100%

          await updateDoc(inviterDocRef, {
            referralCount: increment(1),
            discountRate: newDiscount
          });
        }

        alert('회원가입이 완료되었습니다!\n1개월 무료 혜택이 적용된 마이 대시보드로 이동합니다.');
      } else {
        // Login flow
        await signInWithEmailAndPassword(auth, email, password);
        alert('로그인되었습니다!');
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
          className="absolute right-6 top-6 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-slate-800/80 px-8 pt-8">
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
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
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
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

