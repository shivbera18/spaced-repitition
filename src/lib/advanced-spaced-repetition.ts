/**
 * Advanced SM-2+ Spaced Repetition Algorithm
 * Enhanced version with difficulty calibration and adaptive intervals
 */

export interface ReviewQuality {
  score: number; // 0-5 quality score
  responseTime: number; // milliseconds
  confidence: number; // 1-5 user confidence rating
}

export interface ItemDifficulty {
  easeFactor: number; // SM-2 ease factor (1.3-2.5)
  interval: number; // days until next review
  repetitions: number; // number of successful repetitions
  difficulty: number; // adaptive difficulty (0-10)
  lastReview: Date;
  averageQuality: number; // running average of quality scores
  stabilityFactor: number; // how stable the memory is
}

export interface LearningMetrics {
  totalReviews: number;
  successRate: number;
  averageResponseTime: number;
  learningVelocity: number; // items mastered per day
  retentionRate: number;
  streakCount: number;
}

export class SM2PlusAlgorithm {
  private static readonly MIN_EASE_FACTOR = 1.3;
  private static readonly MAX_EASE_FACTOR = 2.5;
  private static readonly INITIAL_EASE_FACTOR = 2.5;
  private static readonly DIFFICULTY_ADJUSTMENT_RATE = 0.1;

  /**
   * Calculate next review interval using enhanced SM-2+ algorithm
   */
  static calculateNextReview(
    difficulty: ItemDifficulty,
    quality: ReviewQuality
  ): ItemDifficulty {
    const { score, responseTime, confidence } = quality;
    const newDifficulty = { ...difficulty };

    // Update repetitions based on quality
    if (score >= 3) {
      newDifficulty.repetitions += 1;
    } else {
      newDifficulty.repetitions = 0; // Reset on failure
    }

    // Calculate new ease factor with response time consideration
    const responseTimeFactor = this.calculateResponseTimeFactor(responseTime);
    const confidenceFactor = confidence / 5; // Normalize to 0-1
    const adjustedScore = score * responseTimeFactor * confidenceFactor;

    newDifficulty.easeFactor = Math.max(
      this.MIN_EASE_FACTOR,
      Math.min(
        this.MAX_EASE_FACTOR,
        newDifficulty.easeFactor + (0.1 - (5 - adjustedScore) * (0.08 + (5 - adjustedScore) * 0.02))
      )
    );

    // Update average quality (exponential moving average)
    newDifficulty.averageQuality = newDifficulty.averageQuality === 0 
      ? adjustedScore 
      : 0.7 * newDifficulty.averageQuality + 0.3 * adjustedScore;

    // Calculate adaptive difficulty
    newDifficulty.difficulty = this.calculateAdaptiveDifficulty(
      newDifficulty.difficulty,
      adjustedScore,
      newDifficulty.repetitions
    );

    // Calculate stability factor (how well-established the memory is)
    newDifficulty.stabilityFactor = this.calculateStabilityFactor(
      newDifficulty.repetitions,
      newDifficulty.averageQuality,
      newDifficulty.easeFactor
    );

    // Calculate next interval
    newDifficulty.interval = this.calculateInterval(newDifficulty);
    newDifficulty.lastReview = new Date();

    return newDifficulty;
  }

  /**
   * Calculate response time factor (faster = better retention)
   */
  private static calculateResponseTimeFactor(responseTime: number): number {
    const optimalTime = 3000; // 3 seconds optimal response time
    const maxTime = 30000; // 30 seconds max considered time
    
    if (responseTime <= optimalTime) return 1.0;
    if (responseTime >= maxTime) return 0.5;
    
    // Linear decay from 1.0 to 0.5
    return 1.0 - (0.5 * (responseTime - optimalTime) / (maxTime - optimalTime));
  }

  /**
   * Calculate adaptive difficulty based on performance patterns
   */
  private static calculateAdaptiveDifficulty(
    currentDifficulty: number,
    qualityScore: number,
    repetitions: number
  ): number {
    let newDifficulty = currentDifficulty;

    // Increase difficulty if item is too easy (high scores consistently)
    if (qualityScore >= 4.5 && repetitions >= 3) {
      newDifficulty = Math.min(10, newDifficulty + this.DIFFICULTY_ADJUSTMENT_RATE);
    }
    
    // Decrease difficulty if item is too hard (low scores)
    if (qualityScore < 3) {
      newDifficulty = Math.max(1, newDifficulty - this.DIFFICULTY_ADJUSTMENT_RATE);
    }

    return newDifficulty;
  }

  /**
   * Calculate memory stability factor
   */
  private static calculateStabilityFactor(
    repetitions: number,
    averageQuality: number,
    easeFactor: number
  ): number {
    const repetitionFactor = Math.min(1.0, repetitions / 10);
    const qualityFactor = averageQuality / 5;
    const easeFactorNormalized = (easeFactor - this.MIN_EASE_FACTOR) / 
      (this.MAX_EASE_FACTOR - this.MIN_EASE_FACTOR);
    
    return (repetitionFactor * 0.4 + qualityFactor * 0.4 + easeFactorNormalized * 0.2);
  }

  /**
   * Calculate interval with stability consideration
   */
  private static calculateInterval(difficulty: ItemDifficulty): number {
    const { repetitions, easeFactor, stabilityFactor, difficulty: adaptiveDiff } = difficulty;

    let interval: number;

    if (repetitions === 0) {
      interval = 1; // Review tomorrow if failed
    } else if (repetitions === 1) {
      interval = 6; // Review in 6 days for first success
    } else {
      // Standard SM-2 calculation with stability adjustment
      const baseInterval = Math.round(
        difficulty.interval * easeFactor * (1 + stabilityFactor * 0.3)
      );
      
      // Adjust based on adaptive difficulty
      const difficultyMultiplier = 1 + (adaptiveDiff - 5) * 0.1;
      interval = Math.max(1, Math.round(baseInterval * difficultyMultiplier));
    }

    // Cap maximum interval at 365 days
    return Math.min(365, interval);
  }

