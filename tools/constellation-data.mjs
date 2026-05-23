// 12 burc icin yildiz konstelasyon haritasi.
// Coords: 0-100 normalized viewport (sol-ust 0,0, sag-alt 100,100).
// size: 1 (kucuk) - 4 (parlak ana yildiz, brightness icin).
// lines: stars dizinindeki [from, to] indeks ciftleri.

export const constellations = {
  aries: {
    stars: [
      { x: 55, y: 35, size: 4, name: 'Hamal' },
      { x: 42, y: 50, size: 3, name: 'Sheratan' },
      { x: 35, y: 60, size: 2, name: 'Mesarthim' },
      { x: 65, y: 75, size: 2, name: 'Botein' },
    ],
    lines: [[0, 1], [1, 2], [0, 3]],
  },
  taurus: {
    stars: [
      { x: 60, y: 50, size: 4, name: 'Aldebaran' },
      { x: 45, y: 40, size: 2, name: 'Hyades A' },
      { x: 50, y: 55, size: 2, name: 'Hyades B' },
      { x: 70, y: 60, size: 2, name: 'Hyades C' },
      { x: 30, y: 25, size: 3, name: 'Pleiades' },
      { x: 80, y: 75, size: 2, name: 'Elnath' },
    ],
    lines: [[0, 1], [0, 2], [0, 3], [3, 5], [4, 1]],
  },
  gemini: {
    stars: [
      { x: 40, y: 25, size: 4, name: 'Castor' },
      { x: 60, y: 30, size: 4, name: 'Pollux' },
      { x: 42, y: 50, size: 2, name: 'Mebsuta' },
      { x: 58, y: 50, size: 2, name: 'Wasat' },
      { x: 40, y: 75, size: 2, name: 'Alhena' },
      { x: 60, y: 75, size: 2, name: 'Tejat' },
    ],
    lines: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5]],
  },
  cancer: {
    stars: [
      { x: 50, y: 30, size: 3, name: 'Acubens' },
      { x: 35, y: 50, size: 2, name: 'Asellus B.' },
      { x: 65, y: 50, size: 2, name: 'Asellus A.' },
      { x: 50, y: 70, size: 2, name: 'Tarf' },
    ],
    lines: [[0, 1], [0, 2], [1, 3], [2, 3]],
  },
  leo: {
    stars: [
      { x: 25, y: 60, size: 4, name: 'Regulus' },
      { x: 40, y: 45, size: 3, name: 'Algieba' },
      { x: 50, y: 35, size: 2, name: 'Adhafera' },
      { x: 60, y: 30, size: 2, name: 'Eta Leonis' },
      { x: 75, y: 50, size: 3, name: 'Zosma' },
      { x: 80, y: 70, size: 3, name: 'Denebola' },
      { x: 60, y: 65, size: 2, name: 'Chertan' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]],
  },
  virgo: {
    stars: [
      { x: 55, y: 80, size: 4, name: 'Spica' },
      { x: 45, y: 65, size: 2, name: 'Heze' },
      { x: 60, y: 55, size: 2, name: 'Porrima' },
      { x: 40, y: 45, size: 3, name: 'Vindemiatrix' },
      { x: 75, y: 40, size: 2, name: 'Zavijava' },
      { x: 30, y: 30, size: 2, name: 'Auva' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 5], [2, 4]],
  },
  libra: {
    stars: [
      { x: 30, y: 40, size: 3, name: 'Zubeneschamali' },
      { x: 70, y: 40, size: 3, name: 'Zubenelgenubi' },
      { x: 35, y: 70, size: 2, name: 'Brachium' },
      { x: 65, y: 75, size: 2, name: 'Sigma Librae' },
    ],
    lines: [[0, 1], [0, 2], [1, 3], [2, 3]],
  },
  scorpio: {
    stars: [
      { x: 30, y: 25, size: 2, name: 'Acrab' },
      { x: 35, y: 35, size: 3, name: 'Dschubba' },
      { x: 40, y: 45, size: 4, name: 'Antares' },
      { x: 50, y: 55, size: 2, name: 'Tau Scorpii' },
      { x: 60, y: 65, size: 2, name: 'Epsilon' },
      { x: 75, y: 70, size: 3, name: 'Shaula' },
      { x: 80, y: 60, size: 2, name: 'Lesath' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  },
  sagittarius: {
    stars: [
      { x: 30, y: 50, size: 3, name: 'Kaus Borealis' },
      { x: 45, y: 35, size: 3, name: 'Nunki' },
      { x: 60, y: 30, size: 2, name: 'Albaldah' },
      { x: 70, y: 50, size: 3, name: 'Ascella' },
      { x: 55, y: 65, size: 2, name: 'Kaus Media' },
      { x: 40, y: 75, size: 2, name: 'Kaus Australis' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  capricorn: {
    stars: [
      { x: 25, y: 40, size: 3, name: 'Algedi' },
      { x: 75, y: 45, size: 3, name: 'Deneb Algedi' },
      { x: 35, y: 60, size: 2, name: 'Dabih' },
      { x: 50, y: 75, size: 2, name: 'Nashira' },
      { x: 65, y: 65, size: 2, name: 'Theta Cap' },
    ],
    lines: [[0, 2], [2, 3], [3, 4], [4, 1]],
  },
  aquarius: {
    stars: [
      { x: 25, y: 40, size: 3, name: 'Sadalmelik' },
      { x: 40, y: 50, size: 2, name: 'Sadachbia' },
      { x: 50, y: 35, size: 2, name: 'Albali' },
      { x: 60, y: 50, size: 2, name: 'Skat' },
      { x: 75, y: 40, size: 3, name: 'Sadalsuud' },
      { x: 50, y: 75, size: 2, name: 'Fomalhaut' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5]],
  },
  pisces: {
    stars: [
      { x: 20, y: 50, size: 2, name: 'Alrescha' },
      { x: 35, y: 60, size: 2, name: 'Omega Psc' },
      { x: 45, y: 55, size: 3, name: 'Eta Psc' },
      { x: 55, y: 50, size: 2, name: 'Gamma Psc' },
      { x: 65, y: 55, size: 2, name: 'Theta Psc' },
      { x: 75, y: 45, size: 3, name: 'Iota Psc' },
      { x: 80, y: 60, size: 2, name: 'Lambda Psc' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
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
