import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const prayerTimeSettings = pgTable("prayer_time_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  city: text("city").notNull().default("Makkah"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  timezone: text("timezone"),
  calculationMethod: text("calculation_method").default("UmmAlQura"),
});

export const islamicEvents = pgTable("islamic_events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  hijriMonth: integer("hijri_month").notNull(),
  hijriDay: integer("hijri_day").notNull(),
  description: text("description"),
  isRecurring: boolean("is_recurring").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPrayerTimeSettingsSchema = createInsertSchema(prayerTimeSettings).pick({
  city: true,
  latitude: true,
  longitude: true,
  timezone: true,
  calculationMethod: true,
});

export const insertIslamicEventSchema = createInsertSchema(islamicEvents).pick({
  name: true,
  hijriMonth: true,
  hijriDay: true,
  description: true,
  isRecurring: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPrayerTimeSettings = z.infer<typeof insertPrayerTimeSettingsSchema>;
export type PrayerTimeSettings = typeof prayerTimeSettings.$inferSelect;
export type InsertIslamicEvent = z.infer<typeof insertIslamicEventSchema>;
export type IslamicEvent = typeof islamicEvents.$inferSelect;
