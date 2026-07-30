import { Coordinates, CalculationMethod, PrayerTimes, Qibla } from "adhan";

export interface PrayerData {
  currentPrayer: string;
  nextPrayer: string;
  nextPrayerTime: Date | null;
  qiblaDirection: number;
}

const prayerMap: Record<string, string> = {
  fajr: "FAJR",
  sunrise: "SUNRISE",
  dhuhr: "DHUHR",
  asr: "ASR",
  maghrib: "MAGHRIB",
  isha: "ISHA",
  none: "NONE"
};

/**
 * Calculates prayer times and Qibla direction for a given location and date.
 */
export interface DailyPrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export function getDailyPrayerTimes(lat: number, lng: number, date: Date): DailyPrayerTimes {
  const coordinates = new Coordinates(lat, lng);
  const params = CalculationMethod.MuslimWorldLeague(); // Standard calculation method
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  
  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha
  };
}

export function getIslamicData(lat: number, lng: number, date: Date): PrayerData {
  const coordinates = new Coordinates(lat, lng);
  const params = CalculationMethod.MuslimWorldLeague(); // Standard calculation method
  
  let prayerTimes = new PrayerTimes(coordinates, date, params);
  const qiblaDirection = Qibla(coordinates);

  let nextPrayer = prayerTimes.nextPrayer();
  let nextPrayerTime: Date | null = null;
  let nextPrayerName = "NONE";
  
  const currentPrayer = prayerTimes.currentPrayer();

  if (nextPrayer !== "none") {
    nextPrayerTime = prayerTimes.timeForPrayer(nextPrayer);
    nextPrayerName = prayerMap[nextPrayer] || nextPrayer;
  } else {
    // If all prayers for today have passed (after Isha), get tomorrow's Fajr
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPrayerTimes = new PrayerTimes(coordinates, tomorrow, params);
    nextPrayerTime = tomorrowPrayerTimes.fajr;
    nextPrayerName = "FAJR";
  }

  return {
    currentPrayer: currentPrayer !== "none" ? currentPrayer.toUpperCase() : "NONE",
    nextPrayer: nextPrayerName,
    nextPrayerTime,
    qiblaDirection: parseFloat(qiblaDirection.toFixed(1))
  };
}
