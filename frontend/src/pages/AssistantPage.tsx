import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Mic,
  Upload,
  Send,
  Bot,
  User,
  FileText,
  ClipboardList,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Button, AITypingIndicator, ErrorState } from '@/components/ui';
import { sendChatMessage } from '@/lib/api';
import { getConfidenceColor, getPriorityColor } from '@/lib/utils';
import type { ChatMessage } from '@/types';

const suggestedPrompts = [
  'Scholarship eligibility',
  'Payment pending',
  'Required documents',
  'Application status',
];

export function AssistantPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialQuery = searchParams.get('q');

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || loading) return;

    setError(false);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const aiMsg = await sendChatMessage(text);
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5">
          <Bot className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-medium text-brand-700">Vidur AI</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {t('Vidur AI Assistant', 'Vidur AI सहायक')}
        </h1>
        <p className="mt-2 text-gray-500">
          {t('Tell me what you need help with.', 'मुझे बताएं कि आपको किस बारे में सहायता चाहिए।')}
        </p>
      </div>

      {/* Chat Container */}
      <Card className="flex flex-col overflow-hidden" >
        {/* Messages */}
        <div className="min-h-[400px] max-h-[600px] overflow-y-auto bg-gray-50/50 p-4 sm:p-6">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
                <Sparkles className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {t('How can I help you today?', 'मैं आज आपकी कैसे मदद कर सकता हूं?')}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {t('Ask about scholarships, grievances, documents, or any public service.', 'छात्रवृत्ति, शिकायत, दस्तावेज, या किसी भी सार्वजनिक सेवा के बारे में पूछें।')}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="mb-4 animate-fade-in">
              {msg.role === 'user' ? (
                <div className="flex items-start gap-3 justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-3 text-white">
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
                    <User className="h-5 w-5 text-brand-600" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="max-w-[80%] space-y-3">
                    <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-card border border-gray-100">
                      <p className="text-sm leading-relaxed text-gray-800">{msg.content}</p>
                    </div>

                    {/* Analysis Card */}
                    {msg.analysis && (
                      <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-4 animate-slide-up">
                        <div className="mb-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-brand-600" />
                          <span className="text-sm font-semibold text-brand-800">
                            {t('AI Analysis', 'AI विश्लेषण')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <AnalysisItem label={t('Detected Service', 'पहचानी गई सेवा')} value={msg.analysis.detectedService} />
                          <AnalysisItem label={t('Issue', 'समस्या')} value={msg.analysis.issue} />
                          <AnalysisItem label={t('Department', 'विभाग')} value={msg.analysis.department} />
                          <AnalysisItem label={t('Priority', 'प्राथमिकता')} value={msg.analysis.priority} badge />
                          <AnalysisItem label={t('AI Confidence', 'AI विश्वास')} value={msg.analysis.confidence} confidence />
                        </div>
                        <div className="mt-3 rounded-lg bg-white p-3">
                          <p className="text-xs font-medium text-gray-500">{t('Suggested Action', 'सुझाई गई कार्रवाई')}</p>
                          <p className="mt-1 text-sm text-gray-800">{msg.analysis.suggestedAction}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {msg.suggestions && (
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => navigate('/register-grievance')}>
                          <ClipboardList className="h-4 w-4" />
                          {t('Register Grievance', 'शिकायत दर्ज करें')}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => navigate('/services')}>
                          <FileText className="h-4 w-4" />
                          {t('Check Required Documents', 'आवश्यक दस्तावेज जांचें')}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/track')}>
                          <Search className="h-4 w-4" />
                          {t('Track Existing Application', 'मौजूदा आवेदन ट्रैक करें')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-card border border-gray-100">
                <AITypingIndicator />
              </div>
            </div>
          )}

          {error && (
            <ErrorState
              title={t('AI Unavailable', 'AI अनुपलब्ध')}
              message={t('Unable to connect to Vidur AI right now.', 'अभी Vidur AI से कनेक्ट नहीं हो सका।')}
              onRetry={() => handleSend(messages[messages.length - 1]?.content)}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 bg-white p-4">
          <div className="flex items-end gap-2">
            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Voice input"
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/document-ai')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Upload document"
            >
              <Upload className="h-5 w-5" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t('Type your message...', 'अपना संदेश लिखें...')}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              rows={1}
              aria-label="Message input"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-all hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Suggested prompts */}
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-500 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
              >
                {prompt}
                <ArrowRight className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function AnalysisItem({
  label,
  value,
  badge,
  confidence,
}: {
  label: string;
  value: string;
  badge?: boolean;
  confidence?: boolean;
}) {
  const priorityColors = getPriorityColor(value);
  return (
    <div className="rounded-lg bg-white/80 p-2.5">
      <p className="text-xs text-gray-400">{label}</p>
      {badge ? (
        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${priorityColors.bg} ${priorityColors.text}`}>
          {value}
        </span>
      ) : confidence ? (
        <p className={`mt-0.5 text-sm font-semibold ${getConfidenceColor(value)}`}>{value}</p>
      ) : (
        <p className="mt-0.5 text-sm font-semibold text-gray-800">{value}</p>
      )}
    </div>
  );
}
