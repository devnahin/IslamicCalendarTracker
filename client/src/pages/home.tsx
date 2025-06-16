import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, Church } from "lucide-react";
import IslamicCalendar from "@/components/islamic-calendar";
import PrayerTimes from "@/components/prayer-times";
import DateConverter from "@/components/date-converter";
import UpcomingEvents from "@/components/upcoming-events";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: currentHijriDate } = useQuery({
    queryKey: ["/api/hijri-date"],
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-islamic-green shadow-material sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Church className="text-white text-2xl h-8 w-8" />
              <h1 className="text-white text-xl font-bold">Islamic Calendar</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => scrollToSection("calendar")}
                className="text-white hover:text-golden transition-colors duration-200"
              >
                Calendar
              </button>
              <button
                onClick={() => scrollToSection("prayer-times")}
                className="text-white hover:text-golden transition-colors duration-200"
              >
                Prayer Times
              </button>
              <button
                onClick={() => scrollToSection("converter")}
                className="text-white hover:text-golden transition-colors duration-200"
              >
                Converter
              </button>
            </nav>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:text-golden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-islamic-green shadow-lg">
          <nav className="px-4 py-3 space-y-2">
            <button
              onClick={() => scrollToSection("calendar")}
              className="block text-white py-2 hover:text-golden transition-colors w-full text-left"
            >
              Calendar
            </button>
            <button
              onClick={() => scrollToSection("prayer-times")}
              className="block text-white py-2 hover:text-golden transition-colors w-full text-left"
            >
              Prayer Times
            </button>
            <button
              onClick={() => scrollToSection("converter")}
              className="block text-white py-2 hover:text-golden transition-colors w-full text-left"
            >
              Converter
            </button>
          </nav>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Date Card */}
        <section className="mb-8">
          <Card className="shadow-material">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <h2 className="text-sm text-gray-600 uppercase tracking-wide">
                  Today's Islamic Date
                </h2>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-islamic-green">
                  {currentHijriDate?.day || "Loading..."}
                </div>
                <div className="text-2xl font-medium text-dark-slate">
                  {currentHijriDate?.monthName || "Loading..."}
                </div>
                <div className="text-lg text-gray-600">
                  {currentHijriDate?.year ? `${currentHijriDate.year} AH` : "Loading..."}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Gregorian: {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <IslamicCalendar />
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            <PrayerTimes />
            <DateConverter />
            <UpcomingEvents />
          </div>
        </div>

        {/* Detailed Converter Section */}
        <section id="converter" className="mt-8">
          <Card className="shadow-material">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-dark-slate mb-6">Date Converter</h2>
              <DateConverter detailed />
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark-slate text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Islamic Calendar</h4>
              <p className="text-gray-300 text-sm">
                Accurate Hijri dates and prayer times for Muslims worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Hijri Calendar</li>
                <li>Prayer Times</li>
                <li>Date Converter</li>
                <li>Islamic Events</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">About</h4>
              <p className="text-gray-300 text-sm">
                Built with accuracy and respect for Islamic traditions.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-6 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2025 Islamic Calendar App. Made with ❤️ for the Muslim community. Created by A. Zawad</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
