import { useState, useEffect } from 'react';
import './styles/main.css';
import './styles/pdpa.css';
import './styles/home.css';
import './styles/verify.css';
import './styles/scanner.css';
import './styles/social.css';
import './styles/history.css';

import TopBanner from './components/shared/TopBanner';
import BottomNav from './components/shared/BottomNav';
import PDPAModal from './components/shared/PDPAModal';
import Home from './components/home';
import Verify from './components/verify';
import Scanner from './components/scanner';
import Social from './components/social';
import History from './components/history';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [showPDPA, setShowPDPA] = useState(false);
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const saved = localStorage.getItem('gungong_dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    // Check PDPA consent
    const pdpaAccepted = localStorage.getItem('gungong_pdpa_accepted');
    if (!pdpaAccepted) {
      setShowPDPA(true);
    }

    // Initialize LIFF if available
    initLiff();
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('gungong_dark_mode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const initLiff = async () => {
    try {
      if (window.liff) {
        await window.liff.init({ liffId: '2008548759-KkM4Noxa' });
        setIsLiffReady(true);

        if (window.liff.isLoggedIn()) {
          const profile = await window.liff.getProfile();
          setUserProfile(profile);
        }
      }
    } catch (error) {
      console.log('LIFF initialization failed:', error);
      // App still works without LIFF
    }
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    // Scroll to top when changing sections
    window.scrollTo(0, 0);
  };

  const handleShare = async () => {
    if (!window.liff || !window.liff.isApiAvailable('shareTargetPicker')) {
      window.Swal?.fire({
        icon: 'info',
        title: 'แชร์ Mini App',
        text: 'ฟังก์ชันนี้ต้องใช้ LIFF SDK กรุณาเปิดผ่าน LINE App',
        confirmButtonColor: '#3ACE00',
      });
      return;
    }

    try {
      await window.liff.shareTargetPicker([
        {
          type: 'flex',
          altText: 'GunGong - ปกป้องคุณจากมิจฉาชีพ',
          contents: {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: 'GunGong Mini App',
                  weight: 'bold',
                  size: 'lg',
                },
                {
                  type: 'text',
                  text: 'ปกป้องคุณจากมิจฉาชีพ',
                  size: 'sm',
                  color: '#666666',
                },
              ],
            },
          },
        },
      ]);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handlePDPAAccept = () => {
    setShowPDPA(false);
  };

  const renderPage = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'verify':
        return <Verify userProfile={userProfile} onNavigate={handleNavigate} />;
      case 'scanner':
        return <Scanner onNavigate={handleNavigate} />;
      case 'social':
        return <Social userProfile={userProfile} />;
      case 'history':
        return <History />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <PDPAModal isOpen={showPDPA} onAccept={handlePDPAAccept} />

      <TopBanner
        userProfile={userProfile}
        onShare={handleShare}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main>
        {renderPage()}
      </main>

      <BottomNav activeSection={activeSection} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;

