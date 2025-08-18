import { StudyItem, ReviewSession, Subject, StudyStats } from '@/types';

const STORAGE_KEYS = {
  STUDY_ITEMS: 'forgetting-curve-study-items',
  SUBJECTS: 'forgetting-curve-subjects',
  STATS: 'forgetting-curve-stats',
} as const;

/**
 * Local storage utilities for persisting study data
 * In a production app, this would be replaced with a database
 */
export class StorageService {
  /**
   * Get all study items from local storage
   */
  static getStudyItems(): StudyItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const items = localStorage.getItem(STORAGE_KEYS.STUDY_ITEMS);
      if (!items) return [];

      const parsed = JSON.parse(items);
      // Convert date strings back to Date objects
      return parsed.map((item: StudyItem & { reviews: ReviewSession[] }) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        nextReviewDate: new Date(item.nextReviewDate),
        reviews: item.reviews.map((review: ReviewSession & { reviewedAt: string | Date }) => ({
          ...review,
          reviewedAt: new Date(review.reviewedAt),
        })),
      }));
    } catch (error) {
      console.error('Error loading study items:', error);
      return [];
    }
  }

  /**
   * Save study items to local storage
   */
  static saveStudyItems(items: StudyItem[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_ITEMS, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving study items:', error);
    }
  }

  /**
   * Add a new study item
   */
  static addStudyItem(item: StudyItem): void {
    const items = this.getStudyItems();
    items.push(item);
    this.saveStudyItems(items);
  }

  /**
   * Update an existing study item
   */
  static updateStudyItem(updatedItem: StudyItem): void {
    const items = this.getStudyItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    
    if (index !== -1) {
      items[index] = updatedItem;
      this.saveStudyItems(items);
    }
  }

  /**
   * Delete a study item
   */
  static deleteStudyItem(itemId: string): void {
    const items = this.getStudyItems();
    const filteredItems = items.filter(item => item.id !== itemId);
    this.saveStudyItems(filteredItems);
  }

  /**
   * Add a review session to a study item
   */
  static addReviewSession(studyItemId: string, review: ReviewSession): void {
    const items = this.getStudyItems();
    const item = items.find(item => item.id === studyItemId);
    
    if (item) {
      item.reviews.push(review);
      item.updatedAt = new Date();
      this.saveStudyItems(items);
    }
  }

  /**
   * Get all subjects
   */
  static getSubjects(): Subject[] {
    if (typeof window === 'undefined') return this.getDefaultSubjects();
    
    try {
      const subjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return subjects ? JSON.parse(subjects) : this.getDefaultSubjects();
    } catch (error) {
      console.error('Error loading subjects:', error);
      return this.getDefaultSubjects();
    }
  }

  /**
   * Save subjects to local storage
   */
  static saveSubjects(subjects: Subject[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (error) {
      console.error('Error saving subjects:', error);
    }
  }

  /**
   * Add a new subject
   */
  static addSubject(subject: Subject): void {
    const subjects = this.getSubjects();
    subjects.push(subject);
    this.saveSubjects(subjects);
  }

  /**
   * Calculate and cache study statistics
   */
  static calculateStats(): StudyStats {
    const items = this.getStudyItems();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Items due today
    const itemsDueToday = items.filter(item => {
      const reviewDate = new Date(item.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate <= today;
    }).length;

    // Items reviewed today
    const itemsReviewedToday = items.filter(item => 
      item.reviews.some(review => {
        const reviewDate = new Date(review.reviewedAt);
        reviewDate.setHours(0, 0, 0, 0);
        return reviewDate.getTime() === today.getTime();
      })
    ).length;

    // Calculate average accuracy
    let totalReviews = 0;
    let correctReviews = 0;
    items.forEach(item => {
      totalReviews += item.reviews.length;
      correctReviews += item.reviews.filter(review => review.wasCorrect).length;
    });

    const averageAccuracy = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

    // Calculate streak (consecutive days with reviews)
    let currentStreak = 0;
    let longestStreak = 0;
    const checkDate = new Date(today);
    
    while (currentStreak < 365) { // Check up to a year back
      const hasReviewsOnDate = items.some(item =>
        item.reviews.some(review => {
          const reviewDate = new Date(review.reviewedAt);
          reviewDate.setHours(0, 0, 0, 0);
          return reviewDate.getTime() === checkDate.getTime();
        })
      );

      if (hasReviewsOnDate) {
        currentStreak++;
      } else {
        break;
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    // For longest streak, we'd need to implement a more sophisticated algorithm
    // For now, we'll use current streak as longest streak
    longestStreak = Math.max(longestStreak, currentStreak);

    const stats: StudyStats = {
      totalItems: items.length,
      itemsDueToday,
      itemsReviewedToday,
      averageAccuracy,
      currentStreak,
      longestStreak,
      totalReviews,
    };

    // Cache the stats
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    }

    return stats;
  }

  /**
   * Get default subjects
   */
  private static getDefaultSubjects(): Subject[] {
    return [
      { id: 'general', name: 'General', color: '#3B82F6', itemCount: 0 },
      { id: 'languages', name: 'Languages', color: '#10B981', itemCount: 0 },
      { id: 'science', name: 'Science', color: '#F59E0B', itemCount: 0 },
      { id: 'history', name: 'History', color: '#EF4444', itemCount: 0 },
      { id: 'math', name: 'Mathematics', color: '#8B5CF6', itemCount: 0 },
    ];
  }

  /**
   * Clear all data (useful for testing or reset)
   */
  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
