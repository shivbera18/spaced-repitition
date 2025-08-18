'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ModernDashboard } from '@/components/modern-dashboard';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-text">Loading...</div>
      </div>
    );
  }

  if (session) {
    return <ModernDashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-text mb-4">
            Forgetting Curve Tracker
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Optimize your learning using the SM-2+ enhanced algorithm. Track your study sessions,
            schedule reviews, and improve knowledge retention with advanced difficulty calibration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          <div className="bg-surface p-6 rounded-xl border border-border shadow-card hover:shadow-md transition-all">
            <div className="text-primary mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">Advanced Spaced Repetition</h3>
            <p className="text-textSecondary">
              Enhanced SM-2+ algorithm with response time analysis and confidence tracking for optimal learning intervals.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-border shadow-card hover:shadow-md transition-all">
            <div className="text-success mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">Adaptive Difficulty</h3>
            <p className="text-textSecondary">
              Automatically adjusts item difficulty based on performance patterns and memory stability.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-border shadow-card hover:shadow-md transition-all">
            <div className="text-warning mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">Modern UI/UX</h3>
            <p className="text-textSecondary">
              Beautiful dark/light themes with smooth animations and intuitive design for better learning experience.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-8 py-3 bg-primary hover:bg-primaryHover text-textInverse font-semibold rounded-lg shadow-lg transition-all mr-4"
          >
            Get Started Free
          </Link>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-8 py-3 bg-surface hover:bg-surfaceHover text-text font-semibold rounded-lg border border-border transition-all"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
