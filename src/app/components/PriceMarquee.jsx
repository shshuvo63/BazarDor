import { Hind_Siliguri } from 'next/font/google';
import React from 'react';
import Marquee from 'react-marquee-text';
import Link from 'next/link';

const unitInBangla = {
    kg: 'কেজি',
    kilogram: 'কেজি',
    kilograms: 'কেজি',

    g: 'গ্রাম',
    gram: 'গ্রাম',
    grams: 'গ্রাম',

    liter: 'লিটার',
    litre: 'লিটার',
    liters: 'লিটার',
    litres: 'লিটার',

    ml: 'মিলিলিটার',
    milliliter: 'মিলিলিটার',

    piece: 'টি',
    pieces: 'টি',

    dozen: 'ডজন',
};

const banglaFont = Hind_Siliguri({ subsets: ['bengali'], weight: ['400', '500', '600', '700'] });

export default async function PriceMarquee() {
    "use cache";
    const MarqueeData = async () => {
        const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
        const data = await res.json();
        return data;
    };

    const toBanglaNumber = (value) => {
        const banglaDigits = '০১২৩৪৫৬৭৮৯';
        return value.toString().replace(/[0-9]/g, (digit) => banglaDigits[Number(digit)]);
    };

    const products = await MarqueeData();
    const infiniteData = [...products, ...products, ...products];

    return (
        <div className="w-full bg-[#FAFCFA] border-y border-gray-200 py-3 overflow-hidden select-none">
            <Marquee direction="right" pauseOnHover={true} duration={15}>
                <div className="flex items-center">
                    {infiniteData.map((item, index) => (
                        <Link
                            href={`/product/${item.id}`}
                            key={`${item.id}-${index}`}
                            className="flex items-center space-x-2 border-r border-gray-200 px-6 text-sm font-medium text-gray-800 whitespace-nowrap hover:bg-gray-100/50 transition-colors cursor-pointer"
                        >
                            <span className="flex items-center justify-center text-base mr-1">
                                {item.categoryIcon}
                            </span>

                            <span className={`text-[14px] font-medium text-gray-900 ${banglaFont.className}`}>{item.nameBn}</span>

                            <span className={` ${banglaFont.className} text-gray-600`}>
                                {toBanglaNumber(item.today)} টাকা/{unitInBangla[item.unit] || item.unit}
                            </span>

                            <span
                                className={`flex items-center text-[14px] font-semibold ${
                                    item.change.dir === 'up' ? 'text-red-500' : 'text-emerald-600'
                                }`}
                            >
                                <span className="text-[14px] mr-0.5">
                                    {item.change.dir === 'up' ? '▲' : '▼'}
                                </span>
                                <span>{toBanglaNumber(item.change.pct)}%</span>
                            </span>
                        </Link>
                    ))}
                </div>
            </Marquee>
        </div>
    );
}