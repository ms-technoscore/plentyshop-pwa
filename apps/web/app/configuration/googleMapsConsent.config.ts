export type GoogleMapsConsentCopy = {
  message: string;
  ctaBefore: string;
  loadButton: string;
  ctaAfter: string;
};

/**
 * Consent copy keyed by language code (vue-i18n locales + Google Translate codes).
 * Kept outside vue-i18n so the widget can stay `notranslate` (GT DOM mutation breaks Vue clicks)
 * while still following the language the visitor selected.
 */
export const googleMapsConsentTranslations: Record<string, GoogleMapsConsentCopy> = {
  en: {
    message:
      "This page includes a Google Maps map. Loading the map establishes a connection to Google's servers. In doing so, personal data, in particular your IP address and information about your browser and device, may be transmitted to and processed by Google.",
    ctaBefore: 'By clicking on',
    loadButton: 'Load map',
    ctaAfter: 'you consent to the transfer of your data to Google.',
  },
  de: {
    message:
      'Auf dieser Seite ist eine Karte von Google Maps eingebunden. Beim Laden der Karte wird eine Verbindung zu Servern von Google hergestellt. Dabei können personenbezogene Daten, insbesondere Ihre IP-Adresse sowie Informationen zu Ihrem Browser und Gerät, an Google übertragen und dort verarbeitet werden.',
    ctaBefore: 'Mit Klick auf',
    loadButton: 'Karte laden',
    ctaAfter: 'willigen Sie in die Datenübertragung an Google ein.',
  },
  pt: {
    message:
      'Esta página inclui um mapa do Google Maps. Ao carregar o mapa, é estabelecida uma ligação aos servidores da Google. Nesse processo, dados pessoais, em particular o seu endereço IP e informações sobre o seu navegador e dispositivo, podem ser transmitidos à Google e aí processados.',
    ctaBefore: 'Ao clicar em',
    loadButton: 'Carregar mapa',
    ctaAfter: 'autoriza a transferência dos seus dados para a Google.',
  },
  es: {
    message:
      'Esta página incluye un mapa de Google Maps. Al cargar el mapa se establece una conexión con los servidores de Google. Con ello, pueden transmitirse a Google y ser tratados allí datos personales, en particular su dirección IP e información sobre su navegador y dispositivo.',
    ctaBefore: 'Al hacer clic en',
    loadButton: 'Cargar mapa',
    ctaAfter: 'usted consiente la transferencia de sus datos a Google.',
  },
  fr: {
    message:
      "Cette page intègre une carte Google Maps. Le chargement de la carte établit une connexion aux serveurs de Google. Des données personnelles, notamment votre adresse IP ainsi que des informations sur votre navigateur et votre appareil, peuvent alors être transmises à Google et y être traitées.",
    ctaBefore: 'En cliquant sur',
    loadButton: 'Charger la carte',
    ctaAfter: 'vous consentez au transfert de vos données à Google.',
  },
  it: {
    message:
      'Questa pagina include una mappa di Google Maps. Il caricamento della mappa stabilisce una connessione ai server di Google. In tal modo, i dati personali, in particolare il tuo indirizzo IP e le informazioni sul browser e sul dispositivo, possono essere trasmessi a Google e ivi elaborati.',
    ctaBefore: 'Cliccando su',
    loadButton: 'Carica mappa',
    ctaAfter: 'acconsenti al trasferimento dei tuoi dati a Google.',
  },
  nl: {
    message:
      'Op deze pagina is een Google Maps-kaart opgenomen. Bij het laden van de kaart wordt een verbinding met de servers van Google tot stand gebracht. Hierbij kunnen persoonsgegevens, met name uw IP-adres en informatie over uw browser en apparaat, aan Google worden doorgegeven en daar worden verwerkt.',
    ctaBefore: 'Door te klikken op',
    loadButton: 'Kaart laden',
    ctaAfter: 'stemt u in met de gegevensoverdracht aan Google.',
  },
  pl: {
    message:
      'Na tej stronie osadzona jest mapa Google Maps. Załadowanie mapy nawiązuje połączenie z serwerami Google. W związku z tym dane osobowe, w szczególności Twój adres IP oraz informacje o przeglądarce i urządzeniu, mogą zostać przekazane do Google i tam przetwarzane.',
    ctaBefore: 'Klikając',
    loadButton: 'Załaduj mapę',
    ctaAfter: 'wyrażasz zgodę na przekazanie swoich danych do Google.',
  },
  ru: {
    message:
      'На этой странице встроена карта Google Maps. При загрузке карты устанавливается соединение с серверами Google. При этом персональные данные, в частности ваш IP-адрес, а также сведения о браузере и устройстве, могут быть переданы в Google и там обработаны.',
    ctaBefore: 'Нажимая',
    loadButton: 'Загрузить карту',
    ctaAfter: 'вы соглашаетесь на передачу ваших данных в Google.',
  },
  tr: {
    message:
      'Bu sayfada bir Google Maps haritası yer almaktadır. Harita yüklenirken Google sunucularına bir bağlantı kurulur. Bu sırada kişisel verileriniz, özellikle IP adresiniz ile tarayıcı ve cihaz bilgileriniz Google’a aktarılabilir ve orada işlenebilir.',
    ctaBefore: 'Şuna tıklayarak',
    loadButton: 'Haritayı yükle',
    ctaAfter: 'verilerinizin Google’a aktarılmasına izin vermiş olursunuz.',
  },
  cn: {
    message:
      '本页嵌入了 Google Maps 地图。加载地图时会连接 Google 服务器。在此过程中，个人数据（尤其是您的 IP 地址以及浏览器和设备信息）可能会被传输至 Google 并由其处理。',
    ctaBefore: '点击',
    loadButton: '加载地图',
    ctaAfter: '即表示您同意将数据传输给 Google。',
  },
  'zh-CN': {
    message:
      '本页嵌入了 Google Maps 地图。加载地图时会连接 Google 服务器。在此过程中，个人数据（尤其是您的 IP 地址以及浏览器和设备信息）可能会被传输至 Google 并由其处理。',
    ctaBefore: '点击',
    loadButton: '加载地图',
    ctaAfter: '即表示您同意将数据传输给 Google。',
  },
  'zh-TW': {
    message:
      '本頁嵌入了 Google Maps 地圖。載入地圖時會連線至 Google 伺服器。在此過程中，個人資料（尤其是您的 IP 位址以及瀏覽器和裝置資訊）可能會傳輸至 Google 並由其處理。',
    ctaBefore: '點擊',
    loadButton: '載入地圖',
    ctaAfter: '即表示您同意將資料傳輸給 Google。',
  },
  nn: {
    message:
      'تتضمن هذه الصفحة خريطة من Google Maps. يؤدي تحميل الخريطة إلى إنشاء اتصال بخوادم Google. وبذلك قد تُنقل بيانات شخصية، ولا سيما عنوان IP الخاص بك ومعلومات عن متصفحك وجهازك، إلى Google وتُعالَج هناك.',
    ctaBefore: 'بالنقر على',
    loadButton: 'تحميل الخريطة',
    ctaAfter: 'فإنك توافق على نقل بياناتك إلى Google.',
  },
  ar: {
    message:
      'تتضمن هذه الصفحة خريطة من Google Maps. يؤدي تحميل الخريطة إلى إنشاء اتصال بخوادم Google. وبذلك قد تُنقل بيانات شخصية، ولا سيما عنوان IP الخاص بك ومعلومات عن متصفحك وجهازك، إلى Google وتُعالَج هناك.',
    ctaBefore: 'بالنقر على',
    loadButton: 'تحميل الخريطة',
    ctaAfter: 'فإنك توافق على نقل بياناتك إلى Google.',
  },
  da: {
    message:
      'På denne side er der indlejret et Google Maps-kort. Når kortet indlæses, oprettes der forbindelse til Googles servere. Personoplysninger, især din IP-adresse samt oplysninger om din browser og enhed, kan derved blive overført til Google og behandlet dér.',
    ctaBefore: 'Ved at klikke på',
    loadButton: 'Indlæs kort',
    ctaAfter: 'accepterer du overførslen af dine data til Google.',
  },
  se: {
    message:
      'På den här sidan finns en Google Maps-karta inbäddad. När kartan laddas upprättas en anslutning till Googles servrar. Därvid kan personuppgifter, särskilt din IP-adress samt information om din webbläsare och enhet, överföras till Google och behandlas där.',
    ctaBefore: 'Genom att klicka på',
    loadButton: 'Ladda karta',
    ctaAfter: 'samtycker du till att dina uppgifter överförs till Google.',
  },
  sv: {
    message:
      'På den här sidan finns en Google Maps-karta inbäddad. När kartan laddas upprättas en anslutning till Googles servrar. Därvid kan personuppgifter, särskilt din IP-adress samt information om din webbläsare och enhet, överföras till Google och behandlas där.',
    ctaBefore: 'Genom att klicka på',
    loadButton: 'Ladda karta',
    ctaAfter: 'samtycker du till att dina uppgifter överförs till Google.',
  },
  fi: {
    message:
      'Tälle sivulle on upotettu Google Maps -kartta. Kartan lataaminen muodostaa yhteyden Googlen palvelimiin. Tällöin henkilötietoja, erityisesti IP-osoitteesi sekä tietoja selaimestasi ja laitteestasi, voidaan siirtää Googlelle ja käsitellä siellä.',
    ctaBefore: 'Napsauttamalla',
    loadButton: 'Lataa kartta',
    ctaAfter: 'suostut tietojesi siirtoon Googlelle.',
  },
  ro: {
    message:
      'Această pagină include o hartă Google Maps. La încărcarea hărții se stabilește o conexiune cu serverele Google. În acest proces, datele personale, în special adresa dvs. IP și informații despre browser și dispozitiv, pot fi transmise către Google și prelucrate acolo.',
    ctaBefore: 'Făcând clic pe',
    loadButton: 'Încarcă harta',
    ctaAfter: 'sunteți de acord cu transferul datelor dvs. către Google.',
  },
  bg: {
    message:
      'На тази страница е вградена карта на Google Maps. При зареждане на картата се установява връзка със сървърите на Google. При това лични данни, по-специално вашият IP адрес, както и информация за браузъра и устройството ви, могат да бъдат предадени на Google и обработвани там.',
    ctaBefore: 'С кликване върху',
    loadButton: 'Зареди карта',
    ctaAfter: 'давате съгласие за предаване на данните ви към Google.',
  },
  cz: {
    message:
      'Na této stránce je vložena mapa Google Maps. Načtením mapy se naváže spojení se servery Google. Přitom mohou být osobní údaje, zejména vaše IP adresa a informace o prohlížeči a zařízení, předány společnosti Google a tam zpracovány.',
    ctaBefore: 'Kliknutím na',
    loadButton: 'Načíst mapu',
    ctaAfter: 'souhlasíte s předáním svých údajů společnosti Google.',
  },
  cs: {
    message:
      'Na této stránce je vložena mapa Google Maps. Načtením mapy se naváže spojení se servery Google. Přitom mohou být osobní údaje, zejména vaše IP adresa a informace o prohlížeči a zařízení, předány společnosti Google a tam zpracovány.',
    ctaBefore: 'Kliknutím na',
    loadButton: 'Načíst mapu',
    ctaAfter: 'souhlasíte s předáním svých údajů společnosti Google.',
  },
  sk: {
    message:
      'Na tejto stránke je vložená mapa Google Maps. Načítaním mapy sa nadviaže spojenie so servermi Google. Pri tom môžu byť osobné údaje, najmä vaša IP adresa a informácie o prehliadači a zariadení, prenesené spoločnosti Google a tam spracované.',
    ctaBefore: 'Kliknutím na',
    loadButton: 'Načítať mapu',
    ctaAfter: 'súhlasíte s prenosom svojich údajov spoločnosti Google.',
  },
  hr: {
    message:
      'Na ovoj je stranici ugrađena Google Maps karta. Učitavanjem karte uspostavlja se veza s Googleovim poslužiteljima. Pritom se osobni podaci, osobito vaša IP adresa te informacije o pregledniku i uređaju, mogu prenijeti Googleu i tamo obrađivati.',
    ctaBefore: 'Klikom na',
    loadButton: 'Učitaj kartu',
    ctaAfter: 'pristajete na prijenos svojih podataka Googleu.',
  },
  hu: {
    message:
      'Ezen az oldalon Google Maps térkép van beágyazva. A térkép betöltésekor kapcsolat jön létre a Google szervereivel. Ennek során személyes adatok, különösen az IP-címe, valamint a böngészőjére és eszközére vonatkozó információk továbbíthatók a Google-nak, és ott feldolgozásra kerülhetnek.',
    ctaBefore: 'A következőre kattintva',
    loadButton: 'Térkép betöltése',
    ctaAfter: 'hozzájárul adatai Google részére történő továbbításához.',
  },
  lt: {
    message:
      'Šiame puslapyje įterptas „Google Maps“ žemėlapis. Įkeliant žemėlapį užmezgamas ryšys su „Google“ serveriais. Tokiu atveju asmens duomenys, ypač jūsų IP adresas bei informacija apie naršyklę ir įrenginį, gali būti perduoti „Google“ ir ten tvarkomi.',
    ctaBefore: 'Spustelėję',
    loadButton: 'Įkelti žemėlapį',
    ctaAfter: 'sutinkate, kad jūsų duomenys būtų perduoti „Google“.',
  },
  lv: {
    message:
      'Šajā lapā ir iegulta Google Maps karte. Ielādējot karti, tiek izveidots savienojums ar Google serveriem. Tādējādi personas dati, jo īpaši jūsu IP adrese, kā arī informācija par pārlūkprogrammu un ierīci, var tikt nodoti Google un tur apstrādāti.',
    ctaBefore: 'Noklikšķinot uz',
    loadButton: 'Ielādēt karti',
    ctaAfter: 'jūs piekrītat savu datu nodošanai Google.',
  },
  et: {
    message:
      'Sellel lehel on manustatud Google Mapsi kaart. Kaardi laadimisel luuakse ühendus Google’i serveritega. Seejuures võidakse isikuandmed, eelkõige teie IP-aadress ning teave brauseri ja seadme kohta, edastada Google’ile ja seal töödelda.',
    ctaBefore: 'Klõpsates',
    loadButton: 'Laadi kaart',
    ctaAfter: 'nõustute oma andmete edastamisega Google’ile.',
  },
  ga: {
    message:
      'Tá léarscáil Google Maps leabaithe ar an leathanach seo. Nuair a luchtaítear an léarscáil, bunaítear nasc le freastalaithe Google. D’fhéadfadh sonraí pearsanta, go háirithe do sheoladh IP agus faisnéis faoi do bhrabhsálaí agus do ghléas, a bheith curtha chuig Google agus a phróiseáil ann.',
    ctaBefore: 'Trí chliceáil ar',
    loadButton: 'Luchtaigh an léarscáil',
    ctaAfter: 'toilíonn tú le do shonraí a aistriú chuig Google.',
  },
  vn: {
    message:
      'Trang này có nhúng bản đồ Google Maps. Khi tải bản đồ, kết nối tới máy chủ của Google sẽ được thiết lập. Khi đó, dữ liệu cá nhân, đặc biệt là địa chỉ IP cũng như thông tin về trình duyệt và thiết bị của bạn, có thể được truyền tới Google và được xử lý tại đó.',
    ctaBefore: 'Bằng cách nhấp vào',
    loadButton: 'Tải bản đồ',
    ctaAfter: 'bạn đồng ý việc chuyển dữ liệu của mình cho Google.',
  },
  vi: {
    message:
      'Trang này có nhúng bản đồ Google Maps. Khi tải bản đồ, kết nối tới máy chủ của Google sẽ được thiết lập. Khi đó, dữ liệu cá nhân, đặc biệt là địa chỉ IP cũng như thông tin về trình duyệt và thiết bị của bạn, có thể được truyền tới Google và được xử lý tại đó.',
    ctaBefore: 'Bằng cách nhấp vào',
    loadButton: 'Tải bản đồ',
    ctaAfter: 'bạn đồng ý việc chuyển dữ liệu của mình cho Google.',
  },
};

