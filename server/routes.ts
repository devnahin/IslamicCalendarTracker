import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPrayerTimeSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current Hijri date
  app.get("/api/hijri-date", async (req, res) => {
    try {
      const today = new Date();
      // Using a simplified Hijri calculation - in production, use a proper Islamic calendar library
      const hijriDate = convertToHijri(today);
      res.json(hijriDate);
    } catch (error) {
      res.status(500).json({ error: "Failed to get Hijri date" });
    }
  });

  // Get prayer times for a city
  app.get("/api/prayer-times", async (req, res) => {
    try {
      const settings = await storage.getPrayerTimeSettings();
      if (!settings) {
        return res.status(404).json({ error: "Prayer time settings not found" });
      }

      const prayerTimes = await calculatePrayerTimes(settings);
      res.json({
        city: settings.city,
        date: new Date().toISOString().split('T')[0],
        times: prayerTimes,
        nextPrayer: getNextPrayer(prayerTimes)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get prayer times" });
    }
  });

  // Update prayer time settings (city)
  app.post("/api/prayer-settings", async (req, res) => {
    try {
      const validatedData = insertPrayerTimeSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updatePrayerTimeSettings(validatedData);
      res.json(updatedSettings);
    } catch (error) {
      res.status(400).json({ error: "Invalid prayer settings data" });
    }
  });

  // Convert Gregorian to Hijri
  app.post("/api/convert/gregorian-to-hijri", async (req, res) => {
    try {
      const { year, month, day } = req.body;
      if (!year || !month || !day) {
        return res.status(400).json({ error: "Year, month, and day are required" });
      }

      const gregorianDate = new Date(year, month - 1, day);
      const hijriDate = convertToHijri(gregorianDate);
      res.json(hijriDate);
    } catch (error) {
      res.status(500).json({ error: "Failed to convert date" });
    }
  });

  // Convert Hijri to Gregorian
  app.post("/api/convert/hijri-to-gregorian", async (req, res) => {
    try {
      const { year, month, day } = req.body;
      if (!year || !month || !day) {
        return res.status(400).json({ error: "Year, month, and day are required" });
      }

      const gregorianDate = convertToGregorian(year, month, day);
      res.json({
        year: gregorianDate.getFullYear(),
        month: gregorianDate.getMonth() + 1,
        day: gregorianDate.getDate(),
        formatted: gregorianDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to convert date" });
    }
  });

  // Get Islamic events
  app.get("/api/islamic-events", async (req, res) => {
    try {
      const events = await storage.getIslamicEvents();
      const eventsWithDates = events.map(event => ({
        ...event,
        daysUntil: calculateDaysUntilEvent(event.hijriMonth, event.hijriDay)
      })).sort((a, b) => a.daysUntil - b.daysUntil);
      
      res.json(eventsWithDates);
    } catch (error) {
      res.status(500).json({ error: "Failed to get Islamic events" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for Islamic calendar calculations
function convertToHijri(gregorianDate: Date) {
  // Simplified Hijri conversion - in production, use hijri-date library or similar
  const gregorianYear = gregorianDate.getFullYear();
  const gregorianMonth = gregorianDate.getMonth() + 1;
  const gregorianDay = gregorianDate.getDate();
  
  // Approximate conversion (this is a simplified version)
  const hijriYear = Math.floor((gregorianYear - 622) * 1.030684 + 1);
  
  const islamicMonths = [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
  ];
  
  // This is a very simplified conversion - use proper Islamic calendar library in production
  const dayOfYear = Math.floor((gregorianDate.getTime() - new Date(gregorianYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const hijriMonth = Math.floor((dayOfYear / 30.4) % 12);
  const hijriDay = Math.floor((dayOfYear % 30.4)) || 1;
  
  return {
    year: hijriYear,
    month: hijriMonth + 1,
    day: hijriDay,
    monthName: islamicMonths[hijriMonth],
    formatted: `${hijriDay} ${islamicMonths[hijriMonth]} ${hijriYear} AH`
  };
}

function convertToGregorian(hijriYear: number, hijriMonth: number, hijriDay: number): Date {
  // Simplified conversion - use proper Islamic calendar library in production
  const gregorianYear = Math.floor((hijriYear - 1) / 1.030684 + 622);
  const approximateDay = (hijriMonth - 1) * 30 + hijriDay;
  const gregorianDate = new Date(gregorianYear, 0, approximateDay);
  
  return gregorianDate;
}

async function calculatePrayerTimes(settings: any) {
  // In production, use a proper prayer times API like AlAdhan API
  // This is a simplified version with static times
  const times = {
    fajr: "05:15",
    sunrise: "06:45",
    dhuhr: "12:30",
    asr: "15:45",
    maghrib: "18:15",
    isha: "19:45"
  };
  
  return times;
}

function getNextPrayer(prayerTimes: any) {
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const prayers = [
    { name: 'Fajr', time: convertTimeToNumber(prayerTimes.fajr) },
    { name: 'Dhuhr', time: convertTimeToNumber(prayerTimes.dhuhr) },
    { name: 'Asr', time: convertTimeToNumber(prayerTimes.asr) },
    { name: 'Maghrib', time: convertTimeToNumber(prayerTimes.maghrib) },
    { name: 'Isha', time: convertTimeToNumber(prayerTimes.isha) }
  ];
  
  for (const prayer of prayers) {
    if (currentTime < prayer.time) {
      const timeDiff = calculateTimeDifference(currentTime, prayer.time);
      return `${prayer.name} in ${timeDiff}`;
    }
  }
  
  // If all prayers have passed, next is Fajr tomorrow
  const timeDiff = calculateTimeDifference(currentTime, prayers[0].time + 2400);
  return `Fajr in ${timeDiff}`;
}

function convertTimeToNumber(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 100 + minutes;
}

function calculateTimeDifference(current: number, target: number): string {
  const diff = target - current;
  const hours = Math.floor(diff / 100);
  const minutes = diff % 100;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function calculateDaysUntilEvent(hijriMonth: number, hijriDay: number): number {
  // Simplified calculation - in production, use proper Islamic calendar calculations
  const today = new Date();
  const currentHijri = convertToHijri(today);
  
  let daysUntil = 0;
  if (hijriMonth > currentHijri.month || (hijriMonth === currentHijri.month && hijriDay > currentHijri.day)) {
    // Event is this year
    const monthsUntil = hijriMonth - currentHijri.month;
    const daysInMonth = 30; // Approximate
    daysUntil = monthsUntil * daysInMonth + (hijriDay - currentHijri.day);
  } else {
    // Event is next year
    const monthsUntilYearEnd = 12 - currentHijri.month;
    const monthsFromYearStart = hijriMonth - 1;
    const daysInMonth = 30; // Approximate
    daysUntil = monthsUntilYearEnd * daysInMonth + monthsFromYearStart * daysInMonth + hijriDay - currentHijri.day;
  }
  
  return Math.max(daysUntil, 0);
}
