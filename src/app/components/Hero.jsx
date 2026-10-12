import React from 'react';
import Image from 'next/image';

const date = new Date().toLocaleDateString("bn-BD", {
  dateStyle: "full",
});


export default function HeroBanner() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-[#f7fbf8] border border-[#e8f3ec] rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex-1 space-y-4">
          <div className="inline-block bg-[#e5f4ea] text-[#008a45] text-xs font-semibold px-3 py-1.5 rounded-full">
            {date}
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <div className="pt-2">
            <a href='#সবপণ্য' className="bg-[#008a45] hover:bg-[#00753a] text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer">
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

        <div className="w-48 h-48 md:w-64 md:h-64 relative shrink-0">
          <Image
            src="/bazar-hero.png"
            alt="Market Basket"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}