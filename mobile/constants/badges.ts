/** Uygulama rozetleri — ilerleme `countConsecutiveCompletedUnits` ile açılır (ana sayfa ile aynı mantık). */

export type AppBadgeDef = {
  id: string;
  title: string;
  description: string;
  /** Açılmak için gereken ardışık tamamlanmış ünite sayısı */
  minCompletedUnits: number;
};

export const APP_BADGES: AppBadgeDef[] = [
  { id: "units_1", title: "İlk adım", description: "Bir üniteyi baştan sona tamamla.", minCompletedUnits: 1 },
  { id: "units_3", title: "Üçlü", description: "Üç üniteyi tamamla.", minCompletedUnits: 3 },
  { id: "units_5", title: "Beşlik", description: "Beş üniteyi tamamla.", minCompletedUnits: 5 },
  { id: "units_10", title: "Onluk", description: "On üniteyi tamamla.", minCompletedUnits: 10 },
  { id: "units_15", title: "On beş", description: "On beş üniteyi tamamla.", minCompletedUnits: 15 },
  { id: "units_23", title: "Müfredat ustası", description: "Tüm üniteleri tamamla.", minCompletedUnits: 23 },
];
