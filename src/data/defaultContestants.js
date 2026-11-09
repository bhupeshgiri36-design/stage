export const INITIAL_SEATS = [
  // TEAM INFERNO (Red side - 5 seats: KABIR, AMAN, VIRAL, RIYA, SAHIL)
  {
    id: 'inferno-seat-0',
    team: 'inferno',
    seatIndex: 0,
    isLocked: false,
    isUnlocking: false,
    contestant: {
      id: 'c-inferno-0',
      name: 'Kabir',
      nickname: 'The Strategist',
      team: 'inferno',
      seatIndex: 0,
      avatarId: 'boy-1',
      jerseyNumber: 7,
      role: 'Captain',
      score: 250,
      isBuzzed: false,
      state: 'seated',
      catchphrase: 'Tera bhai kabhi haar nahi manta!',
      hometown: 'Delhi'
    }
  },
  {
    id: 'inferno-seat-1',
    team: 'inferno',
    seatIndex: 1,
    isLocked: false,
    isUnlocking: false,
    contestant: {
      id: 'c-inferno-1',
      name: 'Aman',
      nickname: 'Flame Ace',
      team: 'inferno',
      seatIndex: 1,
      avatarId: 'boy-2',
      jerseyNumber: 18,
      role: 'Hype Ace',
      score: 210,
      isBuzzed: false,
      state: 'seated',
      catchphrase: 'Pure fire on stage!',
      hometown: 'Mumbai'
    }
  },
  {
    id: 'inferno-seat-2',
    team: 'inferno',
    seatIndex: 2,
    isLocked: false,
    isUnlocking: false,
    contestant: {
      id: 'c-inferno-2',
      name: 'Viral',
      nickname: 'Buzzer King',
      team: 'inferno',
      seatIndex: 2,
      avatarId: 'boy-3',
      jerseyNumber: 23,
      role: 'Buzzer Master',
      score: 190,
      isBuzzed: false,
      state: 'seated',
      catchphrase: 'Speed over everything!',
      hometown: 'Jaipur'
    }
  },
  {
    id: 'inferno-seat-3',
    team: 'inferno',
    seatIndex: 3,
    isLocked: false,
    isUnlocking: false,
    contestant: {
      id: 'c-inferno-3',
      name: 'Riya',
      nickname: 'Blaze Queen',
      team: 'inferno',
      seatIndex: 3,
      avatarId: 'girl-1',
      jerseyNumber: 9,
      role: 'Trivia Sniper',
      score: 240,
      isBuzzed: false,
      state: 'seated',
      catchphrase: 'Mind games win trophies!',
      hometown: 'Bengaluru'
    }
  },
  {
    id: 'inferno-seat-4',
    team: 'inferno',
    seatIndex: 4,
    isLocked: false,
    isUnlocking: false,
    contestant: {
      id: 'c-inferno-4',
      name: 'Sahil',
      nickname: 'Wildcard',
      team: 'inferno',
      seatIndex: 4,
      avatarId: 'boy-4',
      jerseyNumber: 11,
      role: 'Defensive Anchor',
      score: 170,
      isBuzzed: false,
      state: 'seated',
      catchphrase: 'Inferno stands tall!',
      hometown: 'Pune'
    }
  },

  // TEAM TITANS (Blue side - 5 seats: ARYAN, ARHAN, DEV, NIKHIL, NEHA)
  {
    id: 'titans-seat-0',
    team: 'titans',
    seatIndex: 0,
    isLocked: false,
    isUnlocking: false,
    contestant: {
      id: 'c-titans-0',
      name: 'Aryan',
      nickname: 'Ice Wolf',
      team: 'titans',
      seatIndex: 0,
      avatarId: 'boy-5',
      jerseyNumber: 10,
      role: 'Captain',
      score: 270,
      isBuzzed: false,
      state: 'seated',
      catchphrase: 'Titans freeze the competition!',
      hometown: 'Chandigarh'
    }
  },
  {
    id: 'titans-seat-1',
    team: 'titans',
    seatIndex: 1,
    isLocked: false,
    isUnlocking: false,
    contestant: {
      id: 'c-titans-1',
      name: 'Arhan',
      nickname: 'Thunder Beast',
      team: 'titans',
      seatIndex: 1,
      avatarId: 'boy-1',
      jerseyNumber: 44,
      role: 'Power Striker',
      score: 200,
      isBuzzed: false,
      state: 'seated',
      catchphrase: 'Cold calculations only!',
      hometown: 'Amritsar'
    }
  },
  {
    id: 'titans-seat-2',
    team: 'titans',
    seatIndex: 2,
    isLocked: false,
    isUnlocking: false,
    contestant: {
      id: 'c-titans-2',
      name: 'Dev',
      nickname: 'Shield Ace',
      team: 'titans',
      seatIndex: 2,
      avatarId: 'boy-2',
      jerseyNumber: 33,
      role: 'Tactician',
      score: 220,
      isBuzzed: false,
      state: 'seated',
      catchphrase: 'Unbreakable Titan defense!',
      hometown: 'Bangalore'
    }
  },
  {
    id: 'titans-seat-3',
    team: 'titans',
    seatIndex: 3,
    isLocked: false,
    isUnlocking: false,
    contestant: {
      id: 'c-titans-3',
      name: 'Nikhil',
      nickname: 'Viper',
      team: 'titans',
      seatIndex: 3,
      avatarId: 'boy-3',
      jerseyNumber: 88,
      role: 'Rapid Buzzer',
      score: 180,
      isBuzzed: false,
      state: 'seated',
      catchphrase: 'Fastest finger in the arena!',
      hometown: 'Delhi'
    }
  },
  {
    id: 'titans-seat-4',
    team: 'titans',
    seatIndex: 4,
    isLocked: false,
    isUnlocking: false,
    contestant: {
      id: 'c-titans-4',
      name: 'Neha',
      nickname: 'Phoenix Cryo',
      team: 'titans',
      seatIndex: 4,
      avatarId: 'girl-2',
      jerseyNumber: 99,
      role: 'Strategist',
      score: 230,
      isBuzzed: false,
      state: 'seated',
      catchphrase: 'Cool head, golden victory!',
      hometown: 'Kolkata'
    }
  }
];

