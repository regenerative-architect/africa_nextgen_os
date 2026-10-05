import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const alerts = sqliteTable('alerts', {id:text('id').primaryKey(),revision:integer('revision').notNull(),payload:text('payload').notNull()});
export const members = sqliteTable('members', {id:text('id').primaryKey(),role:text('role').notNull(),label:text('label').notNull()});
export const events = sqliteTable('events', {id:text('id').primaryKey(),alertId:text('alert_id').notNull(),actor:text('actor').notNull(),kind:text('kind').notNull(),at:text('at').notNull(),payload:text('payload').notNull()},t=>[index('events_alert_idx').on(t.alertId)]);
export const feedback = sqliteTable('feedback', {id:text('id').primaryKey(),alertId:text('alert_id').notNull(),actor:text('actor').notNull(),payload:text('payload').notNull(),status:text('status').notNull()});
export const dispatches = sqliteTable('dispatches', {id:text('id').primaryKey(),alertId:text('alert_id').notNull(),status:text('status').notNull(),payload:text('payload').notNull()});
