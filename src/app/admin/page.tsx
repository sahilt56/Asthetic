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

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.mascotImageUrl) {
        setMascotUrl(data.mascotImageUrl);
      } else {
        setMascotUrl('/kitty.gif'); // default
      }
    } catch (e) {
      console.error('Failed to load settings');
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

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        <header className="flex justify-between items-center bg-background p-6 rounded-3xl shadow-sm border border-primary/20">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground font-bold">Admin Dashboard ✨</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-muted-foreground hover:text-foreground font-medium px-4 py-2 rounded-lg border border-transparent hover:border-muted">Logout</button>
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
