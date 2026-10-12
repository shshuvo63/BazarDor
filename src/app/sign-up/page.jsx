"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '../../lib/auth-client'; // আপনার প্রজেক্টের পাথ অনুযায়ী ঠিক করে নেবেন

function SignUpSkeleton() {
  return (
    <div className="min-h-screen w-full bg-[#f4f7f4] flex flex-col justify-between p-6 animate-pulse">
      <div className="max-w-md w-full mx-auto pt-6 flex-1 flex flex-col items-center justify-center">
        {/* Header skeleton */}
        <div className="flex flex-col items-center space-y-2 mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded-lg" />
          <div className="h-3.5 w-64 bg-gray-200 rounded-lg" />
        </div>

        {/* Card skeleton */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-14 bg-gray-200 rounded mb-1.5" />
              <div className="h-11 w-full bg-gray-200 rounded-xl" />
            </div>
          ))}
          <div className="h-10 w-full bg-gray-200 rounded-xl" />

          <div className="py-2">
            <div className="h-px w-full bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-9 bg-gray-200 rounded-xl" />
            <div className="h-9 bg-gray-200 rounded-xl" />
          </div>

          <div className="flex justify-center pt-2">
            <div className="h-3 w-44 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Back link skeleton */}
        <div className="mt-6">
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}


export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);

  // সেশন চেক করার জন্য (যদি অলরেডি লগইন করা থাকে তবে হোমপেজে রিডাইরেক্ট করবে)
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session && !justSignedUp) {
      router.push('/');
    }
  }, [session, justSignedUp, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('পাসওয়ার্ড দুটি মিলছে না!');
      return;
    }

    setLoading(true);

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || 'সাইন আপ করতে সমস্যা হয়েছে');
      return;
    }

    setJustSignedUp(true);
    toast.success('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে');
    router.push('/sign-in');
  };

  const handleSocialLogin = async (provider) => {
    try {
      await authClient.signIn.social({
        provider: provider,
        callbackURL: '/',
      });
    } catch (err) {
      console.error('Social login error:', err);
      toast.error('সোসাল লগইন ব্যর্থ হয়েছে');
    }
  };

  if (isPending) {
    return (
      <SignUpSkeleton />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f7f4] flex flex-col justify-between p-6">
      <div className="max-w-md w-full mx-auto pt-6 flex-1 flex flex-col items-center justify-center">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            বিনামূল্যে সাইন আপ করুন সব বিস্তারিত দাম দেখতে।
          </p>
        </div>

        {/* Card Box */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                placeholder="যেমন: রহিম উদ্দিন"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008a45] transition-colors"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                ইমেইল
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008a45] transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008a45] transition-colors"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type="password"
                placeholder="আবার লিখুন"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008a45] transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#008a45] hover:bg-[#00753a] text-white text-sm font-semibold rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? 'তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative bg-white px-3 text-xs text-gray-400">
              অথবা
            </span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google দিয়ে চালিয়ে যান</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-gray-800" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub দিয়ে চালিয়ে যান</span>
            </button>
          </div>

          {/* Footer Text inside Card */}
          <div className="mt-6 text-center text-xs text-gray-600">
            অ্যাকাউন্ট আছে?{' '}
            <Link href="/sign-in" className="text-[#008a45] font-semibold hover:underline">
              সাইন ইন করুন
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
