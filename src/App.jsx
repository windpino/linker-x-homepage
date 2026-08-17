import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, onSnapshot, setDoc, getDoc, query, orderBy } from 'firebase/firestore';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Solution from './components/Solution';
import Features from './components/Features';
import Inquiry from './components/Inquiry';
import Support from './components/Support';
import LinkerXBot from './components/LinkerXBot';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import Dashboard from './components/Dashboard';
import InstallWizardModal from './components/InstallWizardModal';

const App = () => {
  const [content, setContent] = useState({});
  const [notices, setNotices] = useState([]);
  const [agencyCategories, setAgencyCategories] = useState([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState('general');
  const [subView, setSubView] = useState('main');

  // Firebase Auth State & User Role
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isInstallWizardOpen, setIsInstallWizardOpen] = useState(false);
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Detect standalone Launch
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.location.search.includes('mode=standalone');
    setIsStandaloneMode(isStandalone);
  }, []);

  // Monitor auth state changes with Role-based Routing
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Query users collection for user's role
          const userDocSnap = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            const role = data.role || 'customer';
            setUserRole(role);

            // Role-based routing
            if (role === 'admin' || role === 'super_admin') {
              setSubView('dashboard'); // 관리자 대시보드
            } else {
              setSubView('support'); // customer: 주문/문의 화면
            }
          } else {
            // Master/Admin direct login fallback
            setUserRole('customer');
            setSubView('support');
          }
        } catch (err) {
          console.error('Error fetching user role:', err);
          setSubView('support');
        }
      } else {
        setUserRole(null);
        setSubView('main');
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Fetch CMS content and System Notices from Firebase
  useEffect(() => {
    const contentUnsub = onSnapshot(doc(db, 'settings', 'homepage_content'), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.data());
      }
    });

    const noticesQuery = query(collection(db, 'system_notices'), orderBy('createdAt', 'desc'));
    const noticesUnsub = onSnapshot(noticesQuery, (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const categoriesUnsub = onSnapshot(doc(db, 'settings', 'agencyCategories'), (snapshot) => {
      if (snapshot.exists()) {
        setAgencyCategories(snapshot.data().categories || []);
      }
    });

    return () => {
      contentUnsub();
      noticesUnsub();
      categoriesUnsub();
    };
  }, []);

  const handleSubmitInquiry = async (inquiryData) => {
    try {
      await setDoc(doc(db, 'agency_inquiries', inquiryData.id), inquiryData);
      return true;
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      alert('접수 처리 중 문제가 발생했습니다: ' + err.message);
      return false;
    }
  };

  const [prefilledContent, setPrefilledContent] = useState('');
  const [stickyCategory, setStickyCategory] = useState('도입/설치 상담');
  const [stickyContact, setStickyContact] = useState('');
  const [stickyAgree, setStickyAgree] = useState(true);
  const [isSubmittingSticky, setIsSubmittingSticky] = useState(false);

  const handleOpenInquiry = (typeOrContent) => {
    if (typeof typeOrContent === 'string' && typeOrContent !== 'general' && typeOrContent !== 'agency') {
      setInquiryType('general');
      setPrefilledContent(typeOrContent);
    } else {
      setInquiryType(typeOrContent || 'general');
      setPrefilledContent('');
    }
    setIsInquiryOpen(true);
  };

  // Auth modal helper removed since we split login/signup

  const handleStickySubmit = async (e) => {
    e.preventDefault();
    if (!stickyContact.trim()) {
      alert('연락처를 입력해 주세요.');
      return;
    }
    if (!stickyAgree) {
      alert('개인정보 수집 동의가 필요합니다.');
      return;
    }
    setIsSubmittingSticky(true);
    const data = {
      id: 'sticky_' + Date.now(),
      type: 'general',
      companyName: '간편 상담 신청자',
      ceoName: '간편 신청자',
      email: 'no-email@sticky.com',
      contact: stickyContact,
      password: '',
      category: '',
      content: `[간편 상담 신청] 분야: ${stickyCategory}`,
      status: 'received',
      appliedAt: new Date().toISOString()
    };
    const success = await handleSubmitInquiry(data);
    if (success) {
      alert('간편 상담 신청이 접수되었습니다. 곧 연락드리겠습니다!');
      setStickyContact('');
    }
    setIsSubmittingSticky(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-400">보안 세션 확인 중...</p>
        </div>
      </div>
    );
  }

  // Standalone Mode (Desktop PWA shortcut launch): Render ERP Portal Login screen directly without URL bar (no black strip)
  if (isStandaloneMode) {
    return (
      <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#020617' }}>
        <iframe
          src="https://linker-x-project.vercel.app/?mode=standalone"
          title="Linker X ERP System"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          allow="fullscreen; clipboard-read; clipboard-write; camera; microphone"
        />
      </div>
    );
  }

  // Common Layout Rendering
  return (
    <div className={`font-sans antialiased min-h-screen transition-all ${
      user && subView === 'dashboard' ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'
    }`}>
      
      {/* Navigation */}
      <Navbar 
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenSignup={() => setIsSignupOpen(true)}
        onOpenInstall={() => setIsInstallWizardOpen(true)}
        onNavigateToSupport={() => { setSubView('support'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onNavigateToHome={() => { setSubView('main'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        user={user}
        subView={subView}
      />

      {subView === 'dashboard' && user ? (
        <Dashboard />
      ) : subView === 'main' ? (
        <>
          {/* Hero Section */}
          <Hero 
            onOpenInquiry={() => setIsSignupOpen(true)}
            onOpenInstall={() => setIsInstallWizardOpen(true)}
            onOpenAgencyApply={() => handleOpenInquiry('agency')}
          />

          {/* Packaged Product Showcase (3 Categories) */}
          <Products onOpenInquiry={handleOpenInquiry} />

          {/* Solution Section */}
          <Solution />

          {/* Features & Notices Section */}
          <Features notices={notices} />
        </>
      ) : (
        <Support notices={notices} onOpenInquiry={handleOpenInquiry} />
      )}

      {/* Footer */}
      {subView !== 'dashboard' && (
        <footer className="bg-slate-900 border-t border-slate-800 py-12 text-slate-400 text-sm pb-32">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">Linker X</span>
              <span>| © 2026 Linker X Corporation. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-white transition-colors">고객지원데스크</a>
            </div>
          </div>
        </footer>
      )}

      {/* Sticky Bottom Consultation Banner */}
      {!user && subView === 'main' && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-[#c2410c] text-white py-3 px-4 shadow-[0_-5px_15px_rgba(0,0,0,0.15)]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Hotline info */}
            <div className="flex items-center gap-2 text-sm md:text-base font-extrabold tracking-tight">
              <span className="bg-white/20 px-2.5 py-0.5 rounded text-xs">실시간</span>
              <span>무료 도입상담</span>
              <span className="text-yellow-300 ml-1">02) 401-5121 | 1566-8680</span>
            </div>

            {/* Inline Form */}
            <form onSubmit={handleStickySubmit} className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
              {/* Category Select */}
              <select
                value={stickyCategory}
                onChange={e => setStickyCategory(e.target.value)}
                className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-3 py-2 text-xs font-bold text-white outline-none focus:border-white/50 h-9"
              >
                <option value="도입/설치 상담" className="text-slate-800">도입/설치 상담</option>
                <option value="가격/구독 상담" className="text-slate-800">가격/구독 상담</option>
                <option value="기능 개선/추가" className="text-slate-800">기능 개선/추가</option>
                <option value="기타 문의" className="text-slate-800">기타 문의</option>
              </select>

              {/* Contact Input */}
              <input
                type="text"
                placeholder="연락처를 입력해주세요"
                value={stickyContact}
                onChange={e => setStickyContact(e.target.value)}
                className="bg-white text-slate-800 placeholder-slate-400 rounded-lg px-3.5 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-yellow-400 h-9 w-44"
              />

              {/* Checkbox */}
              <label className="flex items-center gap-1.5 cursor-pointer text-[0.7rem] font-bold select-none">
                <input
                  type="checkbox"
                  checked={stickyAgree}
                  onChange={e => setStickyAgree(e.target.checked)}
                  className="rounded border-white/20 text-[#c2410c] focus:ring-0"
                />
                <span>개인정보수집 동의</span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingSticky}
                className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-slate-900 font-extrabold text-xs px-5 py-2 rounded-lg transition-colors shadow-md h-9"
              >
                {isSubmittingSticky ? '접수 중...' : '상담신청'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Linker X AI Bot Assistant */}
      {subView === 'main' && (
        <LinkerXBot onOpenInquiry={handleOpenInquiry} />
      )}

      {/* Authentication Modals */}
      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)} 
          onOpenSignup={() => setIsSignupOpen(true)}
        />
      )}
      {isSignupOpen && (
        <SignupModal 
          onClose={() => setIsSignupOpen(false)} 
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      )}

      {/* Inquiry Modal Popup */}
      {isInquiryOpen && (
        <Inquiry 
          onClose={() => setIsInquiryOpen(false)} 
          onSubmitInquiry={handleSubmitInquiry}
          initialContent={prefilledContent}
        />
      )}

      {/* Install Wizard Modal Popup */}
      {isInstallWizardOpen && (
        <InstallWizardModal 
          onClose={() => setIsInstallWizardOpen(false)} 
        />
      )}

    </div>
  );
};

export default App;

