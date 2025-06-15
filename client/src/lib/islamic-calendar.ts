// Helper functions for Islamic calendar calculations
// Note: This is a simplified implementation. For production, use proper Islamic calendar libraries

export interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  formatted: string;
}

export const ISLAMIC_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

export function convertToHijri(gregorianDate: Date): HijriDate {
  // This is a simplified conversion algorithm
  // In production, use libraries like hijri-date or moment-hijri
  
  const gregorianYear = gregorianDate.getFullYear();
  const gregorianMonth = gregorianDate.getMonth() + 1;
  const gregorianDay = gregorianDate.getDate();
  
  // Approximate Hijri year calculation
  const hijriYear = Math.floor((gregorianYear - 622) * 1.030684 + 1);
  
  // Approximate month and day calculation
  const dayOfYear = Math.floor((gregorianDate.getTime() - new Date(gregorianYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const hijriMonth = Math.floor((dayOfYear / 30.4) % 12);
  const hijriDay = Math.floor((dayOfYear % 30.4)) || 1;
  
  const monthName = ISLAMIC_MONTHS[hijriMonth];
  
  return {
    year: hijriYear,
    month: hijriMonth + 1,
    day: hijriDay,
    monthName,
    formatted: `${hijriDay} ${monthName} ${hijriYear} AH`
  };
}

export function convertToGregorian(hijriYear: number, hijriMonth: number, hijriDay: number): Date {
  // Simplified conversion - use proper Islamic calendar library in production
  const gregorianYear = Math.floor((hijriYear - 1) / 1.030684 + 622);
  const approximateDay = (hijriMonth - 1) * 30 + hijriDay;
  const gregorianDate = new Date(gregorianYear, 0, approximateDay);
  
  return gregorianDate;
}

export function isIslamicHoliday(hijriMonth: number, hijriDay: number): boolean {
  const holidays = [
    { month: 1, day: 1 }, // Islamic New Year
    { month: 1, day: 10 }, // Day of Ashura
    { month: 3, day: 12 }, // Mawlid an-Nabi
    { month: 7, day: 27 }, // Isra and Mi'raj
    { month: 9, day: 27 }, // Laylat al-Qadr (approximate)
    { month: 10, day: 1 }, // Eid al-Fitr
    { month: 12, day: 9 }, // Day of Arafah
    { month: 12, day: 10 }, // Eid al-Adha
  ];
  
  return holidays.some(holiday => holiday.month === hijriMonth && holiday.day === hijriDay);
}

export function getHolidayName(hijriMonth: number, hijriDay: number): string | null {
  const holidays: { [key: string]: string } = {
    '1-1': 'Islamic New Year',
    '1-10': 'Day of Ashura',
    '3-12': 'Mawlid an-Nabi',
    '7-27': 'Isra and Mi\'raj',
    '9-27': 'Laylat al-Qadr',
    '10-1': 'Eid al-Fitr',
    '12-9': 'Day of Arafah',
    '12-10': 'Eid al-Adha',
  };
  
  return holidays[`${hijriMonth}-${hijriDay}`] || null;
}
