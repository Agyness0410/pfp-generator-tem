import React, { useState, useCallback, useEffect } from 'react';
import type { TraitSelection, Component } from '../types';
import { TRAIT_CATEGORIES } from '../types';
import { componentService } from '../services/componentService';
import { avatarService } from '../services/avatarService';
import { useAuth } from '../contexts/AuthContext';
import CategoryTabs from './CategoryTabs';
import ComponentGrid from './ComponentGrid';
import AvatarPreview from './AvatarPreview';

const AvatarGenerator: React.FC = () => {
  const { userId, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>(TRAIT_CATEGORIES[0]);
  const [selections, setSelections] = useState<TraitSelection>({});
  const [description, setDescription] = useState('');
  const [isUnique, setIsUnique] = useState(true);
  const [isCheckingUniqueness, setIsCheckingUniqueness] = useState(false);
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null);

  // Create selection mapping for tabs
  const selectionMapping: Record<string, keyof TraitSelection> = {
    '00background': 'background',
    '01body': 'body',
    '02face': 'face',
    '03hair': 'hair',
    '03body hoodie': 'bodyHoodie',
    '04mouth': 'mouth',
    '05eye': 'eye',
    '06accessory': 'accessory',
    '07facemask': 'facemask'
  };

  const tabSelections: Record<string, string> = Object.fromEntries(
    TRAIT_CATEGORIES.map(category => [
      category,
      selections[selectionMapping[category]]?.id || ''
    ])
  );

  useEffect(() => {
    checkUniqueness();
  }, [selections]);

  const checkUniqueness = async () => {
    if (Object.keys(selections).length === 0) {
      setIsUnique(true);
      return;
    }

    setIsCheckingUniqueness(true);
    try {
      const unique = await avatarService.checkUniqueness(selections);
      setIsUnique(unique);
    } catch (error) {
      console.error('Error checking uniqueness:', error);
      setIsUnique(false);
    } finally {
      setIsCheckingUniqueness(false);
    }
  };

  const handleComponentSelect = (component: Component | null) => {
    const key = selectionMapping[activeCategory];
    if (key) {
      setSelections(prev => ({
        ...prev,
        [key]: component || undefined
      }));
    }
  };

  const handlePreviewReady = useCallback((canvas: HTMLCanvasElement | null) => {
    setPreviewCanvas(canvas);
  }, []);

  const shareAndDownloadAvatar = async () => {
    if (!previewCanvas || !userId || !isUnique) return;

    try {
      // Save avatar combination
      await avatarService.saveAvatar(userId, selections, description);

      // Create download
      const link = document.createElement('a');
      link.download = `herstory-avatar-${Date.now()}.png`;
      link.href = previewCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open Twitter sharing page immediately after download
      const tweetText = `${description ? description + ' ' : ''}I'm a proud Herstory maker now, period! @herstoryweb3 #herstory`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

      window.open(twitterUrl, '_blank');

      // Log out after sharing
      setTimeout(() => {
        logout();
      }, 1000);
    } catch (error) {
      console.error('Share and download failed:', error);
      alert('Failed to share and download avatar. Please try again.');
    }
  };

  const currentComponents = componentService.getComponentsByCategory(activeCategory);
  const selectedComponentId = selections[selectionMapping[activeCategory]]?.id;

  return (
    <div className="min-h-screen bg-gradient-feminine relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-40 h-40 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-12 relative">
          <div className="mb-6">
            <span className="inline-block text-5xl animate-pulse-soft">👑</span>
          </div>
          <h1 className="font-luxury text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            Herstory Maker
          </h1>
          <p className="font-elegant text-white/90 text-xl leading-relaxed max-w-2xl mx-auto">
            Women, you deserve the best, and thank you for joining the Herstory making
          </p>
          <div className="mt-4 text-white/70 font-elegant text-sm">
            Where art meets feminine power
          </div>
        </div>

        {/* Premium Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mt-12">

          {/* Left Panel - Categories */}
          <div className="xl:col-span-1 order-1">
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 shadow-luxury border border-white/20 sticky top-8">
              <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                selections={tabSelections}
              />
            </div>
          </div>

          {/* Middle Panel - Component Selection & Story */}
          <div className="xl:col-span-2 order-2 space-y-6">
            {/* Component Selection */}
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-luxury border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">🎨</span>
                <div className="flex-1">
                  <h2 className="font-luxury text-2xl lg:text-3xl font-bold text-white capitalize mb-1">
                    {activeCategory.replace(/^\d+/, '').replace(/([a-z])([A-Z])/g, '$1 $2')}
                  </h2>
                  <p className="text-white/70 font-elegant text-sm">Choose the perfect style for your avatar</p>
                </div>
              </div>

              <ComponentGrid
                components={currentComponents}
                selectedId={selectedComponentId}
                onSelect={handleComponentSelect}
              />
            </div>

            {/* Your Story Section */}
            <div className="bg-gradient-to-br from-white/95 via-rose-50/95 to-pink-50/95 backdrop-blur-xl rounded-3xl p-8 shadow-luxury border border-white/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl">
                  <span className="text-2xl">📖</span>
                </div>
                <div>
                  <h3 className="font-luxury text-2xl font-bold text-gray-800">Tell Your Story</h3>
                  <p className="text-gray-600 font-elegant text-sm">What makes your avatar special?</p>
                </div>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                className="w-full p-6 border-0 bg-gradient-to-br from-white to-rose-50 rounded-2xl resize-none focus:outline-none focus:ring-3 focus:ring-rose-300/50 placeholder-gray-400 font-elegant text-gray-700 transition-all duration-300 shadow-inner text-lg leading-relaxed"
                rows={4}
                placeholder="Share the inspiration behind your avatar... What's her story? What makes her uniquely yours? ✨"
              />

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500 font-elegant">
                  {description.length}/500 characters
                </div>
                <div className="flex items-center gap-2 text-rose-500 font-elegant font-medium text-sm">
                  <span className="animate-pulse">💫</span>
                  <span>Express yourself</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Avatar Preview */}
          <div className="xl:col-span-2 order-3">
            <div className="sticky top-8">
              {/* Avatar Showcase */}
              <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl rounded-4xl p-8 shadow-luxury border border-white/30 relative overflow-hidden">
                {/* Premium decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-rose-300/20 to-pink-300/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-tr from-purple-300/20 to-blue-300/20 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  {/* Hero Badge */}
                  <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500/90 to-pink-500/90 rounded-full text-white font-elegant font-bold text-sm shadow-luxury backdrop-blur-sm">
                      <span className="text-lg">✨</span>
                      Your Masterpiece
                      <span className="text-lg">✨</span>
                    </div>
                  </div>

                  {/* Avatar Display */}
                  <div className="relative">
                    <AvatarPreview
                      selections={selections}
                      onPreviewReady={handlePreviewReady}
                    />

                    {/* Floating Status Indicators */}
                    <div className="absolute -top-3 -right-3 flex gap-2">
                      {Object.keys(selections).length > 0 && (
                        <div className="bg-gradient-to-r from-emerald-400 to-green-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                          LIVE
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Uniqueness Status - Prominent */}
                  <div className="mt-6 p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-elegant border border-white/50">
                    {isCheckingUniqueness ? (
                      <div className="text-center">
                        <div className="inline-flex items-center gap-3 text-purple-700">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                          <span className="font-elegant font-semibold">Validating uniqueness...</span>
                        </div>
                      </div>
                    ) : !isUnique ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                          <span className="text-2xl">⚠️</span>
                          <span className="font-luxury text-lg font-bold">Already Exists</span>
                        </div>
                        <p className="text-sm text-red-500 font-elegant">This combination has been created before. Please modify your selection.</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                          <span className="text-2xl animate-pulse-soft">💎</span>
                          <span className="font-luxury text-lg font-bold">Absolutely Unique!</span>
                        </div>
                        <p className="text-sm text-emerald-500 font-elegant">Your avatar is truly one-of-a-kind and ready to shine!</p>
                      </div>
                    )}
                  </div>

                  {/* Premium Call-to-Action */}
                  <div className="mt-6">
                    <button
                      onClick={shareAndDownloadAvatar}
                      disabled={!isUnique || !previewCanvas || isCheckingUniqueness}
                      className="group relative w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white py-5 px-8 rounded-2xl font-elegant font-bold text-xl shadow-luxury hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-rose-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {!isUnique ? (
                          <>
                            <span className="text-2xl">🚫</span>
                            Please Modify Selection
                          </>
                        ) : (
                          <>
                            <span className="text-2xl">🚀</span>
                            Share Your Masterpiece
                            <span className="text-2xl">💎</span>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarGenerator;