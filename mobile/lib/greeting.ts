/**
 * Yerel saate göre gün içi selamlama (Türkiye için yaygın kullanım).
 */
export function getTimeOfDayGreeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "Günaydın";
  if (h >= 12 && h < 18) return "İyi Günler";
  return "İyi Akşamlar";
}