/** @deprecated Prefer getGoogleMapsConsentCopy(lang). */
export const googleMapsConsentCopy = googleMapsConsentTranslations.de;

export const normalizeGoogleMapsConsentLang = (lang?: string | null): string => {
  if (!lang) return 'en';
  const raw = lang.trim().replace('_', '-');
  if (!raw || raw === 'select' || raw.toLowerCase() === 'auto') return 'en';

  const lower = raw.toLowerCase();
  if (googleMapsConsentTranslations[raw]) return raw;
  if (googleMapsConsentTranslations[lower]) return lower;

  const base = lower.split('-')[0] ?? lower;
  if (googleMapsConsentTranslations[base]) return base;

  // Shop locale aliases
  if (base === 'zh') return 'cn';
  if (base === 'sv') return 'se';
  if (base === 'cs') return 'cz';
  if (base === 'vi') return 'vn';

  return 'en';
};

export const getGoogleMapsConsentCopy = (lang?: string | null): GoogleMapsConsentCopy => {
  const key = normalizeGoogleMapsConsentLang(lang);
  return googleMapsConsentTranslations[key] ?? googleMapsConsentTranslations.en!;
};

/**
 * Komplett Konzept Verwertungs GmbH – Google Business place (not the street-address pin).
 * https://www.google.com/maps/place/Komplett+Konzept+Verwertungs+GmbH/@51.9065934,6.7897926,17z
 */
