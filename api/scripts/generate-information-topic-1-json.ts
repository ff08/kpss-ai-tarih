/**
 * information-topic-1.json üretir: her alt konu (sortOrder 1–5) için ≥30 kart.
 * Çalıştır: npx tsx scripts/generate-information-topic-1-json.ts
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

type Card = {
  subtopicSortOrder: number;
  title: string;
  content: string;
  tag?: string;
};

function c(
  sub: number,
  title: string,
  content: string,
  tag?: string,
): Card {
  return { subtopicSortOrder: sub, title, content, tag };
}

/** Alt konu 1: Türk Adının Anlamı ve İlk Ana Yurdu */
const s1: Card[] = [
  c(1, "“Türk” sözcüğü ve güç–doğurganlık kökeni", "Bazı dilbilimsel yaklaşımlar “Türk” kökenini **türe-/tör-** ile ilişkilendirerek **güç, kuvvet, doğmak** anlamlarına götürür. KPSS’te bu tartışmanın ayrıntısı değil; **adın erken dönemde siyasi kimlik** ile birleştiği bilgisidir.", "Dil"),
  c(1, "Çin kaynaklarında Türk boy adları", "Çin tarihî metinlerinde farklı transkripsiyonlarla geçen **boy adları**, sonradan **Türk** çatısı altında birleşen toplulukların izini sürmekte kullanılır. Metinlerdeki **hediye–vergi–sınır** kayıtları, boyların **Çin devletiyle ilişkisini** gösterir.", "Kaynak"),
  c(1, "Orhun Yazıtları ve “Türk budunu”", "**Kül Tigin**, **Bilge Kağan** ve ilgili metinlerde geçen **“Türk budunu / milleti”** ifadeleri, devlet düzeyinde **ortak kimlik** dilinin oluştuğunu gösterir. Yazıtlar aynı zamanda **tarih anlatısı ve meşruiyet** aracıdır.", "Kaynak"),
  c(1, "Tonyukuk Yazıtları’nın yeri", "**Tonyukuk** anıt metinleri, **askeri–diplomatik** tavsiyeler ve **boy birliği** vurgusu ile Köktürk siyasetinin anlaşılmasına yardım eder. Sınavda **birlik ve liderlik** temaları öne çıkar.", "Kaynak"),
  c(1, "Orta Asya: bozkır kuşağı", "**Orta ve İç Asya** bozkırı; geniş otlak, nehir vadileri ve **göç güzergâhları** ile tanımlanır. Bu coğrafya **hayvancılık** ve **kısmen tarım** ekonomisini destekler; **merkezi olmayan** yerleşim kalıpları görülür.", "Coğrafya"),
  c(1, "İç Asya’nın iklim–otlağa etkisi", "**Kuraklık ve otlak baskısı**, boyların **yeni yaylak arayışı** ve **rekabet** dinamiklerini artırır. KPSS çerçevesinde göçleri **yalnızca iklim** ile değil; **siyasi baskı ve iç çatışma** ile birlikte düşünmek gerekir.", "Coğrafya"),
  c(1, "Ana yurt: tek nokta değil kuşak", "“İlk ana yurt” ifadesi tek bir şehir değil; **Türk boylarının kültür ve siyasi örgütlenmesinin şekillendiği geniş bölge** anlamına gelir. Zaman içinde **batı ve güney hareketleri** bu kuşağı genişletir.", "Kavram"),
  c(1, "Bozkır hayatı ve göçebe düzen", "**Kış–yaylak** ayrımı, **konar–göçer** yaşam ve **sürü ekonomisi**, bozkır toplumunun **askeri hareket kabiliyeti** ile bağlantılıdır. Bu düzen, **onlu askeri teşkilat** ile uyumludur.", "Toplum"),
  c(1, "Türk adı ve Hun geleneği ilişkisi", "Tarih anlatımında **Asya Hunları**, sonraki **bozkır imparatorlukları** için **askeri–diplomatik öncül** örnekler sunar. “Türk” adının **Hun dönemindeki boy yapısı** ile **doğrudan özdeş** sayılması her zaman net değildir; **süreklilik** ve **dönüşüm** birlikte ele alınır.", "Tarih"),
  c(1, "Çin Seddi ve bozkır baskısı", "**Sınır örgütlenmesi** ve **sedanter devlet** karşısında bozkır toplulukları **baskın, kaçınma ve hediye diplomasisi** kullanır. Bu tema **Hun–Çin** ilişkilerinde tipiktir.", "Askeri"),
  c(1, "Boy (urug) ve üst kimlik", "Erken dönemde **boy sadakati**, devletleşme ile **kağanlık** ve **millet** kavramlarına bağlanır. Kimlik **soy–ece** ve **mitolojik** unsurlarla desteklenir.", "Toplum"),
  c(1, "Türk adının yayılması: siyasi birlik", "“Türk” adının **genişlemesi**, yalnız dil değil; **ortak düşman**, **ortak liderlik** ve **ortak töre** algısıyla **siyasi birlik** süreçleriyle ilişkilidir.", "Siyasi"),
  c(1, "Yazı ve tarih bilinci", "Köktürk döneminde **runik yazı** ile **tarihî anlatı**, **geçmişi meşrulaştırma** ve **boylara öğüt** verme işlevi görür.", "Kültür"),
  c(1, "Göç yolları ve ticaret öncesi", "Orta Asya; **İpek Yolu kolları** ve **hayvan ticareti** açısından **erken dönemden itibaren** etkileşim bölgesidir. Bu, sonraki **devletlerin gelir kaynakları** için zemin oluşturur.", "Ekonomi"),
  c(1, "Türk toponimleri ve anlatılar", "Sonraki dönem anlatılarında **Oğuz–Kök Türk** kökenli **menkıbeler**, topluluğun **köklerini** ve **liderlik meşruiyetini** güçlendirir. KPSS’te **mit ile tarih** ayrımı önemlidir.", "Anlatı"),
  c(1, "Asya Hunlarında merkez–çevre", "Güçlü Hun yönetiminde **tek hakan** ve **boy reisleri** arasında **gerilim ve denge** aranır. Benzer yapı **Köktürklerde** de izlenir.", "Siyasi"),
  c(1, "Türk adı ve komşu kültürler", "Türk boyları; **Çin**, **İran kültür çevresi** ve **step dünyası** ile **askeri, ticari ve kültürel** etkileşim içindedir. Kimlik **saf değil**, **sentez** ürünüdür.", "Kültür"),
  c(1, "Orta Asya gölleri ve yaylalar", "**Say, Balkhash** çevresi ve **Altay** yöreleri, anlatımda **yaylak–kışlak** düzeninin **doğal çerçevesi** olarak geçer.", "Coğrafya"),
  c(1, "Türkçülük öncesi “Türk” kavramı", "Modern **milliyetçi** okumalardan ayrı olarak, eskiçağda “Türk” **siyasi–etnik** bir etiketin **tarihî inşası** olarak incelenir.", "Kavram"),
  c(1, "Orhun metinlerinde ahlaki öğüt", "Yazıtlarda **atasözü** ve **öğüt** dili, **boy birliği**, **doğru yönetim** ve **Çin’e karşı direniş** temalarını taşır.", "Edebiyat"),
  c(1, "Türk adı ve kadın–erkek rolleri", "Bozkır toplumunda **üretim ve savaş** işbölümü; **aile ve boy** içi roller **töre** ile düzenlenir. Yazıtlarda **hatun** ve **hanım** figürleri **siyasi** anlam taşıyabilir.", "Toplum"),
  c(1, "İlk ana yurt ve hayvancılık türleri", "**Koyun, sığır, at**; **süt–et–kıl** ekonomisinin temelidir. **At**, ayrıca **savaş ve prestij** aracıdır.", "Ekonomi"),
  c(1, "Türk kimliği ve dil ailesi", "**Türk dilleri**; **ses uyumu**, **eklemeli yapı** ve **ortak kelime hazinesi** ile tanımlanır. Tarihî kaynaklarda **adlandırma** ve **unvanlar** önemli iz taşır.", "Dil"),
  c(1, "Moğolistan–Altay hattı", "Arkeoloji ve anlatı birlikte ele alındığında **kuzey–güney** hareketlerin **kültür karışımı** yarattığı görülür.", "Coğrafya"),
  c(1, "Türk adı: ticaret ve el sanatları", "**Demircilik**, **deri** ve **tekstil**; bozkırda **hediye ekonomisi** ve **askeri donanım** için önemlidir.", "Ekonomi"),
  c(1, "Hun sonrası bozkır boşluğu", "Büyük imparatorlukların **çöküşü**, yeni **boy ittifakları** ve **kağanlık** modellerinin **yeniden kurulmasına** zemin hazırlar.", "Tarih"),
  c(1, "Türk adı ve “millet” sözcüğü", "Yazıtlarda **millet/budun** kullanımı, **ortak kader** ve **ortak düşman** retoriği ile **siyasi birlik** hedefini yansıtır.", "Kavram"),
  c(1, "Sınır bölgelerinde kültürel temas", "**Güney sınırı** boyunca **tarım–bozkır** etkileşimi; **dil**, **din** ve **ekonomik** öğelerin **karşılıklı aktarımı** ile sonuçlanır.", "Kültür"),
  c(1, "Türk adı ve sonraki devletler", "**Köktürk**, **Uygur** ve **sonraki Türk–İslam** devletlerinde “Türk” etiketi **farklı siyasi çerçevelerde** yeniden üretilir.", "Tarih"),
  c(1, "KPSS ipucu: ana yurt soruları", "Sorularda **coğrafi kuşak**, **hayvancılık** ve **göç** üçlüsünü **birlikte** işaretleyen şıklar genelde güçlü adaydır.", "Sınav"),
  c(1, "Çalışma listesi: ilişkisel zincir", "**Türk adı** → yazıtlar → **Orta Asya** → **bozkır ekonomisi** → **boy–millet** zincirini ezber yerine **ilişki** olarak çalışın.", "Çalışma"),
];

