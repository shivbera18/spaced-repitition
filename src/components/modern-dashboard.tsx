'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge } from '@/components/ui';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  LightBulbIcon,
  TrophyIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalItems: number;
  dueToday: number;
  masteredItems: number;
  currentStreak: number;
  averageRetention: number;
  studyTime: number;
  weeklyProgress: number[];
}

interface LearningInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  action?: string;
}

export function ModernDashboard() {
  const [stats] = useState<DashboardStats>({
    totalItems: 124,
    dueToday: 8,
    masteredItems: 47,
    currentStreak: 12,
    averageRetention: 89,
    studyTime: 145, // minutes this week
    weeklyProgress: [65, 80, 45, 90, 75, 85, 70]
  });

  const [insights] = useState<LearningInsight[]>([
    {
      type: 'success',
      title: 'Great Progress!',
      description: 'You\'ve maintained a 12-day study streak. Keep it up!',
    },
    {
      type: 'warning',
      title: 'Review Backlog',
      description: '8 items are due for review today. Don\'t let them pile up.',
      action: 'Start Review'
    },
    {
      type: 'info',
      title: 'Optimal Study Time',
      description: 'You perform best during morning sessions (9-11 AM).',
    }
  ]);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = 'primary',
    trend 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    color?: 'primary' | 'success' | 'warning' | 'error';
    trend?: number;
  }) => (
    <Card hover padding="md" className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-textSecondary text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-text">{value}</p>
          {subtitle && (
            <p className="text-textTertiary text-xs">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 text-xs ${
              trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-textSecondary'
            }`}>
              <ArrowTrendingUpIcon className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
              <span>{Math.abs(trend)}% from last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-${color}/10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </Card>
  );

  const InsightCard = ({ insight }: { insight: LearningInsight }) => (
    <Card padding="md" className={`border-l-4 ${
      insight.type === 'success' ? 'border-l-success bg-success/5' :
      insight.type === 'warning' ? 'border-l-warning bg-warning/5' :
      'border-l-primary bg-primary/5'
    }`}>
      <div className="space-y-2">
        <h4 className="font-semibold text-text">{insight.title}</h4>
        <p className="text-textSecondary text-sm">{insight.description}</p>
        {insight.action && (
          <Button variant="outline" size="sm" className="mt-2">
            {insight.action}
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-5 h-5 text-textInverse" />
                </div>
                <h1 className="text-xl font-bold text-text">Forgetting Curve Tracker</h1>
              </div>
              <Badge variant="primary" className="ml-4">
                SM-2+ Enhanced
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="primary">
                <FireIcon className="w-4 h-4 mr-2" />
                Start Study Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <h2 className="text-2xl font-bold text-text">Welcome back!</h2>
            <div className="flex items-center space-x-1">
              <FireIcon className="w-5 h-5 text-warning" />
              <span className="text-lg font-semibold text-text">{stats.currentStreak}</span>
              <span className="text-textSecondary">day streak</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatCard
            title="Items Due Today"
            value={stats.dueToday}
            subtitle="Ready for review"
            icon={ClockIcon}
            color="warning"
            trend={-15}
          />
          <StatCard
            title="Total Items"
            value={stats.totalItems}
            subtitle="In your collection"
            icon={LightBulbIcon}
            color="primary"
            trend={8}
          />
          <StatCard
            title="Mastered"
            value={stats.masteredItems}
            subtitle="Long-term retention"
            icon={TrophyIcon}
            color="success"
            trend={12}
          />
          <StatCard
            title="Retention Rate"
            value={`${stats.averageRetention}%`}
            subtitle="Average accuracy"
            icon={ChartBarIcon}
            color="success"
            trend={3}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card padding="md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text">Weekly Progress</h3>
                <Badge variant="success">{stats.studyTime}min this week</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-end space-x-2 h-32">
                  {stats.weeklyProgress.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                      <motion.div
                        className="bg-primary rounded-t-sm w-full"
                        initial={{ height: 0 }}
                        animate={{ height: `${(value / 100) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      />
                      <span className="text-xs text-textTertiary">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-textSecondary text-sm">This Week</p>
                    <p className="text-xl font-bold text-text">{stats.studyTime}min</p>
                  </div>
                  <div>
                    <p className="text-textSecondary text-sm">Daily Average</p>
                    <p className="text-xl font-bold text-text">{Math.round(stats.studyTime / 7)}min</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text">Learning Insights</h3>
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <InsightCard insight={insight} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card padding="md">
            <h3 className="text-lg font-semibold text-text mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="p-4 h-auto justify-start">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Review Due Items</p>
                    <p className="text-sm text-textSecondary">{stats.dueToday} items waiting</p>
                  </div>
                </div>
              </Button>
              
              <Button variant="outline" className="p-4 h-auto justify-start">
                <div className="flex items-center space-x-3">
                  <LightBulbIcon className="w-5 h-5 text-warning" />
                  <div className="text-left">
                    <p className="font-medium">Add New Items</p>
                    <p className="text-sm text-textSecondary">Expand your knowledge</p>
                  </div>
                </div>
              </Button>
              
              <Button variant="outline" className="p-4 h-auto justify-start">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="w-5 h-5 text-success" />
                  <div className="text-left">
                    <p className="font-medium">View Analytics</p>
                    <p className="text-sm text-textSecondary">Track your progress</p>
                  </div>
                </div>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
