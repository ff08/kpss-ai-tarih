/**
 * İslamiyet Öncesi Türk Tarihi (Topic id=9) — alt konu başlıkları veritabanındaki `title` ile birebir eşleşmeli.
 */
export type Topic9Pack = {
  information: { title: string; content: string; tag?: string }[];
  openQa: { title: string; content: string; hint?: string; tag?: string }[];
  wordGames: { question: string; answer: string; hint: string }[];
  mcq: {
    title: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    explanation: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
  }[];
};

const T = {
  T1: "TÜRK ADININ ANLAMI",
  T2: "TÜRKLERİN İLK ANA YURDU",
  T3: "ORTA ASYA KÜLTÜRLERİ",
  T4: "ORTA ASYA TÜRK GÖÇLERİ",
  T5: "ORTA ASYA'DA KURULAN İLK TÜRK DEVLETLERİ",
  T6: "KAVİMLER GÖÇÜ VE SONUÇLARI",
  T7: "KÖKTÜRK DEVLETİ",
  T8: "MATEM DÖNEMİ",
  T10: "UYGUR DEVLETİ",
  T11: "DİĞER TÜRK DEVLETLERİ VE TOPLULUKLARI",
  T12: "KÜLTÜR VE UYGARLIK",
  T13: "DEVLET YÖNETİMİ",
  T14: "ORDU YAPILANMASI",
  T15: "DİN VE İNANIŞ",
  T16: "HUKUKİ YAPILANMA",
  T17: "SOSYAL HAYAT",
  T18: "EKONOMİK HAYAT",
  T19: "YAZI, DİL VE EDEBİYAT",
  T20: "TÜRK DESTANLARI",
  T21: "BİLİM VE EĞİTİM",
  T22: "SANAT",
} as const;

