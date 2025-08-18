'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudyItem, ReviewSession } from '@/types';
import { StorageService } from '@/lib/storage';
import { SpacedRepetitionEngine } from '@/lib/spaced-repetition';
import Link from 'next/link';

export default function StudyPage() {
  const router = useRouter();
  const [itemsDue, setItemsDue] = useState<StudyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    startTime: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load items due for review
    const allItems = StorageService.getStudyItems();
    const due = SpacedRepetitionEngine.getItemsDueForReview(allItems);
    
    setItemsDue(due);
    setIsLoading(false);
  }, []);

  const currentItem = itemsDue[currentIndex];

  const handleQualityRating = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentItem) return;

    const wasCorrect = quality >= 3;
    const responseTime = Math.round((new Date().getTime() - sessionStats.startTime.getTime()) / 1000);

    // Create review session
    const review: ReviewSession = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      studyItemId: currentItem.id,
      reviewedAt: new Date(),
      quality,
      responseTime,
      wasCorrect,
    };

    // Update item with new scheduling
    const updatedItem = SpacedRepetitionEngine.calculateNextReview(currentItem, quality);
    updatedItem.reviews.push(review);

    // Save updated item
    StorageService.updateStudyItem(updatedItem);

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (wasCorrect ? 1 : 0),
    }));

    // Move to next item or finish session
    if (currentIndex < itemsDue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // Session complete
      router.push('/dashboard?sessionComplete=true');
    }
  };

  const getQualityButtonColor = (quality: number) => {
    if (quality <= 1) return 'bg-red-600 hover:bg-red-700';
    if (quality <= 2) return 'bg-orange-600 hover:bg-orange-700';
    if (quality <= 3) return 'bg-yellow-600 hover:bg-yellow-700';
    if (quality <= 4) return 'bg-green-600 hover:bg-green-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  const qualityLabels = {
    0: 'Complete blackout',
    1: 'Incorrect with wrong answer',
    2: 'Incorrect but remembered some',
    3: 'Correct with serious difficulty',
    4: 'Correct with hesitation',
    5: 'Perfect response',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading study session...</div>
      </div>
    );
  }

  if (itemsDue.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            All caught up!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            No items are due for review right now. Great job staying on top of your studies!
          </p>
          <div className="space-x-4">
            <Link
              href="/add-item"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add New Items
            </Link>
            <Link
              href="/dashboard"
              className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Study Session
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Progress: {currentIndex + 1} / {itemsDue.length} items
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-300">Session Stats</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {sessionStats.correct} / {sessionStats.reviewed} correct
              {sessionStats.reviewed > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  ({Math.round((sessionStats.correct / sessionStats.reviewed) * 100)}%)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / itemsDue.length) * 100}%` }}
          />
        </div>

        {/* Study Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          {/* Subject Badge */}
          <div className="flex justify-between items-start mb-6">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
              {currentItem?.subject || 'General'}
            </span>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Difficulty: {'★'.repeat(currentItem?.difficulty || 3)}{'☆'.repeat(5 - (currentItem?.difficulty || 3))}
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Question:</h2>
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              {currentItem?.question}
            </p>
          </div>

          {/* Answer Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Answer:</h2>
              {!showAnswer && (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
                >
                  Show Answer
                </button>
              )}
            </div>
            
            {showAnswer ? (
              <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                {currentItem?.answer}
              </p>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">Click &quot;Show Answer&quot; to reveal the answer</p>
              </div>
            )}
          </div>

          {/* Quality Rating Buttons */}
          {showAnswer && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                How well did you remember this?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(qualityLabels).map(([quality, label]) => (
                  <button
                    key={quality}
                    onClick={() => handleQualityRating(parseInt(quality) as 0 | 1 | 2 | 3 | 4 | 5)}
                    className={`${getQualityButtonColor(parseInt(quality))} text-white p-3 rounded-lg transition-colors text-sm font-medium hover:scale-105 transform`}
                  >
                    <div className="font-bold text-lg">{quality}</div>
                    <div className="text-xs opacity-90">{label}</div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Your rating determines when you&apos;ll see this item again
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            ← Exit Study Session
          </Link>
        </div>
      </div>
    </div>
  );
}