  /**
   * Create initial difficulty settings for new items
   */
  static createInitialDifficulty(): ItemDifficulty {
    return {
      easeFactor: this.INITIAL_EASE_FACTOR,
      interval: 1,
      repetitions: 0,
      difficulty: 5, // Medium difficulty start
      lastReview: new Date(),
      averageQuality: 0,
      stabilityFactor: 0
    };
  }

  /**
   * Predict forgetting curve for an item
   */
  static predictForgettingCurve(
    difficulty: ItemDifficulty,
    daysAhead: number = 30
  ): Array<{ day: number; retention: number }> {
    const curve: Array<{ day: number; retention: number }> = [];
    const halfLife = difficulty.interval * difficulty.stabilityFactor;
    
    for (let day = 0; day <= daysAhead; day++) {
      // Exponential decay model
      const retention = Math.pow(0.5, day / Math.max(1, halfLife));
      curve.push({ day, retention });
    }
    
    return curve;
  }

  /**
   * Calculate optimal review time within a day
   */
  static calculateOptimalReviewTime(userLearningPattern: LearningMetrics): number {
    // Default to 9 AM if no pattern data
    if (userLearningPattern.totalReviews < 10) return 9;
    
    // Simple heuristic: morning reviews tend to be more effective
    // This could be enhanced with actual user performance data
    const baseHour = 9; // 9 AM
    const velocityAdjustment = Math.min(3, userLearningPattern.learningVelocity);
    
    return baseHour + velocityAdjustment;
  }
}

/**
 * Utility functions for review scheduling
 */
export class ReviewScheduler {
  /**
   * Get items due for review
   */
  static getItemsDue(items: Array<{ difficulty: ItemDifficulty }>): typeof items {
    const now = new Date();
    return items.filter(item => {
      const nextReviewDate = new Date(item.difficulty.lastReview);
      nextReviewDate.setDate(nextReviewDate.getDate() + item.difficulty.interval);
      return nextReviewDate <= now;
    });
  }

  /**
   * Balance review load across days
   */
  static balanceReviewLoad(
    items: Array<{ id: string; difficulty: ItemDifficulty }>,
    maxReviewsPerDay: number = 50
  ): Map<string, Date> {
    const schedule = new Map<string, Date>();
    const dailyLoad = new Map<string, number>();

    items.sort((a, b) => {
      // Prioritize items with higher difficulty and lower stability
      const priorityA = a.difficulty.difficulty / (a.difficulty.stabilityFactor + 0.1);
      const priorityB = b.difficulty.difficulty / (b.difficulty.stabilityFactor + 0.1);
      return priorityB - priorityA;
    });

    for (const item of items) {
      const targetDate = new Date(item.difficulty.lastReview);
      targetDate.setDate(targetDate.getDate() + item.difficulty.interval);
      
      // Find the earliest date with available capacity
      while (true) {
        const dateKey = targetDate.toISOString().split('T')[0];
        const currentLoad = dailyLoad.get(dateKey) || 0;
        
        if (currentLoad < maxReviewsPerDay) {
          schedule.set(item.id, targetDate);
          dailyLoad.set(dateKey, currentLoad + 1);
          break;
        }
        
        // Move to next day if current day is full
        targetDate.setDate(targetDate.getDate() + 1);
      }
    }

    return schedule;
  }
}

/**
 * Legacy compatibility - wrapper for existing StudyItem interface
 */
interface LegacyStudyItem {
  id: string;
  question: string;
  answer: string;
  easeFactor: number;
  interval: number;
  nextReviewDate: Date;
  consecutiveCorrectAnswers: number;
  createdAt: Date;
  updatedAt: Date;
}

export class SpacedRepetitionEngine {
  static calculateNextReview(item: LegacyStudyItem, quality: 0 | 1 | 2 | 3 | 4 | 5): LegacyStudyItem {
    // Convert legacy format to new format
    const difficulty: ItemDifficulty = {
      easeFactor: item.easeFactor || 2.5,
      interval: item.interval || 1,
      repetitions: item.consecutiveCorrectAnswers || 0,
      difficulty: 5,
      lastReview: new Date(),
      averageQuality: quality,
      stabilityFactor: 0
    };

    const reviewQuality: ReviewQuality = {
      score: quality,
      responseTime: 5000, // Default 5 seconds
      confidence: quality >= 4 ? 5 : quality >= 2 ? 3 : 1
    };

    const newDifficulty = SM2PlusAlgorithm.calculateNextReview(difficulty, reviewQuality);

    // Convert back to legacy format
    return {
      ...item,
      easeFactor: newDifficulty.easeFactor,
      interval: newDifficulty.interval,
      consecutiveCorrectAnswers: newDifficulty.repetitions,
      nextReviewDate: new Date(Date.now() + newDifficulty.interval * 24 * 60 * 60 * 1000)
    };
  }

  /**
   * Get items due for review (legacy compatibility)
   */
  static getItemsDueForReview(items: LegacyStudyItem[]): LegacyStudyItem[] {
    const now = new Date();
    return items.filter(item => {
      if (!item.nextReviewDate) return true;
      return new Date(item.nextReviewDate) <= now;
    });
  }
}
