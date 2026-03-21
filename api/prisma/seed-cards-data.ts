/**
 * KPSS Tarih — bilgi kartları (INFORMATION).
 * id: tüm veritabanında benzersiz olmalı.
 */
export type SeedCard = {
  id: string;
  subtopicId: string;
  title: string;
  content: string;
  tag: string | null;
};

export const seedInformationCards: SeedCard[] = [
  // --- İslamiyet Öncesi Türk Tarihi ---
  {
    id: "inf_turk_name_01",
    subtopicId: "turk_name_culture_centers",
    title: "Türk Adı ve Kültür Merkezleri",
    content:
      "Orta Asya’da Türk izlerine rastlanan kültür merkezleri sınavda karıştırılır:\n• **Anav** — erken dönem kültürü\n• **Afanesyevo** — arkeolojik kültür merkezi\n• **Andronova** — geniş yayılım alanı\n• **Tagar** — gelişmiş dönem kültürü\nNot: Müfredat ve kaynaklara göre etiketlemeleri ezberleyin.",
    tag: "Sınavda Çıkar",
  },
  {
    id: "inf_turk_name_02",
    subtopicId: "turk_name_culture_centers",
    title: "İkili Teşkilat ve Uygurlar",
    content:
      "Eski Türk devletlerinde **Doğu–Batı** ikili düzeni (Kağan / Yabgu) yönetimi kolaylaştırmış, parçalanma riskini artırmıştır.\n**Uygurlar**da Maniheizm sonrası **yerleşik hayat**, **kalıcı mimari**, **kütüphane** ve **örgün eğitim** öne çıkar.",
    tag: "Özet",
  },
  {
    id: "inf_first_turk_01",
    subtopicId: "first_turk_states",
    title: "Asya Hun ve Kutluk",
    content:
      "**Asya Hun Devleti** Türk tarihinin önemli devletlerindendir.\n**Göktürkler**de **Kutluk (İlk) Kağanlık** dönemi devletin güçlenmesinde dönüm noktasıdır; **Orhun Yazıtları** kültür ve dil bakımından kritiktir.",
    tag: "Devletler",
  },
  {
    id: "inf_first_turk_02",
    subtopicId: "first_turk_states",
    title: "Uygur Devleti",
    content:
      "**Uygur Kağanlığı** yerleşikleşme, tarım ve şehirleşme ile öne çıkar; din ve kültür politikaları sınavda ayrı başlık olarak işlenir.",
    tag: "KPSS",
  },
  {
    id: "inf_other_turk_01",
    subtopicId: "other_turk_tribes",
    title: "Hazarlar ve Peçenekler",
    content:
      "**Hazarlar** Karadeniz–Hazar ticaret hattında güçlü bir yapı kurmuştur.\n**Peçenekler** ve **Kumanlar** step hareketleri ve Bizans–Rus etkileşimi açısından önemlidir.",
    tag: "Bölgeler",
  },
  {
    id: "inf_other_turk_02",
    subtopicId: "other_turk_tribes",
    title: "Avarlar ve Macarlar",
    content:
      "**Avarlar** Avrupa siyasi coğrafyasında derin iz bırakmıştır.\n**Macarların** (Macar boyları) göç ve yerleşme süreçleri Orta Avrupa tarihinde belirleyicidir.",
    tag: "Avrupa",
  },
  {
    id: "inf_culture_pre_01",
    subtopicId: "culture_civilization_pre",
    title: "Kut, Kurultay ve Ordu",
    content:
      "**Kut** kutsal hak anlayışı; **Kurultay** boy birliği ve karar mekanizmasıdır.\n**Ordu teşkilatı** ve **onlu sistem** eski Türk toplumunun güç kaynağıdır.",
    tag: "Kavramlar",
  },
  {
    id: "inf_culture_pre_02",
    subtopicId: "culture_civilization_pre",
    title: "Hukuk ve Göçebe Yaşam",
    content:
      "**Töre** ve geleneksel hukuk anlayışı; göçebe ekonomide **hayvancılık** ve **ticaret** önemlidir. Din ve inanış çeşitliliği (şamanizm vb.) sınavda bağlam sorularında çıkar.",
    tag: "Sosyal",
  },

  // --- Türk-İslam ---
  {
    id: "inf_muslim_01",
    subtopicId: "first_muslim_turk_states",
    title: "Karahanlılar ve Gazneliler",
    content:
      "**Karahanlılar** İslamiyeti kabul eden ilk büyük Türk devletlerindendir.\n**Gazneliler** Hint seferleri ve kültür merkezleriyle bilinir.",
    tag: "İslamiyet",
  },
  {
    id: "inf_muslim_02",
    subtopicId: "first_muslim_turk_states",
    title: "Büyük Selçuklu",
    content:
      "**Büyük Selçuklu Devleti** geniş coğrafyada siyasi üstünlük kurmuş; **Nizamiye medreseleri** ve bilim–kültür hayatı önemlidir.",
    tag: "Selçuklu",
  },
  {
    id: "inf_egypt_01",
    subtopicId: "egypt_turk_states",
    title: "Tolunoğulları ve İhşidiler",
    content:
      "Mısır’da kurulan ilk Türk yapılanmalarından **Tolunoğulları** ve **İhşidiler** bölgesel güç oluşturmuştur.",
    tag: "Mısır",
  },
  {
    id: "inf_egypt_02",
    subtopicId: "egypt_turk_states",
    title: "Eyyubiler ve Memlükler",
    content:
      "**Eyyubiler** (Selahaddin Eyyubi) Haçlılar karşısında öne çıkar.\n**Memlükler** askeri güç ve devlet idaresiyle uzun süre etkindir.",
    tag: "Haçlılar",
  },
  {
    id: "inf_mongol_01",
    subtopicId: "other_states_mongol",
    title: "Harzemşahlar ve Moğol İstilası",
    content:
      "**Harzemşahlar** İran–Orta Asya hattında güçlüdür; **Moğol istilası** bölgede siyasi haritayı değiştirir.",
    tag: "Moğol",
  },
  {
    id: "inf_mongol_02",
    subtopicId: "other_states_mongol",
    title: "Altın Orda ve Çağatay",
    content:
      "**Altın Orda** Kıpçak bozkırlarında Türk–Moğol karışımı yapı; **Çağatay Ulusu** Türk kültür ve dilinin gelişiminde rol oynar.",
    tag: "Bozkır",
  },
  {
    id: "inf_ti_cult_01",
    subtopicId: "culture_civilization_turk_islam",
    title: "İkta ve Medrese",
    content:
      "**İkta** toprak gelirine dayalı askeri–idari sistemdir.\n**Medreseler** İslam dünyasında örgün eğitimin merkezidir.",
    tag: "İktisat",
  },
  {
    id: "inf_ti_cult_02",
    subtopicId: "culture_civilization_turk_islam",
    title: "Farabi, İbn-i Sina, Biruni",
    content:
      "**Farabi** felsefe ve müzik teorisi; **İbn-i Sina** tıp ve felsefe; **Biruni** astronomi ve matematikte öncüdür. Sınavda isim–eser eşleştirmesi sık gelir.",
    tag: "Bilim",
  },

  // --- Anadolu Selçuklu ve Beylikler ---
  {
    id: "inf_bey1_01",
    subtopicId: "beylik_period_1",
    title: "Saltuklu ve Danişmentliler",
    content:
      "**Saltuklular** Anadolu’da kurulan ilk beyliklerdendir.\n**Danişmentliler** ve **Mengücekliler** bölgede siyasi çeşitlilik oluşturur.",
    tag: "Beylik",
  },
  {
    id: "inf_bey1_02",
    subtopicId: "beylik_period_1",
    title: "Artuklular ve Çaka Beyliği",
    content:
      "**Artuklular** Suriye–Anadolu hattında önemlidir.\n**Çaka Beyliği** Ege’de deniz gücü denemesiyle öne çıkar.",
    tag: "Deniz",
  },
  {
    id: "inf_tr_seljuk_01",
    subtopicId: "turkey_seljuk",
    title: "Kuruluş ve Yükseliş",
    content:
      "**Anadolu Selçuklu Devleti** kuruluş ve fetihlerle güçlenmiş; başkent ve merkez teşkilatı sınavda sorulur.",
    tag: "Anadolu",
  },
  {
    id: "inf_tr_seljuk_02",
    subtopicId: "turkey_seljuk",
    title: "Kösedağ ve Dağılma",
    content:
      "**1243 Kösedağ** yenilgisi devletin zayıflamasında dönüm noktasıdır; sonrasında beylikler çağı hızlanır.",
    tag: "Kösedağ",
  },
  {
    id: "inf_bey2_01",
    subtopicId: "beylik_period_2",
    title: "Karamanoğulları",
    content:
      "**Karamanoğulları** iç Anadolu’da güçlü bir beyliktir; Osmanlı ile rekabet ve kültür politikaları önemlidir.",
    tag: "Beylik",
  },
  {
    id: "inf_bey2_02",
    subtopicId: "beylik_period_2",
    title: "Germiyanoğulları ve Karesiler",
    content:
      "**Germiyanoğulları** ve **Karesioğulları** batı Anadolu’da siyasi dengeyi etkiler; Osmanlı’nın genişlemesiyle sonlanır.",
    tag: "Batı",
  },

  // --- Osmanlı siyasi ---
  {
    id: "inf_os_foun_01",
    subtopicId: "foundation_1299_1453",
    title: "Kuruluş ve Rumeli",
    content:
      "**Osmanlı** kuruluş miti ve erken dönem fetihleri; **Rumeli** geçişi devletin Avrupa ayağıdır.",
    tag: "Kuruluş",
  },
  {
    id: "inf_os_foun_02",
    subtopicId: "foundation_1299_1453",
    title: "İstanbul’un Fethi",
    content:
      "**1453** ile **İstanbul’un Fethi** hem siyasi hem kültürel dönüm noktasıdır; **Fatih** dönemi reformları önemlidir.",
    tag: "1453",
  },
  {
    id: "inf_os_rise_01",
    subtopicId: "rise_1453_1579",
    title: "Yavuz ve Kanuni Dönemi",
    content:
      "**Yavuz Selim** ile **doğu seferleri** ve **halifelik** meselesi; **Kanuni** dönemi hukuk, mimari ve seferlerle “klasik çağ” zirvesidir.",
    tag: "Yükselme",
  },
  {
    id: "inf_os_rise_02",
    subtopicId: "rise_1453_1579",
    title: "Akdeniz ve Hint Korsanlığı",
    content:
      "**Barbaros** ve **Akdeniz** deniz hakimiyeti; **Hint** ticaret yollarına müdahaleler dünya gücü perspektifini gösterir.",
    tag: "Deniz",
  },
  {
    id: "inf_os_stag_01",
    subtopicId: "stagnation_and_decline",
    title: "Duraklama ve İsyanlar",
    content:
      "**17. yüzyıl** sonrası sınır istikrarsızlığı, **Celali isyanları** ve iç siyasi gerilimler dikkat çeker.",
    tag: "İç Politika",
  },
  {
    id: "inf_os_stag_02",
    subtopicId: "stagnation_and_decline",
    title: "Lale Devri ve Diplomasi",
    content:
      "**Lale Devri** kültürel açıdan önemli; **diplomasi** ve **Islahat** arayışları gerileme döneminin başlıklarıdır.",
    tag: "Reform",
  },
  {
    id: "inf_os_dis_01",
    subtopicId: "dissolution_1792_1922",
    title: "Nizam-ı Cedit ve Tanzimat",
    content:
      "**Nizam-ı Cedit** ve **Tanzimat** modernleşme çabalarıdır; **Meşrutiyet** ve **parlamento** deneyimleri önemlidir.",
    tag: "Islahat",
  },
  {
    id: "inf_os_dis_02",
    subtopicId: "dissolution_1792_1922",
    title: "Trablusgarp–Balkan ve Sonuç",
    content:
      "**Trablusgarp** ve **Balkan Savaşları** toprak kaybını hızlandırır; **I. Dünya Savaşı** ile süreç sonlanır.",
    tag: "Son Dönem",
  },

  // --- Osmanlı kültür ---
  {
    id: "inf_os_cent_01",
    subtopicId: "central_org",
    title: "Padişah ve Divan-ı Hümayun",
    content:
      "**Padişah** mutlakiyet ve unvanlar; **Divan-ı Hümayun** merkezi yürütme organıdır (sadrazam, kazasker, defterdar, nişancı vb.).",
    tag: "Merkez",
  },
  {
    id: "inf_os_cent_02",
    subtopicId: "central_org",
    title: "Saray ve Harem",
    content:
      "**Topkapı Sarayı** idari ve tören merkezi; **Harem** özel birim olarak sınavda bağlamıyla çıkar.",
    tag: "Saray",
  },
  {
    id: "inf_os_prov_01",
    subtopicId: "provincial_org",
    title: "Eyalet ve Sancak",
    content:
      "**Eyalet sistemi** taşra yönetiminin çerçevesidir; **sancak** ve **beylerbeyi** kavramları önemlidir.",
    tag: "Taşra",
  },
  {
    id: "inf_os_prov_02",
    subtopicId: "provincial_org",
    title: "Tımar ve Sipahi",
    content:
      "**Tımar** askeri–mali toprak düzeni; **sipahi** tımarlı asker sınıfıdır. Klasik dönemde ordu–vergi ilişkisini taşır.",
    tag: "Tımar",
  },
  {
    id: "inf_os_law_01",
    subtopicId: "law_army_education",
    title: "Şer’i ve Örfi Hukuk",
    content:
      "**Kanunname**ler ve **örfi hukuk**; **Enderun** saray eğitimi; **medrese** ilim geleneği birlikte düşünülür.",
    tag: "Hukuk",
  },
  {
    id: "inf_os_law_02",
    subtopicId: "law_army_education",
    title: "Yeniçeri Ocağı",
    content:
      "**Yeniçeri Ocağı** merkezi ordu gücü; zaman içinde kapıkulu düzeni ve isyanlar (ör. **Vaka-i Hayriye**) sınavda geçer.",
    tag: "Ordu",
  },
  {
    id: "inf_os_eco_01",
    subtopicId: "economy_social",
    title: "Lonca ve Esnaflık",
    content:
      "**Lonca teşkilatı** üretim ve kalite kontrolü; **ihtisab** ve şehir ekonomisi ile ilişkilidir.",
    tag: "İktisat",
  },
  {
    id: "inf_os_eco_02",
    subtopicId: "economy_social",
    title: "Vakıf ve Vergi",
    content:
      "**Vakıflar** sosyal hizmet ve finansman; **öşür**, **cizye**, **timar geliri** gibi kalemler vergi çeşitliliğini gösterir.",
    tag: "Vergi",
  },

  // --- XX. yy Osmanlı ---
  {
    id: "inf_os_xx1_01",
    subtopicId: "tripolitan_balkan_wars",
    title: "Trablusgarp Savaşı",
    content:
      "**Trablusgarp** Kuzey Afrika çıkarları ve Balkan dengeleri açısından önemlidir; **İtalya** ile mücadele başlıkları sınavda çıkar.",
    tag: "1911",
  },
  {
    id: "inf_os_xx1_02",
    subtopicId: "tripolitan_balkan_wars",
    title: "Balkan Savaşları ve Sonuçları",
    content:
      "**Balkan Savaşları** toprak kaybını büyütür; **Edirne** ve göçler toplumsal travma yaratır.",
    tag: "Balkan",
  },
  {
    id: "inf_os_ww1_01",
    subtopicId: "ww1_fronts",
    title: "Cepheler ve Gizli Antlaşmalar",
    content:
      "**Çanakkale**, **Kafkas**, **Kut** gibi cepheler; **Sykes–Picot** vb. gizli paylaşımlar sonrası haritayı etkiler.",
    tag: "Cephe",
  },
  {
    id: "inf_os_ww1_02",
    subtopicId: "ww1_fronts",
    title: "Mondros Ateşkesi",
    content:
      "**30 Ekim 1918 Mondros** ile fiilen çöküş süreci başlar; işgal ve direniş zemini hazırlanır.",
    tag: "Mondros",
  },
  {
    id: "inf_os_soc_01",
    subtopicId: "societies_xx",
    title: "Yararlı Cemiyetler",
    content:
      "**Müdafaa-i Hukuk**, **Kızılay** vb. millî bilinç ve yardım faaliyetleriyle öne çıkar.",
    tag: "Cemiyet",
  },
  {
    id: "inf_os_soc_02",
    subtopicId: "societies_xx",
    title: "Zararlı / İşbirlikçi Cemiyetler",
    content:
      "İşgal şartlarında kurulan **işbirlikçi** yapılar ve propaganda örgütleri Kurtuluş sürecinin karşı kutbunda değerlendirilir.",
    tag: "Eleştiri",
  },

  // --- Kurtuluş Savaşı ---
  {
    id: "inf_prep_01",
    subtopicId: "preparation_period",
    title: "Genelgeler ve Kongreler",
    content:
      "**Amasya Genelgesi** yol haritası; **Erzurum** ve **Sivas Kongreleri** temsil ve meşruiyet oluşturur.",
    tag: "Hazırlık",
  },
  {
    id: "inf_prep_02",
    subtopicId: "preparation_period",
    title: "TBMM’nin Açılması",
    content:
      "**23 Nisan 1920** ile **TBMM** egemenlik ve yürütmede merkez haline gelir; **Misak-ı Millî** sınırları vurgulanır.",
    tag: "TBMM",
  },
  {
    id: "inf_bat_01",
    subtopicId: "battles_period",
    title: "Cepheler ve İnönü",
    content:
      "**Doğu, Güney, Batı** cepheleri; **I. ve II. İnönü** zaferleri moral ve askeri üstünlük sağlar.",
    tag: "Cephe",
  },
  {
    id: "inf_bat_02",
    subtopicId: "battles_period",
    title: "Sakarya ve Büyük Taarruz",
    content:
      "**Sakarya** meşrutiyet ve mareşallik; **Büyük Taarruz** ile düşman hattı kırılır, **30 Ağustos** zaferi gelir.",
    tag: "Taarruz",
  },
  {
    id: "inf_dip_01",
    subtopicId: "diplomacy_lozan",
    title: "Mudanya ve Lozan",
    content:
      "**Mudanya** ile silahların susması; **Lozan** ile **bağımsızlık ve sınırlar** uluslararası hukuka bağlanır.",
    tag: "Diplomasi",
  },
  {
    id: "inf_dip_02",
    subtopicId: "diplomacy_lozan",
    title: "Lozan’ın Maddeleri (Özet)",
    content:
      "Kapitülasyonların kalkması, **Musul** meselesi, **azınlık** ve **ekonomik** maddeler sınavda ayrı soru olarak işlenir.",
    tag: "Lozan",
  },

  // --- Atatürk ilke ve inkılaplar ---
  {
    id: "inf_atp_01",
    subtopicId: "ataturk_principles_list",
    title: "Altı İlke",
    content:
      "**Cumhuriyetçilik, Milliyetçilik, Halkçılık, Devletçilik, Laiklik, İnkılapçılık** — her birinin tanımı ve örnekleri ezberlenmelidir.",
    tag: "İlkeler",
  },
  {
    id: "inf_atp_02",
    subtopicId: "ataturk_principles_list",
    title: "Laiklik ve Eğitim",
    content:
      "**Laiklik** hukuk ve eğitimde devletin tarafsızlığı; **tevhid-i tedrisat** ile eğitim birliği hedeflenir.",
    tag: "Laiklik",
  },
  {
    id: "inf_ref_01",
    subtopicId: "reforms_ataturk",
    title: "Siyasi ve Hukuki İnkılaplar",
    content:
      "**Halifeliğin kaldırılması**, **Medeni Kanun**, **Soyadı Kanunu**, **kadın hakları** başlıkları bir bütün olarak çalışılmalıdır.",
    tag: "Hukuk",
  },
  {
    id: "inf_ref_02",
    subtopicId: "reforms_ataturk",
    title: "Toplumsal ve Ekonomik",
    content:
      "**Kıyafet**, **takvim–saat**, **Latin harfleri**; **iş bankası**, **şeker fabrikaları** gibi **devletçilik** uygulamaları öne çıkar.",
    tag: "Toplum",
  },

  // --- Çağdaş Türk ve dünya ---
  {
    id: "inf_mod_01",
    subtopicId: "interwar",
    title: "İki Savaş Arası",
    content:
      "**SSCB** kuruluşu, **Orta Doğu** mandaları, **Uzak Doğu**’da Japonya’nın genişlemesi dünya dengelerini değiştirir.",
    tag: "1920–39",
  },
  {
    id: "inf_mod_02",
    subtopicId: "interwar",
    title: "Türkiye’nin Dış Politikası",
    content:
      "**Hatay**, **Sadabat**, **Balkan Antantı** gibi adımlar bölgesel güvenlik arayışını gösterir.",
    tag: "Dış Politika",
  },
  {
    id: "inf_ww2_01",
    subtopicId: "ww2_turkey",
    title: "II. Dünya Savaşı Seyri",
    content:
      "Avrupa ve Pasifik cepheleri; **ABD**’nin savaşa girişi ve **Stalingrad** gibi dönüm noktaları genel kültür sorularında çıkar.",
    tag: "Savaş",
  },
  {
    id: "inf_ww2_02",
    subtopicId: "ww2_turkey",
    title: "Türkiye’nin Tutumu",
    content:
      "**Tarafsızlık** çizgisi, **Montrö** ve **Yardım** antlaşmaları; ekonomik ve askeri hazırlıklar dikkat çeker.",
    tag: "Türkiye",
  },
  {
    id: "inf_cw_01",
    subtopicId: "cold_war_global",
    title: "Soğuk Savaş Kutuplaşması",
    content:
      "**NATO** ve **Varşova**; **Kore**, **Küba** krizleri; nükleer denge kavramları önemlidir.",
    tag: "Soğuk Savaş",
  },
  {
    id: "inf_cw_02",
    subtopicId: "cold_war_global",
    title: "Yumuşama ve Küreselleşme",
    content:
      "**Detente**, **Berlin Duvarı**’nın yıkılışı; **internet** ve ekonomik entegrasyon ile **küreselleşme** tartışmaları.",
    tag: "1990+",
  },
];