export const TOPIC9_PACKS: Record<string, Topic9Pack> = {
  [T.T1]: {
    information: [
      {
        title: "Anlam alanı",
        content:
          "“Türk” adı tarih boyunca **güç**, **kuvvet**, **cesaret** ve **töreye bağlılık** çağrışımlarıyla kullanılmıştır; tek bir “sözlük anlamı” yerine değer yüklü bir kimlik ifadesidir.",
        tag: "Kavram",
      },
      {
        title: "Çin kaynakları: Tu-küe",
        content:
          "Erken dönem Çin metinlerinde Türk boyları çoğunlukla **Tu-küe** (Tujue) biçiminde anılır; bu adlandırma, Çin merkezli kayıtların Türk politikasına dair sınıflamasını yansıtır.",
        tag: "Kaynak",
      },
      {
        title: "Devlet adı olarak kullanım",
        content:
          "“Türk” adının **devlet unvanı** olarak belirgin şekilde kullanımı **Göktürk (Kök Türk)** dönemiyle özdeşleşir ve sonraki Türk devletlerinde ortak kimlik dilini besler.",
        tag: "Siyasi tarih",
      },
      {
        title: "Millet adına evrilme",
        content:
          "Zamanla **Türk** adı; dil, töre ve ortak tarih bilinciyle bağlanan geniş bir **boy ve millet** çatısını ifade edecek biçimde yaygınlaşmıştır.",
        tag: "Toplum",
      },
    ],
    openQa: [
      {
        title: "Çin kaynaklarında Türkler genellikle nasıl geçer?",
        content:
          "**Tu-küe** (Tujue) adıyla kaydedilir. Bu, Çin merkezli kayıtların kategori ve yazım geleneğine bağlıdır.",
        hint: "Pinyin kökenli bir transkripsiyon",
        tag: "Kaynak",
      },
      {
        title: "“Türk” adı devlet sıfatı olarak hangi çerçevede öne çıkar?",
        content:
          "**Göktürk Kağanlığı** ile birlikte siyasi birlik ve unvan düzeyinde belirginleşir; sonraki Türk devletlerinde kimlik diline katkı sağlar.",
        hint: "VI. yüzyıl ortası",
        tag: "Siyasi tarih",
      },
      {
        title: "Türk adıyla ilişkilendirilen değerler nelerdir?",
        content:
          "Kaynaklarda ve gelenekte **güç**, **disiplin**, **töre** ve **sadakat** gibi unsurlar vurgulanır; ad tek başına soy ispatı değil kültürel bir çerçevedir.",
        tag: "Kültür",
      },
      {
        title: "Orhun yazıtları Türk adı için ne ifade eder?",
        content:
          "Yazıtlar, **Türk milletinin** varlığını ve **tarih bilincini** resmetmesi bakımından önemlidir; dil ve siyaset birlikte işler.",
        hint: "Kültigin, Bilge Kağan",
        tag: "Abide",
      },
    ],
    wordGames: [
      {
        question: "Türk devlet geleneğinde kağanın tanrısal meşruiyetle ilişkilendirilen gücü?",
        answer: "KUT",
        hint: "Kutsal lütuf",
      },
      {
        question: "Türk adı devlet unvanında belirginleştiği kağanlık?",
        answer: "GÖKTÜRK",
        hint: "Kök Türk",
      },
    ],
    mcq: [
      {
        title: "Aşağıdakilerden hangisi “Türk” adının anlamlandırılmasına ilişkin doğru bir çerçevedir?",
        options: [
          "Türk adı yalnızca bir soyadıdır ve hiçbir siyasi birlikle ilişkilendirilmez.",
          "Türk adı; güç, töre ve kimlik çağrışımlarıyla birlikte özellikle Göktürk döneminde devlet unvanı boyutunda belirginleşir.",
          "Türk adı yalnızca Osmanlı arşivlerinde geçer ve Orta Asya ile bağlantısı yoktur.",
          "Türk adı Antik Yunan kolonilerinde kullanılmış bir ticaret terimidir.",
        ],
        correctIndex: 1,
        explanation:
          "Türk adı hem değer yüklü bir kimlik ifadesi hem de Göktürklerle birlikte devlet unvanı düzeyinde güçlenmiştir. Diğer seçenekler dönem ve bağlam olarak hatalıdır.",
        difficulty: "EASY",
      },
      {
        title: "Çin kaynaklarında Türk boylarının adlandırılmasına dair hangisi uygundur?",
        options: [
          "Kayıtlarda genellikle Tu-küe (Tujue) biçiminde geçebilir.",
          "Kayıtlarda yalnızca “Hun” adı kullanılır; Türk diye bir ad yoktur.",
          "Kayıtlarda Türkler her zaman “Mısır” olarak geçer.",
          "Kayıtlarda Türk adı yalnızca deniz ticareti belgelerinde geçer.",
        ],
        correctIndex: 0,
        explanation:
          "Çin merkezli metinlerde Türk boyları çoğunlukla Tu-küe biçiminde kayda geçer. Bu, kaynak türü ve yazım geleneğiyle ilgilidir.",
        difficulty: "MEDIUM",
      },
      {
        title: "Aşağıdakilerden hangisi yanlıştır?",
        options: [
          "Türk adının tek ve değişmez bir sözlük karşılığı olduğu her kaynakta aynı biçimde verilir.",
          "Türk adı kimi anlatılarda güç ve töre ile ilişkilendirilir.",
          "Göktürk dönemi, adın siyasallaşması açısından önem taşır.",
          "Orhun yazıtları Türk tarih bilinci açısından önemlidir.",
        ],
        correctIndex: 0,
        explanation:
          "Anlamlandırma dönem ve kaynağa göre değişebilir; tek ve değişmez bir “sözlük tanımı” iddiası genellikle yanlıştır.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T2]: {
    information: [
      {
        title: "Ana yurt: Orta Asya",
        content:
          "Türklerin tarih sahnesindeki ana yurdu **Orta Asya** bozkır kuşağıdır; **Altay**, **Tanrı Dağları**, **Ötüken** ve **Orhun** çevresi siyasi ve kültürel merkez olarak öne çıkar.",
        tag: "Coğrafya",
      },
      {
        title: "Ötüken ve Orhun",
        content:
          "**Ötüken**, Türk geleneğinde kutsal sayılan siyasi merkez bölgelerinden biridir; **Orhun** vadisi ise yazıtlar ve siyasi otorite merkezleriyle bilinir.",
        tag: "Mekân",
      },
      {
        title: "Bozkır yaşamı",
        content:
          "Geniş otlaklar **konar-göçer** hayvancılığa elverişlidir; bu yaşam biçimi ordu teşkilatı ve boy örgütlenmesini şekillendirmiştir.",
        tag: "Ekonomi",
      },
    ],
    openQa: [
      {
        title: "Türklerin ilk ana yurdu genel olarak neresidir?",
        content: "**Orta Asya** bozkır kuşağı; Altay–Tanrı Dağları–Ötüken–Orhun çevresi merkez kabul edilir.",
        tag: "Coğrafya",
      },
      {
        title: "Ötüken neden özel bir mekân olarak anılır?",
        content:
          "Siyasi otoritenin ve kutsallığın sembolü olarak anlatılır; merkez–taşra ilişkilerinde belirleyici bir **işaret** taşır.",
        tag: "Kültür",
      },
      {
        title: "Bozkır coğrafyası toplumsal düzeni nasıl etkiler?",
        content:
          "Göçebe hayvancılık, **mobil ordu**, **boy birliği** ve **merkezi otorite** arayışını besler.",
        tag: "Toplum",
      },
    ],
    wordGames: [
      { question: "Türk geleneğinde kutsal merkez bölgelerinden biri?", answer: "ÖTÜKEN", hint: "Orhun çevresi" },
      { question: "Türk yazıtlarının bilinen önemli merkezlerinden biri?", answer: "ORHUN", hint: "Nehir vadisi" },
    ],
    mcq: [
      {
        title: "Türklerin ana yurduna ilişkin hangi ifade uygundur?",
        options: [
          "Ana yurt genellikle Orta Asya bozkır kuşağı ve merkez bölgeleriyle ilişkilendirilir.",
          "Ana yurt yalnızca Balkanlar olarak tanımlanır.",
          "Ana yurt yalnızca Mezopotamya çölleridir.",
          "Ana yurt yalnızca Atlas Okyanusu kıyılarıdır.",
        ],
        correctIndex: 0,
        explanation: "KPSS çerçevesinde ana yurt Orta Asya bozkırı ve merkez bölgeleriyle özdeşleştirilir.",
        difficulty: "EASY",
      },
      {
        title: "Aşağıdakilerden hangisi yanlıştır?",
        options: [
          "Orhun vadisi, yazıtlar ve siyasi merkezlerle ilişkilendirilir.",
          "Bozkır yaşamı mobiliteyi ve ordu örgütünü etkiler.",
          "Ötüken bazı anlatılarda siyasi–kültürel merkez sembolüdür.",
          "Türklerin ana yurdu kesin olarak yalnızca İskandinavya’dır.",
        ],
        correctIndex: 3,
        explanation: "İskandinavya iddiası bu ünite bağlamında yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Ötüken ile ilgili hangisi daha uygundur?",
        options: [
          "Bazı metinlerde kutsal ve merkezî bir mekân sembolü olarak geçer.",
          "Roma İmparatorluğu’nun başkentidir.",
          "Yalnızca deniz ticareti limanıdır.",
          "Yalnızca tarım ürünleri müzesidir.",
        ],
        correctIndex: 0,
        explanation: "Ötüken, Türk geleneğinde merkez ve kutsallık sembolü olarak anılır.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T3]: {
    information: [
      {
        title: "Kültür merkezleri",
        content:
          "Orta Asya’da **Anav**, **Afanesyevo**, **Andronovo**, **Karasuk** gibi kültürler sırasıyla farklı dönemlerde metal işçiliği, göç ve sosyal örgütlenme izleri verir.",
        tag: "Arkeoloji",
      },
      {
        title: "Türk öncesi ve Türk dönemi sürekliliği",
        content:
          "Kültür katmanları tek bir “ırk” hikâyesi değil; **uzun süreli yerleşik–yarı göçebe** dinamiklerin üst üste bindiği bir coğrafyayı gösterir.",
        tag: "Yöntem",
      },
      {
        title: "At ve metal",
        content:
          "Bozkırda **at** ve **demir** işçiliği, mobilite ve askerî üstünlük için kritik unsurlar olarak öne çıkar.",
        tag: "Teknoloji",
      },
    ],
    openQa: [
      {
        title: "Orta Asya kültürleri neden parça parça incelenir?",
        content:
          "Farklı dönemlerde farklı kültür katmanları vardır; **arkeoloji** ve **tarih** birlikte okunmalıdır.",
        tag: "Yöntem",
      },
      {
        title: "Andronovo kültürü ile genelde ne ilişkilendirilir?",
        content:
          "Geniş alana yayılan **Bronz Çağı** gelişmeleri ve sonraki göç hareketleriyle ilişkilendirilir (müfredat genel çerçevesi).",
        tag: "Arkeoloji",
      },
      {
        title: "Karasuk kültürü için müfredatta vurgulanan unsur?",
        content:
          "Demir işçiliğine rastlanması ve Orta Asya’daki **teknoloji** birikimiyle ilişkilendirilmesi.",
        tag: "Teknoloji",
      },
    ],
    wordGames: [
      { question: "Orta Asya’da bilinen kültür merkezlerinden biri?", answer: "ANAV", hint: "Neolit–tunç çağı" },
      { question: "Orta Asya arkeolojisinde sık anılan kültür adı?", answer: "ANDRONOVO", hint: "Geniş yayılım" },
    ],
    mcq: [
      {
        title: "Orta Asya kültürleri hakkında hangisi doğrudur?",
        options: [
          "Farklı dönemlerde farklı kültür katmanları bulunur; tek bir homojen kültürden söz etmek zordur.",
          "Orta Asya’da hiçbir kültür yoktur; tamamen boştur.",
          "Orta Asya yalnızca Roma kolonilerinden oluşur.",
          "Orta Asya yalnızca Mısır uygarlığıdır.",
        ],
        correctIndex: 0,
        explanation: "Katmanlı kültür tarihi yaklaşımı doğrudur; diğerleri bağlam dışıdır.",
        difficulty: "EASY",
      },
      {
        title: "Aşağıdakilerden hangisi yanlıştır?",
        options: [
          "Metal işçiliği ve at kültürü bozkır yaşamında önemlidir.",
          "Arkeolojik kültür adları dönemsel sınıflamalardır.",
          "Orta Asya kültürleri bazen göç ve yayılım ile ilişkilendirilir.",
          "Andronovo adı yalnızca modern bir futbol kulübüdür ve tarihle ilgisi yoktur.",
        ],
        correctIndex: 3,
        explanation: "Andronovo arkeolojik kültür adıdır; iddia yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Karasuk kültürü ile ilişkilendirilen gelişme hangisidir?",
        options: [
          "Demir işçiliğine rastlanması.",
          "Piramit inşasının başlaması.",
          "Rönesans’ın başlaması.",
          "Sanayi İnkılabı’nın başlaması.",
        ],
        correctIndex: 0,
        explanation: "Müfredatta Karasuk demir işçiliği ile anılır.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T4]: {
    information: [
      {
        title: "Göçün nedenleri",
        content:
          "**İklim dalgalanmaları**, **otlak baskısı**, **iç çekişmeler**, **komşu imparatorlukların baskısı** ve **ticaret yollarının** değişmesi göçleri tetikleyebilir.",
        tag: "Neden",
      },
      {
        title: "Yönelimler",
        content:
          "Bazı göçler **batıya** (Avrupa’ya doğru), bazıları **güneye** veya **doğuya** farklı boy birlikleri hâlinde gerçekleşmiştir.",
        tag: "Yön",
      },
      {
        title: "Sonuçlar",
        content:
          "Yeni **siyasi oluşumlar**, **kültür temasları** ve **askerî dengelerin** değişmesi göçlerin uzun vadeli sonuçlarıdır.",
        tag: "Sonuç",
      },
    ],
    openQa: [
      {
        title: "Orta Asya Türk göçlerinde hangi dış baskı unsurları sık anılır?",
        content:
          "Çin ve İran gibi **güçlü komşu devletlerin** baskısı ve **ticaret–sınır** politikaları.",
        tag: "Siyaset",
      },
      {
        title: "Göçler yalnızca kaos mudur?",
        content:
          "Hayır; yeni **devletlerin** kurulması, **kültür etkileşimi** ve **askerî yeniden düzen** gibi yapıcı sonuçları da olabilir.",
        tag: "Yorum",
      },
      {
        title: "Bozkır ekonomisi göçle ilişkisini nasıl kurar?",
        content:
          "Otlak ve su kaynaklarına bağlılık, **hareketliliği** ve **rekabeti** artırır.",
        tag: "Ekonomi",
      },
    ],
    wordGames: [
      { question: "Türk boylarının hareketini tarihte genel adı?", answer: "GÖÇ", hint: "Yer değiştirme" },
      { question: "Göçlerin yönlerinden biri sık vurgulanan?", answer: "BATI", hint: "Avrupa" },
    ],
    mcq: [
      {
        title: "Türk göçleriyle ilgili hangisi daha uygundur?",
        options: [
          "Tek bir nedenle açıklanmak yerine iklim, otlak, siyaset ve iç çekişmeler gibi çoklu etkenlerle ele alınır.",
          "Göçler yalnızca gönüllü turizmdir.",
          "Göçler yalnızca deniz yoluyla olur.",
          "Göçler yalnızca tarım için olur ve siyasetle ilgisi yoktur.",
        ],
        correctIndex: 0,
        explanation: "Çok etkenli açıklama müfredat çerçevesine uygundur.",
        difficulty: "EASY",
      },
      {
        title: "Aşağıdakilerden hangisi göçün olası sonucu değildir?",
        options: [
          "Yeni siyasi oluşumların ortaya çıkması.",
          "Kültür temaslarının artması.",
          "Hiçbir zaman yeni devlet kurulmaz.",
          "Askerî dengelerin değişmesi.",
        ],
        correctIndex: 2,
        explanation: "Göçler yeni devletlerin kurulmasına da yol açabilir; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Orta Asya’dan batıya yönelen hareketler tarihte neyle ilişkilendirilir?",
        options: [
          "Kavimler göçü gibi geniş hareketlerle ilişkilendirilebilir.",
          "Yalnızca Antarktika keşfiyle ilişkilendirilir.",
          "Yalnızca Roma cumhuriyetiyle ilişkilendirilir.",
          "Yalnızca Hint okyanusu korsanlığıyla ilişkilendirilir.",
        ],
        correctIndex: 0,
        explanation: "Batıya yönelişler Kavimler göçü çerçevesinde anlatılır.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T5]: {
    information: [
      {
        title: "İskitler (Sakalar)",
        content:
          "İskitler, **İran** bozkırlarında ve çevresinde etkili olan **atlı göçebe** topluluklardandır; **Altın** eserleri ile sanat tarihinde önemlidirler.",
        tag: "Devlet-toplum",
      },
      {
        title: "Asya Hun Devleti",
        content:
          "Geniş bir imparatorluk düzeni kuran **Asya Hunları**, Türk tarihinin **erken siyasi örgütlenme** örneklerindendir; **Mete Han** dönemi askerî teşkilatta öne çıkar.",
        tag: "Siyaset",
      },
      {
        title: "Genel çerçeve",
        content:
          "“İlk Türk devletleri” ifadesi tek tip devlet değil; **boy birlikleri**, **kağanlık geleneği** ve **komşu imparatorluklarla** etkileşimi kapsar.",
        tag: "Tanım",
      },
    ],
    openQa: [
      {
        title: "İskitler hangi yönleriyle bilinir?",
        content:
          "Atlı göçebe yaşam, **İran** bozkırlarında etki ve **sanat eserleri** (Altın eserleri).",
        tag: "Kültür",
      },
      {
        title: "Asya Hun Devleti’nin önemi nedir?",
        content:
          "Erken dönemde **geniş siyasi örgütlenme** ve **askerî teşkilat** örneği sunmasıdır.",
        tag: "Siyaset",
      },
      {
        title: "“İlk Türk devletleri” dendiğinde dikkat edilmesi gereken?",
        content:
          "Kaynakların **kategori**leri ve **devlet–boy** ayrımı; her adı aynı kurumsal modele indirgememek gerekir.",
        tag: "Yöntem",
      },
    ],
    wordGames: [
      { question: "İskitlerin antik kaynaklarda bilinen adı?", answer: "SAKA", hint: "Sakalar" },
      { question: "Asya Hun düzeninde sık anılan hükümdar?", answer: "METE", hint: "Şanyü düzeni" },
    ],
    mcq: [
      {
        title: "İskitler (Sakalar) hakkında hangisi uygundur?",
        options: [
          "İran bozkırlarında ve çevresinde etkili atlı göçebe topluluklardandırlar.",
          "Yalnızca Güney Amerika’da yaşamışlardır.",
          "Yalnızca deniz ticaretiyle uğraşmışlardır ve at kullanmamışlardır.",
          "Roma’nın resmi dilini oluşturmuşlardır.",
        ],
        correctIndex: 0,
        explanation: "İskitler Orta Asya–İran bozkırı bağlamında anlatılır.",
        difficulty: "EASY",
      },
      {
        title: "Asya Hun Devleti ile ilgili hangisi daha doğrudur?",
        options: [
          "Erken dönemde geniş bir siyasi örgütlenme ve güçlü askerî yapı örneği sunar.",
          "Hiçbir zaman devlet kurmamıştır.",
          "Yalnızca 20. yüzyılda kurulmuştur.",
          "Yalnızca Kuzey Kutbu’nda kurulmuştur.",
        ],
        correctIndex: 0,
        explanation: "Hun düzeni erken imparatorluk örneği olarak işlenir.",
        difficulty: "MEDIUM",
      },
      {
        title: "Aşağıdakilerden hangisi yanlıştır?",
        options: [
          "İskitlerin Altın eserleri sanat tarihi açısından önemlidir.",
          "Asya Hunları siyasi örgütlenme açısından anılır.",
          "İskitler yalnızca Roma senatosunun üyesidir.",
          "Bozkır yaşamı at kültürüyle ilişkilidir.",
        ],
        correctIndex: 2,
        explanation: "İskitler Roma senatosuyla özdeşleştirilemez.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T6]: {
    information: [
      {
        title: "Kavimler göçü (395–?)",
        content:
          "Çoğunlukla **MS 4. yüzyıl sonları** ve sonrasında yoğunlaşan büyük **batıya doğru** halk hareketleri, Roma ve Germen dünyasında derin etkiler bırakmıştır.",
        tag: "Kronoloji",
      },
      {
        title: "Hun itici gücü",
        content:
          "Hun baskısı ve **siyasi dengelerin** bozulması, çeşitli **kavimlerin** batıya itilmesinde rol oynar.",
        tag: "Neden",
      },
      {
        title: "Sonuçlar",
        content:
          "**Roma’nın sarsılması**, **yeni krallıkların** doğuşu ve **Avrupa’nın etnik haritasının** değişmesi başlıca sonuçlardır.",
        tag: "Sonuç",
      },
    ],
    openQa: [
      {
        title: "Kavimler göçü hangi geniş sonuçlarla anılır?",
        content:
          "Roma üzerinde baskı, **yeni siyasi yapılar** ve Avrupa’da **etnik–siyasi** yeniden şekillenme.",
        tag: "Sonuç",
      },
      {
        title: "Hunlar bu süreçte nasıl konumlanır?",
        content:
          "Baskı ve **güç dengesi** unsuru olarak batıya doğru hareketleri tetikleyen etkenlerden biri olarak anlatılır.",
        tag: "Aktör",
      },
      {
        title: "Tek sebep yeterli midir?",
        content:
          "Hayır; iklim, iç savaşlar, Hun baskısı ve **Roma’nın zayıflığı** birlikte okunmalıdır.",
        tag: "Yöntem",
      },
    ],
    wordGames: [
      { question: "Büyük halk hareketlerinin genel adı?", answer: "KAVİM", hint: "Boy/topluluk" },
      { question: "Kavimler göçünün baskısıyla sarsılan imparatorluk?", answer: "ROMA", hint: "Kent devletinden imparatorluğa" },
    ],
    mcq: [
      {
        title: "Kavimler göçüyle ilgili hangisi uygundur?",
        options: [
          "Roma ve Avrupa siyasi düzeninde köklü değişimlere yol açmıştır.",
          "Hiçbir kavim hareket etmemiştir.",
          "Yalnızca Pasifik adalarını etkilemiştir.",
          "Yalnızca Çin’i etkilemiştir.",
        ],
        correctIndex: 0,
        explanation: "Avrupa ve Roma bağlamı müfredat vurgusudur.",
        difficulty: "EASY",
      },
      {
        title: "Aşağıdakilerden hangisi olası bir etkendir?",
        options: [
          "Hun baskısı ve siyasi dengelerin bozulması.",
          "Ay’ın yüzeyinde tarım reformu.",
          "Antarktika sıcaklık dalgası.",
          "Sanayi İnkılabı’nın başlaması.",
        ],
        correctIndex: 0,
        explanation: "Hun baskısı klasik anlatıda etken olarak geçer.",
        difficulty: "MEDIUM",
      },
      {
        title: "Hangi ifade yanlıştır?",
        options: [
          "Kavimler göçü tek günde ve tek nedenden oluşmuştur.",
          "Yeni krallıkların doğuşu görülebilir.",
          "Roma üzerinde baskı artabilir.",
          "Etnik harita değişebilir.",
        ],
        correctIndex: 0,
        explanation: "Tek gün/tek neden iddiası indirgemeci ve yanlıştır.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T7]: {
    information: [
      {
        title: "Kuruluş (552)",
        content:
          "**552**’de **Bumin Kağan** önderliğinde kurulan devlet, **Rouran** egemenliğine son vererek **Göktürk** siyasi geleneğini başlatır.",
        tag: "Tarih",
      },
      {
        title: "Doğu–Batı kolu",
        content:
          "Daha sonra **doğu** ve **batı** kollarına ayrılan yapı, sınır ve ittifak politikalarını etkiler.",
        tag: "Siyaset",
      },
      {
        title: "Çin ile ilişkiler",
        content:
          "Göktürkler, **Çin** ile **ittifak ve çatışma** dönemleri yaşar; bu ilişkiler sınır ve ticaret üzerinden şekillenir.",
        tag: "Diplomasi",
      },
      {
        title: "Orhun yazıtları",
        content:
          "**Kültigin** ve **Bilge Kağan** yazıtları, Türk tarih bilinci ve dil eseri olarak temel kaynaklardandır.",
        tag: "Abide",
      },
    ],
    openQa: [
      {
        title: "Göktürk Devleti hangi olayla kurulur?",
        content:
          "**552**’de **Bumin Kağan**’ın Rouran egemenliğine son vermesiyle kurulduğu anlatılır.",
        tag: "Tarih",
      },
      {
        title: "Orhun yazıtları neyi yansıtır?",
        content:
          "Siyasi olayları, **Türk milleti** bilincini ve **dil** özelliklerini yansıtan önemli **Türkçe** metinlerdir.",
        tag: "Dil",
      },
      {
        title: "Doğu–Batı ayrımı neyi etkiler?",
        content:
          "Siyasi merkezler, **ittifaklar** ve **sınır politikaları** farklılaşabilir.",
        tag: "Siyaset",
      },
    ],
    wordGames: [
      { question: "Göktürkleri kuran kağan?", answer: "BUMİN", hint: "552" },
      { question: "Orhun yazıtlarından birinin kahramanı?", answer: "KÜLTİGİN", hint: "Yazıt adı" },
    ],
    mcq: [
      {
        title: "Göktürk Devleti’nin kuruluşu ile ilgili hangisi uygundur?",
        options: [
          "552’de Bumin Kağan ile Rouran egemenliğine son verilmesi anlatılır.",
          "1453’te kurulmuştur.",
          "1923’te kurulmuştur.",
          "Antik Yunan kolonisi olarak kurulmuştur.",
        ],
        correctIndex: 0,
        explanation: "Kuruluş tarihi ve aktör müfredat bilgisidir.",
        difficulty: "EASY",
      },
      {
        title: "Orhun yazıtları için hangisi doğrudur?",
        options: [
          "Türk tarih bilinci ve Türkçe metin geleneği açısından önemlidir.",
          "Hiç yazı taşımazlar.",
          "Yalnızca Latin alfabesiyle yazılmıştır.",
          "Yalnızca deniz hukuku içerir.",
        ],
        correctIndex: 0,
        explanation: "Orhun yazıtları temel Türkçe ve tarih bilinci kaynağıdır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Aşağıdakilerden hangisi yanlıştır?",
        options: [
          "Göktürkler hiçbir zaman Çin ile etkileşmemiştir.",
          "Doğu ve batı kolu ayrımı yaşanmıştır.",
          "Bumin Kağan kuruluşla ilişkilendirilir.",
          "Yazıtlar önemli kaynaklardandır.",
        ],
        correctIndex: 0,
        explanation: "Çin ile ittifak/çatışma dönemleri vardır; seçenek yanlıştır.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T8]: {
    information: [
      {
        title: "Asya Hun İmparatorluğu",
        content:
          "Başlık müfredatta bazı kaynaklarda **Mete Han dönemi** olarak geçer; burada **Asya Hun** düzeninin **şanyü** merkezli askerî teşkilatı işlenir.",
        tag: "Bağlam",
      },
      {
        title: "Mete Han (Örnek: Modu Chanyu)",
        content:
          "Hun düzeninde **merkezi otoriteyi** güçlendiren ve **onlu ordu** düzenini öne çıkaran önemli bir hükümdar olarak anlatılır.",
        tag: "Figür",
      },
      {
        title: "Onlu sistem",
        content:
          "**Onlu** askerî düzen, disiplin ve komuta zincirinde önemli bir **Göktürk öncesi** askerî miras olarak da hatırlanır.",
        tag: "Askerî",
      },
    ],
    openQa: [
      {
        title: "Mete Han döneminde askerî düzen nasıl anlatılır?",
        content:
          "**Onlu sistem** ve merkezi komuta ile güçlü bir **şanyü** otoritesi vurgulanır.",
        tag: "Askerî",
      },
      {
        title: "Hun devleti hangi geniş coğrafyayla ilişkilendirilir?",
        content:
          "Orta Asya bozkırlarından **Çin** sınırına kadar uzanan geniş bir **imparatorluk** düzeni.",
        tag: "Coğrafya",
      },
      {
        title: "Bu başlık Göktürklerle nasıl bağlanır?",
        content:
          "Erken Türk devlet geleneğinde **askerî teşkilat** ve **kağanlık** izleri açısından karşılaştırmalı okunur.",
        tag: "Karşılaştırma",
      },
    ],
    wordGames: [
      { question: "Hun merkez otoritesinin başı unvanı?", answer: "ŞANYÜ", hint: "Hükümdar" },
      { question: "Hun askerî teşkilatı ve sefer düzeni?", answer: "ORDU", hint: "Kuruluş" },
    ],
    mcq: [
      {
        title: "Mete Han dönemi ile ilgili hangisi uygundur?",
        options: [
          "Asya Hun düzeninde merkezi askerî teşkilat ve onlu düzen vurgulanır.",
          "Mete Han bir Roma imparatorudur.",
          "Hunlar yalnızca deniz kuvvetlerinden oluşur.",
          "Onlu sistem hiç yoktur.",
        ],
        correctIndex: 0,
        explanation: "Hun askerî teşkilatı müfredatın çekirdeğidir.",
        difficulty: "EASY",
      },
      {
        title: "Aşağıdakilerden hangisi yanlıştır?",
        options: [
          "Hun devleti yalnızca Güney Kutbu’nda kurulmuştur.",
          "Şanyü merkez otorite figürüdür.",
          "Onlu düzen askerî disiplinle ilişkilendirilir.",
          "Çin ile çatışmalar anlatılır.",
        ],
        correctIndex: 0,
        explanation: "Hun düzeni Orta Asya–Doğu bağlamındadır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Mete Han ile ilişkilendirilen askerî yenilik hangisidir?",
        options: [
          "Onlu düzen ve merkezi komuta çizgisi.",
          "Uçak gemisi kullanımı.",
          "Tank üretimi.",
          "Rönesans mimarisi.",
        ],
        correctIndex: 0,
        explanation: "Onlu sistem klasik Hun anlatısıdır.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T10]: {
    information: [
      {
        title: "Kuruluş ve yerleşme",
        content:
          "Uygurlar, **744** sonrası süreçte **Göktürk egemenliğinin** zayıflamasıyla **Orhun** çevresinde güçlenir ve daha sonra **yerleşik** hayata geçişle bilinir.",
        tag: "Tarih",
      },
      {
        title: "Maniheizm",
        content:
          "Uygur devletinde **Mani dininin** resmî din olması, kültür ve yazı hayatında önemli dönüşümler yaratır.",
        tag: "Din",
      },
      {
        title: "Kültür mirası",
        content:
          "**Uygur harfleri** ve **edebî–dinsel** metin üretimi, sonraki dönemlere etki eder.",
        tag: "Kültür",
      },
    ],
    openQa: [
      {
        title: "Uygur Devleti hangi dinî tercihle öne çıkar?",
        content:
          "**Maniheizm**’in devlet çapında yaygınlaşması ve resmî din olması.",
        tag: "Din",
      },
      {
        title: "Yerleşik hayata geçiş ne anlama gelir?",
        content:
          "Şehirleşme, **tarım–ticaret** ağırlığı ve **idarî** yapıların güçlenmesi.",
        tag: "Toplum",
      },
      {
        title: "Uygurların yazı ve kültür katkısı?",
        content:
          "**Uygur harfleri** ve metin geleneği, özellikle **İslam sonrası** yazı sistemleriyle etkileşimi açısından anılır.",
        tag: "Yazı",
      },
    ],
    wordGames: [
      { question: "Uygur devletinde yaygınlaşan din?", answer: "MANİ", hint: "Peygamber adı" },
      { question: "Uygurların bilinen yazı kültürü?", answer: "UYGUR", hint: "Harf geleneği" },
    ],
    mcq: [
      {
        title: "Uygur Devleti ile ilgili hangisi doğrudur?",
        options: [
          "Mani dininin devlet çapında önem kazanması ve yerleşik hayata geçişle anılır.",
          "Hiçbir dinî tercih yoktur.",
          "Yalnızca Hristiyanlık vardır ve başka din yoktur.",
          "Uygurlar Atlantik’te kurulmuştur.",
        ],
        correctIndex: 0,
        explanation: "Maniheizm ve yerleşikleşme Uygur anlatısının özüdür.",
        difficulty: "EASY",
      },
      {
        title: "Aşağıdakilerden hangisi yanlıştır?",
        options: [
          "Uygur harfleri kültür tarihinde hiç etki bırakmamıştır.",
          "Uygurlar Göktürk sonrası süreçte güçlenir.",
          "Yerleşik hayat tarafı vardır.",
          "Maniheizm resmî din olarak anılır.",
        ],
        correctIndex: 0,
        explanation: "Uygur harfleri etkili bir yazı geleneği olarak anılır; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "744 civarı genel çerçeve hangisidir?",
        options: [
          "Göktürk egemenliğinde zayıflama ve Uygurların güçlenmesi.",
          "Roma’nın kuruluşu.",
          "Fransız İhtilali.",
          "I. Dünya Savaşı.",
        ],
        correctIndex: 0,
        explanation: "744 civarı Göktürk–Uygur geçişi bağlamında işlenir.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T11]: {
    information: [
      {
        title: "Hazar Kağanlığı",
        content:
          "**Hazarlar**, **Kafkas** ve **Hazar Denizi** çevresinde güçlü bir **kağanlık** kurarak **İpek Yolu** ve **sınır politikaları** açısından önemlidir.",
        tag: "Devlet",
      },
      {
        title: "Kıpçaklar",
        content:
          "**Kıpçaklar (Kumanlar)**, geniş bozkırda etkili bir **konfederasyon** olarak Orta Çağ Avrupa siyasetine etki eder.",
        tag: "Boy",
      },
      {
        title: "Peçenek ve Oğuzlar",
        content:
          "**Peçenekler** ve **Oğuzlar**, Balkanlar ve Orta Doğu’ya yönelen hareketlerde önemli roller taşır.",
        tag: "Göç",
      },
    ],
    openQa: [
      {
        title: "Hazarlar neden önemlidir?",
        content:
          "Ticaret yolları, **din politikaları** (Yahudilik’in kağanlıkta etkisi anlatıları) ve **bölgesel güç** dengeleri açısından.",
        tag: "Siyaset",
      },
      {
        title: "Kıpçaklar hangi coğrafyayla ilişkilendirilir?",
        content:
          "Geniş **step** ve **Doğu Avrupa**–**Kafkas** hattı boyunca.",
        tag: "Coğrafya",
      },
      {
        title: "Oğuzların yönü?",
        content:
          "Anadolu ve **İslam dünyası** içinde **beylik ve devlet** kuruluşlarıyla devam eden süreçlere bağlanır.",
        tag: "Tarih",
      },
    ],
    wordGames: [
      { question: "Kafkas ve Hazar denizi çevresinde güçlü kağanlık?", answer: "HAZAR", hint: "Kağanlık" },
      { question: "Bozkırda Kuman adıyla da anılan topluluk?", answer: "KIPÇAK", hint: "Konfederasyon" },
    ],
    mcq: [
      {
        title: "Hazar Kağanlığı ile ilgili hangisi uygundur?",
        options: [
          "Kafkas ve Hazar çevresinde güçlü bir devlet olarak anılır.",
          "Pasifik’te kurulmuştur.",
          "Hiç ticaret yolu yoktur.",
          "Yalnızca Antik Yunan şehir devletidir.",
        ],
        correctIndex: 0,
        explanation: "Hazarlar bölgesel güç ve ticaret bağlamında işlenir.",
        difficulty: "EASY",
      },
      {
        title: "Kıpçaklar hakkında hangisi doğrudur?",
        options: [
          "Kuman adıyla da bilinirler ve geniş bozkırda etkilidirler.",
          "Yalnızca Kuzey Kutbu’nda yaşarlar.",
          "Roma senatosunu oluştururlar.",
          "Hiçbir zaman göç etmezler.",
        ],
        correctIndex: 0,
        explanation: "Kıpçak–Kuman özdeşlemesi müfredatta geçer.",
        difficulty: "MEDIUM",
      },
      {
        title: "Aşağıdakilerden hangisi yanlıştır?",
        options: [
          "Peçenekler ve Oğuzlar tarihte hiç rol oynamamıştır.",
          "Oğuzlar sonraki süreçlerde önemlidir.",
          "Hazarlar ticaret ve siyasette önemlidir.",
          "Kıpçaklar geniş alanda etkilidir.",
        ],
        correctIndex: 0,
        explanation: "Peçenek ve Oğuzlar önemli roller taşır; seçenek yanlıştır.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T12]: {
    information: [
      {
        title: "Kültür ve uygarlık",
        content:
          "İslamiyet öncesi Türk kültürü; **din**, **hukuk**, **sanat**, **askerî teşkilat** ve **yazı** unsurlarının bir arada okunmasını gerektirir.",
        tag: "Çerçeve",
      },
      {
        title: "Süreklilik",
        content:
          "Bozkır geleneği, **İslam sonrası** bazı kurum ve adetlerde **izler** bırakır; ancak dönüşümler de büyüktür.",
        tag: "Tarih",
      },
    ],
    openQa: [
      {
        title: "Kültür–uygarlık ayrımı nasıl düşünülmeli?",
        content:
          "Uygarlık; yazı, şehirleşme, din ve kurumların **birlikte** değerlendirilmesidir.",
        tag: "Kavram",
      },
      {
        title: "Tek başlık yeterli mi?",
        content:
          "Hayır; **devlet**, **ordu**, **din** ve **ekonomi** birlikte ele alınmalıdır.",
        tag: "Yöntem",
      },
    ],
    wordGames: [
      { question: "Türk geleneğinde yazılı hukuk kurallarına verilen ad?", answer: "TÖRE", hint: "Gelenek" },
      { question: "Kültür ve uygarlık birlikte oluşturduğu kavram?", answer: "MİLLET", hint: "Ortak kültür" },
    ],
    mcq: [
      {
        title: "Kültür ve uygarlık ünitesi hangi yaklaşımı gerektirir?",
        options: [
          "Birden fazla alanı (din, hukuk, sanat, ordu) birlikte okumayı.",
          "Yalnızca savaşları.",
          "Yalnızca denizleri.",
          "Yalnızca matematiği.",
        ],
        correctIndex: 0,
        explanation: "Bütüncül okuma müfredat ilkesidir.",
        difficulty: "EASY",
      },
      {
        title: "Hangisi yanlıştır?",
        options: [
          "İslamiyet öncesi Türk kültürü hiçbir iz bırakmamıştır.",
          "Kurumlar ve adetler zaman içinde dönüşür.",
          "Bozkır yaşamı kültürü şekillendirmiştir.",
          "Yazı ve din unsurları önemlidir.",
        ],
        correctIndex: 0,
        explanation: "Kültürel süreklilik iddiası yanlıştır; izler vardır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Uygarlık için hangi bileşen uygundur?",
        options: [
          "Kurumsallaşma ve kültürel üretim.",
          "Yalnızca mağara resmi.",
          "Yalnızca balıkçılık.",
          "Yalnızca futbol.",
        ],
        correctIndex: 0,
        explanation: "Kurum ve kültürel üretim uygarlık çerçevesidir.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T13]: {
    information: [
      {
        title: "Kağanlık",
        content:
          "En üst **hükümdar** unvanı **kağan**dır; **kut** anlayışıyla meşruiyet kurulur.",
        tag: "Siyaset",
      },
      {
        title: "Kurultay",
        content:
          "**Kurultay**, önemli siyasi kararlarda **boy temsilcilerinin** bir araya gelmesiyle anılır.",
        tag: "Kurum",
      },
      {
        title: "Yabgu ve teşkilat",
        content:
          "**Yabgu**, **şad** gibi unvanlar bölgesel ve idari roller taşır; merkez–taşra ilişkisini gösterir.",
        tag: "İdare",
      },
    ],
    openQa: [
      {
        title: "Kut ne anlama gelir?",
        content:
          "Kağanın **tanrısal lütuf** ile tahtta olduğu inancı; meşruiyetin temelidir.",
        tag: "İnanç",
      },
      {
        title: "Kurultayın işlevi?",
        content:
          "Savaş–barış gibi büyük kararlarda **danışma ve karar** mekanizması.",
        tag: "Kurum",
      },
      {
        title: "Merkez–taşra nasıl düşünülür?",
        content:
          "Yabgu ve benzeri unvanlar **bölgesel yönetim** izleri taşır.",
        tag: "İdare",
      },
    ],
    wordGames: [
      { question: "Türk devletinde en üst hükümdar unvanı?", answer: "KAĞAN", hint: "Taht" },
      { question: "Boy temsilcilerinin büyük kurultayı?", answer: "KURULTAY", hint: "Toplantı" },
    ],
    mcq: [
      {
        title: "Kağanlık düzeni ile ilgili hangisi doğrudur?",
        options: [
          "Kağan, kut anlayışıyla meşruiyet kuran üst hükümdardır.",
          "Kağan yalnızca köy muhtarıdır.",
          "Kut hiçbir anlam taşımaz.",
          "Kurultay hiç toplanmaz.",
        ],
        correctIndex: 0,
        explanation: "Kağan ve kut merkezî kavramlardır.",
        difficulty: "EASY",
      },
      {
        title: "Hangisi yanlıştır?",
        options: [
          "Yabgu unvanı hiç yoktur ve tarihte geçmez.",
          "Kurultay önemli kararlarda anılır.",
          "Kağan üst otoritedir.",
          "Merkez–taşra ilişkisi vardır.",
        ],
        correctIndex: 0,
        explanation: "Yabgu unvanı tarihte geçer; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Kurultay için en uygun ifade?",
        options: [
          "Boy temsilcilerinin bir araya gelerek büyük kararları müzakere ettiği kurum olarak anlatılır.",
          "Roma senatosunun aynısıdır ve birebir kopyasıdır.",
          "Yalnızca eğlence şenliğidir.",
          "Yalnızca tarım fuarıdır.",
        ],
        correctIndex: 0,
        explanation: "Kurultay siyasi danışma/karar mekanizmasıdır.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T14]: {
    information: [
      {
        title: "Onlu sistem",
        content:
          "Ordu **on** tabur/ölçü birimine bölünür; komuta zinciri ve disiplin için uygundur.",
        tag: "Teşkilat",
      },
      {
        title: "Süvari ağırlığı",
        content:
          "Bozkır şartlarında **süvari** ve **ok–yay** taktikleri temeldir.",
        tag: "Taktik",
      },
    ],
    openQa: [
      {
        title: "Onlu sistemin faydası?",
        content:
          "Komuta, seferberlik ve **disiplin** için pratik bir bölünme sağlar.",
        tag: "Askerî",
      },
      {
        title: "Türk ordusunda atın yeri?",
        content:
          "Hareket kabiliyeti ve **lojistik** açısından merkezîdir.",
        tag: "Lojistik",
      },
    ],
    wordGames: [
      { question: "Hun ve Türk askerî düzeninde bilinen bölünme?", answer: "ONLU", hint: "10" },
      { question: "Bozkır savaşının temel silahı?", answer: "YAY", hint: "Ok ile" },
    ],
    mcq: [
      {
        title: "Ordu yapılanması ile ilgili hangisi uygundur?",
        options: [
          "Onlu düzen ve süvari ağırlığı öne çıkar.",
          "Hiç süvari yoktur.",
          "Yalnızca filo vardır.",
          "Yalnızca piyade vardır ve at yoktur.",
        ],
        correctIndex: 0,
        explanation: "Onlu düzen ve süvari müfredat vurgusudur.",
        difficulty: "EASY",
      },
      {
        title: "Hangisi yanlıştır?",
        options: [
          "Ok–yay taktikleri bozkırda hiç önemli değildir.",
          "At stratejik önem taşır.",
          "Onlu sistem anlatılır.",
          "Disiplin önemlidir.",
        ],
        correctIndex: 0,
        explanation: "Ok–yay bozkır savaşında kritiktir; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Süvarinin üstünlüğü hangi koşulla ilişkilendirilir?",
        options: [
          "Geniş otlak ve hareket alanı.",
          "Dar sokak ve sürekli kuşatma.",
          "Okyanus fırtınaları.",
          "Buzullar.",
        ],
        correctIndex: 0,
        explanation: "Bozkır coğrafyası süvariyi destekler.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T15]: {
    information: [
      {
        title: "Gök Tanrı inancı",
        content:
          "Gökyüzü tanrısı inancı, **tek tanrı** çerçevesinde düşünülür ve **doğa** ile **gökyüzü** ritüelleriyle ilişkilendirilir.",
        tag: "İnanç",
      },
      {
        title: "Kut",
        content:
          "Kağanın **kutsal meşruiyeti** kut ile açıklanır.",
        tag: "Siyaset-din",
      },
      {
        title: "Şamanizm unsurları",
        content:
          "Bazı ritüellerde **şaman** aracılığıyla ruh dünyası ile iletişim kurulduğu anlatılır.",
        tag: "Ritüel",
      },
    ],
    openQa: [
      {
        title: "Gök Tanrı inancının özü?",
        content:
          "Gökyüzüne yönelik **tek** ve **üstün** bir ilah anlayışı.",
        tag: "İnanç",
      },
      {
        title: "Kut ve siyaset ilişkisi?",
        content:
          "Kağanın iktidarı **dinsel meşruiyet** ile bağlanır.",
        tag: "Meşruiyet",
      },
      {
        title: "Yer altı–su ruhları anlatıları?",
        content:
          "Doğa unsurlarıyla ilişkili **inanç** katmanları anlatılır.",
        tag: "Mit",
      },
    ],
    wordGames: [
      { question: "Ritüellerde ruhlar âlemiyle aracı kişi?", answer: "ŞAMAN", hint: "Şamanizm" },
      { question: "Gök Tanrı inancında gökyüzü tanrısı adı?", answer: "TENGRİ", hint: "Eski Türkçe köken" },
    ],
    mcq: [
      {
        title: "Gök Tanrı inancı ile ilgili hangisi uygundur?",
        options: [
          "Gökyüzüne yönelik üstün bir ilah anlayışı ve ritüellerle desteklenen bir inanç sistemidir.",
          "Yalnızça politeizmde çok tanrı eşitliği vardır ve hiçbir üstün ilah yoktur.",
          "Yalnızca Mısır firavunlarına özgüdür.",
          "Yalnızca Antik Yunan mitolojisine özgüdür.",
        ],
        correctIndex: 0,
        explanation: "Gök Tanrı inancı üstün ilah ve gökyüzü merkezli bir çerçevedir.",
        difficulty: "EASY",
      },
      {
        title: "Kut kavramı neyi ifade eder?",
        options: [
          "Kağanın tahtta olmasının dinsel–siyasal meşruiyetini.",
          "Yalnızca vergi mükellefiyetini.",
          "Yalnızca tarım takvimini.",
          "Yalnızca denizcilik rutbesini.",
        ],
        correctIndex: 0,
        explanation: "Kut, kağanın kutsal meşruiyetidir.",
        difficulty: "MEDIUM",
      },
      {
        title: "Aşağıdakilerden hangisi yanlıştır?",
        options: [
          "Şaman unsurları bazı ritüellerde hiç anılmaz.",
          "Doğa ve ruh dünyası anlatıları vardır.",
          "Gök Tanrı inancı önemlidir.",
          "Kut siyasetle ilişkilendirilir.",
        ],
        correctIndex: 0,
        explanation: "Şaman unsurları müfredatta ritüel bağlamında anılır; seçenek yanlıştır.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T16]: {
    information: [
      {
        title: "Töre",
        content:
          "Toplumsal yaşamı düzenleyen **yazısız** kurallar bütünü **töre** olarak adlandırılır; **kan davaları**, **misafirperverlik** ve **intikam** gibi başlıkları kapsar.",
        tag: "Hukuk",
      },
      {
        title: "Adet hukuku",
        content:
          "Resmî yazılı kanunlar kadar **örf ve adet** de uygulanır; bozkırda **söz** ve **ant** kutsal sayılabilir.",
        tag: "Örf",
      },
    ],
    openQa: [
      {
        title: "Töre ile modern yazılı hukuk farkı?",
        content:
          "Töre çoğunlukla **sözlü gelenek** ve **toplumsal baskı** ile işler; yazılı kodifikasyon farklıdır.",
        tag: "Karşılaştırma",
      },
      {
        title: "Kan davası neyi gösterir?",
        content:
          "Ailenin ve boyun **onur**unu koruma mekanizması olarak işleyen bir **hukuk** pratiğidir.",
        tag: "Toplum",
      },
    ],
    wordGames: [
      { question: "Yazısız örf ve adet kuralları?", answer: "ÖRF", hint: "Gelenek" },
      { question: "Töre ihlallerinde uygulanan yaptırım?", answer: "CEZA", hint: "Yaptırım" },
    ],
    mcq: [
      {
        title: "Töre hakkında hangisi doğrudur?",
        options: [
          "Yazısız geleneksel kurallar bütünü olarak anlatılır ve toplumsal hayatı düzenler.",
          "Yalnızca Roma hukukudur.",
          "Yalnızca deniz hukukudur.",
          "Hiçbir ceza yoktur.",
        ],
        correctIndex: 0,
        explanation: "Töre yazısız hukuk geleneğidir.",
        difficulty: "EASY",
      },
      {
        title: "Hangisi yanlıştır?",
        options: [
          "Töre ile ilgili hiçbir uygulama yoktur.",
          "Misafirperverlik törede önemlidir.",
          "Ant ve söz kutsal sayılabilir.",
          "Kan davaları anlatılabilir.",
        ],
        correctIndex: 0,
        explanation: "Töre uygulamaları vardır; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Adet hukuku için hangisi uygundur?",
        options: [
          "Örf ve adet kurallarının töre ile birlikte işlemesi.",
          "Yalnızca bilgisayar kodları.",
          "Yalnızca deniz sigortası.",
          "Yalnızca futbol kuralları.",
        ],
        correctIndex: 0,
        explanation: "Örf–adet ve töre birlikte düşünülür.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T17]: {
    information: [
      {
        title: "Aile ve boy",
        content:
          "**Aile** temel birimdir; daha geniş **boy** bağları siyasi ve askerî dayanışmayı sağlar.",
        tag: "Yapı",
      },
      {
        title: "Kadın–erkek rolleri",
        content:
          "Töre içinde **miras**, **evlilik** ve **intikam** gibi konularda roller farklılaşabilir.",
        tag: "Toplum",
      },
    ],
    openQa: [
      {
        title: "Boy birliği ne işe yarar?",
        content:
          "Savaş, göç ve **dayanışma** için geniş ağ oluşturur.",
        tag: "Siyaset",
      },
      {
        title: "Misafirperverlik neden önemlidir?",
        content:
          "Bozkırda **güven** ve **itibar** ağlarını güçlendirir.",
        tag: "Ahlak",
      },
    ],
    wordGames: [
      { question: "Geniş akrabalık ve dayanışma birimi?", answer: "BOY", hint: "Üst kimlik" },
      { question: "Törede konuk koruma ilkesi?", answer: "MİSAFİR", hint: "Konuk" },
    ],
    mcq: [
      {
        title: "Sosyal hayat ile ilgili hangisi uygundur?",
        options: [
          "Aile ve boy örgütlenmesi dayanışma ve siyasi birlik için önemlidir.",
          "Boy diye bir kavram yoktur.",
          "Hiç evlilik yoktur.",
          "Töre sosyal hayatı ilgilendirmez.",
        ],
        correctIndex: 0,
        explanation: "Boy ve aile temel yapıdır.",
        difficulty: "EASY",
      },
      {
        title: "Hangisi yanlıştır?",
        options: [
          "Misafirperverlik törede hiç önemli değildir.",
          "Boy birliği savaşta dayanışma sağlayabilir.",
          "Aile temel birimdir.",
          "Roller törede farklılaşabilir.",
        ],
        correctIndex: 0,
        explanation: "Misafirperverlik önemlidir; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Kadın–erkek rolleri konusunda hangisi doğrudur?",
        options: [
          "Miras ve evlilik gibi konularda töre kuralları farklılık gösterebilir.",
          "Her zaman modern medeni kanunla aynıdır.",
          "Hiç kural yoktur.",
          "Yalnızca Roma hukukuna göredir.",
        ],
        correctIndex: 0,
        explanation: "Töre içi roller dönem ve boya göre değişebilir.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T18]: {
    information: [
      {
        title: "Hayvancılık",
        content:
          "Bozkırda **koyun**, **sığır**, **at** gibi hayvanlar geçim ve **ticaret** için temeldir.",
        tag: "Ekonomi",
      },
      {
        title: "Ticaret yolları",
        content:
          "**İpek Yolu** ve **kervan** ticareti, el sanatları ve **kentsel** pazarlarla birleşir.",
        tag: "Ticaret",
      },
    ],
    openQa: [
      {
        title: "Tarım neden sınırlıdır?",
        content:
          "İklim ve otlak ekonomisi **hayvancılığı** öne çıkarır.",
        tag: "Coğrafya",
      },
      {
        title: "Ganimet ekonomisi?",
        content:
          "Savaş **ganimeti** ve **vergi** boyları toplumsal düzeni besler.",
        tag: "Siyasi ekonomi",
      },
    ],
    wordGames: [
      { question: "Bozkırda başlıca geçim dalı?", answer: "HAYVAN", hint: "İthalat değil" },
      { question: "Ticaret yolu olarak anılan ünlü rota?", answer: "İPEK", hint: "Yol" },
    ],
    mcq: [
      {
        title: "Ekonomik hayat ile ilgili hangisi uygundur?",
        options: [
          "Hayvancılık ve kervan ticareti önemli geçim kaynaklarıdır.",
          "Hiç hayvan yoktur.",
          "Ticaret yolları yoktur.",
          "Yalnızca balıkçılık vardır.",
        ],
        correctIndex: 0,
        explanation: "Hayvancılık ve ticaret bozkır ekonomisinin temelidir.",
        difficulty: "EASY",
      },
      {
        title: "Hangisi yanlıştır?",
        options: [
          "İpek Yolu hiçbir zaman tarihte yoktur.",
          "Kervan ticareti anlatılır.",
          "Hayvancılık önemlidir.",
          "El sanatları ticarete katılır.",
        ],
        correctIndex: 0,
        explanation: "İpek Yolu tarihî ticaret yoludur; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Ganimetin işlevi?",
        options: [
          "Savaş ve fetihlerde toplumsal kaynak aktarımı sağlayabilir.",
          "Yalnızca müzik notasıdır.",
          "Yalnızca deniz feneridir.",
          "Yalnızca tarım aletidir.",
        ],
        correctIndex: 0,
        explanation: "Ganimet ekonomisi ve siyasetle ilgilidir.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T19]: {
    information: [
      {
        title: "Göktürk alfabesi",
        content:
          "Göktürkler, **4 köşeli** harflerle yazılmış **alfabe** kullanır; Orhun ve Yenisey yazıtları bu geleneğin örnekleridir.",
        tag: "Yazı",
      },
      {
        title: "Orhun yazıtları",
        content:
          "**Kültigin** ve **Bilge Kağan** yazıtları hem tarih hem **dil** bilimi için temeldir.",
        tag: "Abide",
      },
      {
        title: "Sözlü edebiyat",
        content:
          "Destan ve **sözlü** anlatı geleneği, yazı öncesi kültür aktarımı için önemlidir.",
        tag: "Edebiyat",
      },
    ],
    openQa: [
      {
        title: "Yenisey yazıtları neyi temsil eder?",
        content:
          "Erken dönem **Türk yazı** geleneğinin önemli bir koludur.",
        tag: "Arkeoloji",
      },
      {
        title: "Göktürk alfabesinin özelliği?",
        content:
          "Harflerin **köşeli** yapısı ve **süsten** yazı yazma geleneği.",
        tag: "Paleografi",
      },
    ],
    wordGames: [
      { question: "Erken Türk yazı geleneğinin kollarından biri?", answer: "YENİSEY", hint: "Sibirya ırmağı" },
      { question: "Orhun yazıtlarından bir kağan adı?", answer: "BİLGE", hint: "Kağan" },
    ],
    mcq: [
      {
        title: "Yazı, dil ve edebiyat ünitesinde hangisi doğrudur?",
        options: [
          "Orhun yazıtları Türkçe ve tarih bilinci açısından temel kaynaklardandır.",
          "Hiç yazı yoktur.",
          "Yalnızca Latin alfabesiyle yazılmıştır.",
          "Yalnızca Arap alfabesiyle yazılmıştır.",
        ],
        correctIndex: 0,
        explanation: "Orhun yazıtları temel Türkçe metinlerdir.",
        difficulty: "EASY",
      },
      {
        title: "Hangisi yanlıştır?",
        options: [
          "Göktürk alfabesi hiç kullanılmamıştır.",
          "Yenisey yazıtları erken yazı geleneğine örnektir.",
          "Sözlü edebiyat kültür aktarımı sağlar.",
          "Kültigin yazıtı anılır.",
        ],
        correctIndex: 0,
        explanation: "Göktürk alfabesi kullanılmıştır; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Sözlü edebiyatın işlevi?",
        options: [
          "Yazı öncesi dönemde kültür ve tarih aktarımı.",
          "Yalnızca deniz haritası çizmek.",
          "Yalnızca banka hesabı tutmak.",
          "Yalnızca radyo frekansı.",
        ],
        correctIndex: 0,
        explanation: "Sözlü gelenek kültür aktarımı için önemlidir.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T20]: {
    information: [
      {
        title: "Destan türü",
        content:
          "Destanlar; **kahramanlık**, **millet** bilinci ve **mit** unsurlarını birleştirir.",
        tag: "Tür",
      },
      {
        title: "Oğuz Kağan Destanı",
        content:
          "Geniş coğrafyada bilinen **Oğuz** kahramanlık anlatısı, boy birliği ve **devlet** kurma temalarını içerir.",
        tag: "Örnek",
      },
    ],
    openQa: [
      {
        title: "Destanlar tarih yazımı mıdır?",
        content:
          "Doğrudan **tarih** kaynağı değil; **mit**, **kimlik** ve **değer** aktarımı içerir.",
        tag: "Yöntem",
      },
      {
        title: "Dede Korkut hikâyeleri hangi geleneğe bağlanır?",
        content:
          "Oğuzlarla ilişkili **sözlü** anlatı geleneğine ve sonraki dönemde yazıya geçişe.",
        tag: "Edebiyat",
      },
    ],
    wordGames: [
      { question: "Kahramanlık ve mit anlatısı türü?", answer: "DESTAN", hint: "Epik" },
      { question: "Türk destan geleneğinde bilinen boy?", answer: "OĞUZ", hint: "Kağan" },
    ],
    mcq: [
      {
        title: "Türk destanları ile ilgili hangisi uygundur?",
        options: [
          "Kahramanlık ve millet bilinci gibi temalar taşır; mit unsurları içerebilir.",
          "Yalnızca matematik formülüdür.",
          "Yalnızca denizcilik kılavuzudur.",
          "Hiç kahraman yoktur.",
        ],
        correctIndex: 0,
        explanation: "Destanlar epik ve kimlik temalıdır.",
        difficulty: "EASY",
      },
      {
        title: "Hangisi yanlıştır?",
        options: [
          "Destanlar her cümlesiyle kesin tarih belgesidir.",
          "Mit unsurları taşıyabilir.",
          "Kimlik aktarımı yapar.",
          "Oğuz anlatılarıyla ilişkilendirilir.",
        ],
        correctIndex: 0,
        explanation: "Destanlar doğrudan tarih belgesi sayılmaz; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Oğuz Kağan Destanı için hangisi doğrudur?",
        options: [
          "Türk destan geleneğinde önemli bir örnektir.",
          "Hiçbir zaman anılmaz.",
          "Yalnızca Çin’de yazılmıştır.",
          "Yalnızca deniz hukukudur.",
        ],
        correctIndex: 0,
        explanation: "Oğuz destanları önemli örneklerdendir.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T21]: {
    information: [
      {
        title: "Gökbilim ve takvim",
        content:
          "Bozkırda **yıldız** ve **mevsim** gözlemi sefer ve **ekonomik** ritim için önemlidir.",
        tag: "Bilim",
      },
      {
        title: "Eğitim",
        content:
          "Şehzade ve **elit** eğitimi, **at binme**, **ok atma** ve **dil** öğrenimini içerir.",
        tag: "Eğitim",
      },
    ],
    openQa: [
      {
        title: "Çin etkisi bilimde?",
        content:
          "Komşu kültürlerle **teknik** ve **bilimsel** bilgi alışverişi görülebilir.",
        tag: "Etkileşim",
      },
      {
        title: "Eğitimin amacı?",
        content:
          "Liderlik ve **komuta** için beden ve zihin disiplini.",
        tag: "Askerî",
      },
    ],
    wordGames: [
      { question: "Gece gökyüzünde yön ve zaman için gözlenen?", answer: "YILDIZ", hint: "Gökbilim" },
      { question: "Bozkırda süvari yetkinliği için temel?", answer: "ATLI", hint: "Eğitim" },
    ],
    mcq: [
      {
        title: "Bilim ve eğitim ünitesinde hangisi uygundur?",
        options: [
          "Gökbilim ve takvim gözlemi yaşam ve sefer düzeni için önemlidir.",
          "Hiç gözlem yoktur.",
          "Yalnızca denizcilik vardır.",
          "Yalnızca matbaa vardır.",
        ],
        correctIndex: 0,
        explanation: "Gökbilim ve takvim bozkır yaşamında önemlidir.",
        difficulty: "EASY",
      },
      {
        title: "Hangisi yanlıştır?",
        options: [
          "İslamiyet öncesi Türklerde hiç eğitim yoktur.",
          "At ve ok eğitimi önemlidir.",
          "Gökbilim pratikleri vardır.",
          "Komşu kültürlerle etkileşim olabilir.",
        ],
        correctIndex: 0,
        explanation: "Eğitim ve disiplin vardır; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Takvim ve mevsim bilgisinin işlevi?",
        options: [
          "Göç ve otlak kullanımı için ritim oluşturur.",
          "Yalnızca futbol maçı takvimidir.",
          "Yalnızca radyo frekansıdır.",
          "Yalnızca banka faizidir.",
        ],
        correctIndex: 0,
        explanation: "Mevsim ve otlak ekonomisiyle ilişkilidir.",
        difficulty: "HARD",
      },
    ],
  },

  [T.T22]: {
    information: [
      {
        title: "Hayvan üslubu",
        content:
          "İskit ve Altın **hayvan** motifleri, **sanat** tarihinde bozkır estetiğini yansıtır.",
        tag: "Görsel",
      },
      {
        title: "Mimari ve musiki",
        content:
          "Çadır ve **kentsel** yapı örnekleri ile **kopuz** gibi **musiki** aletleri kültür mirasıdır.",
        tag: "Sanat",
      },
    ],
    openQa: [
      {
        title: "İskit sanatı nasıl tanınır?",
        content:
          "**Altın** eserler ve **hayvan** biçimli motiflerle.",
        tag: "Arkeoloji",
      },
      {
        title: "Çadır mimarisi?",
        content:
          "Mobil yaşam için **konuşlandırılabilir** merkez ve tören alanı.",
        tag: "Mimari",
      },
    ],
    wordGames: [
      { question: "İskitlerin ünlü metal sanatı?", answer: "ALTIN", hint: "Madeni" },
      { question: "Türk musikisinde telli çalgı?", answer: "KOPUZ", hint: "Çalgı" },
    ],
    mcq: [
      {
        title: "Sanat ünitesi ile ilgili hangisi uygundur?",
        options: [
          "İskit Altın eserleri ve hayvan motifleri bozkır sanatının örnekleridir.",
          "Hiç sanat yoktur.",
          "Yalnızca Rönesans tablosudur.",
          "Yalnızca gotik katedraldir.",
        ],
        correctIndex: 0,
        explanation: "İskit sanatı müfredatta önemlidir.",
        difficulty: "EASY",
      },
      {
        title: "Hangisi yanlıştır?",
        options: [
          "Bozkırda hiç sanat ve zanaat yoktur.",
          "Musiki aletleri anlatılır.",
          "Metal işçiliği önemlidir.",
          "Motifler kültür aktarır.",
        ],
        correctIndex: 0,
        explanation: "Sanat ve zanaat vardır; seçenek yanlıştır.",
        difficulty: "MEDIUM",
      },
      {
        title: "Hayvan üslubu için hangisi doğrudur?",
        options: [
          "Bozkırda güç ve mitolojik anlam taşıyan motifler kullanılabilir.",
          "Yalnızca deniz canlıları.",
          "Yalnızca matematik sembolleri.",
          "Yalnızca yazılım ikonları.",
        ],
        correctIndex: 0,
        explanation: "Hayvan motifleri bozkır sanatında yaygındır.",
        difficulty: "HARD",
      },
    ],
  },
};
