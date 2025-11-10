
import React, { useState, useCallback } from 'react';
import { generateVbaCode } from './services/geminiService';
import { SparkleIcon, CopyIcon, ClipboardCheckIcon } from './components/icons';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleGenerateCode = useCallback(async () => {
    if (!prompt.trim()) {
      setError('لطفاً یک دستور وارد کنید.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedCode('');

    try {
      const code = await generateVbaCode(prompt);
      setGeneratedCode(code);
    } catch (err) {
      setError('خطایی در ارتباط با سرویس رخ داد. لطفاً دوباره تلاش کنید.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleCopyCode = useCallback(() => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [generatedCode]);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          
          <header className="p-4 border-b border-gray-700 bg-gray-800/50">
            <h1 className="text-xl sm:text-2xl font-bold text-center text-cyan-400">
              مولد کد VBA برای اکسل
            </h1>
            <p className="text-center text-gray-400 mt-1 text-sm">
              دستور خود را بنویسید و کد VBA کامل با مدیریت خطا دریافت کنید.
            </p>
          </header>

          <main className="p-6 space-y-6">
            <div>
              <label htmlFor="prompt-input" className="block text-lg font-semibold mb-2 text-gray-300">
                دستور شما
              </label>
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثال: یک ماکرو بنویس که مقادیر ستون A را جمع کرده و نتیجه را در سلول B1 نمایش دهد."
                className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-none placeholder-gray-500"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleGenerateCode}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-x-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>در حال تولید کد...</span>
                </>
              ) : (
                <>
                  <SparkleIcon />
                  <span>تولید کد</span>
                </>
              )}
            </button>

            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">{error}</div>}

            {(generatedCode || isLoading) && (
              <div className="mt-6 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-300">کد VBA تولید شده</h2>
                  {generatedCode && (
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-x-1.5 bg-gray-700 hover:bg-gray-600 text-sm text-gray-200 py-1.5 px-3 rounded-md transition-colors"
                    >
                      {isCopied ? <ClipboardCheckIcon /> : <CopyIcon />}
                      {isCopied ? 'کپی شد!' : 'کپی کن'}
                    </button>
                  )}
                </div>
                <div className="bg-gray-900/70 border border-gray-700 rounded-lg overflow-hidden min-h-[200px]">
                  {isLoading && !generatedCode && (
                    <div className="flex items-center justify-center h-full p-4">
                        <div className="text-gray-400">منتظر پاسخ هوش مصنوعی...</div>
                    </div>
                  )}
                  <pre className="p-4 text-sm whitespace-pre-wrap break-all" dir="ltr">
                    <code className="language-vba font-mono">{generatedCode}</code>
                  </pre>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
