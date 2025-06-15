// Helper functions for prayer times calculations
// Note: This is a simplified implementation. For production, use proper prayer times APIs

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerTimesResponse {
  city: string;
  date: string;
  times: PrayerTimes;
  nextPrayer: string;
}

export const CITIES = [
  { name: "Makkah", lat: 21.3891, lng: 39.8579, timezone: "Asia/Riyadh" },
  { name: "Madinah", lat: 24.5247, lng: 39.5692, timezone: "Asia/Riyadh" },
  { name: "Riyadh", lat: 24.7136, lng: 46.6753, timezone: "Asia/Riyadh" },
  { name: "Cairo", lat: 30.0444, lng: 31.2357, timezone: "Africa/Cairo" },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784, timezone: "Europe/Istanbul" },
  { name: "Karachi", lat: 24.8607, lng: 67.0011, timezone: "Asia/Karachi" },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456, timezone: "Asia/Jakarta" },
];

export function calculatePrayerTimes(lat: number, lng: number, date: Date = new Date()): PrayerTimes {
  // This is a very simplified calculation
  // In production, use proper prayer times calculations or APIs like:
  // - AlAdhan API (https://aladhan.com/prayer-times-api)
  // - PrayTimes library
  // - Islamic Society of North America (ISNA) calculations
  
  // Simplified static times based on general Islamic prayer schedules
  // These would normally be calculated based on sun position, location, and date
  
  return {
    fajr: "05:15",
    sunrise: "06:45",
    dhuhr: "12:30",
    asr: "15:45",
    maghrib: "18:15",
    isha: "19:45"
  };
}

export function getNextPrayer(prayerTimes: PrayerTimes, currentTime: Date = new Date()): string {
  const now = currentTime.getHours() * 100 + currentTime.getMinutes();
  
  const prayers = [
    { name: 'Fajr', time: convertTimeToNumber(prayerTimes.fajr) },
    { name: 'Dhuhr', time: convertTimeToNumber(prayerTimes.dhuhr) },
    { name: 'Asr', time: convertTimeToNumber(prayerTimes.asr) },
    { name: 'Maghrib', time: convertTimeToNumber(prayerTimes.maghrib) },
    { name: 'Isha', time: convertTimeToNumber(prayerTimes.isha) }
  ];
  
  for (const prayer of prayers) {
    if (now < prayer.time) {
      const timeDiff = calculateTimeDifference(now, prayer.time);
      return `${prayer.name} in ${timeDiff}`;
    }
  }
  
  // If all prayers have passed, next is Fajr tomorrow
  const timeDiff = calculateTimeDifference(now, prayers[0].time + 2400);
  return `Fajr in ${timeDiff}`;
}

function convertTimeToNumber(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 100 + minutes;
}

function calculateTimeDifference(current: number, target: number): string {
  const diff = target > current ? target - current : target + 2400 - current;
  const hours = Math.floor(diff / 100);
  const minutes = diff % 100;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatPrayerTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
