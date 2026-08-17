import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { X, Lock, AlertCircle, User, ShieldCheck } from 'lucide-react';

const LoginModal = ({ onClose, onOpenSignup }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginId || !password) {
      setErrorMsg('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    const trimmedId = loginId.trim().toLowerCase();
    const virtualEmail = `${trimmedId}@linkerx-user.local`;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, virtualEmail, password);
      alert('로그인되었습니다!');
      onClose();
    } catch (err) {
      console.error(err);
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('파이어베이스 콘솔에서 [이메일/비밀번호 로그인] 기능이 활성화되지 않았습니다. Authentication > Sign-in method에서 이메일/비밀번호를 [사용 설정] 해주세요.');
      } else {
        setErrorMsg('로그인 중 오류가 발생했습니다: ' + err.message);
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
      <div className="relative w-full max-w-[420px] bg-white rounded-[32px] shadow-[0_30px_70px_-15px_rgba(2,6,23,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200/50">
        
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
          <div className="flex flex-col items-center mt-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md mb-3">
              <span className="font-black text-base text-white">LX</span>
            </div>
            <h2 className="text-xl font-black text-slate-950 tracking-tight">
              링커엑스 로그인
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1">
              Linker X 통합 물류 시스템 계정으로 로그인하세요.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 text-[12.5px] font-bold text-red-600 flex items-center gap-1.5">
                <AlertCircle size={14} className="shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login ID Input */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                접속 아이디
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="아이디 입력"
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-[14px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                비밀번호
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-[14px] font-bold outline-none transition-all focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all text-[15px] mt-2"
            >
              {isLoading ? '인증 진행 중...' : '로그인'}
            </button>

            {/* Navigation to Signup */}
            <div className="text-center pt-2 text-xs font-bold text-slate-500">
              아직 계정이 없으신가요?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSignup();
                }}
                className="text-blue-600 hover:text-blue-700 font-extrabold hover:underline"
              >
                회원가입하기
              </button>
            </div>

            <hr className="border-slate-100/80 my-3" />

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>SSL 보안 암호화 로그인 지원</span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
