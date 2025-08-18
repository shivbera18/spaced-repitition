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
    } else {
      consecutiveCorrectAnswers += 1;

      // Calculate new interval based on SM-2 algorithm
      if (consecutiveCorrectAnswers === 1) {
        interval = 1;
      } else if (consecutiveCorrectAnswers === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }

      // Update ease factor based on performance
      easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      
      // Ensure ease factor stays within reasonable bounds
      easeFactor = Math.max(1.3, easeFactor);
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return {
      ...item,
      interval,
      easeFactor,
      consecutiveCorrectAnswers,
      nextReviewDate,
      updatedAt: new Date(),
    };
  }

  /**
   * Get items that are due for review
   * @param items - Array of study items
   * @returns Items that need to be reviewed today or earlier
   */
  static getItemsDueForReview(items: StudyItem[]): StudyItem[] {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    return items.filter(item => item.nextReviewDate <= today);
  }

  /**
   * Get items scheduled for review in the next N days
   * @param items - Array of study items
   * @param days - Number of days to look ahead
   * @returns Items scheduled for review in the specified timeframe
   */
  static getUpcomingReviews(items: StudyItem[], days: number = 7): StudyItem[] {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return items.filter(item => 
      item.nextReviewDate > today && item.nextReviewDate <= futureDate
    );
  }

  /**
   * Calculate retention rate for a study item based on review history
   * @param item - Study item to analyze
   * @returns Retention rate as a percentage (0-100)
   */
  static calculateRetentionRate(item: StudyItem): number {
    if (item.reviews.length === 0) return 0;

    const correctAnswers = item.reviews.filter(review => review.wasCorrect).length;
    return Math.round((correctAnswers / item.reviews.length) * 100);
  }

  /**
   * Predict the probability of remembering an item at a given time
   * Based on the forgetting curve: R = e^(-t/S)
   * @param item - Study item
   * @param daysFromLastReview - Days since last review
   * @returns Probability of recall (0-1)
   */
  static predictRecallProbability(item: StudyItem, daysFromLastReview: number): number {
    // S = stability factor, roughly correlates with ease factor
    const stabilityFactor = item.easeFactor * 2;
    
    // Forgetting curve formula
    const recallProbability = Math.exp(-daysFromLastReview / stabilityFactor);
    
    return Math.max(0, Math.min(1, recallProbability));
  }

  /**
   * Create a new study item with default spaced repetition parameters
   * @param question - Question text
   * @param answer - Answer text
   * @param subject - Subject category
   * @param difficulty - Initial difficulty (1-5)
   * @returns New study item
   */
  static createStudyItem(
    question: string,
    answer: string,
    subject: string,
    difficulty: 1 | 2 | 3 | 4 | 5 = 3
  ): StudyItem {
    const now = new Date();
    const id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initial ease factor based on difficulty
    const initialEaseFactor = 2.5 - (difficulty - 3) * 0.2;

    return {
      id,
      question,
      answer,
      subject,
      difficulty,
      createdAt: now,
      updatedAt: now,
      reviews: [],
      nextReviewDate: now, // Available for immediate review
      interval: 0,
      easeFactor: initialEaseFactor,
      consecutiveCorrectAnswers: 0,
    };
  }
}
