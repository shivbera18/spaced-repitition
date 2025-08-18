'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { SM2PlusAlgorithm, ReviewQuality, ItemDifficulty } from '@/lib/advanced-spaced-repetition';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  BoltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface StudyItem {
  id: string;
  front: string;
  back: string;
  difficulty: ItemDifficulty;
}

interface ReviewSessionProps {
  items: StudyItem[];
  onSessionComplete: (results: ReviewResult[]) => void;
}

interface ReviewResult {
  itemId: string;
  quality: ReviewQuality;
  newDifficulty: ItemDifficulty;
  responseTime: number;
}

export function ReviewSession({ items, onSessionComplete }: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [itemStartTime, setItemStartTime] = useState(Date.now());
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [confidence, setConfidence] = useState(3);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;
  const remainingItems = items.length - currentIndex;

  useEffect(() => {
    setItemStartTime(Date.now());
  }, [currentIndex]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleQualityResponse = (qualityScore: number) => {
    if (!currentItem) return;

    const responseTime = Date.now() - itemStartTime;
    const quality: ReviewQuality = {
      score: qualityScore,
      responseTime,
      confidence
    };

    const newDifficulty = SM2PlusAlgorithm.calculateNextReview(
      currentItem.difficulty,
      quality
    );

    const result: ReviewResult = {
      itemId: currentItem.id,
      quality,
      newDifficulty,
      responseTime
    };

    const newResults = [...results, result];
    setResults(newResults);

    if (currentIndex < items.length - 1) {
      // Move to next item
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setConfidence(3);
    } else {
      // Session complete
      onSessionComplete(newResults);
    }
  };

  const getDifficultyBadge = (difficulty: ItemDifficulty) => {
    const level = difficulty.difficulty;
    if (level <= 3) return { variant: 'success' as const, text: 'Easy' };
    if (level <= 7) return { variant: 'warning' as const, text: 'Medium' };
    return { variant: 'error' as const, text: 'Hard' };
  };

  const qualityButtons = [
    { score: 0, label: 'Total blackout', color: 'bg-red-500', icon: XCircleIcon },
    { score: 1, label: 'Incorrect, easy interval', color: 'bg-red-400', icon: XCircleIcon },
    { score: 2, label: 'Incorrect, normal interval', color: 'bg-orange-400', icon: XCircleIcon },
    { score: 3, label: 'Correct, difficult', color: 'bg-yellow-400', icon: CheckCircleIcon },
    { score: 4, label: 'Correct, normal', color: 'bg-green-400', icon: CheckCircleIcon },
    { score: 5, label: 'Correct, easy', color: 'bg-green-500', icon: CheckCircleIcon },
  ];

  if (!currentItem) {
    return (
      <Card className="text-center" padding="lg">
        <h2 className="text-2xl font-bold text-text mb-4">No items to review</h2>
                <p className="text-theme-text-muted mb-4">You&apos;ve completed all available items!</p>
      </Card>
    );
  }

  const difficultyBadge = getDifficultyBadge(currentItem.difficulty);
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card padding="sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Badge variant={difficultyBadge.variant}>
              {difficultyBadge.text}
            </Badge>
            <div className="flex items-center text-textSecondary text-sm space-x-4">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BoltIcon className="w-4 h-4" />
                <span>{remainingItems} remaining</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-textSecondary">
            {currentIndex + 1} of {items.length}
          </div>
        </div>
        <ProgressBar value={progress} showLabel={true} />
      </Card>

      {/* Study Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            className="min-h-[400px] flex flex-col justify-center cursor-pointer"
            padding="lg"
            hover={!showAnswer}
            onClick={!showAnswer ? handleShowAnswer : undefined}
          >
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg text-textSecondary font-medium">Question</h3>
                <p className="text-2xl font-bold text-text leading-relaxed">
                  {currentItem.front}
                </p>
              </div>

              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 border-t border-border pt-6"
                  >
                    <h3 className="text-lg text-textSecondary font-medium">Answer</h3>
                    <p className="text-xl text-text leading-relaxed">
                      {currentItem.back}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showAnswer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-textTertiary"
                >
                  Click to reveal answer
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Answer Controls */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Confidence Slider */}
            <Card padding="md">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-text">How confident were you?</h4>
                  <div className="flex items-center space-x-2 text-textSecondary">
                    <HeartIcon className="w-4 h-4" />
                    <span>{confidence}/5</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-textSecondary">Not confident</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-backgroundTertiary rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-textSecondary">Very confident</span>
                </div>
              </div>
            </Card>

            {/* Quality Buttons */}
            <Card padding="md">
              <h4 className="font-medium text-text mb-4">How well did you remember?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {qualityButtons.map(({ score, label, color, icon: Icon }) => (
                  <Button
                    key={score}
                    onClick={() => handleQualityResponse(score)}
                    variant="outline"
                    className="justify-start p-4 h-auto"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <div className="text-left">
                        <div className="font-medium">{score}</div>
                        <div className="text-sm text-textSecondary">{label}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