/** Alt konu 2: Orta Asya Kültürleri ve Türk Göçleri */
const s2: Card[] = [
  c(2, "Anav kültürü ve Demir Çağı", "**Anav kültürü**; genellikle **Demir Çağı** Orta Asya–Kazak bozkırı ile ilişkilendirilir. **Mezar törenleri** ve **madeni eserler**, sınavda **erken bozkır** başlığıyla bağlanır.", "Arkeoloji"),
  c(2, "Afanasyevo kültürü: erken metal", "**Afanasyevo**; **erken metal**, **yerleşim** ve **mezar** buluntuları ile bilinir. **Güney Sibirya–Orta Asya** hattında değerlendirilir.", "Arkeoloji"),
  c(2, "Andronovo kültür alanı", "**Andronovo** kültür çevresi; **bronz–demir** geçişi ve **geniş bozkır** boyunca **yayılım** ile anlatılır. **Atlı göçebe** öncülleriyle ilişkilendirilir.", "Arkeoloji"),
  c(2, "Tagar ve Minusinsk çevresi", "**Tagar kültürü**; **Yenisey** yöresinde **maden işçiliği** ve **hayvan motifleri** ile öne çıkar. Kültür **mozaiği** anlatımında kullanılır.", "Arkeoloji"),
  c(2, "Orta Asya kuraklık ve otlağın daralması", "**Kuraklık** ve **otlağın taşması**, boyları **yeni otlaklara** itebilir. KPSS’te **tek faktör** yerine **çoklu neden** yaklaşımı beklenir.", "Sebep"),
  c(2, "İç savaş ve boy çekişmesi", "**Merkez–çevre** ve **veraset** çatışmaları göçleri **iç siyasi** olarak tetikler.", "Siyasi"),
  c(2, "Dış baskı: komşu imparatorluklar", "**Çin**, **İran** ve **Bizans** çevresindeki **askeri baskı**, bozkır topluluklarını **ittifak** veya **kaçış** hareketine yönlendirir.", "Askeri"),
  c(2, "Ticaret yolları ve güvenlik", "**Kervan güvenliği** bozulunca topluluklar **alternatif güzergâh** arar; bu da **siyasi birleşme** ihtiyacını artırır.", "Ekonomi"),
  c(2, "Göçün demografik sonucu", "Göçler **nüfus karışımı**, **yeni yerel güçler** ve **askeri sınıfın yeniden örgütlenmesi** doğurur.", "Sonuç"),
  c(2, "Göç ve yeni devletçikler", "Hareket halindeki boylar **kısa ömürlü birlikler** veya **kalıcı kağanlıklar** kurabilir.", "Sonuç"),
  c(2, "Bozkır ekonomisi: sürü ve takas", "**Sürü** varlığı **para ekonomisine** kısmi bağımlılık ve **hediye–takas** ile birleşir.", "Ekonomi"),
  c(2, "Kışlak–yaylak ve siyasi merkez", "**Merkez** bazen **kışlak**ta kurulur; **yaylak** hareketleri **askeri sefer** ile örtüşür.", "Coğrafya"),
  c(2, "Orta Asya nehir vadileri", "**Sırderya**, **Amuderya** vadileri **tarım** ve **kontrol noktaları** için stratejiktir.", "Coğrafya"),
  c(2, "Arkeoloji ve yazılı kaynak farkı", "**Kazı buluntuları** sessizdir; **tarihî metin** sonradan gelir. İkisini **birlikte** yorumlamak gerekir.", "Metod"),
  c(2, "Kültür merkezleri ve yayılım", "**Kültür** sınırları **keskin değil**; **öğeler** zamanla **komşu topluluklara** aktarılır.", "Arkeoloji"),
  c(2, "Türk göçleri ve Avrupa’ya etki", "**Kavimler Göçü** çerçevesinde **batı hareketleri**, **Roma** ve **sonrası** dünyada **siyasi harita** değişimine yol açar.", "Tarih"),
  c(2, "Göçebe–yerleşik etkileşimi", "**Şehirleri yağma–koruma**, **tarım alanlarına** yakınlık ve **askeri hizmet** karşılığı **ödün** ilişkileri görülür.", "Toplum"),
  c(2, "Orta Asya’da din öncesi inanç izleri", "**Mezar hediyeleri**, **hayvan kurbanı** ve **gökyüzü** motifleri **sonraki Gök Tanrı** anlatılarıyla **bağ kurulabilir** (dikkatli karşılaştırma).", "İnanç"),
  c(2, "Metalürji ve askeri üstünlük", "**Demir işçiliği**; **silah**, **atalet** ve **prestij** üretiminde belirleyicidir.", "Teknoloji"),
  c(2, "Göç ve kabile ittifakı", "**Aşiret birliği** zayıflarsa göç **dağılık** veya **başka boya** katılım şeklinde olur.", "Siyasi"),
  c(2, "Bozkırda yazı öncesi iletişim", "**Sözlü gelenek**, **haberci** ve **töre** kuralları **yazıdan önce** düzeni taşır.", "Kültür"),
  c(2, "Orta Asya rüzgârı ve step yangınları", "Doğal olaylar **otlak** kalitesini etkileyerek **kısa vadeli** hareketliliği artırabilir.", "Coğrafya"),
  c(2, "Göç sonrası dil teması", "Yeni komşularla **dil ödünçlemesi** ve **unvan** aktarımları görülür.", "Dil"),
  c(2, "Kültür: seramik ve dokuma", "**Seramik** desenleri **bölgesel** kültürleri ayırt etmeye yardım eder.", "Arkeoloji"),
  c(2, "Türk göçleri ve tarım sınırı", "**Sınır tarımı** bölgelerinde **askeri hizmet** karşılığı **arazi** ilişkileri gelişebilir.", "Ekonomi"),
  c(2, "Orta Asya göçleri ve İpek Yolu", "**Uzun mesafe ticaret**; göçleri **yönlendiren** ve **besleyen** etmenlerden biridir.", "Ticaret"),
  c(2, "Göç ve salgın (tarihî anlatım)", "Bazı anlatımlarda **salgın** ve **kıtlık** göçleri hızlandırır; **KPSS** genelde **çok etmenli** açıklama ister.", "Sebep"),
  c(2, "Arkeolojik tabakalaşma", "**Üst üste kültür** tabakaları **süreklilik–kopuş** tartışması yaratır.", "Metod"),
  c(2, "Türk göçleri ve Balkanlar (dolaylı)", "Doğrudan değil; **Peçenek–Kuman** hattı üzerinden **gecikmeli** etkiler söz konusu olabilir.", "Tarih"),
  c(2, "KPSS: göç nedenleri sorusu", "**İklim + siyasi baskı + iç çatışma** üçlüsünü **bir arada** sunan seçenekler güçlüdür.", "Sınav"),
  c(2, "Çalışma: kültür–göç bağlantısı", "**Anav/Afanasyevo** → **bozkır ekonomisi** → **göç dinamikleri** zincirini çizin.", "Çalışma"),
];

