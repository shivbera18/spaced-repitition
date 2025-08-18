/**
 * Legacy Spaced Repetition Algorithm (SM-2)
 * This file provides backward compatibility while delegating to the advanced SM-2+ implementation
 */

export interface StudyItem {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = very easy, 5 = very hard
  easeFactor: number;
  interval: number; // days until next review
  nextReviewDate: Date;
  consecutiveCorrectAnswers: number;
  reviews: ReviewSession[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewSession {
  id: string;
  studyItemId: string;
  reviewedAt: Date;
  quality: 0 | 1 | 2 | 3 | 4 | 5; // 0 = complete blackout, 5 = perfect response
  responseTime: number; // seconds taken to respond
  wasCorrect: boolean;
}

export enum ReviewQuality {
  AGAIN = 1,
  HARD = 2,
  GOOD = 3,
  EASY = 4,
}

/**
 * Legacy spaced repetition algorithm (SM-2)
 * For new implementations, use SM2PlusAlgorithm from advanced-spaced-repetition.ts
 */
export class SpacedRepetitionAlgorithm {
  /**
   * Calculate next review interval using basic SM-2 algorithm
   */
  static calculateNextInterval(item: StudyItem, quality: ReviewQuality): StudyItem {
    let { easeFactor, interval, consecutiveCorrectAnswers } = item;

    if (quality < ReviewQuality.GOOD) {
      // Reset on failure
      consecutiveCorrectAnswers = 0;
      interval = 1;
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
   * Alias for calculateNextInterval for backward compatibility
   */
  static calculateNextReview(item: StudyItem, quality: 0 | 1 | 2 | 3 | 4 | 5): StudyItem {
    return this.calculateNextInterval(item, quality as ReviewQuality);
  }

  /**
   * Get items that are due for review
   */
  static getItemsDueForReview(items: StudyItem[]): StudyItem[] {
    const now = new Date();
    return items.filter(item => new Date(item.nextReviewDate) <= now);
  }

  /**
   * Get upcoming reviews within specified days
   */
  static getUpcomingReviews(items: StudyItem[], days: number = 7): StudyItem[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return items.filter(item => {
      const reviewDate = new Date(item.nextReviewDate);
      return reviewDate > now && reviewDate <= futureDate;
    });
  }

  /**
   * Calculate retention rate for an item
   */
  static calculateRetentionRate(item: StudyItem): number {
    if (item.consecutiveCorrectAnswers === 0) return 0;
    
    // Simple retention calculation based on ease factor and interval
    const daysSinceCreation = (Date.now() - item.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const reviewFrequency = daysSinceCreation / Math.max(1, item.consecutiveCorrectAnswers + 1);
    
    return Math.min(1, item.easeFactor / 2.5 * (1 / Math.max(1, reviewFrequency)));
  }

  /**
   * Predict recall probability
   */
  static predictRecallProbability(item: StudyItem, daysFromLastReview: number): number {
    const { easeFactor, interval } = item;
    
    // Exponential decay based on interval and ease factor
    const decayRate = 1 / (interval * easeFactor);
    return Math.exp(-decayRate * daysFromLastReview);
  }

  /**
   * Get learning statistics
   */
  static getLearningStats(items: StudyItem[]): {
    totalItems: number;
    dueToday: number;
    masteredItems: number;
    averageEaseFactor: number;
  } {
    const now = new Date();
    const dueItems = items.filter(item => new Date(item.nextReviewDate) <= now);
    const masteredItems = items.filter(item => item.consecutiveCorrectAnswers >= 5);
    const totalEaseFactor = items.reduce((sum, item) => sum + item.easeFactor, 0);

    return {
      totalItems: items.length,
      dueToday: dueItems.length,
      masteredItems: masteredItems.length,
      averageEaseFactor: items.length > 0 ? totalEaseFactor / items.length : 2.5,
    };
  }

  /**
   * Create a new study item with default settings
   */
  static createStudyItem(
    question: string,
    answer: string,
    subject: string = 'General',
    difficulty: 1 | 2 | 3 | 4 | 5 = 3
  ): StudyItem {
    const now = new Date();
    return {
      id: crypto.randomUUID(),
      question,
      answer,
      subject,
      difficulty,
      easeFactor: 2.5, // Default ease factor
      interval: 1, // Start with 1 day interval
      nextReviewDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      consecutiveCorrectAnswers: 0,
      reviews: [],
      createdAt: now,
      updatedAt: now,
    };
  }
}

/**
 * Alias for backward compatibility - used by add-item page and other legacy components
 */
export const SpacedRepetitionEngine = SpacedRepetitionAlgorithm;

// Export for backward compatibility
export default SpacedRepetitionAlgorithm;
