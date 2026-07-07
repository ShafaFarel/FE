import React from 'react';
import { Calendar, Trash2, ChevronRight, MessageCircle, FileText, Activity } from 'lucide-react';

// Helper for Scenario Badges
const SCENARIO_TAGS = {
  'Rekomendasi Utama': { label: 'Utama', color: 'bg-indigo-500/10 border-indigo-500/20 text-[#5E6AD2]' },
  'Pilihan Alternatif': { label: 'Alternatif', color: 'bg-sky-500/10 border-sky-500/20 text-[#0369A1]' },
  'Pilihan Aman': { label: 'Aman', color: 'bg-green-500/10 border-green-500/20 text-[#1aae39]' },
};

function HistoryCard({ record, onSelect, activeId }) {
  let scenarios = record.scenarios || [];
  if (typeof scenarios === 'string') {
    try { scenarios = JSON.parse(scenarios); }
    catch { scenarios = []; }
  }
  const primary = Array.isArray(scenarios) ? scenarios[0] : null;
  const isActive = record.id === activeId;

  return (
    <button
      onClick={() => onSelect(record)}
      className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
        isActive 
          ? 'bg-surface-2 border-hairline-strong text-ink font-medium' 
          : 'bg-canvas border-hairline hover:bg-surface-2 text-ink-muted'
      }`}
    >
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-semibold text-ink truncate">
          {record.studentName}
        </p>
        <p className="text-[10px] text-ink-subtle truncate font-mono">
          {primary?.major_name || '—'}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <span className="text-xs font-mono font-semibold text-ink">{record.confidence}%</span>
        <ChevronRight className="h-3.5 w-3.5 text-ink-subtle" />
      </div>
    </button>
  );
}

export default function Dashboard({ history, activePrediction, onSelectPrediction, onClearHistory, setActiveView }) {
  const hasHistory = history.length > 0;
  const displayRecord = activePrediction || history[0] || null;
  
  let displayScenarios = displayRecord?.scenarios || [];
  if (typeof displayScenarios === 'string') {
    try { displayScenarios = JSON.parse(displayScenarios); }
    catch { displayScenarios = []; }
  }
  if (!Array.isArray(displayScenarios)) displayScenarios = [];

  return (
    <div className="relative py-12 max-w-5xl mx-auto px-4">
      
      {/* Dashboard Sub Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-hairline pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink tracking-[-0.03em] leading-tight">Overview dashboard.</h1>
          <p className="text-xs text-ink-muted mt-1 leading-relaxed">
            Kelola riwayat analisis dan tinjau probabilitas spesialisasi karir secara mendalam.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('form')}
            className="bg-ink hover:bg-ink-muted text-canvas font-medium text-xs rounded px-4 py-2 transition-all shadow-sm"
          >
            Mulai Analisis Baru
          </button>
          {hasHistory && (
            <button
              onClick={onClearHistory}
              className="border border-hairline bg-canvas hover:bg-surface-2 text-red-500 font-medium text-xs rounded px-3 py-2 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus Riwayat</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT PANEL: Detailed Analysis Report (8 Cols) ── */}
        <div className="lg:col-span-8 space-y-6">
          {displayRecord ? (
            <div className="bg-canvas border border-hairline rounded-lg overflow-hidden shadow-sm">
              
              {/* Document/Report Header */}
              <div className="p-6 border-b border-hairline space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-ink-subtle font-mono uppercase tracking-wider">Laporan hasil prediksi</span>
                  <div className="flex items-center gap-1 text-[10px] text-ink-subtle font-mono">
                    <Calendar className="h-3 w-3" />
                    <span>{displayRecord.date}</span>
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-ink">
                  {displayRecord.studentName} — Analisis jalur karir
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                  <span>Gaya Belajar: <span className="font-medium text-ink">{displayRecord.learningStyle}</span></span>
                  <span className="text-hairline-strong">•</span>
                  <span>Akurasi Model: <span className="font-mono text-ink font-medium">{displayRecord.confidence}%</span></span>
                </div>
              </div>

              {/* Table of Recommendation Path Scenarios */}
              <div className="p-6 space-y-4">
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">Matriks skenario rekomendasi</h3>
                
                <div className="border border-hairline rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-2 border-b border-hairline text-ink-muted font-mono uppercase tracking-wider text-[9px]">
                        <th className="px-4 py-2.5">Skenario</th>
                        <th className="px-4 py-2.5">Jurusan Pendidikan</th>
                        <th className="px-4 py-2.5">Prospek Karir</th>
                        <th className="px-4 py-2.5">Rentang Gaji</th>
                        <th className="px-4 py-2.5 text-right">Kecocokan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {displayScenarios.map((s, idx) => {
                        const tag = SCENARIO_TAGS[s.scenario_type] || { label: 'Alternatif', color: 'bg-surface-3 text-ink-muted border-hairline' };
                        return (
                          <tr key={idx} className="hover:bg-surface-1/40 transition-colors">
                            <td className="px-4 py-3">
                              <span className={`inline-block border px-2 py-0.5 rounded text-[9px] font-semibold ${tag.color}`}>
                                {tag.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-ink">{s.major_name}</td>
                            <td className="px-4 py-3 text-ink-muted">{s.career_prospect}</td>
                            <td className="px-4 py-3 font-mono text-ink-muted">{s.estimated_salary || '—'}</td>
                            <td className="px-4 py-3 text-right font-mono font-semibold text-ink">{s.match_percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Property: Scores Used */}
              {displayRecord.scores && (
                <div className="px-6 pb-6 pt-2 border-t border-hairline bg-surface-1/30">
                  <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider font-mono block mb-3">Nilai Rapor Terbaca</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Matematika', key: 'math_score' },
                      { label: 'Sains / IPA', key: 'science_score' },
                      { label: 'Bahasa', key: 'language_score' },
                      { label: 'Logika / Komputer', key: 'logical_score' },
                    ].map(f => (
                      <div key={f.key} className="flex justify-between items-center sm:block">
                        <span className="text-xs text-ink-muted">{f.label}</span>
                        <p className="text-sm font-semibold font-mono text-ink sm:mt-1">{displayRecord.scores[f.key] ?? '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Action Panel */}
              <div className="bg-surface-2 border-t border-hairline px-6 py-4 flex items-center justify-between">
                <span className="text-xs text-ink-muted">Tanyakan detail roadmap karir di ruang mentor.</span>
                <button
                  onClick={() => setActiveView('mentor-ai')}
                  className="bg-ink hover:bg-ink-muted text-canvas font-medium text-xs rounded px-4 py-2 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Konsultasi AI Mentor</span>
                </button>
              </div>

            </div>
          ) : (
            /* Empty State */
            <div className="bg-canvas border border-hairline rounded-lg p-16 text-center shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-surface-2 border border-hairline flex items-center justify-center mx-auto mb-4">
                <FileText className="h-5 w-5 text-ink-subtle" />
              </div>
              <h3 className="text-base font-semibold text-ink">Belum ada riwayat prediksi.</h3>
              <p className="text-xs text-ink-muted mt-2 max-w-sm mx-auto leading-relaxed">
                Silakan lakukan pengujian dan prediksi menggunakan data rapor terlebih dahulu.
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL: Sidebar Navigation & Context (4 Cols) ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* History Page Directory */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-semibold text-ink-muted font-mono uppercase tracking-wider">
              Dokumen riwayat
            </h3>
            {hasHistory ? (
              <div className="space-y-2">
                {history.map((rec, i) => (
                  <HistoryCard
                    key={rec.id || i}
                    record={rec}
                    activeId={displayRecord?.id}
                    onSelect={onSelectPrediction}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-canvas border border-hairline rounded-lg p-4 text-center">
                <p className="text-xs text-ink-subtle font-mono">Kosong</p>
              </div>
            )}
          </div>

          {/* Quick AI Mentor Callout */}
          <div className="bg-[#0f1117] text-white border border-[#1f2937] rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-white/70 animate-pulse" />
              <span className="text-xs font-medium text-white/80">AI mentor aktif</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Diskusikan 3 opsi skenario yang direkomendasikan secara personal langsung dengan asisten AI.
            </p>
            <button
              onClick={() => setActiveView('mentor-ai')}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium text-xs rounded py-2 transition-all text-center block"
            >
              Buka Obrolan Mentor
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