/** Alt konu 3: Orta Asya'da Kurulan İlk Türk Devletleri */
const s3: Card[] = [
  c(3, "İskitler ve hayvan üslubu", "**İskit sanatında** **hayvan dövüşü** ve **stilize figürler** öne çıkar; **metal işçiliği** yüksektir.", "Kültür"),
  c(3, "İskitler ve mezar kurganları", "**Kurgan** mezarları; **lider** ve **savaşçı** gömüleriyle **hiyerarşiyi** gösterir.", "Arkeoloji"),
  c(3, "Asya Hunları ve Çin sınırı", "**Modu Chanyu** gibi figürler anlatımda **güçlü liderlik** örneği olarak geçer; isimler **ezber** yerine **rol** ile öğrenilmelidir.", "Siyasi"),
  c(3, "Hun–Çin hediye diplomasisi", "**Hediye ve vergi** ilişkileri **savaşın maliyetini** azaltma amacı taşır.", "Diplomasi"),
  c(3, "Kavimler Göçü: genel çerçeve", "**M.S. 4–5. yüzyıllar** civarı **Avrupa’da** büyük hareketlilik; **Roma** sınırlarını zorlar.", "Kronoloji"),
  c(3, "Avrupa Hunları ve batı ittifakları", "**Avrupa Hunları**; **Roma**, **Germen** ve **diğer** topluluklarla **ittifak–savaş** içindedir.", "Siyasi"),
  c(3, "Attila dönemi ve baskı", "**Attila** dönemi **kısa süreli** yoğun **askeri baskı** ile bilinir; **detay kronoloji** KPSS’te sınırlıdır.", "Askeri"),
  c(3, "Köktürk I: Bumin ve kuruluş", "**Bumin Kağan** ve **İstemi Yabgu** anlatımında **doğu–batı** kol **işbölümü** vurgulanır.", "Devlet"),
  c(3, "Köktürkler ve Çin egemenliği dönemi", "Bazı dönemlerde **Çin** üzerinde **tabiiyet–danışmanlık** ilişkileri görülür; **bağımsızlık** mücadelesi yazıtlarda **güçlü** temadır.", "Diplomasi"),
  c(3, "İlteriş Kutlu ve bağımsızlık", "**İlteriş** dönemi **Köktürk** güçlenmesi ve **Çin** ile **çatışma** ile ilişkilendirilir.", "Askeri"),
  c(3, "Kutluk Kağan ve birlik çabası", "**Kutluk** adı anlatımlarda **iç birlik** ve **merkez** otorite ile bağlanır.", "Siyasi"),
  c(3, "II. Köktürk ve Çin–Tibet ekseni", "**Kapgan** döneminde **genişleme** ve **iç isyan** riskleri **birlikte** ele alınır.", "Askeri"),
  c(3, "Orhun yazıtları ve Bilge Kağan öğütleri", "**Bilge Kağan** metninde **halka ve boylara** yönelik **öğüt** ve **eleştiri** dili belirgindir.", "Kaynak"),
  c(3, "Köktürk çöküşü ve Uygur yükselişi", "**744** civarı anlatımda **Uygurların** **Köktürk** sonrası **bölgede güçlenmesi** yer alır (tarih rakamları kaynaklara göre **yaklaşık**).", "Kronoloji"),
  c(3, "Uygur Devleti ve yerleşikleşme", "**Uygurlar**; **şehir**, **ticaret** ve **idari** yapı ile **daha yerleşik** bir modele kayar.", "Toplum"),
  c(3, "Uygurlarda Maniheizm", "Bazı Uygur hükümdarlarının **Maniheizm**’i benimsemesi **kültür ve diplomasi** üzerinde **derin etki** yaratır.", "Din"),
  c(3, "Uygur yazısı ve kültür aktarımı", "**Uygur yazısı** sonraki **Mongol** ve **benzeri** sistemlere **etki** eden bir **aracı** rol oynar.", "Kültür"),
  c(3, "Göktürk runik yazısı", "**Runik** harfler **yazıtlarda** kullanılır; **Türkçenin** erken **yazılı** örneklerindendir.", "Yazı"),
  c(3, "Köktürklerde vergi ve tımar benzeri", "Anlatımda **savaş ganimeti**, **hayvan** ve **hediye** ekonomisi **merkezi gelir** kaynaklarıdır.", "Ekonomi"),
  c(3, "Türk devletinde elçilik", "**Elçi** ve **haber** ağı **bozkır diplomasisi** için hayati önemdedir.", "Diplomasi"),
  c(3, "Köktürk–Bizans teması (dolaylı)", "Bazı anlatımlarda **İstemi** kolunun **batı** yönelimi **Bizans–İran** dengesiyle **dolaylı** ilişkiler kurar.", "Diplomasi"),
  c(3, "Göktürk isyanları ve boy sadakati", "**Boy isyanları** merkezi otoriteyi **zayıflatır**; yazıtlarda **uyarı** olarak geçer.", "Siyasi"),
  c(3, "Uygurların sonrası: karışım", "**Karluk**, **Kırgız** ve **diğer** güçler **Orta Asya**’da **yeni düzen** kurar.", "Tarih"),
  c(3, "İskit–Türk sürekliliği tartışması", "Kültür **sürekliliği** ile **etnik özdeşlik** ayrı konulardır; KPSS **dikkatli** ifade ister.", "Metod"),
  c(3, "Hun ordusu: yay ve at", "**Ok–yay** ve **hafif süvari** taktikleri **sedanter** ordulara karşı **avantaj** sağlar.", "Askeri"),
  c(3, "Köktürklerde kadın ve hatun", "Bazı **hatun** figürleri **siyasi nüfuz** taşır; **veraset** ve **ittifak** için önemlidir.", "Toplum"),
  c(3, "Uygur şehirleri ve ticaret", "**Beşbalık** gibi merkezler anlatımda **ticaret** ve **yönetim** için geçer.", "Ekonomi"),
  c(3, "Kavimler Göçü ve Germen krallıkları", "Batıda **yeni krallıklar** kurulması **feodal** gelişmelerle **bağlanır**.", "Tarih"),
  c(3, "KPSS: Köktürk–Uygur ayrımı", "**Yazı** + **Çin ilişkisi** + **din** (**Maniheizm** Uygur) ayırt edicidir.", "Sınav"),
  c(3, "Çalışma: devletler kronolojisi", "**Hun → Avrupa Hun → Köktürk → Uygur** hattını **özellik** ile çalışın.", "Çalışma"),
  c(3, "İlk Türk devletleri ve töre", "**Töre** tüm bu devletlerde **meşruiyet** ve **sosyal düzen** için **ortak** çerçevedir.", "Hukuk"),
];