export const PRESET_FRIENDS_TO_CALL = [
  {
    name: 'Rahul Khanna',
    nickname: 'Buzzer Beast',
    role: 'Hype Master',
    jerseyNumber: 23,
    avatarId: 'boy-3',
    catchphrase: 'Bhai stage pe aa gaya toh game over!',
    hometown: 'Bangalore'
  },
  {
    name: 'Pooja Reddy',
    nickname: 'Cyber Queen',
    role: 'Trivia Sniper',
    jerseyNumber: 11,
    avatarId: 'girl-3',
    catchphrase: 'Calculate everything, regret nothing!',
    hometown: 'Hyderabad'
  },
  {
    name: 'Rohan Mehra',
    nickname: 'The Tank',
    role: 'Anchor Favourite',
    jerseyNumber: 45,
    avatarId: 'boy-4',
    catchphrase: 'Champions Tera Bhai trophy hamari hai!',
    hometown: 'Pune'
  },
  {
    name: 'Neha Joshi',
    nickname: 'Phoenix',
    role: 'Wildcard Legend',
    jerseyNumber: 33,
    avatarId: 'girl-4',
    catchphrase: 'Stage mera, audience meri!',
    hometown: 'Jaipur'
  },
  {
    name: 'Vicky Choudhary',
    nickname: 'Roast King',
    role: 'Crowd Magnet',
    jerseyNumber: 0,
    avatarId: 'boy-5',
    catchphrase: 'Tera bhai kisi se kam nahi!',
    hometown: 'Gurugram'
  }
];

export const ANCHOR_QUICK_LINES = [
  {
    id: 'hello',
    label: 'Hello Everyone!',
    speech: 'Hello everyone! Welcome to the grand arena of Champions Tera Bhai! Today the stakes are higher than ever!',
    gesture: 'welcome'
  },
  {
    id: 'call-friend',
    label: 'Call Friend To Chair',
    speech: 'Ladies and gentlemen, we have an empty seat on the battle desk! Unlock the chair and bring our next champion to the stage!',
    gesture: 'point-left'
  },
  {
    id: 'inferno-heat',
    label: 'Inferno Fire!',
    speech: 'Team Inferno is bringing pure fire tonight! Look at those red gaming stations locked and loaded!',
    gesture: 'point-left'
  },
  {
    id: 'titans-ice',
    label: 'Titans Strike!',
    speech: 'Team Titans, with the ice-cold wolf spirit! Let us see if you can freeze the competition!',
    gesture: 'point-right'
  },
  {
    id: 'buzzer-ready',
    label: 'Hands on Buzzers!',
    speech: 'Contestants, place your hands on the glowing buzzers! 3, 2, 1... First one to hit answers the question!',
    gesture: 'mic-raise'
  },
  {
    id: 'crowning',
    label: 'Crowning Moment!',
    speech: 'Who will lift the Golden Crown of Champions Tera Bhai?! Let the arena explode with applause!',
    gesture: 'celebrate'
  }
];

export const TRIVIA_QUESTIONS = [
  {
    id: 'q-1',
    category: 'POP CULTURE & SHOWTIME',
    question: 'Who coined the legendary catchphrase: "Tera Bhai Shuru Karta Hai Toh Khatam Karke Hi Chhodta Hai"?',
    options: ['The Anchor', 'Team Inferno Captain', 'The Backstage DJ', 'Special Guest Judge'],
    correctIndex: 0,
    points: 100,
    roastTip: 'Host prestige is on the line!'
  },
  {
    id: 'q-2',
    category: 'GAMING ARENA',
    question: 'In an intense reality face-off, what is the best strategy when your rival hits the buzzer early?',
    options: ['Panic and drop mic', 'Maintain ice-cold stare', 'Chant Champions Tera Bhai', 'Counter with lightning speed'],
    correctIndex: 3,
    points: 150,
    roastTip: 'Speed is everything in this arena!'
  },
  {
    id: 'q-3',
    category: 'CHAMPIONS MEME LORE',
    question: 'What color is the legendary championship crown glowing at the center podium?',
    options: ['Neon Emerald', 'Imperial Gold', 'Cyber Purple', 'Crimson Ruby'],
    correctIndex: 1,
    points: 200,
    roastTip: 'Look at the center stage logo!'
  },
  {
    id: 'q-4',
    category: 'SQUAD DYNAMICS',
    question: 'Which team sports the roaring Wolf Insignia with Electric Cyan lighting?',
    options: ['Team Inferno', 'Team Titans', 'Team Phoenix', 'Team VIP'],
    correctIndex: 1,
    points: 120,
    roastTip: 'Check the right-hand neon desk!'
  }
];
