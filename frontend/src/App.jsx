import React, { useState } from 'react';
import { WaterProvider, useWater } from './context/WaterContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SdgInfoModal from './components/SdgInfoModal';
import NotificationToast from './components/NotificationToast';
import LandingPage from './pages/LandingPage';
import AssessmentPage from './pages/AssessmentPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';

function MainApp() {
  const { activeView, error, setError } = useWater();
  const [isSdgModalOpen, setIsSdgModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col selection:bg-ocean-100 selection:text-ocean-900">
      {/* Navigation */}
      <Navbar onOpenSdgModal={() => setIsSdgModalOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage onOpenSdgModal={() => setIsSdgModalOpen(true)} />
        )}
        {activeView === 'assessment' && <AssessmentPage />}
        {activeView === 'dashboard' && <DashboardPage />}
        {activeView === 'chat' && <ChatPage />}
      </main>

      {/* Footer */}
      <Footer onOpenSdgModal={() => setIsSdgModalOpen(true)} />

      {/* SDG 6 Information Modal */}
      <SdgInfoModal
        isOpen={isSdgModalOpen}
        onClose={() => setIsSdgModalOpen(false)}
      />

      {/* Global Notifications */}
      <NotificationToast
        error={error}
        onClose={() => setError(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <WaterProvider>
      <MainApp />
    </WaterProvider>
  );
}
