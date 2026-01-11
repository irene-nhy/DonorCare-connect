
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, MessageSquare, CheckCircle2, ArrowRight, Loader2, ExternalLink, Home, Hash, Phone, AlertCircle, Settings, CloudSync, User, Mail, Calendar } from 'lucide-react';
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import AdminDashboard from './components/AdminDashboard';
import { InquiryCategory, AppSettings } from './types';
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from './constants';
import { refineMessage } from './services/geminiService';

// Webhook for Google Sheets logging
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbwJRom_bAcvm-k6oB7y_LLqww5LC1ZXRYrPx0L_A_iGbqLjp6-ZCz7dfhq_AkwM3REfFg/exec";

const App: React.FC = () => {
  // State
  const [categories, setCategories] = useState<InquiryCategory[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory | null>(null);
  
  // Form States
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [donationId, setDonationId] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [callbackTime, setCallbackTime] = useState('');
  
  // UI States
  const [isRefining, setIsRefining] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refinedMessage, setRefinedMessage] = useState('');
  const [view, setView] = useState<'home' | 'refine' | 'success'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeWhatsappUrl, setActiveWhatsappUrl] = useState('');

  // Hash Navigation Sync
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') setIsAdminOpen(true);
      else {
        setIsAdminOpen(false);
        if (hash === '') {
          setView('home');
          setSelectedCategory(null);
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleCategorySelect = (cat: InquiryCategory) => {
    setSelectedCategory(cat);
    setRefinedMessage(cat.template);
    setView('refine');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSmartRefine = async () => {
    if (!selectedCategory) return;
    setIsRefining(true);
    const result = await refineMessage(selectedCategory.label, userNotes, settings.ngoName);
    setRefinedMessage(result);
    setIsRefining(false);
  };

  const handleSendWhatsApp = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);

    const isCallback = selectedCategory.id === 'callback';

    try {
      // 1. Prepare data for Google Sheet
      const payload = {
        timestamp: new Date().toISOString(),
        donorName: userName || 'Not provided',
        donorEmail: userEmail || 'Not provided',
        donationId: donationId || 'N/A',
        contactPhone: contactPhone || 'N/A',
        callbackTime: isCallback ? callbackTime : 'N/A',
        category: selectedCategory.label,
        message: refinedMessage,
        rawNotes: userNotes,
        platform: 'DonorCare Connect Web'
      };

      // 2. POST to Google Apps Script Webhook
      await fetch(GOOGLE_SHEET_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error("Webhook submission failed, proceeding anyway:", error);
    }

    // 3. Construct professional pre-filled WhatsApp message
    const callbackInfo = isCallback && callbackTime 
      ? `• Requested Callback: ${new Date(callbackTime).toLocaleString()}\n` 
      : '';

    const fullMessage = `*Support Inquiry: ${selectedCategory.label}*
---------------------------
${refinedMessage}

*Donor Information*
• Name: ${userName || 'Guest'}
• Email: ${userEmail || 'N/A'}
• Phone: ${contactPhone || 'N/A'}
${callbackInfo}• Donation ID: ${donationId || 'N/A'}
---------------------------
_Sent via ${settings.ngoName} Support Portal_`;
    
    const encodedMessage = encodeURIComponent(fullMessage);
    const sanitizedNgoPhone = settings.ngoPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${sanitizedNgoPhone}?text=${encodedMessage}`;
    
    setActiveWhatsappUrl(whatsappUrl);
    setIsSubmitting(false);
    setView('success');

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  const resetFlow = () => {
    setView('home');
    setSelectedCategory(null);
    setUserNotes('');
    setDonationId('');
    setContactPhone('');
    setUserName('');
    setUserEmail('');
    setCallbackTime('');
    setRefinedMessage('');
    setActiveWhatsappUrl('');
    window.location.hash = '';
  };

  const isDefaultPhone = settings.ngoPhone === "1234567890";
  const isCallbackCategory = selectedCategory?.id === 'callback';

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        settings={settings} 
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminMode={isAdminOpen}
      />

      {isDefaultPhone && view === 'home' && (
        <div className="bg-amber-50 border-b border-amber-100 py-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
              <AlertCircle size={18} className="text-amber-500" />
              <span>Setup required: Please configure your foundation's WhatsApp number in settings.</span>
            </div>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              <Settings size={14} /> Open Admin Settings
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
        {view === 'home' && (
          <div className="fade-in">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-soft-coral/10 text-soft-coral text-sm font-semibold mb-4">
                Personalized Support
              </span>
              <h2 className="text-4xl font-extrabold text-charcoal mb-4 tracking-tight leading-tight">
                How can we help you today?
              </h2>
              <p className="text-lg text-gray-500">
                Select a category to start a conversation directly with our team on WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} onClick={handleCategorySelect} />
              ))}
            </div>
          </div>
        )}

        {view === 'refine' && selectedCategory && (
          <div className="max-w-3xl mx-auto fade-in">
            <button 
              onClick={() => setView('home')}
              className="mb-8 flex items-center gap-2 text-gray-400 hover:text-charcoal transition-colors group"
            >
              <CheckCircle2 size={18} className="rotate-180" />
              <span className="font-medium">Change Category</span>
            </button>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="p-8 bg-warm-cream/50 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{selectedCategory.emoji}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-charcoal">{selectedCategory.label}</h3>
                    <p className="text-gray-500">Tell us a bit about yourself and your request</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input 
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-soft-coral focus:ring-2 focus:ring-soft-coral/10 outline-none transition-all"
                        placeholder="e.g. Jane Doe"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input 
                        type="email"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-soft-coral focus:ring-2 focus:ring-soft-coral/10 outline-none transition-all"
                        placeholder="name@example.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Donation ID (Optional)</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input 
                        type="text"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-soft-coral focus:ring-2 focus:ring-soft-coral/10 outline-none transition-all"
                        placeholder="e.g. TX-99120"
                        value={donationId}
                        onChange={(e) => setDonationId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input 
                        type="tel"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-soft-coral focus:ring-2 focus:ring-soft-coral/10 outline-none transition-all"
                        placeholder="e.g. 60123456789"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {isCallbackCategory && (
                    <div className="md:col-span-2 animate-in fade-in duration-300">
                      <label className="block text-xs font-bold text-soft-coral uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Calendar size={14} /> Preferred Callback Time
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input 
                          type="datetime-local"
                          required={isCallbackCategory}
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-soft-coral/5 border border-soft-coral/20 focus:border-soft-coral focus:ring-2 focus:ring-soft-coral/10 outline-none transition-all"
                          value={callbackTime}
                          onChange={(e) => setCallbackTime(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {isCallbackCategory ? "Additional details for the call" : "Details or Questions"}
                  </label>
                  <textarea 
                    className="w-full h-32 p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-soft-coral focus:ring-2 focus:ring-soft-coral/10 outline-none transition-all resize-none text-lg"
                    placeholder="Describe your inquiry..."
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={handleSmartRefine}
                      disabled={!userNotes || isRefining}
                      className="mt-3 flex items-center gap-2 text-gentle-teal hover:bg-gentle-teal/5 px-4 py-2 rounded-xl transition-all font-semibold text-sm disabled:opacity-30"
                    >
                      {isRefining ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                      Refine with AI
                    </button>
                    {isSubmitting && (
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-400 animate-pulse">
                        <CloudSync size={14} />
                        Syncing...
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    WhatsApp Message Preview
                  </label>
                  <div className="p-6 bg-charcoal text-white/90 rounded-2xl font-medium leading-relaxed shadow-inner">
                    <p className="whitespace-pre-wrap">{refinedMessage}</p>
                    <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50 space-y-1">
                      <p>Donation ID: {donationId || 'N/A'}</p>
                      <p>Name: {userName || 'N/A'}</p>
                      {isCallbackCategory && callbackTime && (
                        <p className="text-soft-coral font-bold">Callback: {new Date(callbackTime).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleSendWhatsApp}
                    disabled={isSubmitting || !userName || !userEmail || (isCallbackCategory && !callbackTime)}
                    className="w-full bg-soft-coral hover:bg-[#FF7A69] text-white font-bold py-5 rounded-2xl shadow-xl shadow-soft-coral/30 flex items-center justify-center gap-3 text-xl active:scale-[0.98] transition-all group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        <MessageSquare size={24} />
                        {isCallbackCategory ? "Schedule Call" : "Open WhatsApp"}
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    {isCallbackCategory 
                      ? "Your callback time and details will be logged in our foundation records."
                      : "Please fill in your name and email to proceed."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'success' && (
          <div className="max-w-md mx-auto py-20 text-center fade-in">
            <div className="relative mb-8 inline-block">
              <div className="absolute inset-0 bg-gentle-teal/20 rounded-full animate-ping"></div>
              <div className="w-24 h-24 bg-gentle-teal text-white rounded-full flex items-center justify-center relative shadow-lg">
                <CheckCircle2 size={56} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">{isCallbackCategory ? "Call Scheduled!" : "Request Logged!"}</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We've saved your request to our records and triggered WhatsApp in a new tab to confirm with our team.
            </p>
            
            <div className="flex flex-col gap-4">
              <a 
                href={activeWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-soft-coral text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#FF7A69] transition-all"
              >
                <ExternalLink size={20} />
                Open WhatsApp Manually
              </a>
              
              <button 
                onClick={resetFlow}
                className="w-full bg-white text-gray-600 font-semibold py-4 rounded-xl border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
              >
                <Home size={20} />
                Back to Home
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-sm">
            <h4 className="font-bold text-charcoal mb-2">DonorCare Connect</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Streamlining support for the heroes who support us.
            </p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-soft-coral transition-colors">Privacy</a>
            <a href="#" className="hover:text-soft-coral transition-colors">Security</a>
          </div>
          <p className="text-xs text-gray-300">
            © 2026 {settings.ngoName}.
          </p>
        </div>
      </footer>

      {isAdminOpen && (
        <AdminDashboard 
          categories={categories}
          settings={settings}
          onSaveCategories={setCategories}
          onSaveSettings={setSettings}
          onClose={() => {
            setIsAdminOpen(false);
            window.location.hash = '';
          }}
        />
      )}
    </div>
  );
};

export default App;
