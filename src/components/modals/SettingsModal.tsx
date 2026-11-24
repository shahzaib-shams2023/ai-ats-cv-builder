import React, { useState } from 'react';
import { UserSettings } from '@/lib/storage/cv-store';
import { Settings, Key, X, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (updated: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [provider, setProvider] = useState<UserSettings['llmProvider']>(settings.llmProvider || 'auto');
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [modelName, setModelName] = useState(settings.modelName || '');
  const [customEndpoint, setCustomEndpoint] = useState(settings.customEndpoint || '');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      llmProvider: provider,
      apiKey: apiKey.trim() || undefined,
      modelName: modelName.trim() || undefined,
      customEndpoint: customEndpoint.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200/90 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/80">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 tracking-tight">AI Engine Configuration</h3>
              <p className="text-[11px] text-slate-500 font-mono">LLM RUNTIME SPECIFICATIONS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1 text-[11px]">Inference Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none text-xs transition-all cursor-pointer"
            >
              <option value="auto">Auto / Built-in Smart NLP Engine (No API Key Required)</option>
              <option value="gemini">Google Gemini (Gemini 1.5 Flash / Pro)</option>
              <option value="openai">OpenAI (GPT-4o, GPT-4o-mini)</option>
              <option value="anthropic">Anthropic (Claude 3.5 Haiku / Sonnet)</option>
              <option value="custom">Custom OpenAI-Compatible Endpoint / Local LLM</option>
            </select>
          </div>

          {provider !== 'auto' && (
            <div>
              <label className="block font-medium text-slate-700 mb-1 text-[11px] flex items-center gap-1.5">
                <Key className="w-3 h-3 text-slate-400" />
                API Authorization Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-... or AIza..."
                className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none text-xs font-mono transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                Encrypted in local browser storage; never transmitted to external third parties.
              </span>
            </div>
          )}

          {provider === 'custom' && (
            <div>
              <label className="block font-medium text-slate-700 mb-1 text-[11px]">Base URL Endpoint</label>
              <input
                type="text"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                placeholder="https://api.openai.com/v1 or http://localhost:11434/v1"
                className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none text-xs font-mono transition-all"
              />
            </div>
          )}

          {provider !== 'auto' && (
            <div>
              <label className="block font-medium text-slate-700 mb-1 text-[11px]">Model Identifier (Optional)</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder={
                  provider === 'gemini'
                    ? 'gemini-1.5-flash'
                    : provider === 'openai'
                    ? 'gpt-4o-mini'
                    : 'claude-3-5-haiku-20241022'
                }
                className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 outline-none text-xs font-mono transition-all"
              />
            </div>
          )}

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 leading-snug">
              <strong className="text-slate-900">High Reliability Standby:</strong> If external API limits or networking disconnects occur, the built-in intelligent NLP heuristic engine automatically continues tailoring CVs and calculating ATS scores without interruption.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary px-4 py-1.5 text-xs font-medium cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
