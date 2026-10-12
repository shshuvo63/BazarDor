"use client"
import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';

const unitInBangla = {
  kg: 'কেজি',
  kilogram: 'কেজি',
  g: 'গ্রাম',
  liter: 'লিটার',
  litre: 'লিটার',
  piece: 'পিস',
  pieces: 'পিস',
  dozen: 'ডজন',
};

function CategoryProductsContent({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    fetch(`https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const productData = Array.isArray(data) ? data : data?.products || data?.data || [];
        setProducts(productData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [slug]);

  const toBanglaNumber = (value) => {
    if (value === undefined || value === null) return '';
    const banglaDigits = '০১২৩৪৫৬৭৮৯';
    return value.toString().replace(/[0-9]/g, (digit) => banglaDigits[Number(digit)]);
  };

  // Get Category Info from first product if available
  const firstProduct = products[0] || {};
  const categoryNameBn = firstProduct.categoryNameBn || slug;
  const categoryIcon = firstProduct.categoryIcon || '📦';

  // Search Filter
  const filteredProducts = products.filter((item) =>
    item.nameBn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting Handler
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-high') return a.today - b.today;
    if (sortBy === 'high-low') return b.today - a.today;
    return 0;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-[#f4f7f4] min-h-screen">
      {/* Category Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl">
          {categoryIcon}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{categoryNameBn}</h1>
          <p className="text-xs text-gray-500 mt-0.5">মোট পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-end gap-4">
        <div className="w-full md:w-auto flex items-center gap-2 justify-end">
          <span className="text-xs text-gray-500 font-medium">সাজান</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#008a45]"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* Total Products Counter */}
      <div>
        <p className="text-xs text-gray-500 font-medium">
          মোট {toBanglaNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-5 border border-gray-100 h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        /* Product Cards Grid with /product/[id] Link */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map((item, index) => {
            const isUp = item.change?.dir === 'up';
            const isDown = item.change?.dir === 'down';
            const productId = item.id || index;

            return (
              <Link
                key={productId}
                href={`/product/${productId}`}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-[#008a45]/40 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                    {item.image || item.categoryIcon || '📦'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">
                      {item.nameBn}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      প্রতি {unitInBangla[item.unit] || item.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                      আজকের দাম
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {toBanglaNumber(item.today)} <span className="text-sm font-normal text-gray-600">টাকা</span>
                    </p>
                  </div>

                  <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md ${
                    isUp ? 'bg-red-50 text-red-500' : isDown ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'
                  }`}>
                    <span>{isUp ? '▲' : isDown ? '▼' : '—'}</span>
                    <span>{toBanglaNumber(item.change?.pct || 0)}%</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CategoryProductsView({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f7f4] p-6 text-center text-gray-500">লোড হচ্ছে...</div>}>
      <CategoryProductsContent params={params} />
    </Suspense>
  );
}