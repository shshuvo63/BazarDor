"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '../../lib/auth-client'; // আপনার প্রজেক্টের পাথ অনুযায়ী ঠিক করে নেবেন

function ProfileSkeleton() {
  return (
    <div className="min-h-screen w-full bg-[#f4f7f4] flex flex-col justify-between p-6">
      <div className="max-w-3xl w-full mx-auto space-y-6 pt-6 animate-pulse">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-40 bg-gray-200 rounded-lg" />
          <div className="h-3.5 w-64 bg-gray-200 rounded-lg" />
        </div>

        {/* Profile info card skeleton */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 flex-shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded-lg" />
              <div className="h-3 w-44 bg-gray-200 rounded-lg" />
            </div>
          </div>
          <div className="h-9 w-24 bg-gray-200 rounded-xl" />
        </div>

        {/* Settings card skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="h-5 w-16 bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div>
              <div className="h-3 w-10 bg-gray-200 rounded mb-1.5" />
              <div className="h-11 w-full bg-gray-200 rounded-xl" />
            </div>
            <div>
              <div className="h-3 w-12 bg-gray-200 rounded mb-1.5" />
              <div className="h-11 w-full bg-gray-200 rounded-xl" />
            </div>
            <div className="h-10 w-full bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}


export default function UserProfile() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();

  const [name, setName] = useState('');
  const [syncedName, setSyncedName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // সেশন লোড হলে নাম একবারই ইনপুটে সিঙ্ক হবে
  // effect-এর ভেতর setState করলে cascading render হয়, তাই render-এর সময় সিঙ্ক করা হলো
  const sessionName = session?.user?.name ?? '';
  if (sessionName !== syncedName) {
    setSyncedName(sessionName);
    setName(sessionName);
  }

  // লগইন না করা থাকলে সাইনইন পেজে রিডাইরেক্ট (external system update — effect ঠিক আছে)
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/sign-in');
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('নাম খালি রাখা যাবে না');
      return;
    }

    setLoading(true);

    const { error } = await authClient.updateUser({
      name: trimmed,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || 'নাম আপডেট করতে সমস্যা হয়েছে');
      return;
    }

    await refetch(); // সেশন রিফ্রেশ করে নতুন নাম দেখাবে
    toast.success('নাম সফলভাবে আপডেট হয়েছে');
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('সফলভাবে সাইন আউট হয়েছে');
          router.push('/sign-in');
        },
        onError: () => {
          setSigningOut(false);
          toast.error('সাইন আউট করতে সমস্যা হয়েছে');
        },
      },
    });
  };

  if (isPending || !session) {
    return (
      <ProfileSkeleton/>
    );
  }

  const user = session.user;
  const initials = (user.name || user.email || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen w-full bg-[#f4f7f4] flex flex-col justify-between p-6">

      <div className="max-w-3xl w-full mx-auto space-y-6 pt-6">
        {/* Top Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
          <p className="text-xs text-gray-500 mt-1">আপনার অ্যাকাউন্টর তথ্য এখানে দেখুন।</p>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-200 relative flex-shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#008a45]/10 text-[#008a45] text-lg font-bold">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{user.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-red-200 text-red-500 text-xs font-semibold rounded-xl hover:bg-red-50/50 transition-colors cursor-pointer disabled:opacity-70"
          >
            <span>←</span>
            <span>{signingOut ? 'বের হচ্ছেন...' : 'সাইন আউট'}</span>
          </button>
        </div>

        {/* Settings/Update Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008a45] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                ইমেইল
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">ইমেইল পরিবর্তন করা যাবে না</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#008a45] hover:bg-[#00753a] text-white text-sm font-semibold rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? 'আপডেট হচ্ছে...' : 'আপডেট'}
            </button>
          </form>
        </div>
      </div>


    </div>
  );
}
