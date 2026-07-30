export interface MoonData {
  phaseName: string;
  illumination: number;
  distance: number;
}

export const LUNAR_MONTH = 29.53058770576;
export const KNOWN_NEW_MOON = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime();
export const ANOMALISTIC_MONTH = 27.55455;
export const KNOWN_PERIGEE = new Date(Date.UTC(2024, 0, 13, 10, 34)).getTime();

/**
 * Calculates the current moon phase, illumination percentage, and distance in KM.
 * Uses astronomical constants and trigonometric approximations.
 * @param date - The Date object to calculate the moon data for.
 * @returns MoonData containing phaseName, illumination, and distance.
 */
export function getMoonData(date: Date): MoonData {
  // Synodic month calculation (Phase)
  const days = (date.getTime() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  const phase = (days / LUNAR_MONTH) - Math.floor(days / LUNAR_MONTH);
  const illumination = ((1 - Math.cos(phase * 2 * Math.PI)) / 2) * 100;
  
  let phaseName = "";
  if (phase < 0.02 || phase > 0.98) phaseName = "NEW MOON";
  else if (phase < 0.23) phaseName = "WAXING CRESCENT";
  else if (phase < 0.27) phaseName = "FIRST QUARTER";
  else if (phase < 0.48) phaseName = "WAXING GIBBOUS";
  else if (phase < 0.52) phaseName = "FULL MOON";
  else if (phase < 0.73) phaseName = "WANING GIBBOUS";
  else if (phase < 0.77) phaseName = "LAST QUARTER";
  else phaseName = "WANING CRESCENT";

  // Anomalistic month calculation (Distance)
  const daysPerigee = (date.getTime() - KNOWN_PERIGEE) / (1000 * 60 * 60 * 24);
  const phasePerigee = (daysPerigee / ANOMALISTIC_MONTH) - Math.floor(daysPerigee / ANOMALISTIC_MONTH);
  const distance = 362600 + (405400 - 362600) * ((1 - Math.cos(phasePerigee * 2 * Math.PI)) / 2);

  return { 
    phaseName, 
    illumination: parseFloat(illumination.toFixed(1)), 
    distance: Math.round(distance) 
  };
}
