import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { LogOut, Copy, ExternalLink, Calendar, Users, Award, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Real-time listener for current user document
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const getDDay = (targetDateStr) => {
    if (!targetDateStr) return 0;
    const target = new Date(targetDateStr);
    const now = new Date();
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleCopyLink = () => {
    if (!userData?.referralCode) return;
    const shareUrl = `${window.location.origin}/?ref=${userData.referralCode}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await signOut(auth);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-400">마이 대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  const dDay = getDDay(userData?.trialEndDate);
  const discountRate = userData?.discountRate || 0;
  const inviteCount = userData?.referralCount || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 relative overflow-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-650/10 rounded-full blur-[130px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
          <div>
            <span className="text-[10px] bg-blue-500/15 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full font-black tracking-wider uppercase">
              LINKER X PARTNER PORTAL
            </span>
            <h2 className="text-2xl font-black text-white mt-3 tracking-tight">
              {userData?.email?.split('@')[0]} 대표님, 반갑습니다!
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1">계정 정보: {userData?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 hover:text-red-400 text-slate-300 font-extrabold text-xs px-4.5 py-2.5 rounded-2xl transition-all"
          >
            <LogOut size={14} />
            로그아웃
          </button>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Card 1: Trial D-Day Counter */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
            <div>
              <div className="flex items-center gap-2.5 text-blue-400 text-xs font-black uppercase mb-4">
                <Calendar size={15} />
                <span>무료 체험 정보</span>
              </div>
              <h3 className="text-sm font-black text-slate-400">남은 무료 체험 기간</h3>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-5xl font-black text-white tracking-tighter">D-{dDay}</span>
                <span className="text-sm font-extrabold text-slate-400">일</span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold mt-2">만료 예정일: {userData?.trialEndDate ? new Date(userData.trialEndDate).toLocaleDateString() : '-'}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-blue-300 font-bold">
              <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
              <span>현재 모든 기능을 무제한 이용하실 수 있습니다.</span>
            </div>
          </div>

          {/* Card 2: Invite & Discount Rates (Viral loops) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 text-amber-400 text-xs font-black uppercase">
                  <Users size={15} />
                  <span>바이럴 보상 혜택</span>
                </div>
                {inviteCount >= 10 && (
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                    평생 무료 획득 🎉
                  </span>
                )}
              </div>
              <h3 className="text-sm font-black text-slate-400">내 누적 요금 할인율</h3>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-5xl font-black text-amber-400 tracking-tighter">{discountRate}%</span>
                <span className="text-sm font-extrabold text-slate-400">할인 중</span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold mt-2">초대한 지인: 총 {inviteCount}명 (1명당 10% 평생 할인)</p>
            </div>

            {/* Gauge progress bar to 10 invites */}
            <div className="mt-6 pt-4 border-t border-slate-800/60">
              <div className="flex justify-between text-[9px] font-black text-slate-400 mb-1.5 uppercase">
                <span>진행 상황 ({inviteCount} / 10명)</span>
                <span>{inviteCount >= 10 ? '완료' : '평생 무료까지 ' + (10 - inviteCount) + '명'}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(inviteCount * 10, 100)}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Center Section: 나만의 추천 초대 링크 공유 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 text-center mb-8 relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-base font-black text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            지인 소개하고 평생 할인 혜택 받기
          </h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed font-bold">
            아래의 나만의 추천 링크를 복사하여 카카오톡이나 문자메시지로 전송하세요. 지인이 링크를 통해 가입하면 **두 분 모두에게 요금 평생 10% 추가 할인** 혜택이 적용됩니다!
          </p>

          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto bg-slate-950 p-2.5 rounded-2xl border border-slate-850">
            <div className="flex-1 bg-transparent px-3 py-2 text-left text-xs font-mono font-bold text-slate-400 truncate select-all h-[36px] flex items-center">
              {userData?.referralCode ? `${window.location.origin}/?ref=${userData.referralCode}` : '코드 생성 실패'}
            </div>
            <button
              onClick={handleCopyLink}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
                copied 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 size={14} />
                  복사 완료!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  추천 링크 복사
                </>
              )}
            </button>
          </div>
          
          <div className="text-[10px] text-amber-400 font-extrabold mt-3">
            🔑 내 초대 코드: {userData?.referralCode}
          </div>
        </div>

        {/* Large Central Execute ERP Button */}
        <div className="bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-[36px] p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-6 shadow-md">
            <Award className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-3">
            링커엑스(Linker X) 솔루션 가동
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-8 font-bold leading-relaxed">
            이제 회원사과 본사 사이의 복잡한 수발주 거래, 전표 자동 처리 및 완벽한 재고 모니터링을 즉시 시작하세요.
          </p>

          <button
            onClick={() => window.open('http://localhost:5174', '_blank')}
            className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-650 to-blue-650 hover:from-blue-500 hover:to-indigo-550 text-white font-black text-base px-10 py-5 rounded-2xl shadow-[0_12px_35px_rgba(29,78,216,0.3)] hover:shadow-[0_15px_45px_rgba(29,78,216,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>링커엑스 ERP 실행하기</span>
            <ExternalLink className="h-5 w-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