/** Alt konu 4: Diğer Türk Devletleri ve Toplulukları */
const s4: Card[] = [
  c(4, "Hazar Kağanlığı ve ticaret yolları", "**Hazarlar**; **Kuzey Kafkas–Hazar** çevresinde **İpek Yolu** kolları üzerinde **aracı** güçtür.", "Ticaret"),
  c(4, "Hazarlar ve Bizans–Abbasi dengesi", "**İki büyük güç** arasında **denge** ve **ittifak** diplomasisi yürütürler.", "Diplomasi"),
  c(4, "Hazarlar ve din politikası", "Yönetimde **din** tercihleri **ticaret ve siyaset** ile **iç içe** tartışılır (Musevi–İslam anlatımları kaynaklara göre değişir).", "Din"),
  c(4, "Kıpçaklar: bozkır yayılımı", "**Kıpçaklar** geniş alana yayılır; **askeri** olarak **paralı** ve **ittifak** unsuru olurlar.", "Askeri"),
  c(4, "Kıpçak–Kuman özdeşliği", "Anlatımda **Kıpçak** ve **Kuman** adları **benzer topluluk** için kullanılabilir.", "Kavram"),
  c(4, "Peçenekler ve Balkan öncesi", "**Peçenekler**; **step**ten **Batı**’ya hareket ederek **Bizans** ve **Macar** dünyası ile **çatışır–anlaşır**.", "Tarih"),
  c(4, "Peçenek–Bizans sınır savaşları", "**Sınır** boyunca **akınlar** ve **anlaşmalar** dönüşümlüdür.", "Askeri"),
  c(4, "Oğuz boyları ve boy yapısı", "**Oğuzlar**; **boy birliği** ve **güçlü askeri** gelenekleri ile bilinir.", "Toplum"),
  c(4, "Oğuzlar ve Selçuklu öncesi", "**Oğuz göçleri** ve **liderlik** anlatıları **sonraki Selçuk** sürecine **zemin** hazırlar.", "Tarih"),
  c(4, "Hazarlar ve Hazar denizi ticareti", "**Balık–tuz–kervan** unsurları **bölgesel ekonomi** ile bağlanır.", "Ekonomi"),
  c(4, "Kıpçaklar ve Altın Orda çağrışımı", "Sonraki dönemde **Altın Orda** coğrafyasında **Kıpçak** unsurları **yoğun**dur.", "Tarih"),
  c(4, "Peçenekler ve Macaristan kuruluşu", "Bazı anlatımlarda **Macar** göçleri ile **Peçenek baskısı** **dolaylı** ilişkilendirilir.", "Tarih"),
  c(4, "Oğuz Yabgu ve merkez otorite", "**Yabgu** ve **boy beyleri** arasında **gerilim** tipiktir.", "Siyasi"),
  c(4, "Hazar–Rus temasları", "**İdil** çevresinde **Viking–Rus** akınları ve **ticaret** ilişkileri **çatışmalı** olabilir.", "Diplomasi"),
  c(4, "Kıpçak yayılması ve Slav dünyası", "**Kıpçak** akınları **Kiev Rus** topraklarını da **etkiler**.", "Askeri"),
  c(4, "Peçeneklerde elçi ve fidye", "**Esir** ve **fidye** ekonomisi **sınır savaşları** ile bağlantılıdır.", "Ekonomi"),
  c(4, "Oğuz sanatı ve halı (genel)", "Sonraki dönem **Oğuz** kültür ürünleri **geniş** coğrafyaya yayılır.", "Kültür"),
  c(4, "Hazarlar: çok etnik yapı", "**Türk**, **İran**, **Slav** ve **diğer** unsurlar **merkez** otorite altında **karma** yapı oluşturur.", "Toplum"),
  c(4, "Kıpçak hukuku ve töre", "**Töre** benzeri **kabile hukuku** **yönetimde** rol oynar.", "Hukuk"),
  c(4, "Peçenek–Oğuz rekabeti", "**Step** kaynakları ve **güzergâh** kontrolü için **rekabet** görülür.", "Siyasi"),
  c(4, "Oğuzlar ve İslam öncesi inanç", "**İslam öncesi** dönemde **Gök Tanrı** ve **geleneksel** inançlar ağırlıklıdır.", "İnanç"),
  c(4, "Hazar ordusu: süvari ve süvari–piyade karışımı", "**Süvari** ağırlıklı **taktik** komşu devletlere **zorluk** çıkarır.", "Askeri"),
  c(4, "Kıpçakların paralı askerliği", "**Bizans** ve **diğer** devletler **Kıpçak** süvarisini **istihdam** eder.", "Askeri"),
  c(4, "Peçeneklerin Balkan yerleşimi", "Bazı gruplar **Bizans** sınırında **iskân** edilir.", "Toplum"),
  c(4, "Oğuzlar ve hayvancılık ekonomisi", "**Sürü** ekonomisi **göç** kabiliyetini **korur**.", "Ekonomi"),
  c(4, "Hazarlar ve halife ile yazışmalar", "**Diplomatik** yazışmalar **eşitlik** ve **ticaret** koşullarını **görüşmek** için kullanılır.", "Diplomasi"),
  c(4, "Kıpçak coğrafyası: bozkır genişliği", "**Don–Volga** ile **Kafkas** arası **geniş** otlak.", "Coğrafya"),
  c(4, "Peçenekler ve Haçlı dönemi (dolaylı)", "**Haçlı** seferleri çağında **Balkan** dengeleri **karmaşık**dır.", "Tarih"),
  c(4, "Oğuzların günümüz Türk boyları ile ilişkisi", "Anlatımda **kültürel süreklilik** **dikkatle** kurulur; **soy** iddiaları **bilimsel** tartışmalıdır.", "Metod"),
  c(4, "KPSS: Hazar–Kıpçak–Peçenek–Oğuz", "**Coğrafya + komşu devlet + ekonomi** üçlüsü ile **ayırt** edin.", "Sınav"),
  c(4, "Çalışma: dörtlü tablo", "Her topluluk için **merkez**, **komşu**, **ekonomi**, **askeri rol** yazın.", "Çalışma"),
];