export const googleMapsKontaktEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2461.4997136410116!2d6.7897926!3d51.9065934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8605480427df1%3A0x7d584a202efb24c6!2sKomplett%20Konzept%20Verwertungs%20GmbH!5e1!3m2!1sde!2sde!4v1767780998230!5m2!1sde!2sde';

/** CMS embed still points at Dunkerstraße 29 (address geocode on the neighbour building). */
const googleMapsKontaktEmbedOverrideKeys = [
  '0x47b863f6972473f1',
  '0x39987599c938c8cf',
  'Dunkerstra',
];

/**
 * Optional static preview images keyed by a fragment of the embed URL (e.g. Google place id).
 * Upload an exact map screenshot to the CDN and add an entry here when available.
 */
export const googleMapsEmbedPreviews: Record<string, string> = {
  // Komplett Konzept – /Kontakt (business place + legacy CMS address embed)
  '0x47b8605480427df1': '/_nuxt-plenty/images/google-map-kontakt.jpg',
  '0x47b863f6972473f1': '/_nuxt-plenty/images/google-map-kontakt.jpg',
};

export const resolveGoogleMapsEmbedUrl = (embedUrl: string): string => {
  if (googleMapsKontaktEmbedOverrideKeys.some((key) => embedUrl.includes(key))) {
    return googleMapsKontaktEmbedUrl;
  }

  return embedUrl;
};

export const getGoogleMapsPreviewUrl = (embedUrl: string, dataPreview?: string): string | undefined => {
  if (dataPreview) return dataPreview;

  const resolvedEmbedUrl = resolveGoogleMapsEmbedUrl(embedUrl);

  for (const [key, url] of Object.entries(googleMapsEmbedPreviews)) {
    if (resolvedEmbedUrl.includes(key) || embedUrl.includes(key)) return url;
  }

  return undefined;
};
