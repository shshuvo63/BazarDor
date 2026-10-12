
// import BreadCrumbs from "@/app/components/BreadCrumbs";
import { Hind_Siliguri } from "next/font/google";
import { Suspense } from "react";
export const instant = false;

const banglaFont = Hind_Siliguri({
    subsets: ["bengali"],
    weight: ["400", "500", "600", "700"],
});

// interface Market {
//     market: string;
//     division: string;
//     min: number;
//     max: number;
// }

// interface Product {
//     id: string;
//     nameBn: string;
//     unit: string;
//     today: number;
//     yesterday: number;
//     lastWeek: number;
//     lastMonth: number;
//     image: string;
//     category: string;
//     categoryNameBn: string;
//     change: {
//         dir: "up" | "down";
//         pct: number;
//     };
//     minPrice: number;
//     maxPrice: number;
//     avgPrice: number;
//     markets: Market[];
// }

// interface PageProps {
//     params: Promise<{
//         id: string;
//     }>;
// }

const maxPrice = (product) => {
    return Math.max(product.today, product.yesterday, product.lastWeek, product.lastMonth);
}

const minPrice = (product)=> {
    return Math.min(product.today, product.yesterday, product.lastWeek, product.lastMonth);
}

const unitInBangla= {
    kg: "কেজি",
    kilogram: "কেজি",
    kilograms: "কেজি",
    g: "গ্রাম",
    gram: "গ্রাম",
    grams: "গ্রাম",
    liter: "লিটার",
    litre: "লিটার",
    liters: "লিটার",
    litres: "লিটার",
    piece: "টি",
    pieces: "টি",
    dozen: "ডজন",
};

const toBanglaNumber = (
    value
) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    return value.toString().replace(/[0-9]/g, (digit) => {
        return "০১২৩৪৫৬৭৮৯"[Number(digit)];
    });
};

