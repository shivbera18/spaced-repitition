// Study item types
export interface StudyItem {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = very easy, 5 = very hard
  createdAt: Date;
  updatedAt: Date;
  reviews: ReviewSession[];
  nextReviewDate: Date;
  interval: number; // days until next review
  easeFactor: number; // SuperMemo algorithm ease factor
  consecutiveCorrectAnswers: number;
}

export interface ReviewSession {
  id: string;
  studyItemId: string;
  reviewedAt: Date;
  quality: 0 | 1 | 2 | 3 | 4 | 5; // 0 = complete blackout, 5 = perfect response
  responseTime: number; // seconds taken to respond
  wasCorrect: boolean;
}

export interface StudyStats {
  totalItems: number;
  itemsDueToday: number;
  itemsReviewedToday: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  totalReviews: number;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  itemCount: number;
}
