import { users, prayerTimeSettings, islamicEvents, type User, type InsertUser, type PrayerTimeSettings, type InsertPrayerTimeSettings, type IslamicEvent, type InsertIslamicEvent } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPrayerTimeSettings(userId?: number): Promise<PrayerTimeSettings | undefined>;
  updatePrayerTimeSettings(settings: InsertPrayerTimeSettings): Promise<PrayerTimeSettings>;
  getIslamicEvents(): Promise<IslamicEvent[]>;
  createIslamicEvent(event: InsertIslamicEvent): Promise<IslamicEvent>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private prayerSettings: Map<number, PrayerTimeSettings>;
  private islamicEventsMap: Map<number, IslamicEvent>;
  private currentUserId: number;
  private currentPrayerSettingsId: number;
  private currentEventId: number;

  constructor() {
    this.users = new Map();
    this.prayerSettings = new Map();
    this.islamicEventsMap = new Map();
    this.currentUserId = 1;
    this.currentPrayerSettingsId = 1;
    this.currentEventId = 1;

    // Initialize with default Islamic events
    this.initializeIslamicEvents();
  }

  private initializeIslamicEvents() {
    const defaultEvents = [
      { name: "Mawlid an-Nabi", hijriMonth: 3, hijriDay: 12, description: "Birth of Prophet Muhammad (PBUH)", isRecurring: true },
      { name: "Isra and Mi'raj", hijriMonth: 7, hijriDay: 27, description: "Night Journey of Prophet Muhammad (PBUH)", isRecurring: true },
      { name: "Laylat al-Qadr", hijriMonth: 9, hijriDay: 27, description: "Night of Power", isRecurring: true },
      { name: "Eid al-Fitr", hijriMonth: 10, hijriDay: 1, description: "Festival of Breaking the Fast", isRecurring: true },
      { name: "Day of Arafah", hijriMonth: 12, hijriDay: 9, description: "Day of Hajj pilgrimage", isRecurring: true },
      { name: "Eid al-Adha", hijriMonth: 12, hijriDay: 10, description: "Festival of Sacrifice", isRecurring: true },
      { name: "Islamic New Year", hijriMonth: 1, hijriDay: 1, description: "First day of Muharram", isRecurring: true },
      { name: "Day of Ashura", hijriMonth: 1, hijriDay: 10, description: "Day of Remembrance", isRecurring: true },
    ];

    defaultEvents.forEach(event => {
      const islamicEvent: IslamicEvent = {
        id: this.currentEventId++,
        ...event
      };
      this.islamicEventsMap.set(islamicEvent.id, islamicEvent);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPrayerTimeSettings(userId?: number): Promise<PrayerTimeSettings | undefined> {
    // For simplicity, return the first settings or create default
    const settings = Array.from(this.prayerSettings.values())[0];
    if (settings) return settings;
    
    // Create default settings
    const defaultSettings: PrayerTimeSettings = {
      id: this.currentPrayerSettingsId++,
      userId: userId || null,
      city: "Makkah",
      latitude: "21.3891",
      longitude: "39.8579",
      timezone: "Asia/Riyadh",
      calculationMethod: "UmmAlQura"
    };
    this.prayerSettings.set(defaultSettings.id, defaultSettings);
    return defaultSettings;
  }

  async updatePrayerTimeSettings(settings: InsertPrayerTimeSettings): Promise<PrayerTimeSettings> {
    const existing = Array.from(this.prayerSettings.values())[0];
    if (existing) {
      const updated: PrayerTimeSettings = { ...existing, ...settings };
      this.prayerSettings.set(existing.id, updated);
      return updated;
    }
    
    const newSettings: PrayerTimeSettings = {
      id: this.currentPrayerSettingsId++,
      userId: null,
      ...settings
    };
    this.prayerSettings.set(newSettings.id, newSettings);
    return newSettings;
  }

  async getIslamicEvents(): Promise<IslamicEvent[]> {
    return Array.from(this.islamicEventsMap.values());
  }

  async createIslamicEvent(event: InsertIslamicEvent): Promise<IslamicEvent> {
    const id = this.currentEventId++;
    const islamicEvent: IslamicEvent = { ...event, id };
    this.islamicEventsMap.set(id, islamicEvent);
    return islamicEvent;
  }
}

export const storage = new MemStorage();
