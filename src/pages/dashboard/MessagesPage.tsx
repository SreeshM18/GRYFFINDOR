import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageSquare,
  Sparkles,
  Zap,
  Coffee,
  CheckCircle2,
  AlertTriangle,
  User,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';
import { ChatMessage, UserId } from '../../types/workOs';

export const MessagesPage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [activeSender, setActiveSender] = useState<UserId>(currentUser.id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const loadMessages = () => {
    setMessages(workOs.getChatMessages());
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const toSend = text || inputText;
    if (!toSend.trim()) return;

    soundFx.playChime();
    workOs.sendChatMessage(activeSender, toSend.trim());
    setInputText('');
    loadMessages();
  };

  const quickTemplates = [
    {
      label: 'Daily Standup',
      icon: Zap,
      text: '⚡ Daily Standup: Today focusing on completing the core system architecture and verifying responsive views across 4K & mobile.',
    },
    {
      label: 'Shipped Deliverable',
      icon: CheckCircle2,
      text: '🎉 Shipped! Merged latest commits into main branch. Build passed with 0 errors.',
    },
    {
      label: 'Coffee / Break',
      icon: Coffee,
      text: '☕ Stepping away for a 20-minute rest break. Back shortly!',
    },
    {
      label: 'Need Review',
      icon: AlertTriangle,
      text: '🚨 Need review: Left notes on the latest schema and UI tokens. Please review when you get a chance.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              Co-Founder Async Channel
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft uppercase">
              Direct Sync
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-0.5">
            Internal sync between Sreesh M and Mrithula M for standups, blockers, and celebrations.
          </p>
        </div>

        {/* Sender Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-content-muted font-mono text-[11px]">Replying as:</span>
          <div className="flex rounded-xl p-1 bg-surface-elevated border border-border-subtle">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveSender('sreesh');
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeSender === 'sreesh'
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Sreesh M
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveSender('mrithula');
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeSender === 'mrithula'
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Mrithula M
            </button>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 rounded-2xl border border-border-subtle bg-surface-card p-6 overflow-y-auto space-y-4 shadow-sm">
        {messages.map((msg) => {
          const isSender = msg.senderId === activeSender;
          const isSreesh = msg.senderId === 'sreesh';
          const senderName = isSreesh ? 'Sreesh M' : 'Mrithula M';
          const senderColor = isSreesh ? 'text-blue-400' : 'text-burgundy-soft';
          const timeFormatted = new Date(msg.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-xl ${isSender ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full border border-border-strong flex items-center justify-center font-display font-bold text-xs shrink-0 ${
                  isSreesh ? 'bg-blue-950/40 text-blue-300' : 'bg-burgundy/20 text-burgundy-soft'
                }`}
              >
                {senderName[0]}
              </div>

              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  isSender
                    ? 'bg-burgundy text-white border-burgundy shadow-sm rounded-tr-none'
                    : 'bg-surface-elevated border-border-subtle text-content-primary rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] font-mono">
                  <span className={`font-semibold ${isSender ? 'text-rose-100' : senderColor}`}>
                    {senderName}
                  </span>
                  <span className={isSender ? 'text-rose-200/80' : 'text-content-muted'}>
                    {timeFormatted}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Async Action Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        {quickTemplates.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(item.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated text-content-secondary hover:text-content-primary text-xs whitespace-nowrap transition-colors"
            >
              <Icon className="w-3.5 h-3.5 text-burgundy-soft" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type a message as ${activeSender === 'sreesh' ? 'Sreesh' : 'Mrithula'}...`}
          className="flex-1 text-xs p-3.5 rounded-2xl border border-border-subtle bg-surface-card text-content-primary focus:outline-none focus:border-burgundy"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-3.5 rounded-2xl bg-burgundy hover:bg-burgundy-soft disabled:opacity-40 text-white font-medium shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
