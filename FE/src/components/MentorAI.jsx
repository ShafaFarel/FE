import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { api } from '../utils/api';

const QUICK_PROMPTS = [
  'Apa prospek karir di jurusan yang direkomendasikan untukku?',
  'Berapa estimasi gaji awal untuk karir saya?',
  'Apa yang harus aku persiapkan sebelum masuk kuliah?',
  'Jurusan mana yang paling banyak dibutuhkan industri saat ini?',
];

export default function MentorAI() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Aku AI Mentor EduFuture yang sudah mengenal profil akademis kamu. Kamu bisa tanya soal jurusan yang direkomendasikan, prospek karir, estimasi gaji, atau langkah persiapan ke depan. Silakan ketik pertanyaan kamu.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [input]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.chatWithMentor(trimmed);
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (error) {
      console.error('Mentor AI error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, ada gangguan koneksi. Pastikan Anda sudah masuk dan telah melakukan prediksi karir sebelumnya.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isOnlyGreeting = messages.length === 1;

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      
      {/* Header */}
      <div className="mb-6 shrink-0 border-b border-hairline pb-4">
        <h1 className="text-xl font-semibold text-ink tracking-[-0.03em] leading-tight">Diskusikan karir kamu dengan AI Mentor.</h1>
        <p className="text-xs text-ink-muted mt-1 leading-relaxed">
          Ruang diskusi interaktif berdasarkan rekam data akademis kamu.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-canvas border border-hairline rounded-lg flex flex-col overflow-hidden min-h-0 shadow-sm mb-4">
        
        {/* Messages Feed - Notion Style Comments */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-hairline">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const lines = msg.content.split('\n');
            return (
              <div 
                key={i} 
                className={`flex flex-col space-y-1.5 ${i > 0 ? 'pt-6' : ''} animate-fade-in`}
              >
                {/* Meta Header */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold font-mono uppercase tracking-wider">
                    {isUser ? 'Siswa' : 'AI Mentor'}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-hairline-strong" />
                  <span className="text-[10px] text-ink-subtle font-mono">
                    {isUser ? 'User' : 'Llama 3.1'}
                  </span>
                </div>

                {/* Plain Text Body */}
                <div className="text-sm text-ink-muted leading-relaxed max-w-3xl whitespace-pre-line">
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* Typing state */}
          {isLoading && (
            <div className="pt-6 flex flex-col space-y-1">
              <span className="text-[10px] font-semibold font-mono uppercase tracking-wider text-ink-subtle">
                AI Mentor
              </span>
              <p className="text-xs text-ink-subtle font-mono animate-pulse">
                Menyusun jawaban...
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {isOnlyGreeting && (
          <div className="px-6 py-4 bg-surface-2 border-t border-hairline shrink-0">
            <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider font-mono block mb-2">Pertanyaan Cepat:</span>
            <div className="flex flex-col gap-2">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className="text-left text-xs text-[#5E6AD2] hover:text-[#4E58B8] font-medium hover:underline"
                >
                  → {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-hairline bg-surface-1 shrink-0">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan kamu di sini... (Enter untuk kirim)"
                rows={1}
                className="w-full bg-canvas border border-hairline rounded px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-ink-muted resize-none leading-relaxed"
                style={{ maxHeight: '120px', minHeight: '40px' }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="shrink-0 h-10 bg-ink hover:bg-ink-muted text-canvas font-medium text-xs rounded px-4 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Kirim</span>
            </button>
          </form>
          <div className="flex justify-between text-[9px] text-ink-subtle mt-2 font-mono px-1">
            <span>Shift+Enter untuk baris baru.</span>
            <span>Koneksi aman.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
