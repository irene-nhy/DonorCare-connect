
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Save, Trash2, Plus, Phone, LayoutGrid, BarChart3, Globe, AlertCircle } from 'lucide-react';
import { InquiryCategory, AppSettings, InquiryStat } from '../types';

interface AdminDashboardProps {
  categories: InquiryCategory[];
  settings: AppSettings;
  onSaveCategories: (cats: InquiryCategory[]) => void;
  onSaveSettings: (sets: AppSettings) => void;
  onClose: () => void;
}

const mockStats: InquiryStat[] = [
  { category: 'Tax Receipt', count: 145 },
  { category: 'Donation Update', count: 82 },
  { category: 'General', count: 34 },
  { category: 'Feedback', count: 12 },
  { category: 'Impact', count: 56 },
  { category: 'Recurring', count: 91 },
];

const COLORS = ['#FF8B7B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ categories, settings, onSaveCategories, onSaveSettings, onClose }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'categories' | 'branding'>('branding'); // Default to branding to help user find phone setting
  const [localCategories, setLocalCategories] = useState(categories);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleUpdateCategory = (id: string, updates: Partial<InquiryCategory>) => {
    setLocalCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleAddCategory = () => {
    const newCat: InquiryCategory = {
      id: Date.now().toString(),
      emoji: '🆕',
      label: 'New Category',
      description: 'Describe what this inquiry is for.',
      template: 'Hi team, I have a question regarding...'
    };
    setLocalCategories([...localCategories, newCat]);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-gray-50">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-xl">NGO Admin Panel</h2>
          <nav className="flex gap-1 bg-gray-200 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-white shadow-sm' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <BarChart3 size={16} /> Analytics
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'categories' ? 'bg-white shadow-sm' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <LayoutGrid size={16} /> Categories
            </button>
            <button 
              onClick={() => setActiveTab('branding')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'branding' ? 'bg-white shadow-sm' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <Globe size={16} /> Branding
            </button>
          </nav>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              onSaveCategories(localCategories);
              onSaveSettings(localSettings);
              onClose();
            }}
            className="flex items-center gap-2 bg-charcoal text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
          >
            <Save size={18} /> Save & Exit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <h3 className="text-2xl font-bold mb-6">Support Inquiry Volume</h3>
                <div className="h-[400px] w-full bg-warm-cream/30 p-6 rounded-3xl border border-warm-cream">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#7F8C8D', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#7F8C8D', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {mockStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Total Inquiries', val: '420', trend: '+12% this week' },
                  { label: 'Avg. Response Time', val: '1.4h', trend: '-20% efficiency' },
                  { label: 'Conversion Rate', val: '94%', trend: 'Goal: 95%' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-charcoal">{stat.val}</p>
                    <p className="text-xs font-medium text-gentle-teal mt-2">{stat.trend}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Inquiry Categories</h3>
                <button 
                  onClick={handleAddCategory}
                  className="flex items-center gap-2 text-soft-coral hover:bg-soft-coral/5 px-4 py-2 rounded-xl transition-all font-semibold"
                >
                  <Plus size={20} /> Add New
                </button>
              </div>

              <div className="grid gap-4">
                {localCategories.map((cat) => (
                  <div key={cat.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 group">
                    <div className="flex gap-4">
                      <input 
                        className="text-3xl w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-center"
                        value={cat.emoji}
                        onChange={(e) => handleUpdateCategory(cat.id, { emoji: e.target.value })}
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 bg-white border border-gray-200 px-4 py-2 rounded-xl font-semibold"
                            value={cat.label}
                            onChange={(e) => handleUpdateCategory(cat.id, { label: e.target.value })}
                          />
                          <button 
                            onClick={() => setLocalCategories(localCategories.filter(c => c.id !== cat.id))}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        <textarea 
                          className="w-full bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm h-16"
                          value={cat.description}
                          onChange={(e) => handleUpdateCategory(cat.id, { description: e.target.value })}
                        />
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">WhatsApp Message Template</label>
                          <textarea 
                            className="w-full bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm h-24 mt-1 font-mono"
                            value={cat.template}
                            onChange={(e) => handleUpdateCategory(cat.id, { template: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold">Foundation Settings</h3>
              
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                <AlertCircle className="text-blue-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Important: Phone Format</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    WhatsApp requires phone numbers in full international format <strong>without</strong> symbols. 
                    Incorrect formatting (like including a '+' or spaces) will cause errors for your donors.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 p-8 bg-gray-50 rounded-3xl border border-gray-200">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Organization Name</label>
                  <input 
                    className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm"
                    value={localSettings.ngoName}
                    onChange={(e) => setLocalSettings({ ...localSettings, ngoName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Foundation WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input 
                      className="w-full bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-xl shadow-sm font-mono text-lg"
                      placeholder="e.g. 60192634560"
                      value={localSettings.ngoPhone}
                      onChange={(e) => setLocalSettings({ ...localSettings, ngoPhone: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <p className="text-xs text-gray-500 font-medium">✅ Correct: <span className="text-green-600">60192634560</span> (Country code + number)</p>
                    <p className="text-xs text-gray-500 font-medium">❌ Incorrect: <span className="text-red-500">+60 19-263 4560</span> (No symbols or spaces!)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Primary Brand Color</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="color"
                      className="w-12 h-12 rounded-xl cursor-pointer border-none"
                      value={localSettings.primaryColor}
                      onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                    />
                    <input 
                      className="bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm uppercase font-mono"
                      value={localSettings.primaryColor}
                      onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
