import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(invitationCode);

    if (!success) {
      setError('Invalid or expired invitation code. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-feminine flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-white/10 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-lg w-full relative">
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-luxury p-10 border border-white/30">
          <div className="text-center mb-10">
            <div className="mb-6">
              <span className="inline-block text-6xl mb-4 animate-pulse-soft">✨</span>
            </div>
            <h1 className="font-luxury text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome to Herstory
            </h1>
            <p className="font-elegant text-white/90 text-lg leading-relaxed">
              Woman, you deserve the best, thank you for being part of <span className="font-semibold text-rose-200">Herstory</span>! ✨
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label htmlFor="invitation-code" className="block text-white font-elegant font-medium text-lg">
                🎫 Exclusive Invitation Code
              </label>
              <div className="relative">
                <input
                  id="invitation-code"
                  type="text"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  className="w-full px-6 py-5 bg-white/25 backdrop-blur-sm border border-white/40 rounded-2xl shadow-elegant focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent placeholder-white/70 text-white text-lg font-elegant font-medium transition-all duration-300 hover:bg-white/30"
                  placeholder="Enter your exclusive code..."
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-shimmer opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100/90 backdrop-blur-sm border border-red-200 text-red-700 p-5 rounded-2xl shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💝</span>
                  <div>
                    <p className="font-elegant font-medium">{error}</p>
                    <p className="text-sm text-red-600 mt-1">Please try again with the correct invitation code</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !invitationCode.trim()}
              className="group relative w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white py-5 px-8 rounded-2xl font-elegant font-bold text-xl shadow-luxury hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-rose-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Verifying your invitation...
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🌟</span>
                    Enter the Experience
                    <span className="text-2xl">🌟</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>
        </div>

        {/* Elegant bottom text */}
        <div className="text-center mt-8">
          <p className="text-white/70 font-elegant text-sm">
            Crafted with 💎 for extraordinary women
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;