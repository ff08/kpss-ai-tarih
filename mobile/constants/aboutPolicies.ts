/** Hakkında > politika modallarında gösterilen tam metinler */

export type PolicyId = "genel" | "gizlilik" | "kullanim";

export const ABOUT_POLICIES: Record<
  PolicyId,
  { title: string; summary: string; body: string }
> = {
  genel: {
    title: "Genel bilgiler ve feragat",
    summary: "Eğitim amacı, ÖSYM ve müfredat uyarısı",
    body:
      "Bu uygulama eğitim amaçlıdır; resmi sınav kaynağı değildir. İçerikler müfredat çerçevesinde özetlenmiştir. Güncel mevzuat, sınav kılavuzu ve duyurular için ÖSYM’yi ve resmi kaynakları takip edin.\n\n" +
      "Tarih AI, bilgi kartları, soru–cevap ve çoktan seçmeli içeriklerle tekrar yapmanıza yardımcı olmayı amaçlar; sınavda çıkacak soruları garanti etmez.",
  },
  gizlilik: {
    title: "Gizlilik",
    summary: "Veri toplama ve bağlantı",
    body:
      "Uygulama şu an için hesap oluşturmadan veya kişisel veri toplamadan çalışabilir. Cihazınız, yapılandırdığınız API adresi üzerinden içerik sunucusuna bağlanır; bu bağlantı sırasında sunucu günlükleri (IP, istek zamanı gibi teknik veriler) tutuluyorsa bunlar sunucu yöneticisinin politikasına tabidir.\n\n" +
      "İleride hesap, analitik veya üçüncü taraf hizmetleri eklenirse bu metin ve gerekirse ayrıntılı gizlilik politikası güncellenecektir. Önemli değişikliklerde uygulama içi bildirim veya mağaza açıklaması ile bilgilendirme hedeflenir.",
  },
  kullanim: {
    title: "Kullanım koşulları",
    summary: "Kişisel kullanım ve içerik kuralları",
    body:
      "İçerikleri yalnızca kişisel çalışmanız ve bireysel öğrenmeniz için kullanın. İçeriği ticari amaçla çoğaltmak, satmak veya izinsiz paylaşmak yasaktır.\n\n" +
      "API veya uygulama üzerinden otomatik toplu indirme, veri madenciliği veya scraping yapılmamalıdır. Sunucuya makul kullanım dışında yük bindirmekten kaçının.\n\n" +
      "Bu koşullara aykırı kullanımda teknik erişim kısıtlanabilir veya hesap kapatılabilir.",
  },
};

export const POLICY_ORDER: PolicyId[] = ["genel", "gizlilik", "kullanim"];
