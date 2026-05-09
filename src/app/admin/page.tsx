'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  _id: string;
  title: string;
  price?: string;
  imageUrl: string;
  link: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !link || !imageBase64) {
      alert('Please fill out Title, Link, and select an Image');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price,
          link,
          imageBase64,
          password
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setTitle('');
        setPrice('');
        setLink('');
        setImageBase64('');
        setPreviewUrl('');
        fetchProducts(); // Refresh list
      } else {
        alert(data.error || 'Failed to add product');
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
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-muted-foreground hover:text-foreground">Logout</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="md:col-span-1 bg-background p-6 rounded-3xl shadow-sm border border-primary/20 h-fit">
            <h2 className="font-serif text-xl mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Product Image</label>
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-colors relative overflow-hidden aspect-[4/5]">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm"
                  placeholder="e.g. Vintage Lace Trim Cami"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Price (Optional)</label>
                <input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm"
                  placeholder="e.g. $18.99"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Amazon Affiliate Link</label>
                <input 
                  type="url" 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm"
                  placeholder="https://amazon.com/..."
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="mt-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Uploading to Cloudinary...' : 'Add Product'}
              </button>
            </form>
          </div>

          {/* Product List */}
          <div className="md:col-span-2 bg-background p-6 rounded-3xl shadow-sm border border-primary/20">
            <h2 className="font-serif text-xl mb-6">Manage Products</h2>
            
            {products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No products found. Add one to get started!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="relative group border border-primary/10 rounded-xl overflow-hidden bg-muted/20">
                    <div className="relative aspect-square w-full">
                      <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-sans font-medium text-sm line-clamp-1">{product.title}</h3>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="mt-2 w-full py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-md hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
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
