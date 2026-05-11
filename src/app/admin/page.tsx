'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  _id: string;
  title: string;
  price?: string;
  imageUrl: string;
  link: string;
  description?: string;
  aboutText?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Settings State
  const [mascotUrl, setMascotUrl] = useState('');
  const [savingMascot, setSavingMascot] = useState(false);
  
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerTaglines, setHeaderTaglines] = useState('');
  const [headerNotice, setHeaderNotice] = useState('');
  const [headerNoticeInterval, setHeaderNoticeInterval] = useState('5'); // Default 5 min
  const [savingHeader, setSavingHeader] = useState(false);
  
  // AESTHETIC CUSTOMIZATION STATES
  const [headerTheme, setHeaderTheme] = useState('glass');
  const [headerTitleColor, setHeaderTitleColor] = useState('');
  const [headerTitleFont, setHeaderTitleFont] = useState('font-serif');
  const [headerSubtitleColor, setHeaderSubtitleColor] = useState('');
  const [headerSubtitleFont, setHeaderSubtitleFont] = useState('font-sans');

  // COMING SOON / MAINTENANCE MODE
  const [comingSoonEnabled, setComingSoonEnabled] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState('');
  const [comingSoonMessage, setComingSoonMessage] = useState('');
  const [comingSoonDate, setComingSoonDate] = useState('');
  const [savingComingSoon, setSavingComingSoon] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState('');
  const [easterEggImage, setEasterEggImage] = useState('');

  // MULTI-NOTICE MANAGEMENT SYSTEM
  const [notices, setNotices] = useState<any[]>([]);
  const [nText, setNText] = useState('');
  const [nIntervalMin, setNIntervalMin] = useState('0');
  const [nIntervalSec, setNIntervalSec] = useState('30');
  const [nDurationSec, setNDurationSec] = useState('10');
  const [nLink, setNLink] = useState('');
  const [nImageUrl, setNImageUrl] = useState('');
  const [nMediaType, setNMediaType] = useState('image'); // 'image' | 'video'
  const [nType, setNType] = useState('notice'); // 'notice' | 'billboard'
  const [savingNotice, setSavingNotice] = useState(false);
  const [uploadingNoticeFile, setUploadingNoticeFile] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

  const resetNoticeForm = () => {
    setEditingNoticeId(null);
    setNText('');
    setNLink('');
    setNImageUrl('');
    setNMediaType('image');
    setNType('notice');
    setNIntervalMin('0');
    setNIntervalSec('30');
    setNDurationSec('10');
  };

  const handleEditNotice = (item: any) => {
    setEditingNoticeId(item._id);
    setNText(item.text || '');
    setNLink(item.link || '');
    setNImageUrl(item.imageUrl || '');
    setNMediaType(item.mediaType || 'image');
    setNType(item.type || 'notice');
    setNDurationSec(item.durationSeconds.toString());
    const mins = Math.floor(item.intervalSeconds / 60);
    const secs = item.intervalSeconds % 60;
    setNIntervalMin(mins.toString());
    setNIntervalSec(secs.toString());
  };

  // Handle direct file uploads for Notice Media
  const handleNoticeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Size check 5MB approx
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }

    setUploadingNoticeFile(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileBase64: base64, password: password })
        });
        const data = await res.json();
        if (data.success) {
          setNImageUrl(data.secure_url);
          setNMediaType(data.mediaType); // Sets 'image' or 'video' automatically!
        } else { alert("Upload failed."); }
      } catch (err) { alert("Connection error."); }
      setUploadingNoticeFile(false);
    };
    reader.readAsDataURL(file);
  };

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setNotices(data.data);
    } catch (e) { console.error("Failed fetch notices"); }
  };

  const handleAddNotice = async () => {
    // If billboard, allow empty text as long as media exists. If notice, require text.
    if (nType === 'notice' && !nText) return alert("Please enter notice text.");
    if (nType === 'billboard' && !nText && !nImageUrl) return alert("Billboard requires text OR media upload!");
    
    setSavingNotice(true);
    const totalSec = (parseInt(nIntervalMin) * 60) + parseInt(nIntervalSec);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingNoticeId, // Inclusion forces the API to Update instead of Create!
          text: nText, 
          intervalSeconds: totalSec > 0 ? totalSec : 60, 
          durationSeconds: parseInt(nDurationSec) || 10,
          link: nLink,
          imageUrl: nImageUrl,
          type: nType,
          mediaType: nMediaType
        })
      });
      const data = await res.json();
      if (data.success) {
        resetNoticeForm();
        fetchNotices();
      } else {
        alert("Server Error: " + (data.error || "Failed to add item"));
      }
    } catch (e) { 
      alert("Failed to connect to server"); 
    } finally {
      setSavingNotice(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if(!confirm("Delete this notice?")) return;
    try {
      await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      fetchNotices();
    } catch (e) { alert("Failed deleting"); }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setMascotUrl(data.mascotImageUrl || '/kitty.gif');
      setHeaderTitle(data.headerTitle || 'Aesthetic Finds ✨');
      setHeaderTaglines(data.headerTaglines || 'Curated coquette treasures, cute decor, and premium finds, just for you.');
      setHeaderNotice(data.headerNotice || '');
      setHeaderNoticeInterval(data.headerNoticeInterval || '5');
      
      // Load aesthetic configs
      setHeaderTheme(data.headerTheme || 'glass');
      setHeaderTitleColor(data.headerTitleColor || '');
      setHeaderTitleFont(data.headerTitleFont || 'font-serif');
      setHeaderSubtitleColor(data.headerSubtitleColor || '');
      setHeaderSubtitleFont(data.headerSubtitleFont || 'font-sans');

      // Coming Soon settings
      setComingSoonEnabled(data.comingSoonEnabled === 'true');
      setComingSoonTitle(data.comingSoonTitle || '');
      setComingSoonMessage(data.comingSoonMessage || '');
      setComingSoonDate(data.comingSoonDate || '');
      setEasterEggMessage(data.easterEggMessage || '');
      setEasterEggImage(data.easterEggImage || '');
    } catch (e) {
      console.error('Failed to load settings');
    }
  };

  const handleSaveHeader = async () => {
    setSavingHeader(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'headerTitle', value: headerTitle })
      });
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'headerTaglines', value: headerTaglines })
      });
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'headerNotice', value: headerNotice })
      });
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'headerNoticeInterval', value: headerNoticeInterval })
      });

      // Aesthetic keys saving
      const configs = [
        { key: 'headerTheme', value: headerTheme },
        { key: 'headerTitleColor', value: headerTitleColor },
        { key: 'headerTitleFont', value: headerTitleFont },
        { key: 'headerSubtitleColor', value: headerSubtitleColor },
        { key: 'headerSubtitleFont', value: headerSubtitleFont }
      ];
      
      for (const config of configs) {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        });
      }

      alert('Header settings updated successfully!');
    } catch (e) {
      alert('Error saving header settings.');
    } finally {
      setSavingHeader(false);
    }
  };

  const handleSaveMascot = async () => {
    setSavingMascot(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'mascotImageUrl', value: mascotUrl })
      });
      const data = await res.json();
      if (data.success) {
        alert('Mascot updated successfully!');
      } else {
        alert('Failed to save mascot.');
      }
    } catch (e) {
      alert('Network error saving mascot.');
    } finally {
      setSavingMascot(false);
    }
  };

  const handleSaveComingSoon = async () => {
    setSavingComingSoon(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'comingSoonEnabled', value: comingSoonEnabled ? 'true' : 'false' })
      });
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'comingSoonMessage', value: comingSoonMessage })
      });
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'comingSoonTitle', value: comingSoonTitle })
      });
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'comingSoonDate', value: comingSoonDate })
      });
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'easterEggMessage', value: easterEggMessage })
      });
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'easterEggImage', value: easterEggImage })
      });
      alert('Coming Soon settings updated successfully!');
    } catch (e) {
      alert('Failed to save Coming Soon settings.');
    } finally {
      setSavingComingSoon(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchSettings();
      fetchNotices();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_preview_active', 'true');
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      alert('Login failed');
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String);
        setPreviewUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setLink('');
    setDescription('');
    setAboutText('');
    setImageBase64('');
    setPreviewUrl('');
  };

  const handleEditInit = (product: Product) => {
    setEditingId(product._id);
    setTitle(product.title);
    setPrice(product.price || '');
    setLink(product.link);
    setDescription(product.description || '');
    setAboutText(product.aboutText || '');
    setImageBase64(''); // Only provide if user uploads a new file
    setPreviewUrl(product.imageUrl);
    
    // Scroll up to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !link) {
      alert('Please fill out Title and Affiliate Link');
      return;
    }

    // If creating NEW, must have image
    if (!editingId && !imageBase64) {
      alert('Please upload an image for the new product');
      return;
    }
    
    setSubmitting(true);
    try {
      const isUpdating = !!editingId;
      const url = isUpdating ? `/api/products/${editingId}` : '/api/products';
      const method = isUpdating ? 'PUT' : 'POST';
      
      const payload: any = {
        title,
        price,
        link,
        description,
        aboutText,
        password
      };

      if (imageBase64) {
        payload.imageBase64 = imageBase64;
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (data.success) {
        resetForm();
        fetchProducts(); // Refresh list
        alert(isUpdating ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        alert(data.error || 'Request failed');
      }
    } catch (error) {
      alert('Network error');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
        if (editingId === id) resetForm();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <div className="bg-background p-8 rounded-3xl shadow-sm border border-primary/20 max-w-sm w-full">
          <h1 className="font-serif text-2xl text-center mb-6 text-foreground">Admin Login ✨</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_preview_active');
    // Clear cookie too so server components re-lock the page
    document.cookie = "admin_preview_active=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        <header className="flex justify-between items-center bg-background p-6 rounded-3xl shadow-sm border border-primary/20">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground font-bold">Admin Dashboard ✨</h1>
          <div className="flex items-center gap-3">
            <a 
              href="/" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded-xl hover:bg-green-100 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Preview Live Site
            </a>
            <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground font-medium px-4 py-2 rounded-lg border border-transparent hover:border-muted">Logout</button>
          </div>
        </header>

        {/* GLOBAL SETTINGS BAR */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-primary/15 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-muted/30 rounded-2xl flex items-center justify-center border border-muted overflow-hidden shrink-0">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={mascotUrl || '/kitty.gif'} alt="Mascot Preview" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-[#3E322C]">Site Mascot Image</h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Paste a direct URL of a new GIF to change the character roaming the site.</p>
            </div>
          </div>
          <div className="flex flex-1 gap-2 w-full">
            <input 
              type="url" 
              value={mascotUrl} 
              onChange={(e) => setMascotUrl(e.target.value)}
              placeholder="https://example.com/cool-cat.gif"
              className="flex-1 px-4 py-3 rounded-xl bg-muted/10 border border-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button 
              onClick={handleSaveMascot}
              disabled={savingMascot}
              className="px-6 py-3 bg-[#E60023] hover:bg-[#bd081c] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm"
            >
              {savingMascot ? 'Saving...' : 'Save Mascot'}
            </button>
          </div>
        </section>

        {/* COMING SOON SETTINGS BAR */}
        <section className="bg-[#FFF5F5] p-6 rounded-3xl shadow-sm border border-[#FFE4E6] flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FFE4E6] pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#3E322C] flex items-center gap-2">
                🚀 Coming Soon / Overlay Control
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Block the public frontend with a beautiful countdown timer overlay.</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer scale-95">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={comingSoonEnabled} 
                  onChange={(e) => setComingSoonEnabled(e.target.checked)} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E60023]"></div>
                <span className="ml-3 text-sm font-bold text-[#3E322C]">
                  {comingSoonEnabled ? '✅ ACTIVATED' : '❌ DEACTIVATED'}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#8C7A74] uppercase">Main Heading</label>
                <input 
                  type="text" 
                  placeholder="We will live soon"
                  value={comingSoonTitle}
                  onChange={(e) => setComingSoonTitle(e.target.value)}
                  disabled={!comingSoonEnabled}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#FFE4E6] focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm disabled:opacity-50 font-bold"
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#8C7A74] uppercase">Overlay Subtitle/Msg</label>
                <input 
                  type="text" 
                  placeholder="We are preparing something truly magical just for you."
                  value={comingSoonMessage}
                  onChange={(e) => setComingSoonMessage(e.target.value)}
                  disabled={!comingSoonEnabled}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#FFE4E6] focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm disabled:opacity-50"
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#8C7A74] uppercase">Target Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={comingSoonDate}
                  onChange={(e) => setComingSoonDate(e.target.value)}
                  disabled={!comingSoonEnabled}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#FFE4E6] focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm disabled:opacity-50"
                />
             </div>
          </div>

          {/* Easter Egg Troll Row */}
          <div className="mt-2 pt-4 border-t border-[#FFE4E6]/60 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-red-700 uppercase flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  Hidden Troll Text (For Inspect-Element users)
                </label>
                <input 
                  type="text" 
                  placeholder="Caught You Looking!..."
                  value={easterEggMessage}
                  onChange={(e) => setEasterEggMessage(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-red-50/30 border border-[#FFE4E6] focus:outline-none focus:ring-1 focus:ring-red-200 text-xs italic font-medium"
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-red-700 uppercase flex items-center gap-1">
                  🖼️ Hidden Meme Image URL
                </label>
                <input 
                  type="url" 
                  placeholder="Paste direct link to a funny GIF or image"
                  value={easterEggImage}
                  onChange={(e) => setEasterEggImage(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-red-50/30 border border-[#FFE4E6] focus:outline-none focus:ring-1 focus:ring-red-200 text-xs font-medium"
                />
             </div>
          </div>

          <div className="flex justify-end">
             <button 
               onClick={handleSaveComingSoon}
               disabled={savingComingSoon}
               className="px-6 py-2.5 bg-[#3E322C] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
             >
               {savingComingSoon ? 'Saving...' : 'Save Overlay Mode Settings'}
             </button>
          </div>
        </section>

        {/* HEADER SETTINGS BAR */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-primary/15 flex flex-col gap-4">
          <div className="border-b border-muted pb-3 mb-1">
            <h3 className="font-serif text-xl font-bold text-[#3E322C] flex items-center gap-2">
              Customizable Dynamic Header 🎭
            </h3>
            <p className="text-xs text-muted-foreground">Customize site name and add multiple cycling taglines (put each tagline on a new line).</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8C7A74] uppercase tracking-wider">Main Site Title</label>
              <input 
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                placeholder="Aesthetic Finds ✨"
                className="px-4 py-3 rounded-xl bg-muted/10 border border-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8C7A74] uppercase tracking-wider">Rotating Taglines (One per line)</label>
              <textarea 
                rows={3}
                value={headerTaglines}
                onChange={(e) => setHeaderTaglines(e.target.value)}
                placeholder="Line 1&#10;Line 2&#10;Line 3"
                className="px-4 py-3 rounded-xl bg-muted/10 border border-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[80px]"
              />
            </div>
          </div>

          {/* AESTHETIC CUSTOMIZATION PANEL */}
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-muted/50">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#8C7A74] uppercase flex items-center gap-1">
                Header Theme Look
              </label>
              <select 
                value={headerTheme} 
                onChange={(e) => setHeaderTheme(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-muted/5 border border-muted text-sm font-medium focus:ring-2 focus:ring-pink-300 focus:outline-none"
              >
                <option value="glass">✨ Modern Glassmorphism</option>
                <option value="minimal">🤍 Clean White Minimalist</option>
                <option value="soft-blush">🌸 Cute Soft Blush Pink</option>
                <option value="dark-luxury">🖤 Dark Luxury Gold</option>
                <option value="sunset-gradient">🌇 Aesthetic Sunset Gradient</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 border-l border-muted/30 pl-0 md:pl-4">
              <label className="text-[11px] font-bold text-[#8C7A74] uppercase">Title Styling</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select 
                    value={headerTitleFont} 
                    onChange={(e) => setHeaderTitleFont(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/5 border border-muted text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  >
                    <option value="font-serif">Serif (Elegant)</option>
                    <option value="font-sans">Sans (Modern)</option>
                    <option value="font-mono">Monospace (Cute)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-muted/5 border border-muted rounded-xl px-2 py-1">
                   <input 
                     type="color" 
                     value={headerTitleColor || '#000000'} 
                     onChange={(e) => setHeaderTitleColor(e.target.value)} 
                     className="w-7 h-7 border-0 cursor-pointer bg-transparent"
                   />
                   <span className="text-[10px] font-mono text-muted-foreground">Color</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-l border-muted/30 pl-0 md:pl-4">
              <label className="text-[11px] font-bold text-[#8C7A74] uppercase">Subtitle Styling</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select 
                    value={headerSubtitleFont} 
                    onChange={(e) => setHeaderSubtitleFont(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/5 border border-muted text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  >
                    <option value="font-sans">Sans (Clear)</option>
                    <option value="font-serif">Serif (Classic)</option>
                    <option value="font-mono">Monospace</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-muted/5 border border-muted rounded-xl px-2 py-1">
                   <input 
                     type="color" 
                     value={headerSubtitleColor || '#6B7280'} 
                     onChange={(e) => setHeaderSubtitleColor(e.target.value)} 
                     className="w-7 h-7 border-0 cursor-pointer bg-transparent"
                   />
                   <span className="text-[10px] font-mono text-muted-foreground">Color</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notice Board System v2 */}
          <div className="mt-4 p-5 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#E60023] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md shadow-sm">Master Notice Suite</span>
              <h4 className="font-sans font-bold text-[#3E322C] text-base">Notice Broadcast Center</h4>
            </div>

            {/* CREATE FORM */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-xl border border-[#FECACA]/50 shadow-sm mb-4">
              <div className="md:col-span-4">
                <label className="text-[11px] font-bold text-[#8C7A74] uppercase mb-1 block">Display Type</label>
                <select 
                  value={nType}
                  onChange={(e) => setNType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-muted focus:outline-none focus:ring-2 focus:ring-[#E60023]/50 text-sm font-bold text-[#E60023]"
                >
                  <option value="notice">💎 Central Notice (Subtle)</option>
                  <option value="billboard">🔥 Billboard (Full Header Cover)</option>
                </select>
              </div>

              {nType === 'notice' && (
                <div className="md:col-span-4 transition-all duration-300">
                  <label className="text-[11px] font-bold text-[#8C7A74] uppercase mb-1 block">Special Notice Message</label>
                  <textarea 
                    value={nText}
                    onChange={(e) => setNText(e.target.value)}
                    placeholder="🔥 E.g., 50% Off Flash Sale!"
                    className="w-full px-3 py-2.5 rounded-lg border border-muted focus:outline-none focus:ring-2 focus:ring-[#E60023]/50 text-sm min-h-[60px]"
                  />
                </div>
              )}

              {nType === 'billboard' && (
                <div className="md:col-span-4 transition-all duration-300">
                  <div className="flex flex-col gap-2">
                     <div>
                       <label className="text-[11px] font-bold text-[#8C7A74] uppercase mb-1 block">Target Promo URL (Optional)</label>
                       <input type="url" value={nLink} onChange={(e) => setNLink(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-muted text-sm" />
                     </div>
                     <div>
                       <label className="text-[11px] font-bold text-[#8C7A74] uppercase mb-1 block">Upload Media (Video & Image Supported)</label>
                       <div className="flex items-center gap-2">
                          <label className={`flex-1 flex flex-col items-center justify-center px-3 py-2 bg-white text-pink-500 rounded-lg shadow-sm tracking-wide uppercase border border-pink-200 cursor-pointer hover:bg-pink-50 transition-all text-[10px] font-bold ${uploadingNoticeFile ? 'opacity-50 pointer-events-none' : ''}`}>
                              <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" /></svg>
                              <span className="truncate w-full text-center">{uploadingNoticeFile ? "Uploading..." : (nImageUrl ? "✓ Media Uploaded" : "Attach File (Max 5MB)")}</span>
                              <input type='file' className="hidden" onChange={handleNoticeFileUpload} accept="image/*,video/*" />
                          </label>
                          {nImageUrl && (
                            <span className="bg-green-100 text-green-600 text-[9px] px-1 rounded uppercase font-bold">{nMediaType}</span>
                          )}
                       </div>
                     </div>
                  </div>
                </div>
              )}

              <div className="md:col-span-4 flex flex-col justify-between h-full">
                 <div className="grid grid-cols-3 gap-2 mb-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#8C7A74] uppercase mb-1 block">Interval M</label>
                      <input type="number" min="0" value={nIntervalMin} onChange={(e) => setNIntervalMin(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-muted text-sm" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#8C7A74] uppercase mb-1 block">Interval S</label>
                      <input type="number" min="0" max="59" value={nIntervalSec} onChange={(e) => setNIntervalSec(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-muted text-sm" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#8C7A74] uppercase mb-1 block truncate">Dur (Sec)</label>
                      <input type="number" min="1" value={nDurationSec} onChange={(e) => setNDurationSec(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-muted text-sm" />
                    </div>
                 </div>
                 <button 
                    onClick={handleAddNotice}
                    disabled={savingNotice}
                    className="w-full py-3 bg-[#E60023] text-white rounded-lg font-bold text-sm hover:bg-[#C4001D] transition-colors shadow-md flex items-center justify-center leading-tight"
                 >
                    {savingNotice ? '...' : (editingNoticeId ? '💾 Update Notice' : '+ Create Item')}
                 </button>
                 {editingNoticeId && (
                    <button 
                      onClick={resetNoticeForm}
                      className="w-full mt-2 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold text-xs hover:bg-gray-200 transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
              </div>

            </div>

            {/* LIST DISPLAY */}
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
              {notices.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-3 italic">No active dynamic notices yet.</p>
              ) : notices.map((item) => (
                <div key={item._id} className="flex justify-between items-center bg-white px-3 py-2.5 rounded-xl border border-muted shadow-sm group">
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <p className={`font-bold text-sm truncate max-w-[250px] md:max-w-full ${item.text ? 'text-[#E60023]' : 'text-gray-400 italic'}`}>
                      {item.text || "🖼️ [Visual Media Only]"}
                    </p>
                    <div className="flex gap-2.5 text-[10px] font-bold text-[#8C7A74] items-center mt-0.5">
                       <span className={`px-1.5 py-0.5 rounded ${item.type === 'billboard' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-600'}`}>
                         {item.type === 'billboard' ? '👑 Billboard' : '📢 Notice'}
                       </span>
                       <span>⏰ Every: {item.intervalSeconds}s</span>
                       <span>⏱ Show: {item.durationSeconds}s</span>
                       {item.link && <span className="text-blue-500">🔗 Link</span>}
                       {item.imageUrl && (
                         <span className="bg-purple-100 text-purple-600 px-1 rounded uppercase text-[9px]">
                           {item.mediaType === 'video' ? '🎥 Video' : '🖼 Img'}
                         </span>
                       )}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                      <button onClick={() => handleEditNotice(item)} className="p-2 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex-shrink-0" title="Edit item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDeleteNotice(item._id)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all flex-shrink-0" title="Delete item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button 
              onClick={handleSaveHeader}
              disabled={savingHeader}
              className="px-8 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 shadow-sm transition-all disabled:opacity-50"
            >
              {savingHeader ? 'Updating Header...' : 'Save Header Configuration'}
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Combined Action Form */}
          <div className="md:col-span-5 bg-background p-6 md:p-7 rounded-3xl shadow-sm border border-primary/20 h-fit sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl text-[#262626] font-bold">
                {editingId ? 'Edit Product Details' : 'Add New Product'}
              </h2>
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="text-xs bg-muted px-3 py-1.5 rounded-full font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Image Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-wide uppercase text-muted-foreground/80">
                  {editingId ? 'Update Product Image (Optional)' : 'Product Image'}
                </label>
                <div className="group border-2 border-dashed border-primary/20 hover:border-primary/40 bg-muted/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-all relative overflow-hidden aspect-video sm:aspect-[1.5/1]">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                        Click to Swap Image
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-white p-2.5 rounded-full shadow-sm text-primary/60">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">Select Product Photo</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-muted/10 border border-primary/10 focus:bg-background focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10 font-sans text-sm transition-all"
                    placeholder="Pear Aesthetic Table Lamp"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">Front Description (Paragraph)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="px-4 py-3 rounded-xl bg-muted/10 border border-primary/10 focus:bg-background focus:border-primary/40 focus:outline-none font-sans text-sm resize-none"
                  placeholder="Perfect aesthetic addition to cozy up your personal space."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">About Details (Back Face)</label>
                <textarea 
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  rows={3}
                  className="px-4 py-3 rounded-xl bg-muted/10 border border-primary/10 focus:bg-background focus:border-primary/40 focus:outline-none font-sans text-sm"
                  placeholder="Premium Quality material&#10;Perfect Gifting Option&#10;Highly Durable Design"
                />
                <span className="text-[10px] text-muted-foreground opacity-75">Pro-tip: Hit Enter to start new line points.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground/80 uppercase">Price (Optional)</label>
                  <input 
                    type="text" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-muted/10 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/10 font-sans text-sm"
                    placeholder="$19.99"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">Marketplace Affiliate Link</label>
                  <input 
                    type="url" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-muted/10 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/10 font-sans text-sm"
                    placeholder="https://amazon.com/product-slug"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className={`mt-2 py-4 rounded-2xl text-white font-bold text-sm uppercase tracking-widest shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2.5 ${editingId ? 'bg-[#A67B7B] hover:bg-[#916868] shadow-[#A67B7B]/20' : 'bg-[#DE9B9B] hover:bg-[#CF8282] shadow-[#DE9B9B]/25'}`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : (
                  editingId ? 'Save Product Updates' : 'Publish New Product'
                )}
              </button>
            </form>
          </div>

          {/* Product List */}
          <div className="md:col-span-7 bg-background p-6 md:p-8 rounded-3xl shadow-sm border border-primary/20">
            <div className="flex items-center justify-between mb-7">
              <h2 className="font-serif text-xl md:text-2xl text-[#3E322C] font-bold">Product Inventory</h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20">
                {products.length} Items
              </span>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-16 bg-muted/5 rounded-3xl border border-dashed border-muted/30">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-serif text-lg text-muted-foreground">Inventory is Empty</h3>
                <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto mt-1">Upload your first aesthetic treasure to display it in the gallery.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {products.map((product) => (
                  <div 
                    key={product._id} 
                    className={`relative flex flex-col rounded-2xl bg-muted/10 border overflow-hidden transition-all duration-300 ${editingId === product._id ? 'border-[#DE9B9B] ring-2 ring-[#DE9B9B]/20 bg-[#FFF9F9]' : 'border-primary/10 hover:border-primary/30 hover:shadow-md'}`}
                  >
                    {editingId === product._id && (
                      <div className="absolute top-2 right-2 z-10 bg-[#DE9B9B] text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">Editing Now</div>
                    )}
                    <div className="relative aspect-square w-full bg-[#F5EEEC]">
                      <Image src={product.imageUrl} alt={product.title} fill className="object-contain p-2" />
                    </div>
                    <div className="p-4 flex flex-col flex-1 bg-white">
                      <h3 className="font-sans font-bold text-[#3E322C] text-sm line-clamp-1 mb-1" title={product.title}>
                        {product.title}
                      </h3>
                      <p className="text-xs text-[#8C7A74] line-clamp-2 flex-1 mb-3 font-medium leading-relaxed">
                        {product.description || 'No description added.'}
                      </p>
                      
                      <div className="flex gap-2 pt-2 mt-auto border-t border-muted/30">
                        <button 
                          onClick={() => handleEditInit(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/5 text-black text-xs font-bold rounded-xl hover:bg-primary/10 border border-primary/10 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"/></svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
