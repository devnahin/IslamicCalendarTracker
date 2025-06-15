import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Sun, Cloud, Moon, Star, MapPin } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const CITIES = [
  { name: "Makkah", lat: "21.3891", lng: "39.8579" },
  { name: "Madinah", lat: "24.5247", lng: "39.5692" },
  { name: "Riyadh", lat: "24.7136", lng: "46.6753" },
  { name: "Cairo", lat: "30.0444", lng: "31.2357" },
  { name: "Istanbul", lat: "41.0082", lng: "28.9784" },
  { name: "Karachi", lat: "24.8607", lng: "67.0011" },
  { name: "Jakarta", lat: "-6.2088", lng: "106.8456" },
];

const PRAYER_ICONS = {
  fajr: Clock,
  dhuhr: Sun,
  asr: Cloud,
  maghrib: Moon,
  isha: Star
};

export default function PrayerTimes() {
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const queryClient = useQueryClient();

  const { data: prayerData, isLoading } = useQuery({
    queryKey: ["/api/prayer-times"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (city: any) => {
      return apiRequest("POST", "/api/prayer-settings", {
        city: city.name,
        latitude: city.lat,
        longitude: city.lng,
        timezone: "auto",
        calculationMethod: "UmmAlQura"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prayer-times"] });
    },
  });

  const changeCity = () => {
    const nextIndex = (selectedCityIndex + 1) % CITIES.length;
    setSelectedCityIndex(nextIndex);
    updateSettingsMutation.mutate(CITIES[nextIndex]);
  };

  if (isLoading) {
    return (
      <Card className="shadow-material">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const prayerTimes = prayerData?.times || {};
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr, icon: PRAYER_ICONS.fajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: PRAYER_ICONS.dhuhr },
    { name: 'Asr', time: prayerTimes.asr, icon: PRAYER_ICONS.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib, icon: PRAYER_ICONS.maghrib },
    { name: 'Isha', time: prayerTimes.isha, icon: PRAYER_ICONS.isha }
  ];

  return (
    <section id="prayer-times">
      <Card className="shadow-material">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-dark-slate">Prayer Times</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={changeCity}
              className="text-prayer-blue hover:text-islamic-green transition-colors"
              disabled={updateSettingsMutation.isPending}
            >
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {updateSettingsMutation.isPending 
                  ? "Updating..." 
                  : prayerData?.city || CITIES[selectedCityIndex].name
                }
              </span>
            </Button>
          </div>

          <div className="space-y-3">
            {prayers.map((prayer) => {
              const IconComponent = prayer.icon;
              return (
                <div key={prayer.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="text-prayer-blue w-4 h-4" />
                    <span className="font-medium text-dark-slate">{prayer.name}</span>
                  </div>
                  <span className="text-gray-600">{prayer.time || "Loading..."}</span>
                </div>
              );
            })}
          </div>

          {prayerData?.nextPrayer && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                Next: <span className="font-medium text-islamic-green">{prayerData.nextPrayer}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
