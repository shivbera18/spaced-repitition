import { pgTable, text, timestamp, integer, real, boolean, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'), // for credentials login
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// NextAuth required tables
export const accounts = pgTable('account', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}));

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// Subjects table
export const subjects = pgTable('subjects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Study items table
export const studyItems = pgTable('study_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subjectId: uuid('subjectId')
    .references(() => subjects.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  difficulty: integer('difficulty').notNull(), // 1-5
  easeFactor: real('easeFactor').notNull().default(2.5),
  interval: integer('interval').notNull().default(1),
  consecutiveCorrectAnswers: integer('consecutiveCorrectAnswers').notNull().default(0),
  nextReviewDate: timestamp('nextReviewDate', { mode: 'date' }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Review sessions table
export const reviewSessions = pgTable('review_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  studyItemId: uuid('studyItemId')
    .notNull()
    .references(() => studyItems.id, { onDelete: 'cascade' }),
  quality: integer('quality').notNull(), // 0-5
  responseTime: integer('responseTime'), // in seconds
  wasCorrect: boolean('wasCorrect').notNull(),
  reviewedAt: timestamp('reviewedAt', { mode: 'date' }).defaultNow(),
});

// User settings table
export const userSettings = pgTable('user_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  dailyReviewGoal: integer('dailyReviewGoal').default(20),
  preferredStudyTime: text('preferredStudyTime').default('morning'), // morning, afternoon, evening
  notificationsEnabled: boolean('notificationsEnabled').default(true),
  timezone: text('timezone').default('UTC'),
  theme: text('theme').default('system'), // light, dark, system
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  subjects: many(subjects),
  studyItems: many(studyItems),
  reviewSessions: many(reviewSessions),
  settings: one(userSettings),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  user: one(users, {
    fields: [subjects.userId],
    references: [users.id],
  }),
  studyItems: many(studyItems),
}));

export const studyItemsRelations = relations(studyItems, ({ one, many }) => ({
  user: one(users, {
    fields: [studyItems.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [studyItems.subjectId],
    references: [subjects.id],
  }),
  reviews: many(reviewSessions),
}));

export const reviewSessionsRelations = relations(reviewSessions, ({ one }) => ({
  user: one(users, {
    fields: [reviewSessions.userId],
    references: [users.id],
  }),
  studyItem: one(studyItems, {
    fields: [reviewSessions.studyItemId],
    references: [studyItems.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));
