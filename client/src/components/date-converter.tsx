import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const GREGORIAN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const ISLAMIC_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

interface DateConverterProps {
  detailed?: boolean;
}

export default function DateConverter({ detailed = false }: DateConverterProps) {
  const { toast } = useToast();
  
  // Gregorian form state
  const [gregDay, setGregDay] = useState("1");
  const [gregMonth, setGregMonth] = useState("10");
  const [gregYear, setGregYear] = useState("2023");
  
  // Hijri form state
  const [hijriDay, setHijriDay] = useState("15");
  const [hijriMonth, setHijriMonth] = useState("3");
  const [hijriYear, setHijriYear] = useState("1445");
  
  // Results
  const [convertedHijri, setConvertedHijri] = useState("");
  const [convertedGregorian, setConvertedGregorian] = useState("");

  const gregorianToHijriMutation = useMutation({
    mutationFn: async (data: { year: number; month: number; day: number }) => {
      const response = await apiRequest("POST", "/api/convert/gregorian-to-hijri", data);
      return response.json();
    },
    onSuccess: (data) => {
      setConvertedHijri(data.formatted);
    },
    onError: () => {
      toast({
        title: "Conversion Error",
        description: "Failed to convert Gregorian date to Hijri",
        variant: "destructive",
      });
    },
  });

  const hijriToGregorianMutation = useMutation({
    mutationFn: async (data: { year: number; month: number; day: number }) => {
      const response = await apiRequest("POST", "/api/convert/hijri-to-gregorian", data);
      return response.json();
    },
    onSuccess: (data) => {
      setConvertedGregorian(data.formatted);
    },
    onError: () => {
      toast({
        title: "Conversion Error",
        description: "Failed to convert Hijri date to Gregorian",
        variant: "destructive",
      });
    },
  });

  const convertGregorianToHijri = () => {
    gregorianToHijriMutation.mutate({
      year: parseInt(gregYear),
      month: parseInt(gregMonth),
      day: parseInt(gregDay)
    });
  };

  const convertHijriToGregorian = () => {
    hijriToGregorianMutation.mutate({
      year: parseInt(hijriYear),
      month: parseInt(hijriMonth),
      day: parseInt(hijriDay)
    });
  };

  const quickConvert = () => {
    const today = new Date();
    setGregDay(today.getDate().toString());
    setGregMonth((today.getMonth() + 1).toString());
    setGregYear(today.getFullYear().toString());
    convertGregorianToHijri();
  };

  if (!detailed) {
    // Simple version for sidebar
    return (
      <Card className="shadow-material">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-dark-slate mb-4">Quick Converter</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Gregorian Date
              </Label>
              <Input
                type="date"
                value={`${gregYear}-${gregMonth.padStart(2, '0')}-${gregDay.padStart(2, '0')}`}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setGregDay(date.getDate().toString());
                  setGregMonth((date.getMonth() + 1).toString());
                  setGregYear(date.getFullYear().toString());
                }}
                className="w-full"
              />
            </div>
            
            <Button
              onClick={convertGregorianToHijri}
              disabled={gregorianToHijriMutation.isPending}
              className="w-full bg-islamic-green hover:bg-islamic-green/90"
            >
              {gregorianToHijriMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Convert
            </Button>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Hijri Date
              </Label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {convertedHijri || "Select a date to convert"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed version for main section
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold text-dark-slate mb-4">Gregorian to Hijri</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Day</Label>
              <Input
                type="number"
                min="1"
                max="31"
                value={gregDay}
                onChange={(e) => setGregDay(e.target.value)}
                placeholder="1"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Month</Label>
              <Select value={gregMonth} onValueChange={setGregMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GREGORIAN_MONTHS.map((month, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Year</Label>
              <Input
                type="number"
                value={gregYear}
                onChange={(e) => setGregYear(e.target.value)}
                placeholder="2023"
              />
            </div>
          </div>
          
          <Button
            onClick={convertGregorianToHijri}
            disabled={gregorianToHijriMutation.isPending}
            className="w-full bg-islamic-green hover:bg-islamic-green/90"
          >
            {gregorianToHijriMutation.isPending ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 mr-2" />
            )}
            Convert to Hijri
          </Button>
          
          <div className="p-4 bg-light-gray rounded-md">
            <p className="text-sm text-gray-600 mb-1">Hijri Date:</p>
            <p className="text-lg font-semibold text-islamic-green">
              {convertedHijri || "No conversion yet"}
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-dark-slate mb-4">Hijri to Gregorian</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Day</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={hijriDay}
                onChange={(e) => setHijriDay(e.target.value)}
                placeholder="1"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Month</Label>
              <Select value={hijriMonth} onValueChange={setHijriMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ISLAMIC_MONTHS.map((month, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Year</Label>
              <Input
                type="number"
                value={hijriYear}
                onChange={(e) => setHijriYear(e.target.value)}
                placeholder="1445"
              />
            </div>
          </div>
          
          <Button
            onClick={convertHijriToGregorian}
            disabled={hijriToGregorianMutation.isPending}
            className="w-full bg-prayer-blue hover:bg-prayer-blue/90"
          >
            {hijriToGregorianMutation.isPending ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ArrowLeft className="h-4 w-4 mr-2" />
            )}
            Convert to Gregorian
          </Button>
          
          <div className="p-4 bg-light-gray rounded-md">
            <p className="text-sm text-gray-600 mb-1">Gregorian Date:</p>
            <p className="text-lg font-semibold text-prayer-blue">
              {convertedGregorian || "No conversion yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
