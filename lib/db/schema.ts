import { pgTable, serial, text, timestamp, integer, jsonb, decimal } from 'drizzle-orm/pg-core';

export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  channels: jsonb('channels').$type<string[]>(),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  status: text('status').default('active'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const clickEvents = pgTable('click_events', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').references(() => campaigns.id),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  metadata: jsonb('metadata'),
  timestamp: timestamp('timestamp').defaultNow()
});

export const competitors = pgTable('competitors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url'),
  industry: text('industry'),
  channels: jsonb('channels').$type<string[]>(),
  metrics: jsonb('metrics'),
  campaigns: jsonb('campaigns'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow()
});

export const abTests = pgTable('ab_tests', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  campaignId: integer('campaign_id').references(() => campaigns.id),
  variants: jsonb('variants'),
  status: text('status').default('running'),
  results: jsonb('results'),
  createdAt: timestamp('created_at').defaultNow(),
  endedAt: timestamp('ended_at')
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type'),
  frequency: text('frequency'),
  recipients: jsonb('recipients').$type<string[]>(),
  data: jsonb('data'),
  status: text('status').default('scheduled'),
  nextRun: timestamp('next_run'),
  createdAt: timestamp('created_at').defaultNow()
});