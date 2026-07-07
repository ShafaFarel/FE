import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PredictionForm from './components/PredictionForm';
import ResultPage from './components/ResultPage';
import Dashboard from './components/Dashboard';
import MentorAI from './components/MentorAI';
import AuthModal from './components/AuthModal';

import { CAREER_DATABASE } from './utils/aiPredictor';
import { api } from './utils/api';

// Riwayat simulasi bawaan agar Dashboard terisi sejak awal (sekarang kosong demi data real)
const INITIAL_MOCK_HISTORY = [];


// Helper: Form baru sudah mengirimkan nilai langsung — tinggal pass ke backend
const mapFormToBackendScores = (formData) => {
  return {
    math_score: Math.round(parseFloat(formData.math_score) || 0),
    science_score: Math.round(parseFloat(formData.science_score) || 0),
    language_score: Math.round(parseFloat(formData.language_score) || 0),
    logical_score: Math.round(parseFloat(formData.logical_score) || 0),
    learning_style: formData.learningStyle || 'Visual'
  };
};

function App() {
  const [activeView, setActiveView] = useState('landing');
  const [history, setHistory] = useState(INITIAL_MOCK_HISTORY);
  const [activePrediction, setActivePrediction] = useState(null);
  const [predictionError, setPredictionError] = useState(null);

  // States untuk Auth
  const [userEmail, setUserEmail] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [targetViewAfterLogin, setTargetViewAfterLogin] = useState(null);

  // Periksa status login saat inisialisasi
  useEffect(() => {
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  const loadHistory = async () => {
    if (!userEmail) return;
    try {
      const res = await api.getHistory();
      if (res.status === 'success' && res.history) {
        const mapped = res.history.map(row => {
          let scenarios = row.predicted_majors || [];
          if (typeof scenarios === 'string') {
            try {
              scenarios = JSON.parse(scenarios);
            } catch (e) {
              scenarios = [];
            }
          }
          const confidenceVal = scenarios?.[0]?.match_percentage || 0;
          return {
            id: row.id,
            studentName: userEmail.split('@')[0],
            learningStyle: row.learning_style || 'Visual',
            scores: {
              math_score: row.math_score ?? 0,
              science_score: row.science_score ?? 0,
              language_score: row.language_score ?? 0,
              logical_score: row.logical_score ?? 0,
            },
            scenarios: Array.isArray(scenarios) ? scenarios : [],
            confidence: typeof confidenceVal === 'number' ? confidenceVal : parseFloat(confidenceVal) || 0,
            date: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          };
        });
        setHistory(mapped);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  useEffect(() => {
    if (userEmail) {
      loadHistory();
    } else {
      setHistory(INITIAL_MOCK_HISTORY);
    }
  }, [userEmail]);

  // Wrapper Navigasi Gated dengan Auth
  const navigateToView = (view) => {
    if (['form', 'mentor-ai', 'dashboard', 'result'].includes(view) && !userEmail) {
      setTargetViewAfterLogin(view);
      setIsAuthModalOpen(true);
      return;
    }
    setActiveView(view);
  };

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    if (targetViewAfterLogin) {
      setActiveView(targetViewAfterLogin);
      setTargetViewAfterLogin(null);
    } else {
      setActiveView('landing');
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUserEmail('');
    setActiveView('landing');
  };

  // Tangani Pengiriman Form Prediksi ke API Real XGBoost
  const handlePredictSubmit = async (formData) => {
    console.log('[App] handlePredictSubmit:', formData);
    setPredictionError(null);

    try {
      const scoresInput = mapFormToBackendScores(formData);
      const response = await api.predict(scoresInput);

      if (response.status !== 'success' || !response.scenarios?.length) {
        throw new Error('Gagal mendapatkan skenario dari server.');
      }

      // Simpan seluruh response backend (semua 3 skenario) + identitas siswa
      const prediction = {
        id:            Date.now().toString(),
        studentName:   formData.name || 'Siswa',
        learningStyle: formData.learningStyle || 'Visual',
        scores: {
          math_score:     formData.math_score,
          science_score:  formData.science_score,
          language_score: formData.language_score,
          logical_score:  formData.logical_score,
        },
        // 3 skenario langsung dari backend
        scenarios:  response.scenarios,
        // shorthand untuk backward compat
        confidence: response.scenarios[0]?.match_percentage || 0,
        date:       new Date().toISOString().split('T')[0],
      };

      setActivePrediction(prediction);
      setHistory(prev => {
        const filtered = prev.filter(h => h.id !== prediction.id);
        return [prediction, ...filtered];
      });

      // Langsung ke Dashboard
      setActiveView('dashboard');
      loadHistory();

    } catch (err) {
      console.error('[App] Error di handlePredictSubmit:', err);
      setPredictionError(err.message || 'Terjadi kesalahan tidak terduga saat memproses prediksi.');
      setActiveView('landing');
    }
  };

  // Simpan prediksi ke riwayat dashboard
  const handleSaveHistory = (prediction) => {
    const exists = history.some(h => h.id === prediction.id || 
      (h.scenarios?.[0]?.major_name === prediction.scenarios?.[0]?.major_name && h.studentName === prediction.studentName)
    );
    if (!exists) {
      setHistory([prediction, ...history]);
    }
  };

  // Pilih prediksi lama dari dashboard
  const handleSelectPrediction = (record) => {
    setActivePrediction(record);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat prediksi Anda dari database?')) {
      try {
        await api.clearHistory();
        setHistory([]);
        setActivePrediction(null);
      } catch (err) {
        console.error('Failed to clear history:', err);
        alert('Gagal menghapus riwayat.');
      }
    }
  };

  const isCurrentPredictionSaved = activePrediction && history.some(
    h => h.id === activePrediction.id || 
    (h.scenarios?.[0]?.major_name === activePrediction.scenarios?.[0]?.major_name)
  );

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink selection:bg-primary/30 selection:text-white">
      {/* Navigasi */}
      <Navbar 
        activeView={activeView} 
        setActiveView={navigateToView} 
        userEmail={userEmail}
        onLogout={handleLogout}
        onLoginClick={() => setIsAuthModalOpen(true)}
      />

      {/* Router Tampilan Utama */}
      <main className="flex-grow">
        {/* Error Banner — hanya muncul jika ada predictionError */}
        {predictionError && (
          <div className="mx-auto max-w-3xl px-4 pt-6">
            <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-300">
              <span>⚠️ {predictionError}</span>
              <button
                onClick={() => setPredictionError(null)}
                className="ml-4 text-rose-400 hover:text-white transition-colors font-bold text-lg leading-none"
              >×</button>
            </div>
          </div>
        )}

        {activeView === 'landing' && (
          <LandingPage setActiveView={navigateToView} />
        )}

        {activeView === 'form' && (
          <PredictionForm onPredictSubmit={handlePredictSubmit} />
        )}

        {activeView === 'mentor-ai' && (
          <MentorAI />
        )}

        {activeView === 'result' && activePrediction && (
          <ResultPage
            prediction={activePrediction}
            onReset={() => setActiveView('form')}
            onSaveHistory={handleSaveHistory}
            hasSaved={isCurrentPredictionSaved}
          />
        )}

        {/* Fallback jika activePrediction null */}
        {activeView === 'result' && !activePrediction && (
          <div className="mx-auto max-w-2xl px-4 py-20 text-center">
            <p className="text-ink-subtle mb-4">Data prediksi tidak tersedia.</p>
            <button
              onClick={() => setActiveView('form')}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
            >
              Kembali ke Formulir
            </button>
          </div>
        )}

        {activeView === 'dashboard' && (
          <Dashboard
            history={history}
            onSelectPrediction={handleSelectPrediction}
            onClearHistory={handleClearHistory}
            setActiveView={navigateToView}
            currentGpa={activePrediction ? activePrediction.gpa : 3.7}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-hairline bg-canvas-deeper/30 py-8 text-center text-xs text-ink-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} EduFuture AI Inc. Dirancang untuk penyelarasan karier masa depan siswa.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-ink transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-ink transition-colors">Ketentuan Layanan</a>
            <a href="#" className="hover:text-ink transition-colors">Dokumentasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
