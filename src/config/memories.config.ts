export interface PolaroidItem {
  id?: string;
  src: string;
  caption: string;
  rotation: number;
  date: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  description: string;
  image: string;
  quote?: string;
}

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  duration: string;
  mood: string;
  channel: 'lofi' | 'rain' | 'crackle' | 'off';
}

export interface MemoriesConfig {
  meta: {
    title: string;
    description: string;
  };
  recipient: {
    name: string;
    fullName: string;
    nickname?: string;
  };
  sender: {
    name: string;
    title: string;
  };
  music: {
    url: string;
    title: string;
  };
  intro: {
    tagline: string;
    headerBadge: string;
    cardGreeting: string;
    cardSubtext: string;
    envelopeButtonText: string;
    letterPreview: {
      salutation: string;
      body: string;
      buttonText: string;
    };
  };
  duo: {
    title: string;
    subtitle: string;
    annotation: string;
    footerLabel: string;
    swipeLabel: string;
    polaroids: PolaroidItem[];
    receipt: {
      storeName: string;
      items: { name: string; price: string }[];
      total: string;
      footerNote: string;
    };
    stickyNoteText: string;
  };
  desk: {
    title: string;
    subtitle: string;
    polaroids: PolaroidItem[];
    hiddenNoteText: string;
    album: {
      title: string;
      photos: PolaroidItem[];
    };
    specialNote: {
      title: string;
      message: string;
      signOff: string;
    };
    littleThings: {
      title: string;
      items: string[];
    };
  };
  mixtape: {
    title: string;
    subtitle: string;
    cassetteLabel: string;
    tracks: TrackItem[];
    quotes: string[];
  };
  journey: {
    title: string;
    subtitle: string;
    milestones: MilestoneItem[];
  };
  letter: {
    recipient: string;
    openingLine: string;
    paragraphs: string[];
    signature: string;
    closingMessage: string;
  };
  capsule: {
    title: string;
    subtitle: string;
    question: {
      text: string;
      placeholder?: string;
    };
    challenge: {
      text: string;
    };
    futureNote: {
      text: string;
    };
    surprise: {
      message: string;
    };
    memory: {
      image: string;
      date: string;
      caption: string;
    };
  };
  lanterns: {
    title: string;
    subtitle: string;
    initialWishes: string[];
  };
  finale: {
    heroMemoryIndex: number;
    instruction: string;
    caption: string;
    finalMessage: string;
    finalSubtext: string;
    signature: string;
  };
}

