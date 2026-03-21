/**
 * Alt konu başına 1 açık uçlu soru-cevap + 1 çoktan seçmeli (KPSS Tarih örnek içerik).
 * MCQ: content alanı JSON — { "options": string[], "correctIndex": number }
 */
export type SeedQaMcq = {
  subtopicId: string;
  qa: { title: string; content: string };
  mcq: { title: string; options: string[]; correctIndex: number };
};

export const seedQaMcqBySubtopic: SeedQaMcq[] = [
  {
    subtopicId: "turk_name_culture_centers",
    qa: {
      title: "Orta Asya’da Türk kültürüyle ilişkilendirilen başlıca arkeolojik kültür merkezlerinden üçünü sayınız.",
      content:
        "**Anav**, **Afanesyevo** ve **Andronova** kültürleri sınavda sık geçer. **Tagar** kültürü de gelişmiş döneme işaret eder; isimleri coğrafi yayılım ve kronoloji ile ilişkilendirin.",
    },
    mcq: {
      title: "Aşağıdakilerden hangisi Orta Asya’da Türk izleriyle ilişkilendirilen kültür merkezlerinden biri değildir?",
      options: ["Anav kültürü", "Andronova kültürü", "Miken uygarlığı", "Tagar kültürü"],
      correctIndex: 2,
    },
  },
  {
    subtopicId: "first_turk_states",
    qa: {
      title: "Göktürk devletinde Kutluk (İlk) Kağanlık döneminin önemi nedir?",
      content:
        "Devletin **güçlenmesi** ve **merkezî otoritenin** pekişmesi açısından dönüm noktasıdır; **Orhun Yazıtları** bu dönemin kültür ve dil mirasıdır.",
    },
    mcq: {
      title: "Aşağıdakilerden hangisi eski Türk devletlerinden biridir?",
      options: ["Asya Hun Devleti", "Hitit İmparatorluğu", "Sümer devletleri", "Elam"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "other_turk_tribes",
    qa: {
      title: "Hazarların Karadeniz–Hazar ticaret hattındaki rolünü kısaca açıklayınız.",
      content:
        "**Hazarlar**, kontrol ettikleri ticaret güzergâhları ve siyasi yapılarıyla bölgede **güçlü bir aktör** olmuşlardır; **Peçenekler** ve **Kumanlar** ise step hareketleriyle Bizans–Rus etkileşiminde önemlidir.",
    },
    mcq: {
      title: "Karadeniz–Hazar hattında güçlü bir yapı kuran Türk topluluğu hangisidir?",
      options: ["Hazarlar", "Uygurlar", "Karahanlılar", "Eyyubiler"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "culture_civilization_pre",
    qa: {
      title: "Kut ve Kurultay kavramları eski Türk toplumunda neyi ifade eder?",
      content:
        "**Kut**, hükümdarın kutsal hak ve meşruiyet anlayışıdır; **Kurultay**, boy birliği ve **karar alma** mekanizmasıdır.",
    },
    mcq: {
      title: "Eski Türklerde boy birliği ve karar mekanizması için kullanılan kurul hangisidir?",
      options: ["Kurultay", "Divan-ı Hümayun", "Meclis-i Mebusan", "Senato"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "first_muslim_turk_states",
    qa: {
      title: "İslamiyeti kabul eden ilk büyük Türk devletlerinden ikisini ve öne çıkan özelliklerini yazınız.",
      content:
        "**Karahanlılar** İslamiyeti benimseyen ilk büyük Türk devletlerindendir; **Gazneliler** Hint seferleri ve kültür merkezleriyle bilinir; **Büyük Selçuklu** geniş coğrafyada siyasi üstünlük ve **Nizamiye medreseleri** ile öne çıkar.",
    },
    mcq: {
      title: "İslamiyeti kabul eden ilk büyük Türk devletlerinden biri hangisidir?",
      options: ["Karahanlılar", "Roma İmparatorluğu", "Bizans", "Sasani"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "egypt_turk_states",
    qa: {
      title: "Mısır’da Tolunoğulları ve Memlükler hakkında kısa bir karşılaştırma yapınız.",
      content:
        "**Tolunoğulları** ve **İhşidiler** bölgesel güç oluşturur; **Eyyubiler** Haçlılar karşısında öne çıkar; **Memlükler** askeri güç ve devlet idaresiyle uzun süre etkindir.",
    },
    mcq: {
      title: "Haçlılar karşısında öne çıkan Mısır Türk devletlerinden biri hangisidir?",
      options: ["Eyyubiler", "Osmanlı (Kuruluş)", "Safeviler", "Timurlular"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "other_states_mongol",
    qa: {
      title: "Harzemşahlar ve Moğol istilasının bölge için sonuçları nelerdir?",
      content:
        "**Harzemşahlar** İran–Orta Asya hattında güçlüdür; **Moğol istilası** siyasi haritayı değiştirir ve bölgede **yeniden yapılanma** süreçlerini hızlandırır.",
    },
    mcq: {
      title: "Moğol istilası öncesi İran–Orta Asya hattında güçlü olan devlet hangisidir?",
      options: ["Harzemşahlar", "Karahanlılar", "Osmanlı", "Ak Koyunlu"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "culture_civilization_turk_islam",
    qa: {
      title: "Türk-İslam kültüründe ikta sistemi ve medreselerin işlevi nedir?",
      content:
        "**İkta**, askeri ve idari hizmet karşılığı gelir bağlama düzenidir; **medreseler** ise örgün eğitim ve ilim geleneğinin merkezidir (ör. Nizamiye).",
    },
    mcq: {
      title: "Farabi, İbn-i Sina ve Biruni hangi bağlamda müfredatta sık geçer?",
      options: ["Türk-İslam bilim ve felsefe geleneği", "Rönesans sanatı", "Antik Yunan mitolojisi", "Endüstri devrimi"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "beylik_period_1",
    qa: {
      title: "I. dönem Anadolu beyliklerinden ikisini ve kısa özelliklerini yazınız.",
      content:
        "**Saltuklular**, **Mengücekliler**, **Danişmentliler**, **Artuklular** ve **Çaka Beyliği** gibi beylikler Anadolu’da **siyasi çeşitlilik** ve **sınır ötesi** etkileşimler yaratır.",
    },
    mcq: {
      title: "Aşağıdakilerden hangisi I. dönem Anadolu beyliklerinden biridir?",
      options: ["Saltuklular", "Karamanoğulları", "Osmanlı (1299 sonrası genişleme)", "Safeviler"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "turkey_seljuk",
    qa: {
      title: "Kösedağ Savaşı’nın Türkiye Selçuklu Devleti için anlamı nedir?",
      content:
        "Moğol baskısı ve siyasi sonuçlarıyla devletin **yıkılış süreci** hızlanır; merkezî otorite zayıflar ve **beylikler dönemi** koşulları güçlenir.",
    },
    mcq: {
      title: "Türkiye Selçuklu Devleti’nde yıkılış sürecini hızlandıran başlıca olay hangisidir?",
      options: ["Kösedağ Savaşı", "Malazgirt Savaşı", "Çaldıran Savaşı", "Lozan Antlaşması"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "beylik_period_2",
    qa: {
      title: "II. dönem Anadolu beyliklerinden Karamanoğulları’nın yeri nedir?",
      content:
        "**Karamanoğulları** Anadolu’da genişlemiş bir beylik olarak **Osmanlı** ile rekabet ve etkileşim içindedir; **Karesioğulları** ve **Germiyanoğulları** da aynı dönemde önemlidir.",
    },
    mcq: {
      title: "II. dönem Anadolu beyliklerinden biri hangisidir?",
      options: ["Karamanoğulları", "Tolunoğulları", "Memlükler", "Harzemşahlar"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "foundation_1299_1453",
    qa: {
      title: "Osmanlı’nın kuruluş döneminde (1299–1453) fetih ve iskan politikalarının rolünü özetleyiniz.",
      content:
        "Sınırların genişlemesi, **uç beyliği** geleneği ve **iskân** ile bölgenin **Türk–İslam** karakteri pekişir; **İstanbul’un fethi** dönemin doruk noktasıdır.",
    },
    mcq: {
      title: "Osmanlı Devleti’nin kuruluş döneminde İstanbul’u fetheden padişah kimdir?",
      options: ["II. Mehmed (Fatih)", "I. Selim", "Kanuni", "IV. Murad"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "rise_1453_1579",
    qa: {
      title: "Osmanlı’nın yükselme döneminde “dünya gücü” olmasını sağlayan başlıca unsurlar nelerdir?",
      content:
        "Geniş **coğrafi** kontrol, güçlü **ordu** ve **donanma**, merkezî **bürokrasi** ve **Kanuni** dönemi ile **hukuk** ve **idare** istikrarı öne çıkar.",
    },
    mcq: {
      title: "Osmanlı’nın yükselme döneminde “Kanuni” lakaplı padişah kimdir?",
      options: ["I. Süleyman", "Yıldırım Bayezid", "Fatih Sultan Mehmet", "II. Abdülhamid"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "stagnation_and_decline",
    qa: {
      title: "Duraklama ve gerileme döneminde Osmanlı’nın “arayış”ları nelerdir?",
      content:
        "Islahat denemeleri, **diplomasi** ile denge arayışı ve iç **isyanlar**/siyasi krizler birlikte ele alınmalıdır.",
    },
    mcq: {
      title: "Osmanlı’da duraklama dönemiyle ilişkilendirilen genel yaklaşım hangisidir?",
      options: [
        "Reform ve denge arayışları",
        "İstanbul’un fethi",
        "Cumhuriyet ilânı",
        "Lozan’ın imzalanması",
      ],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "dissolution_1792_1922",
    qa: {
      title: "Dağılma döneminde (1792–1922) “en uzun yüzyıl” ifadesi neyi çağrıştırır?",
      content:
        "İç ve dış baskılar, **Meşrutiyet** deneyimleri, savaşlar ve nihayet **monarşinin** sona ermesine giden süreçleri kapsar.",
    },
    mcq: {
      title: "Osmanlı’nın son döneminde açılan ilk meclis deneyimi hangisidir?",
      options: ["I. Meşrutiyet", "TBMM", "Çırağan Baskını", "Lozan Konferansı"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "central_org",
    qa: {
      title: "Osmanlı merkez teşkilatında Divan-ı Hümayun’un işlevi nedir?",
      content:
        "Başlıca **devlet işlerinin** görüşüldüğü, vezirler ve ilgili görevlilerin yer aldığı **merkezî karar** mekanizmasıdır; padişahın otoritesi ile ilişkilidir.",
    },
    mcq: {
      title: "Osmanlı’da merkezde başlıca devlet işlerinin görüşüldüğü kurul hangisidir?",
      options: ["Divan-ı Hümayun", "Eyalet meclisi", "Lonca heyeti", "Vakıf şurası"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "provincial_org",
    qa: {
      title: "Tımar sisteminin taşra idaresindeki rolünü kısaca açıklayınız.",
      content:
        "**Tımar**, askeri ve idari hizmet karşılığı **gelir** bağlama düzeni olup **sipahi** ve **reaya** ilişkilerini düzenler; merkezî ordunun finansmanına katkı sağlar.",
    },
    mcq: {
      title: "Osmanlı taşrasında sipahi ve askeri hizmetle ilişkili gelir düzeni hangisidir?",
      options: ["Tımar sistemi", "Kapitülasyon", "İştira bonosu", "Mondros"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "law_army_education",
    qa: {
      title: "Enderun ile medreseler Osmanlı’da eğitim açısından nasıl ayrılır?",
      content:
        "**Enderun**, saray ve devlet kademelerine **mensup yetiştirme** sistemi iken **medreseler** ilmî/ dînî eğitimin merkezidir; ikisi farklı **personel** üretir.",
    },
    mcq: {
      title: "Osmanlı’da sarayda yetişen devşirme kökenli kadroların eğitim gördüğü kurum hangisidir?",
      options: ["Enderun", "Sivil okullar (Tanzimat sonrası genel)", "Robert Kolej", "Darülfünun"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "economy_social",
    qa: {
      title: "Lonca teşkilatı ve vakıfların Osmanlı ekonomi ve sosyal hayattaki rolleri nedir?",
      content:
        "**Lonca**, meslek düzenini ve kaliteyi korur; **vakıflar** ise sosyal hizmet ve altyapı (külliye, imaret vb.) için **sürdürülebilir** gelir modeli sunar.",
    },
    mcq: {
      title: "Osmanlı’da meslek düzenini ve üretim standartlarını yöneten yapı hangisidir?",
      options: ["Lonca teşkilatı", "Tımar", "Kapıkulu", "Meclis-i Vükela"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "tripolitan_balkan_wars",
    qa: {
      title: "Trablusgarp ve Balkan Savaşları’nın Osmanlı için sonuçları nelerdir?",
      content:
        "Toprak kayıpları, **Balkan**’da demografik ve siyasi değişimler ve **ulusal** bilinçte derin etkiler bırakır.",
    },
    mcq: {
      title: "Osmanlı’nın Balkanlarda ağır toprak kaybettiği savaşlar hangi döneme denk gelir?",
      options: ["Balkan Savaşları", "I. İnönü Muharebeleri", "Büyük Taarruz", "Kore Savaşı"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "ww1_fronts",
    qa: {
      title: "I. Dünya Savaşı’nda Osmanlı’nın cephelerdeki durumu ve Mondros Ateşkesi’nin anlamı nedir?",
      content:
        "Çok cepheli savaş **ekonomik** ve **askeri** tüketimi artırır; **Mondros** ile fiilen **silahların susması** ve işgal sürecinin başlaması gelir.",
    },
    mcq: {
      title: "I. Dünya Savaşı sonunda Osmanlı için imzalanan ateşkes hangisidir?",
      options: ["Mondros Ateşkesi", "Mudanya Ateşkesi", "Lozan Antlaşması", "Küçük Kaynarca"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "societies_xx",
    qa: {
      title: "XX. yüzyıl başında cemiyetler neden “yararlı” ve “zararlı” diye sınıflandırılır?",
      content:
        "**Milli** çıkarlara hizmet edenler ile işgal ve iş birliği bağlamında **eleştirilenler** ayrıştırılır; müfredatta örnek cemiyetler ezberlenir.",
    },
    mcq: {
      title: "Kurtuluş mücadelesinde millî çıkarlara hizmet eden cemiyet örneklerinden biri hangisidir?",
      options: ["Müdafaa-i Hukuk cemiyetleri", "İttihat ve Terakki (genel bağlamda)", "Osmanlı Bankası", "Şirket-i Hayriye"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "preparation_period",
    qa: {
      title: "Hazırlık döneminde Amasya Genelgesi’nin önemi nedir?",
      content:
        "Mücadelenin **ilkelerini** ve **örgütlenme** çizgisini ortaya koyar; kongre sürecinin **yol haritası** olarak okunur.",
    },
    mcq: {
      title: "TBMM’nin açıldığı şehir hangisidir?",
      options: ["Ankara", "İstanbul", "İzmir", "Erzurum"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "battles_period",
    qa: {
      title: "I. ve II. İnönü muharebeleri Kurtuluş Savaşı için neyi ifade eder?",
      content:
        "Düşman ilerleyişinin **durdurulması**, moral ve **askeri** üstünlük sağlanması açısından kritik **ön cephe** zaferleridir.",
    },
    mcq: {
      title: "Kurtuluş Savaşı’nda Batı Cephesi’nde üst üste kazanılan önemli muharebeler hangileridir?",
      options: ["I. ve II. İnönü", "Çanakkale (1915)", "Trablusgarp", "Balkan Savaşı"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "diplomacy_lozan",
    qa: {
      title: "Mudanya Ateşkesi ile Lozan Barış Antlaşması arasındaki fark nedir?",
      content:
        "**Mudanya** silahların susması ve geçiş sürecini düzenler; **Lozan** ise **bağımsızlık**, **sınırlar** ve çok sayıda hukuki maddenin **uluslararası** zemine bağlanmasıdır.",
    },
    mcq: {
      title: "Türkiye’nin bağımsızlığını uluslararası hukuka bağlayan antlaşma hangisidir?",
      options: ["Lozan Barış Antlaşması", "Sevr Antlaşması", "Mondros Ateşkesi", "Küçük Kaynarca"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "ataturk_principles_list",
    qa: {
      title: "Atatürk ilkelerinden laikliğin tanımı ve eğitimdeki yansıması nedir?",
      content:
        "**Laiklik**, hukuk ve eğitimde devletin **din karşısında tarafsızlığı** ve **tevhid-i tedrisat** ile eğitim birliği hedefidir.",
    },
    mcq: {
      title: "Atatürk ilkeleri arasında yer almayan seçenek hangisidir?",
      options: ["Monarşizm", "Cumhuriyetçilik", "Halkçılık", "Laiklik"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "reforms_ataturk",
    qa: {
      title: "Medeni Kanun ve Latin harfleri hangi inkılap alanına girer?",
      content:
        "**Medeni Kanun** hukuki modernleşme; **Latin harfleri** ise eğitim ve kültür alanında **köklü** toplumsal inkılap adımlarıdır.",
    },
    mcq: {
      title: "Halifeliğin kaldırılması hangi inkılap alanıyla ilişkilendirilir?",
      options: ["Siyasi/hukuki inkılaplar", "Spor reformları", "Tarım kooperatifleri", "NATO üyeliği"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "interwar",
    qa: {
      title: "İki savaş arası dönemde SSCB’nin kuruluşunun dünya dengelerine etkisi nedir?",
      content:
        "İdeolojik ve coğrafi olarak yeni bir **blok** oluşur; **Orta Doğu** mandaları ve **Uzak Doğu**’da Japonya’nın genişlemesi çok kutuplu gerilimleri şekillendirir.",
    },
    mcq: {
      title: "1922’de kurulan ve dünya siyasetinde yeni bir blok oluşturan devlet hangisidir?",
      options: ["SSCB", "ABD (1776)", "Avustralya Konfedereasyonu", "Kanada"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "ww2_turkey",
    qa: {
      title: "II. Dünya Savaşı’nda Türkiye’nin tarafsızlık politikası nasıl okunmalıdır?",
      content:
        "Ekonomik ve askeri **hazırlık** ile birlikte **Montrö** ve yardım antlaşmaları gibi adımlar **tarafsızlık** çizgisinin parçasıdır.",
    },
    mcq: {
      title: "II. Dünya Savaşı sırasında Türkiye’nin genel tutumu hangisiyle özetlenir?",
      options: ["Tarafsızlık çizgisi", "Doğrudan Mihver üyeliği", "Doğrudan Müttefik üyeliği", "BM Güvenlik Konseyi dönem başkanlığı"],
      correctIndex: 0,
    },
  },
  {
    subtopicId: "cold_war_global",
    qa: {
      title: "Soğuk Savaş döneminde NATO ve Varşova Paktı’nın rolü nedir?",
      content:
        "İki kutup **askeri** ittifaklarıyla dünyayı **nükleer denge** ve bölgesel mücadele ekseninde şekillendirir; **yumuşama** ve **Berlin Duvarı**’nın yıkılışı sonrası dönem farklıdır.",
    },
    mcq: {
      title: "Soğuk Savaş döneminde Batı ittifakının askeri örgütü hangisidir?",
      options: ["NATO", "Varşova Paktı", "Bağlantısızlar Hareketi", "ANZUS"],
      correctIndex: 0,
    },
  },
];
