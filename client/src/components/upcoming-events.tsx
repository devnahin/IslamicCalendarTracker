import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function UpcomingEvents() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/islamic-events"],
  });

  if (isLoading) {
    return (
      <Card className="shadow-material">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-dark-slate mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingEvents = events?.slice(0, 4) || [];

  return (
    <Card className="shadow-material">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-dark-slate mb-4">Upcoming Events</h3>
        
        <div className="space-y-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event: any) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-golden rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-dark-slate text-sm">{event.name}</p>
                  <p className="text-xs text-gray-600">
                    {event.hijriDay} {getMonthName(event.hijriMonth)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.daysUntil === 0 
                      ? "Today" 
                      : event.daysUntil === 1 
                        ? "Tomorrow" 
                        : `In ${event.daysUntil} days`
                    }
                  </p>
                  {event.description && (
                    <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No upcoming events found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getMonthName(monthNumber: number): string {
  const months = [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
  ];
  return months[monthNumber - 1] || 'Unknown';
}