async function ProductDetailContent({ id }) {
    const res = await fetch(
        `https://openapi.programming-hero.com/api/bazardor/products/${id}`
    );

    const product = await res.json();
    const isUp = product.change.dir === "up";

    return (
        <div className="space-y-6">
            {/* <BreadCrumbs product={product}/> */}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl">
                        {product.image}
                    </div>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                            {product.nameBn}
                        </h1>

                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                            প্রতি {unitInBangla[product.unit] || product.unit} · {product.categoryNameBn}
                        </p>

                        <p className="text-xs text-gray-500 font-medium mt-1">
                            গতকালকের তুলনায় আজ দাম{" "}
                            <span
                                className={
                                    isUp ? "font-bold text-red-600" : "font-bold text-emerald-600"
                                }
                            >
                                {isUp ? "বেড়েছে" : "কমেছে"} · {toBanglaNumber(product.today - product.yesterday)} টাকা
                            </span>
                        </p>
                    </div>
                </div>

                <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-4 text-center min-w-35">
                    <span className="text-xs text-gray-500 font-medium block">
                        আজকের দাম
                    </span>

                    <div className="text-3xl font-extrabold text-gray-900 my-0.5">
                        {toBanglaNumber(product.today)}
                    </div>

                    <span className="text-xs text-gray-500 font-medium block">
                        টাকা / কেজি
                    </span>

                    <div
                        className={`mt-1 text-xs font-bold flex items-center justify-center ${isUp ? "text-red-600" : "text-emerald-600"
                            }`}
                    >
                        <span>{isUp ? "▲" : "▼"}</span>
                        <span className="ml-1">
                            {toBanglaNumber(product.change.pct)}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                        দামের সারসংক্ষেপ
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#FAFCFA] border border-gray-200 rounded-xl p-4">
                            <span className="text-xs text-gray-500 font-medium block">
                                সর্বনিম্ন দাম
                            </span>

                            <div className="text-xl font-bold text-emerald-600 my-1">
                                {
                                    toBanglaNumber(minPrice(product))
                                }{" "}
                                <span className="text-sm">টাকা</span>
                            </div>

                            <span className="text-xs text-gray-400 font-medium">
                                সবচেয়ে কম দামের বাজার
                            </span>
                        </div>

                        <div className="bg-[#FAFCFA] border border-gray-200 rounded-xl p-4">
                            <span className="text-xs text-gray-500 font-medium block">
                                সর্বাধিক দাম
                            </span>

                            <div className="text-xl font-bold text-red-600 my-1">
                                {toBanglaNumber(maxPrice(product))}{" "}
                                <span className="text-sm">টাকা</span>
                            </div>

                            <span className="text-xs text-gray-400 font-medium">
                                সবচেয়ে বেশি দামের বাজার
                            </span>
                        </div>

                        <div className="bg-[#FAFCFA] border border-gray-200 rounded-xl p-4">
                            <span className="text-xs text-gray-500 font-medium block">
                                গড় দাম
                            </span>

                            <div className="text-xl font-bold text-emerald-600 my-1">
                                {toBanglaNumber((maxPrice(product) + minPrice(product)) / 2)}{" "}
                                <span className="text-sm">টাকা</span>
                            </div>

                            <span className="text-xs text-gray-400 font-medium">
                                প্রতি কেজি-এর হিসাবে
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                        বাজারভিত্তিক আজকের দাম
                    </h2>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs sm:text-sm font-semibold text-gray-600">
                                    <th className="py-3 px-2">বাজার</th>
                                    <th className="py-3 px-2">বিভাগ</th>
                                    <th className="py-3 px-2">সর্বনিম্ন</th>
                                    <th className="py-3 px-2">সর্বাধিক</th>
                                    <th className="py-3 px-2 text-right">গড়</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-medium text-gray-800">
                                {product.markets.map((market) => (
                                    <tr
                                        key={market.market}
                                        className="bg-white even:bg-[#F0F5F0] hover:bg-gray-100/60 transition-colors"
                                    >
                                        <td className="py-3.5 px-2 font-semibold text-gray-900">
                                            {market.market}
                                        </td>

                                        <td className="py-3.5 px-2 text-gray-500">
                                            {market.division}
                                        </td>

                                        <td className="py-3.5 px-2 text-gray-700">
                                            {toBanglaNumber(market.min)} টাকা
                                        </td>

                                        <td className="py-3.5 px-2 text-gray-700">
                                            {toBanglaNumber(market.max)} টাকা
                                        </td>

                                        <td className="py-3.5 px-2 text-right font-bold text-gray-900">
                                            {toBanglaNumber((market.min + market.max) / 2)} টাকা
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductDetailSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-4 w-48 bg-gray-200 rounded-lg" />

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4 space-x-reverse w-full">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl shrink-0" />
                    <div className="space-y-2 w-full">
                        <div className="h-7 w-48 bg-gray-200 rounded-lg" />
                        <div className="h-4 w-32 bg-gray-200 rounded-lg" />
                        <div className="h-4 w-56 bg-gray-200 rounded-lg" />
                    </div>
                </div>

                <div className="bg-gray-100 rounded-xl p-4 w-full sm:w-36 h-28 shrink-0" />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                <div className="space-y-4">
                    <div className="h-6 w-36 bg-gray-200 rounded-lg" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#FAFCFA] border border-gray-200 rounded-xl p-4 h-24" />
                        <div className="bg-[#FAFCFA] border border-gray-200 rounded-xl p-4 h-24" />
                        <div className="bg-[#FAFCFA] border border-gray-200 rounded-xl p-4 h-24" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="h-6 w-48 bg-gray-200 rounded-lg" />
                    <div className="h-48 w-full bg-gray-100 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export default async function ProductDetail({ params }) {
    "use cache";

    const { id } = await params;

    return (
        <div
            className={`${banglaFont.className} w-full bg-[#f4f6f3] min-h-screen py-6 px-4 sm:px-6 lg:px-8 lg:mb-10`}
        >
            <div className="max-w-7xl mx-auto space-y-6">
                <Suspense fallback={<ProductDetailSkeleton />}>
                    <ProductDetailContent id={id} />
                </Suspense>
            </div>
        </div>
    );
}