export const memoriesConfig: MemoriesConfig = {
  meta: {
    title: "MAHABOOB — Our Friendship Scrapbook 💖",
    description: "A digital scrapbook that happens to be alive.",
  },
  recipient: {
    name: "Mahaboob",
    fullName: "Syed Mahaboob Basha",
    nickname: "Mahaboob",
  },
  sender: {
    name: "Ubaidullah",
    title: "YOUR FAVORITE CO-CONSPIRATOR",
  },
  music: {
    url: "https://archive.org/download/fave2/Ed%20Sheeran%20-%20Shape%20of%20You.mp3",
    title: 'Play "Shape of You" 🎵',
  },
  intro: {
    tagline: "ARCHIVE OF CHAOS ♡ FOR MAHABOOB",
    headerBadge: "ARCHIVE OF CHAOS",
    cardGreeting: "oh, you actually opened it. 👋",
    cardSubtext: "here is a digital scrapbook of our mutual bad decisions & legendary moments.",
    envelopeButtonText: "OPEN THE ENVELOPE ❤️",
    letterPreview: {
      salutation: "Dear Mahaboob,",
      body: "I compiled all our legendary screw-ups, deep late-night talks, and unfiltered moments into one place. Click below if you dare.",
      buttonText: "ENTER THE CHAOS →",
    },
  },
  duo: {
    title: "THE BROTHERHOOD.",
    subtitle: "A series of highly questionable life choices & timeless memories.",
    annotation: "look at this guy...",
    footerLabel: "— evidence for future trials —",
    swipeLabel: "swipe to see more disasters...",
    polaroids: [
      {
        src: "/images/mahaboob/photo_1_lawn_selfie.jpg",
        caption: "Where the caffeine & chaos started ☕",
        rotation: -4,
        date: "Sept 2026",
      },
      {
        src: "/images/mahaboob/photo_2_grass_smile.jpg",
        caption: "Zero thoughts, just vibes in the grass 🌸",
        rotation: 6,
        date: "Aug 2026",
      },
      {
        src: "/images/mahaboob/photo_9_night_spin.jpg",
        caption: "Survival rate: 100% through the blur 🌟",
        rotation: -2,
        date: "Midnight '26",
      },
    ],
    receipt: {
      storeName: "CHAI & CHATTER CAFE",
      items: [
        { name: "2x IRANI CHAI", price: "$4.00" },
        { name: "1x SAMOSA PLATE", price: "$3.50" },
        { name: "ENDLESS BAD ADVICE", price: "PRICELESS" },
      ],
      total: "INFINITE ♡",
      footerNote: "THANKS FOR SURVIVING ME ♡",
    },
    stickyNoteText: "remember this day? 😂\nwe swore we had everything figured out.",
  },
  desk: {
    title: "little moments...",
    subtitle: "some things are better when you look a little closer.",
    polaroids: [
      {
        src: "/images/mahaboob/photo_1_lawn_selfie.jpg",
        caption: "Where the caffeine addiction started ☕",
        rotation: -4,
        date: "Sept 2026",
      },
      {
        src: "/images/mahaboob/photo_2_grass_smile.jpg",
        caption: "Enablers of bad decisions 🍕",
        rotation: 6,
        date: "Aug 2026",
      },
      {
        src: "/images/mahaboob/photo_9_night_spin.jpg",
        caption: "Survival rate: 100% (so far!) 🌟",
        rotation: -2,
        date: "Late Night",
      },
    ],
    hiddenNoteText: "psst... you found this note! I knew we'd make it through everything. ♡",
    album: {
      title: "Mahaboob's Vault",
      photos: [
        {
          src: "/images/mahaboob/photo_1_lawn_selfie.jpg",
          caption: "When the sun was hitting just right ☀️",
          rotation: -5,
          date: "Sept '26",
        },
        {
          src: "/images/mahaboob/photo_2_grass_smile.jpg",
          caption: "Looking up wondering why we procrastinated again 🌸",
          rotation: 4,
          date: "Summer '26",
        },
        {
          src: "/images/mahaboob/photo_3_pillar_portrait.jpg",
          caption: "Thinking about life, the universe, and food 🧢",
          rotation: -3,
          date: "Aug '26",
        },
        {
          src: "/images/mahaboob/photo_4_mirror_monochrome.jpg",
          caption: "Peak aesthetic mirror selfie (peak quality) ⚡",
          rotation: 7,
          date: "Spring '25",
        },
        {
          src: "/images/mahaboob/photo_5_warm_portrait.png",
          caption: "Looking handsome as always my brother 🤎",
          rotation: -6,
          date: "Eid Season",
        },
        {
          src: "/images/mahaboob/photo_6_love_yourself.png",
          caption: "The golden reminder: Love yourself always ☁️",
          rotation: 3,
          date: "Sunset Walk",
        },
        {
          src: "/images/mahaboob/photo_7_sunset_healing.png",
          caption: "Healing takes time — watching the horizon 🌅",
          rotation: -2,
          date: "Twilight",
        },
        {
          src: "/images/mahaboob/photo_8_candid_purple.png",
          caption: "The candid moment where nobody knew what was happening 💜",
          rotation: 5,
          date: "Afternoon",
        },
        {
          src: "/images/mahaboob/photo_9_night_spin.png",
          caption: "Spinning through the night like main characters ✨",
          rotation: -4,
          date: "Midnight",
        },
      ],
    },
    specialNote: {
      title: "for you, Mahaboob... ♡",
      message: "You are the rare kind of brother people write cheesy scrapbook pages about. Real, loyal, and always there when it counts. Never change.",
      signOff: "always in your corner.",
    },
    littleThings: {
      title: "little things",
      items: [
        "Inside jokes nobody else in the room understands",
        "Saying 'I am 5 mins away' when barely leaving the bed",
        "Deep talks that solved literally zero world problems",
        "Knowing exactly when the other needs tea without speaking",
        "Surviving every chaotic plan we ever cooked up",
      ],
    },
  },
  mixtape: {
    title: "The Mixtape Deck",
    subtitle: "every memory has a soundtrack.",
    cassetteLabel: "MAHABOOB • SIDE A",
    tracks: [
      {
        id: "t1",
        title: "Shape of You (Lofi Chill)",
        artist: "Ed Sheeran / Acoustic",
        duration: "3:53",
        mood: "Nostalgic Vibes",
        channel: "lofi",
      },
      {
        id: "t2",
        title: "Late Night Road Trips",
        artist: "Atmospheric Synthesizer",
        duration: "4:12",
        mood: "Midnight Talks",
        channel: "lofi",
      },
      {
        id: "t3",
        title: "Monsoon Chai Melodies",
        artist: "Rain & Piano Chords",
        duration: "2:45",
        mood: "Peaceful Rain",
        channel: "rain",
      },
      {
        id: "t4",
        title: "Vinyl Coffeehouse",
        artist: "Analog Tape Crackle",
        duration: "3:30",
        mood: "Warm Hearth",
        channel: "crackle",
      },
    ],
    quotes: [
      "Music hits different when the memories are real.",
      "Rewind the tape, never the regret.",
      "Breathe, listen, and remember the good days.",
    ],
  },
  journey: {
    title: "Our Timeline & Milestones",
    subtitle: "how we got from strangers to unshakeable brothers.",
    milestones: [
      {
        id: "m1",
        title: "The Beginning",
        date: "Spring 2025",
        tag: "ORIGIN",
        description: "Where it all started. Casual banter turned into daily calls and mutual bad decisions.",
        image: "/images/mahaboob/photo_4_mirror_monochrome.jpg",
        quote: "Some friendships begin quietly, then take over your whole camera roll.",
      },
      {
        id: "m2",
        title: "The Sunset Talks",
        date: "Late Summer 2026",
        tag: "DEEP TALKS",
        description: "Leaning against the pillars, talking about our dreams, past mistakes, and where life is taking us.",
        image: "/images/mahaboob/photo_7_sunset_healing.png",
        quote: "Healing takes time, but good company makes it gentle.",
      },
      {
        id: "m3",
        title: "Love Yourself Era",
        date: "August 2026",
        tag: "GROWTH",
        description: "Reminding each other that self-worth comes before anyone else's approval.",
        image: "/images/mahaboob/photo_6_love_yourself.png",
        quote: "Stand tall, look ahead, and own your journey.",
      },
      {
        id: "m4",
        title: "The Midnight Chaos",
        date: "September 2026",
        tag: "CHAOS",
        description: "Spinning lights, laughing till our stomachs hurt, and documenting the utter blur of youth.",
        image: "/images/mahaboob/photo_9_night_spin.png",
        quote: "Blurry photos always hold the clearest memories.",
      },
      {
        id: "m5",
        title: "The Brotherhood Today",
        date: "Present & Beyond",
        tag: "FOREVER",
        description: "Through the good, the tough, and everything in between. Unshakable.",
        image: "/images/mahaboob/photo_5_warm_portrait.png",
        quote: "A true friend is someone who walks in when the rest of the world walks out.",
      },
    ],
  },
  letter: {
    recipient: "Mahaboob",
    openingLine: "Oh, one more thing...",
    paragraphs: [
      "I'm actually really grateful for the day our paths crossed.",
      "From random tea runs to conversations that actually mattered when things got heavy.",
      "You're one of the truest, most genuine people I know — never lose that spark.",
      "Thanks for being someone I can always count on without question.",
    ],
    signature: "— your co-conspirator & brother",
    closingMessage: "now go do something productive 😂 (and buy chai!)",
  },
  capsule: {
    title: "The Time Capsule",
    subtitle: "Pick something to open.",
    question: {
      text: "What is one memory of us that still makes you smile or laugh out loud?",
      placeholder: "Type your memory here, Mahaboob...",
    },
    challenge: {
      text: "Send me the absolute funniest or worst photo of me you have on your phone right now. No excuses.",
    },
    futureNote: {
      text: "Come back here next year. If we're not running our dream projects by then, we're buying that tea stall anyway.",
    },
    surprise: {
      message: "Secret drawer unlocked! (Disclaimer: I was drinking late-night tea while coding this. You owe me biryani.) 🍲",
    },
    memory: {
      image: "/images/mahaboob/photo_8_candid_purple.png",
      date: "Golden Afternoon",
      caption: "The candid moment where we couldn't stop laughing",
    },
  },
  lanterns: {
    title: "Sky of Wishes",
    subtitle: "release a floating lantern into the night sky.",
    initialWishes: [
      "Health, peace, and endless success for Mahaboob 🌟",
      "May our brotherhood stay unbreakable forever ♡",
      "Infinite laughter, zero regrets, and rich futures 💸",
      "That island we promised we'd buy 🏝️",
      "Always staying true to who we are ✨",
    ],
  },
  finale: {
    heroMemoryIndex: 2,
    instruction: "tap the photo to reveal...",
    caption: "the absolute peak of our brotherhood",
    finalMessage: "Honestly, the dumbest and simplest moments are always the ones that matter most.",
    finalSubtext: "Thanks for being a true brother. ♡",
    signature: "— Ubaidullah",
  },
};
