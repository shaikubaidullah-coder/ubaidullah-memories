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
  person: {
    name: string;
    fullName: string;
    traits: string[];
    bio: string;
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
    title: "SHAIK UBAIDULLAH — Personal Journey & Memory Vault 💖",
    description: "A digital scrapbook & sanctuary of growth, reflection, and practical living.",
  },
  person: {
    name: "Ubaidullah",
    fullName: "Shaik Ubaidullah",
    traits: ["Kind", "Friendly", "Practical", "Focused", "Grounded"],
    bio: "A kind and friendly soul with a practical mind. Believer in quiet consistency, meaningful work, and enjoying life's simple joys.",
  },
  music: {
    url: "https://archive.org/download/fave2/Ed%20Sheeran%20-%20Shape%20of%20You.mp3",
    title: 'Play Soundtrack 🎵',
  },
  intro: {
    tagline: "PERSONAL SANCTUARY ♡ SHAIK UBAIDULLAH",
    headerBadge: "JOURNEY & VAULT",
    cardGreeting: "welcome to my digital sanctuary. 👋",
    cardSubtext: "a scrapbook of my personal journey, milestones, lessons, and quiet growth.",
    envelopeButtonText: "OPEN MY VAULT ✉️",
    letterPreview: {
      salutation: "Dear Ubaidullah,",
      body: "Take a pause. Here is your personal digital scrapbook — celebrating where you started, how you stayed kind through everything, and the practical mindset carrying you forward.",
      buttonText: "ENTER MY JOURNEY →",
    },
  },
  duo: {
    title: "THE ESSENCE OF ME.",
    subtitle: "Kind heart. Practical mind. Constantly growing.",
    annotation: "unfiltered moments & reflections...",
    footerLabel: "— moments of calm & clarity —",
    swipeLabel: "swipe to view my moments...",
    polaroids: [
      {
        src: "/images/me/photo_3_pillar_portrait.jpg",
        caption: "Grounded & looking ahead 🧢",
        rotation: -4,
        date: "Late Summer 2026",
      },
      {
        src: "/images/me/photo_1_lawn_selfie.jpg",
        caption: "Kindness first, always ☀️",
        rotation: 6,
        date: "September 2026",
      },
      {
        src: "/images/me/photo_9_night_spin.png",
        caption: "Living through the blur & finding joy ✨",
        rotation: -2,
        date: "Midnight Vibe",
      },
    ],
    receipt: {
      storeName: "DAILY LIVING LOG",
      items: [
        { name: "MORNING COFFEE & FOCUS", price: "DAILY" },
        { name: "PRACTICAL HARD WORK", price: "NON-STOP" },
        { name: "GENUINE KINDNESS", price: "ALWAYS" },
      ],
      total: "PRICELESS ♡",
      footerNote: "STAY TRUE TO WHO YOU ARE ♡",
    },
    stickyNoteText: "reminder to self: 🌿\nstay practical, stay gentle, stay hungry.",
  },
  desk: {
    title: "little moments...",
    subtitle: "some things are better when you look a little closer.",
    polaroids: [
      {
        src: "/images/me/photo_3_pillar_portrait.jpg",
        caption: "Grounded & looking ahead 🧢",
        rotation: -4,
        date: "Aug 2026",
      },
      {
        src: "/images/me/photo_2_grass_smile.jpg",
        caption: "Peaceful moments under the open sky 🌸",
        rotation: 6,
        date: "Summer 2026",
      },
      {
        src: "/images/me/photo_9_night_spin.png",
        caption: "Survival rate: 100% through the blur 🌟",
        rotation: -2,
        date: "Midnight",
      },
    ],
    hiddenNoteText: "note to self: you're doing much better than you realize. Keep building quietly. ♡",
    album: {
      title: "Ubaidullah's Gallery",
      photos: [
        {
          src: "/images/me/photo_1_lawn_selfie.jpg",
          caption: "When the evening light was golden and calm ☀️",
          rotation: -5,
          date: "Sept 2026",
        },
        {
          src: "/images/me/photo_2_grass_smile.jpg",
          caption: "Looking up at the clouds with a grateful heart 🌸",
          rotation: 4,
          date: "Summer 2026",
        },
        {
          src: "/images/me/photo_3_pillar_portrait.jpg",
          caption: "Standing firm with clear vision for what's ahead 🧢",
          rotation: -3,
          date: "Aug 2026",
        },
        {
          src: "/images/me/photo_4_mirror_monochrome.jpg",
          caption: "Classic monochrome aesthetic mirror snapshot ⚡",
          rotation: 7,
          date: "Spring 2025",
        },
        {
          src: "/images/me/photo_5_warm_portrait.png",
          caption: "Warm, grounded, and at peace with myself 🤎",
          rotation: -6,
          date: "Eid Season",
        },
        {
          src: "/images/me/photo_6_love_yourself.png",
          caption: "The ultimate principle: Love yourself always ☁️",
          rotation: 3,
          date: "Sunset Walk",
        },
        {
          src: "/images/me/photo_7_sunset_healing.png",
          caption: "Healing takes time — watching the twilight skyline 🌅",
          rotation: -2,
          date: "Twilight",
        },
        {
          src: "/images/me/photo_8_candid_purple.png",
          caption: "Natural candid afternoon moment 💜",
          rotation: 5,
          date: "Candid Day",
        },
        {
          src: "/images/me/photo_9_night_spin.png",
          caption: "Spinning light trails and celebrating the night ✨",
          rotation: -4,
          date: "Midnight",
        },
      ],
    },
    specialNote: {
      title: "my daily oath... ♡",
      message: "Treat everyone with kindness, keep your feet on solid ground, solve real problems with practical thinking, and never compromise your inner peace for outside noise.",
      signOff: "— Shaik Ubaidullah",
    },
    littleThings: {
      title: "what makes me, me",
      items: [
        "A kind and welcoming attitude to everyone I meet",
        "Practical and realistic thinking over wishful illusions",
        "Quiet discipline and showing up even when nobody is watching",
        "Enjoying a hot cup of tea during golden hour sunsets",
        "Remembering that self-respect and peace of mind are non-negotiable",
      ],
    },
  },
  mixtape: {
    title: "My Soundtrack & Ambient Vault",
    subtitle: "music for deep focus, calm thinking, and peaceful evenings.",
    cassetteLabel: "SHAIK UBAIDULLAH • SIDE A",
    tracks: [
      {
        id: "t1",
        title: "Shape of You (Lofi Acoustic)",
        artist: "Chill Instrumental",
        duration: "3:53",
        mood: "Reflective Beats",
        channel: "lofi",
      },
      {
        id: "t2",
        title: "Late Night Focus & Code",
        artist: "Deep Synthesizer",
        duration: "4:12",
        mood: "Deep Work",
        channel: "lofi",
      },
      {
        id: "t3",
        title: "Rain on the Window Sill",
        artist: "Monsoon Piano & Water",
        duration: "2:45",
        mood: "Peaceful Rain",
        channel: "rain",
      },
      {
        id: "t4",
        title: "Vinyl Warmth by the Desk",
        artist: "Vintage Tape Crackle",
        duration: "3:30",
        mood: "Warm Hearth",
        channel: "crackle",
      },
    ],
    quotes: [
      "Kindness is strength in a world that often forgets to be gentle.",
      "Practical solutions over noisy words, always.",
      "Healing takes time, but quiet discipline builds the future.",
    ],
  },
  journey: {
    title: "My Personal Milestones",
    subtitle: "the journey of becoming who I am today.",
    milestones: [
      {
        id: "m1",
        title: "The Beginning of the Journey",
        date: "Spring 2025",
        tag: "ORIGIN",
        description: "Early days of self-reflection, learning my craft, and deciding who I wanted to be in this world.",
        image: "/images/me/photo_4_mirror_monochrome.jpg",
        quote: "Every big journey starts with an honest look in the mirror.",
      },
      {
        id: "m2",
        title: "Healing Takes Time",
        date: "Late Summer 2026",
        tag: "PATIENCE",
        description: "Standing by the pillars facing the sunset — learning to let go of rush and trusting the timing of growth.",
        image: "/images/me/photo_7_sunset_healing.png",
        quote: "Healing takes time, but patience makes the soul unshakeable.",
      },
      {
        id: "m3",
        title: "The 'Love Yourself' Mindset",
        date: "August 2026",
        tag: "SELF-WORTH",
        description: "Realizing that self-respect and boundaries are the foundation of everything good in life.",
        image: "/images/me/photo_6_love_yourself.png",
        quote: "Love yourself enough to choose peace over unnecessary chaos.",
      },
      {
        id: "m4",
        title: "Unfiltered Joy & Freedom",
        date: "September 2026",
        tag: "ENERGY",
        description: "Spinning light trails at night — allowing myself to celebrate and enjoy being fully alive.",
        image: "/images/me/photo_9_night_spin.png",
        quote: "Work hard, stay practical, but never forget to laugh freely.",
      },
      {
        id: "m5",
        title: "Shaik Ubaidullah Today",
        date: "Present & Future",
        tag: "IDENTITY",
        description: "Kind, friendly, practical, and clear-eyed about the roadmap ahead. Grounded and ready.",
        image: "/images/me/photo_5_warm_portrait.png",
        quote: "Stay true to who you are. The best is yet to come.",
      },
    ],
  },
  letter: {
    recipient: "Ubaidullah",
    openingLine: "A private letter to myself...",
    paragraphs: [
      "If you're reading this, take a breath and look at how far you've come.",
      "In a world that can be noisy and rushed, you've chosen to stay kind, friendly, and deeply practical.",
      "You've handled setbacks with quiet patience and kept your dignity intact through every storm.",
      "Never lose that calm strength, your practical edge, or your warmth toward others.",
      "Be proud of the man you are building every single day.",
    ],
    signature: "— your future self",
    closingMessage: "now take a sip of chai and keep building ☕",
  },
  capsule: {
    title: "My Time Capsule",
    subtitle: "promises and intentions for the road ahead.",
    question: {
      text: "What is one core promise you are making to yourself for the upcoming year?",
      placeholder: "Write a promise to yourself, Ubaidullah...",
    },
    challenge: {
      text: "Do one genuinely kind act today without telling anyone. Let kindness be its own reward.",
    },
    futureNote: {
      text: "Open this in one year. Check how many of your goals turned from sketches into real-world reality.",
    },
    surprise: {
      message: "Secret drawer unlocked! (A reminder: Keep coding, stay curious, and always keep your coffee cup full.) ☕",
    },
    memory: {
      image: "/images/me/photo_7_sunset_healing.png",
      date: "Sunset Horizon",
      caption: "Healing takes time — the golden hour reminder",
    },
  },
  lanterns: {
    title: "Sky of My Aspirations",
    subtitle: "release a glowing lantern with your prayers & ambitions.",
    initialWishes: [
      "Continuous health, peace, and clarity of mind 🌟",
      "Building practical solutions that help real people 🛠️",
      "Staying kind and humble regardless of success ♡",
      "Financial freedom, growth, and wisdom 💸",
      "Unwavering strength to protect my inner peace ✨",
    ],
  },
  finale: {
    heroMemoryIndex: 0,
    instruction: "tap my photo to reveal...",
    caption: "the grounded self",
    finalMessage: "Stay kind. Stay friendly. Stay practical. The journey is just beginning.",
    finalSubtext: "Proud of the road traveled so far. ♡",
    signature: "— Shaik Ubaidullah",
  },
};
