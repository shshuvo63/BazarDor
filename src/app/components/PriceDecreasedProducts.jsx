"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-sm flex flex-col justify-between animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded-lg" />
          <div className="h-3 w-20 bg-gray-200 rounded-lg" />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-6 w-28 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
}

export default function PriceDecreasedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://openapi.programming-hero.com/api/bazardor/products')
      .then((res) => res.json())
      .then((data) => {
        const sortedProducts = [...data]
          .sort((a, b) => a.today - b.today)
          .slice(0, 6);
        setProducts(sortedProducts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toBanglaNumber = (value) => {
    if (value === undefined || value === null) return '';
    const banglaDigits = '০১২৩৪৫৬৭৮৯';
    return value.toString().replace(/[0-9]/g, (digit) => banglaDigits[Number(digit)]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6  rounded-2xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-emerald-600 text-xs">▼</span>
        <h2 className="text-xl font-bold text-gray-900">আজ দাম কমেছে</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((item, index) => (
            <Link href={`/product/${item.id}`}
              key={item.id || index}
              className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                  {item.categoryIcon || '📦'}
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

                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                  <span>▼</span>
                  <span>{toBanglaNumber(item.change?.pct || 0)}%</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
