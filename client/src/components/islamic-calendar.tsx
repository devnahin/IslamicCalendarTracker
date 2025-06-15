import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const ISLAMIC_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function IslamicCalendar() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(2); // Rabi' al-Awwal
  const [currentYear, setCurrentYear] = useState(1445);

  const { data: currentHijriDate } = useQuery({
    queryKey: ["/api/hijri-date"],
  });

  const { data: islamicEvents } = useQuery({
    queryKey: ["/api/islamic-events"],
  });

  const previousMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const generateCalendarDays = () => {
    const daysInMonth = 30; // Simplified - Islamic months are typically 29 or 30 days
    const startDay = 3; // Simplified start day calculation
    const days = [];

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: 30 - i,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = currentHijriDate && 
        currentHijriDate.day === day && 
        currentHijriDate.month === currentMonthIndex + 1 && 
        currentHijriDate.year === currentYear;
      
      const hasEvent = islamicEvents?.some(event => 
        event.hijriMonth === currentMonthIndex + 1 && event.hijriDay === day
      );

      days.push({
        day,
        isCurrentMonth: true,
        isToday: !!isToday,
        hasEvent: !!hasEvent
      });
    }

    // Next month days to fill the grid
    const remainingCells = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <section id="calendar">
      <Card className="shadow-material">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-slate">Islamic Calendar</h2>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={previousMonth}
                className="p-2 text-gray-500 hover:text-islamic-green"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium text-dark-slate min-w-48 text-center">
                {ISLAMIC_MONTHS[currentMonthIndex]} {currentYear}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextMonth}
                className="p-2 text-gray-500 hover:text-islamic-green"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {WEEKDAYS.map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-light-gray rounded">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayInfo, index) => (
              <div
                key={index}
                className={`
                  p-3 h-12 flex items-center justify-center rounded cursor-pointer transition-colors relative
                  ${dayInfo.isCurrentMonth 
                    ? dayInfo.isToday 
                      ? 'bg-islamic-green text-white font-bold shadow-md'
                      : 'text-dark-slate hover:bg-gray-50'
                    : 'text-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                {dayInfo.day}
                {dayInfo.hasEvent && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-golden rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-islamic-green rounded"></div>
              <span className="text-gray-600">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-golden rounded-full"></div>
              <span className="text-gray-600">Islamic Holiday</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