/** Alt konu 5: Kültür ve Uygarlık (Devlet, Ordu, Sosyal Yapı) */
const s5: Card[] = [
  c(5, "Gök Tanrı inancı: tek üst güç", "**Tengri**; gökyüzü ve evren düzeninde **üstün** ve **adil** bir güç olarak anlaşılır.", "Din"),
  c(5, "Gök Tanrı ve kutsal doğa", "**Dağ**, **su**, **ağaç** ve **gökyüzü** belirli ritüellerle **kutsanır**.", "Ritüel"),
  c(5, "Kut ve meşruiyet", "**Kut**; hükümdarın **tanrısal lütuf** ile **yönetme hakkı** olduğu inancını taşır.", "Siyasi"),
  c(5, "Kut kaybı ve isyan gerekçesi", "**Yenilgi**, **kıtlık** ve **adaletsizlik** kutun **kırıldığı** söylentilerini **besler**.", "Siyasi"),
  c(5, "Kurultay: toplanma ve karar", "**Boy reisleri** ve **ileri gelenler** **savaş–barış**, **veraset** ve **ittifak** konularını **müşavere** eder.", "Kurum"),
  c(5, "Kurultay ve merkezi otorite", "**Kağan** kararları **boylarla** uzlaşma gerektirir; aksi **isyan** riski doğar.", "Kurum"),
  c(5, "Onlu askeri sistem", "**On–yüz–bin** birimleri **emir zincirini** basitleştirir ve **sefer** hızını artırır.", "Ordu"),
  c(5, "Onlu sistem ve disiplin", "**Küçük birim** dayanışması **dağılma** riskini azaltır.", "Ordu"),
  c(5, "Töre: yazısız hukuk", "**Suç–ceza**, **miras**, **misafirperverlik** ve **savaş kuralları** törede **yer alır**.", "Hukuk"),
  c(5, "Töre ve kağan yasaları", "Merkezi **yasalar** zamanla töre ile **sentez** olabilir.", "Hukuk"),
  c(5, "Kağan ve yabgu unvanları", "**Kağan** merkez **hükümdar**; **yabgu** genelde **kol** komutanı veya **bölge** lideridir.", "Unvan"),
  c(5, "Şad ve tarım–ticaret bakanlığı benzeri", "Anlatımda **şad** gibi unvanlar **idari** roller taşır.", "İdare"),
  c(5, "Bozkırda el ve süvari", "**At** **süvarisi** çekirdek; **piyade** ikincil **roller** üstlenir.", "Ordu"),
  c(5, "Ok–yay taktikleri", "**Gerilla benzeri** çekilme ve **ok yağmuru** **ağır zırhlı** düşmana karşı **etkilidir**.", "Askeri"),
  c(5, "Misafirperverlik ve güven", "**Yabancı elçi** ve **sığınmacı** töreye göre **korunur**.", "Hukuk"),
  c(5, "Kadın ve erkek: töre içinde", "**Miras**, **evlilik** ve **intikam** kuralları **cinsiyet** rollerini **şekillendirir**.", "Toplum"),
  c(5, "Şaman ve ritüel", "**Şaman**; **ruhlar** ile **topluluk** arasında **aracı** kabul edilir.", "İnanç"),
  c(5, "Kurban ve davet törenleri", "**Hayvan kurbanı** ve **şölen** liderin **meşruiyetini** **gösterir**.", "Ritüel"),
  c(5, "At kültü ve gömüt gelenekleri", "**At** **gömme** ve **hediye** ölüm sonrası **prestij** taşır.", "Kültür"),
  c(5, "Orta çadır ve hanlık düzeni", "**Han** merkezde; **aile** ve **hizmetkâr** düzeni **hiyerarşik**dir.", "Toplum"),
  c(5, "Türk ordusunda disiplin ve töre cezası", "**Kaçan**, **ihanet eden** asker **ağır ceza** ile yüzleşir.", "Askeri"),
  c(5, "Gök Tanrı ve yıldız gözlemi", "Bazı ritüellerde **gökyüzü** gözlemi **sefer** zamanlaması için **kullanılır**.", "İnanç"),
  c(5, "Kurultay ve veraset krizi", "**Kardeş–oğul** sırası **çatışmaları** **iç savaş** çıkarabilir.", "Siyasi"),
  c(5, "Onlu sistem ve yağma düzeni", "**Ganimet** paylaşımı **birim** başına **düzenlenir**.", "Ekonomi"),
  c(5, "Töre ve ticaret anlaşmaları", "**And** ve **söz** törede **kutsal** bağlayıcıdır.", "Hukuk"),
  c(5, "Gök Tanrı inancı ve yabancı dinler", "**Budizm**, **Maniheizm** ve **Hristiyanlık** ile **karşılaşma** sonraki dönemde **yoğunlaşır**.", "Din"),
  c(5, "Devlet sembolleri: sancak ve tuğ", "**Tuğ** ve **sancak** **komuta** ve **kimlik** göstergesidir.", "Askeri"),
  c(5, "Sosyal tabakalaşma: bey ve köle", "**Bey**, **serbest** ve **köle** ayrımları **savaş ganimeti** ile **pekişebilir**.", "Toplum"),
  c(5, "KPSS: kurumlar dörtlüsü", "**Gök Tanrı – Kut – Kurultay – Töre** zincirini **ezber** değil **ilişki** ile öğrenin.", "Sınav"),
  c(5, "Çalışma: onlu sistem örneği", "10 → 100 → 1000 biriminde **komuta** nasıl **kısalır** yazın.", "Çalışma"),
  c(5, "İslam öncesi kültür mirası ve sonrası", "**Töre** ve **Gök Tanrı** unsurları **İslam sonrası** bazı **adetlerde** **iz** bırakır.", "Kültür"),
];

const cards: Card[] = [...s1, ...s2, ...s3, ...s4, ...s5];

for (let i = 1; i <= 5; i++) {
  const n = cards.filter((x) => x.subtopicSortOrder === i).length;
  if (n < 30) {
    throw new Error(`subtopicSortOrder ${i} için yetersiz kart: ${n}`);
  }
}

const out = {
  topicSortOrder: 1,
  cards,
};

const outPath = join(__dirname, "..", "prisma", "data", "information-topic-1.json");
writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log(`Yazıldı: ${outPath} (${cards.length} kart, alt konu başına ≥30).`);
