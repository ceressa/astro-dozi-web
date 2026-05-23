// 12 burc icin yildiz konstelasyon haritasi (GERCEK SEKILLERLE).
//
// Koordinatlar: 0-100 normalized viewport (sol-ust 0,0, sag-alt 100,100).
//   - Goksel haritada dogu sol, bati sag oldugu icin RA artisi sol-yon-azalan
//     mantiginda Y eksenini astronomik haritalardaki yaygin "yukari = kuzey,
//     sol = dogu" yonelimine adapte ettik (tipik Sky&Telescope chart gibi).
// size: 1 (loş) - 5 (alpha star, parlak).
// lines: stars dizinindeki [from, to] indeks ciftleri (gercek IAU
//   asterism cizgilerine sadik).
//
// Kaynak: IAU resmi takimyildizi sinirlari + Sky&Telescope / Stellarium
// asterism cizgileri kullanarak orantili tanimlandi.

export const constellations = {
  // ARIES: kucuk yay, Hamal-Sheratan-Mesarthim ve ayri 41 Ari
  aries: {
    stars: [
      { x: 60, y: 35, size: 4, name: 'Hamal (α Ari)' },
      { x: 48, y: 45, size: 3, name: 'Sheratan (β Ari)' },
      { x: 42, y: 52, size: 2, name: 'Mesarthim (γ Ari)' },
      { x: 80, y: 70, size: 2, name: '41 Arietis' },
    ],
    lines: [[0, 1], [1, 2]],
  },

  // TAURUS: Aldebaran + Hyades V + iki boynuz + Pleiades (ayrı küme)
  // NOT: Pleiades, IAU asterism cizgileri ile Hyades'e bagli degildir.
  // Sadece ayni takimyildiz icinde gokyuzunde duran "Golden Gate"in
  // bati yanidir. Bu yuzden Pleiades cizgisiz yildiz olarak duruyor.
  taurus: {
    stars: [
      { x: 58, y: 55, size: 5, name: 'Aldebaran (α Tau)' },
      { x: 50, y: 50, size: 2, name: 'γ Tau (Hyades, Prima Hyadum)' },
      { x: 53, y: 60, size: 2, name: 'δ Tau (Hyades, Secunda Hyadum)' },
      { x: 48, y: 62, size: 2, name: 'ε Tau (Hyades, Ain)' },
      { x: 80, y: 25, size: 4, name: 'Elnath (β Tau, kuzey boynuz)' },
      { x: 72, y: 78, size: 3, name: 'ζ Tau (guney boynuz)' },
      { x: 18, y: 35, size: 3, name: 'Pleiades (M45, ayrı küme)' },
    ],
    lines: [
      [0, 1], [0, 2], [0, 3],  // Aldebaran -> Hyades V
      [1, 4],                   // Hyades top -> Elnath (kuzey boynuz)
      [0, 5],                   // Aldebaran -> ζ Tau (guney boynuz)
      // Pleiades cizgisiz duruyor (IAU asterism boyle)
    ],
  },

  // GEMINI: iki paralel kardes - Castor (kuzey) ve Pollux (guney)
  gemini: {
    stars: [
      { x: 35, y: 22, size: 4, name: 'Castor (α Gem)' },
      { x: 50, y: 28, size: 5, name: 'Pollux (β Gem)' },
      { x: 38, y: 38, size: 2, name: 'τ Gem' },
      { x: 52, y: 42, size: 2, name: 'ι Gem' },
      { x: 40, y: 55, size: 2, name: 'ε Gem (Mebsuta)' },
      { x: 55, y: 60, size: 2, name: 'δ Gem (Wasat)' },
      { x: 35, y: 75, size: 3, name: 'γ Gem (Alhena, ayak)' },
      { x: 58, y: 80, size: 3, name: 'ξ Gem (Alzirr, ayak)' },
    ],
    lines: [
      [0, 2], [2, 4], [4, 6],  // Castor kol-bacak zinciri
      [1, 3], [3, 5], [5, 7],  // Pollux kol-bacak zinciri
      [0, 1],                   // Iki kardesin basini birlestir
    ],
  },

  // CANCER: ters Y (zayif takimyildiz, 4 yildiz)
  cancer: {
    stars: [
      { x: 50, y: 30, size: 2, name: 'ι Cnc' },
      { x: 52, y: 50, size: 3, name: 'γ Cnc (Asellus Borealis)' },
      { x: 58, y: 55, size: 3, name: 'δ Cnc (Asellus Australis)' },
      { x: 75, y: 70, size: 2, name: 'α Cnc (Acubens)' },
      { x: 32, y: 75, size: 3, name: 'β Cnc (Tarf)' },
    ],
    lines: [
      [0, 1], [1, 2],
      [2, 3], [2, 4],
    ],
  },

  // LEO: orak (Sickle, "?" tersine) + ucgen govde + kuyruk Denebola
  // NOT: Sickle tersine soru isareti, acik kavis, kapanmaz. Regulus
  // > η > γ > ζ > μ > ε (Algenubi) zinciri Algenubi'de biter, geri donmez.
  leo: {
    stars: [
      { x: 28, y: 65, size: 5, name: 'Regulus (α Leo)' },
      { x: 32, y: 55, size: 3, name: 'η Leo' },
      { x: 38, y: 45, size: 4, name: 'Algieba (γ Leo)' },
      { x: 42, y: 35, size: 2, name: 'Adhafera (ζ Leo)' },
      { x: 37, y: 25, size: 2, name: 'Rasalas (μ Leo)' },
      { x: 28, y: 28, size: 2, name: 'Algenubi (ε Leo)' },
      { x: 60, y: 50, size: 3, name: 'Chertan (θ Leo)' },
      { x: 65, y: 40, size: 3, name: 'Zosma (δ Leo)' },
      { x: 85, y: 55, size: 4, name: 'Denebola (β Leo)' },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],   // Sickle acik (kapanmaz)
      [2, 6], [6, 7], [7, 8], [6, 8], [0, 6],   // govde ucgeni + Regulus baglantisi
    ],
  },

  // VIRGO: uzanan kadin sekli, Spica gunde-bati'da parlak
  virgo: {
    stars: [
      { x: 65, y: 80, size: 5, name: 'Spica (α Vir)' },
      { x: 55, y: 65, size: 2, name: 'ζ Vir (Heze)' },
      { x: 45, y: 55, size: 3, name: 'γ Vir (Porrima)' },
      { x: 50, y: 45, size: 2, name: 'η Vir (Zaniah)' },
      { x: 35, y: 45, size: 3, name: 'δ Vir (Auva)' },
      { x: 38, y: 30, size: 3, name: 'ε Vir (Vindemiatrix)' },
      { x: 75, y: 40, size: 2, name: 'β Vir (Zavijava)' },
    ],
    lines: [
      [0, 1], [1, 2], [2, 4], [4, 5],   // ana govde
      [2, 3], [3, 6],                    // sag kol Zavijava'ya
    ],
  },

  // LIBRA: terazi kefesi paralelkenari
  libra: {
    stars: [
      { x: 30, y: 30, size: 3, name: 'β Lib (Zubeneschamali, kuzey kefe)' },
      { x: 70, y: 45, size: 3, name: 'α Lib (Zubenelgenubi, guney kefe)' },
      { x: 55, y: 75, size: 2, name: 'γ Lib (Zubenelakrab)' },
      { x: 15, y: 65, size: 2, name: 'σ Lib (Brachium)' },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0],
    ],
  },

  // SCORPIO: J-shape - kafa ucgeni + Antares + kivrik kuyruk
  scorpio: {
    stars: [
      { x: 25, y: 25, size: 3, name: 'β Sco (Acrab, kafa)' },
      { x: 32, y: 35, size: 3, name: 'δ Sco (Dschubba)' },
      { x: 18, y: 38, size: 2, name: 'π Sco' },
      { x: 38, y: 50, size: 5, name: 'Antares (α Sco)' },
      { x: 45, y: 60, size: 2, name: 'τ Sco' },
      { x: 55, y: 70, size: 2, name: 'ε Sco' },
      { x: 65, y: 78, size: 2, name: 'μ Sco' },
      { x: 75, y: 80, size: 3, name: 'ζ Sco' },
      { x: 82, y: 73, size: 2, name: 'η Sco' },
      { x: 80, y: 62, size: 3, name: 'θ Sco (Sargas)' },
      { x: 70, y: 55, size: 2, name: 'ι Sco' },
      { x: 60, y: 50, size: 4, name: 'λ Sco (Shaula, igne)' },
      { x: 58, y: 55, size: 3, name: 'υ Sco (Lesath)' },
    ],
    lines: [
      [0, 1], [1, 2],                          // kafa ucgeni
      [1, 3],                                   // kafa -> Antares
      [3, 4], [4, 5], [5, 6], [6, 7],          // govde + kuyruk asagi
      [7, 8], [8, 9], [9, 10], [10, 11],       // kuyruk yukari kivrik
      [11, 12],                                 // igne ucu
    ],
  },

  // SAGITTARIUS: caydanlik (Teapot) - kapak, govde, kulp, agiz
  sagittarius: {
    stars: [
      { x: 22, y: 70, size: 4, name: 'γ Sgr (Alnasl, agiz ucu)' },
      { x: 30, y: 78, size: 5, name: 'ε Sgr (Kaus Australis, govde TB)' },
      { x: 42, y: 80, size: 3, name: 'φ Sgr (govde alt)' },
      { x: 55, y: 78, size: 2, name: 'τ Sgr' },
      { x: 65, y: 65, size: 4, name: 'ζ Sgr (Ascella, kulp ust)' },
      { x: 55, y: 55, size: 3, name: 'σ Sgr (Nunki, kapak)' },
      { x: 42, y: 55, size: 3, name: 'λ Sgr (Kaus Borealis, kapak ust)' },
      { x: 38, y: 65, size: 3, name: 'δ Sgr (Kaus Media)' },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4],   // alt govde + sag kenar
      [4, 5], [5, 6], [6, 7], [7, 1],   // kapak + sol kenar
      [7, 0],                            // delta -> alnasl spout baglantisi
      [4, 3],                            // kulp ic dugum
    ],
  },

  // CAPRICORNUS: yelken ucgeni (boat shape)
  capricorn: {
    stars: [
      { x: 22, y: 30, size: 3, name: 'α Cap (Algedi)' },
      { x: 28, y: 35, size: 3, name: 'β Cap (Dabih)' },
      { x: 40, y: 60, size: 2, name: 'θ Cap' },
      { x: 50, y: 72, size: 3, name: 'ζ Cap' },
      { x: 65, y: 65, size: 2, name: 'ε Cap' },
      { x: 75, y: 50, size: 3, name: 'γ Cap (Nashira)' },
      { x: 82, y: 45, size: 3, name: 'δ Cap (Deneb Algedi)' },
    ],
    lines: [
      [0, 1],                          // bas dugum
      [1, 2], [2, 3],                  // sol kenar asagi
      [3, 4], [4, 5],                  // alt + sag kenar yukari
      [5, 6], [6, 0],                  // ust kenar kapanis
    ],
  },

  // AQUARIUS: Y-bar + asagi akan su zinciri
  aquarius: {
    stars: [
      { x: 25, y: 30, size: 4, name: 'α Aqr (Sadalmelik)' },
      { x: 55, y: 25, size: 4, name: 'β Aqr (Sadalsuud)' },
      { x: 40, y: 38, size: 2, name: 'γ Aqr (Sadachbia)' },
      { x: 50, y: 45, size: 2, name: 'ζ Aqr' },
      { x: 60, y: 55, size: 2, name: 'η Aqr' },
      { x: 65, y: 68, size: 3, name: 'δ Aqr (Skat)' },
      { x: 75, y: 75, size: 2, name: 'φ Aqr (su damlasi)' },
      { x: 80, y: 88, size: 3, name: 'τ Aqr (su damlasi sonu)' },
    ],
    lines: [
      [0, 1],                            // ust bar
      [1, 3], [3, 2], [2, 0],            // Y centeri
      [3, 4], [4, 5], [5, 6], [6, 7],    // asagi akan su
    ],
  },

  // PISCES: iki balik V seklinde Alrescha'da birlesir
  pisces: {
    stars: [
      { x: 65, y: 75, size: 3, name: 'α Psc (Alrescha, V dugumu)' },
      { x: 55, y: 65, size: 2, name: 'ω Psc' },
      { x: 42, y: 55, size: 2, name: 'ξ Psc' },
      { x: 28, y: 50, size: 3, name: 'γ Psc (circlet)' },
      { x: 18, y: 55, size: 2, name: 'κ Psc' },
      { x: 12, y: 65, size: 2, name: 'λ Psc' },
      { x: 18, y: 75, size: 2, name: 'ι Psc' },
      { x: 75, y: 60, size: 2, name: 'η Psc' },
      { x: 82, y: 45, size: 3, name: 'ο Psc' },
      { x: 88, y: 30, size: 2, name: 'φ Psc' },
      { x: 80, y: 18, size: 3, name: 'υ Psc (kuzey balik)' },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3],            // sol kol Alrescha -> circlet
      [3, 4], [4, 5], [5, 6], [6, 3],    // circlet halkasi
      [0, 7], [7, 8], [8, 9], [9, 10],   // sag kol Alrescha -> kuzey balik
    ],
  },
};

// Burc sembol siralamasi 12'lik wheel icin (Koc=0, Boga=1, ... saat yonu).
export const wheelOrder = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

export const wheelSymbols = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

export const wheelLabels = {
  aries: 'Koç', taurus: 'Boğa', gemini: 'İkizler', cancer: 'Yengeç',
  leo: 'Aslan', virgo: 'Başak', libra: 'Terazi', scorpio: 'Akrep',
  sagittarius: 'Yay', capricorn: 'Oğlak', aquarius: 'Kova', pisces: 'Balık',
};

export const wheelSlugs = {
  aries: 'koc', taurus: 'boga', gemini: 'ikizler', cancer: 'yengec',
  leo: 'aslan', virgo: 'basak', libra: 'terazi', scorpio: 'akrep',
  sagittarius: 'yay', capricorn: 'oglak', aquarius: 'kova', pisces: 'balik',
};
