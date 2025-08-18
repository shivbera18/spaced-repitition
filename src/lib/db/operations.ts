import { db } from '@/lib/db';
import { studyItems, reviewSessions, subjects, userSettings } from '@/lib/db/schema';
import { eq, and, lte, desc, count } from 'drizzle-orm';
import type { StudyItem, ReviewSession, Subject } from '@/types';

export class DatabaseService {
  // Study Items
  static async createStudyItem(userId: string, item: Omit<StudyItem, 'id' | 'createdAt' | 'updatedAt' | 'reviews'>) {
    const result = await db
      .insert(studyItems)
      .values({
        userId,
        subjectId: item.subject,
        question: item.question,
        answer: item.answer,
        difficulty: item.difficulty,
        easeFactor: item.easeFactor,
        interval: item.interval,
        consecutiveCorrectAnswers: item.consecutiveCorrectAnswers,
        nextReviewDate: item.nextReviewDate,
      })
      .returning();

    return result[0];
  }

  static async getUserStudyItems(userId: string): Promise<StudyItem[]> {
    const items = await db
      .select()
      .from(studyItems)
      .where(eq(studyItems.userId, userId))
      .orderBy(desc(studyItems.createdAt));

    // Convert to StudyItem type and fetch reviews
    const studyItemsWithReviews = await Promise.all(
      items.map(async (item) => {
        const reviews = await this.getItemReviews(item.id);
        return {
          id: item.id,
          question: item.question,
          answer: item.answer,
          subject: item.subjectId || '',
          difficulty: item.difficulty as 1 | 2 | 3 | 4 | 5,
          createdAt: item.createdAt!,
          updatedAt: item.updatedAt!,
          reviews,
          nextReviewDate: item.nextReviewDate,
          interval: item.interval,
          easeFactor: item.easeFactor,
          consecutiveCorrectAnswers: item.consecutiveCorrectAnswers,
        } as StudyItem;
      })
    );

    return studyItemsWithReviews;
  }

  static async getItemsDueForReview(userId: string): Promise<StudyItem[]> {
    const now = new Date();
    const items = await db
      .select()
      .from(studyItems)
      .where(and(
        eq(studyItems.userId, userId),
        lte(studyItems.nextReviewDate, now)
      ));

    const studyItemsWithReviews = await Promise.all(
      items.map(async (item) => {
        const reviews = await this.getItemReviews(item.id);
        return {
          id: item.id,
          question: item.question,
          answer: item.answer,
          subject: item.subjectId || '',
          difficulty: item.difficulty as 1 | 2 | 3 | 4 | 5,
          createdAt: item.createdAt!,
          updatedAt: item.updatedAt!,
          reviews,
          nextReviewDate: item.nextReviewDate,
          interval: item.interval,
          easeFactor: item.easeFactor,
          consecutiveCorrectAnswers: item.consecutiveCorrectAnswers,
        } as StudyItem;
      })
    );

    return studyItemsWithReviews;
  }

  static async updateStudyItem(itemId: string, updates: Partial<StudyItem>) {
    const result = await db
      .update(studyItems)
      .set({
        question: updates.question,
        answer: updates.answer,
        difficulty: updates.difficulty,
        easeFactor: updates.easeFactor,
        interval: updates.interval,
        consecutiveCorrectAnswers: updates.consecutiveCorrectAnswers,
        nextReviewDate: updates.nextReviewDate,
        updatedAt: new Date(),
      })
      .where(eq(studyItems.id, itemId))
      .returning();

    return result[0];
  }

  static async deleteStudyItem(itemId: string) {
    await db.delete(studyItems).where(eq(studyItems.id, itemId));
  }

  // Review Sessions
  static async createReviewSession(userId: string, review: Omit<ReviewSession, 'id'>) {
    const result = await db
      .insert(reviewSessions)
      .values({
        userId,
        studyItemId: review.studyItemId,
        quality: review.quality,
        responseTime: review.responseTime,
        wasCorrect: review.wasCorrect,
        reviewedAt: review.reviewedAt,
      })
      .returning();

    return result[0];
  }

  static async getItemReviews(itemId: string): Promise<ReviewSession[]> {
    const reviews = await db
      .select()
      .from(reviewSessions)
      .where(eq(reviewSessions.studyItemId, itemId))
      .orderBy(desc(reviewSessions.reviewedAt));

    return reviews.map(review => ({
      id: review.id,
      studyItemId: review.studyItemId,
      reviewedAt: review.reviewedAt!,
      quality: review.quality as 0 | 1 | 2 | 3 | 4 | 5,
      responseTime: review.responseTime || 0,
      wasCorrect: review.wasCorrect,
    }));
  }

  static async getUserReviewStats(userId: string) {
    const totalItems = await db
      .select({ count: count() })
      .from(studyItems)
      .where(eq(studyItems.userId, userId));

    const itemsDue = await db
      .select({ count: count() })
      .from(studyItems)
      .where(and(
        eq(studyItems.userId, userId),
        lte(studyItems.nextReviewDate, new Date())
      ));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reviewsToday = await db
      .select({ count: count() })
      .from(reviewSessions)
      .where(and(
        eq(reviewSessions.userId, userId),
        lte(reviewSessions.reviewedAt, tomorrow)
      ));

    return {
      totalItems: totalItems[0]?.count || 0,
      itemsDueToday: itemsDue[0]?.count || 0,
      itemsReviewedToday: reviewsToday[0]?.count || 0,
      averageAccuracy: 0, // Calculate separately if needed
      currentStreak: 0,
      longestStreak: 0,
      totalReviews: reviewsToday[0]?.count || 0,
    };
  }

  // Subjects
  static async createSubject(userId: string, subject: Omit<Subject, 'id' | 'itemCount'>) {
    const result = await db
      .insert(subjects)
      .values({
        userId,
        name: subject.name,
        color: subject.color,
      })
      .returning();

    return {
      id: result[0].id,
      name: result[0].name,
      color: result[0].color,
      itemCount: 0,
    } as Subject;
  }

  static async getUserSubjects(userId: string): Promise<Subject[]> {
    const userSubjects = await db
      .select()
      .from(subjects)
      .where(eq(subjects.userId, userId));

    const subjectsWithCount = await Promise.all(
      userSubjects.map(async (subject) => {
        const itemCount = await db
          .select({ count: count() })
          .from(studyItems)
          .where(eq(studyItems.subjectId, subject.id));

        return {
          id: subject.id,
          name: subject.name,
          color: subject.color,
          itemCount: itemCount[0]?.count || 0,
        } as Subject;
      })
    );

    return subjectsWithCount;
  }

  static async deleteSubject(subjectId: string) {
    await db.delete(subjects).where(eq(subjects.id, subjectId));
  }

  // User Settings
  static async getUserSettings(userId: string) {
    const settings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    return settings[0] || null;
  }

  static async updateUserSettings(userId: string, updates: Partial<typeof userSettings.$inferSelect>) {
    const result = await db
      .update(userSettings)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userSettings.userId, userId))
      .returning();

    return result[0];
  }
}
