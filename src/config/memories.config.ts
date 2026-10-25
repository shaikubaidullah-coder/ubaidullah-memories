export interface PolaroidItem {
  id?: string;
  src: string;
  caption: string;
  rotation: number;
  date: string;
}

export interface MemoriesConfig {
  meta: {
    title: string;
    description: string;
  };
  recipient: {
    name: string;
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
    title: "US — Our Friendship Scrapbook 💖",
    description: "A digital scrapbook that happens to be alive.",
  },
  recipient: {
    name: "Aisha",
  },
  sender: {
    name: "Sam",
    title: "YOUR FAVORITE IDIOT",
  },
  music: {
    url: "https://archive.org/download/fave2/Ed%20Sheeran%20-%20Shape%20of%20You.mp3",
    title: 'Play "Shape of You" 🎵',
  },
  intro: {
    tagline: "ARCHIVE OF CHAOS ♡ BY YOUR FAVORITE IDIOT",
    headerBadge: "ARCHIVE OF CHAOS",
    cardGreeting: "oh, you actually opened it. 👋",
    cardSubtext: "here is a digital scrapbook of our mutual bad decisions.",
    envelopeButtonText: "OPEN THE ENVELOPE ❤️",
    letterPreview: {
      salutation: "Dear Aisha,",
      body: "I compiled all our legendary screw-ups, late-night food runs, and hair-dye disasters into one place. Click below if you dare.",
      buttonText: "ENTER THE CHAOS →",
    },
  },
  duo: {
    title: "THE DUO.",
    subtitle: "A series of highly questionable life choices.",
    annotation: "look at these dorks...",
    footerLabel: "— evidence for future trials —",
    swipeLabel: "swipe to see more disasters...",
    polaroids: [
      {
        src: "/images/hero_1.png",
        caption: "Where the caffeine addiction started ☕",
        rotation: -4,
        date: "Sept 2021",
      },
      {
        src: "/images/hero_2.png",
        caption: "Enablers of bad decisions 🍕",
        rotation: 6,
        date: "July 2023",
      },
      {
        src: "/images/hero_3.png",
        caption: "Survival rate: 100% (so far!) 🌟",
        rotation: -2,
        date: "Aug 2026",
      },
    ],
    receipt: {
      storeName: "LOFI COFFEE",
      items: [
        { name: "1x LATTE", price: "$4.50" },
        { name: "1x MATCHA", price: "$5.00" },
      ],
      total: "$9.50",
      footerNote: "THANKS FOR SHARING ♡",
    },
    stickyNoteText: "remember this? 😂\nwe really did that.",
  },
  desk: {
    title: "little moments...",
    subtitle: "some things are better when you look a little closer.",
    polaroids: [
      {
        src: "/images/hero_1.png",
        caption: "Where the caffeine addiction started ☕",
        rotation: -4,
        date: "Sept 2021",
      },
      {
        src: "/images/hero_2.png",
        caption: "Enablers of bad decisions 🍕",
        rotation: 6,
        date: "July 2023",
      },
      {
        src: "/images/hero_3.png",
        caption: "Survival rate: 100% (so far!) 🌟",
        rotation: -2,
        date: "Aug 2026",
      },
    ],
    hiddenNoteText: "psst... you found this note! I knew we'd make it. ♡",
    album: {
      title: "Our Album",
      photos: [
        {
          src: "/images/gallery_1.png",
          caption: "Picnic where geese stole our sandwiches 🌸",
          rotation: -5,
          date: "Spring '22",
        },
        {
          src: "/images/gallery_2.png",
          caption: "Extremely blurred selfie (peak quality)",
          rotation: 4,
          date: "New Year's Eve",
        },
        {
          src: "/images/gallery_3.png",
          caption: "Baking experiment (that left carbon in the oven)",
          rotation: -3,
          date: "Rainy Tuesday",
        },
        {
          src: "/images/gallery_4.png",
          caption: "Losing our hearing at that basement concert 🎸",
          rotation: 7,
          date: "Oct 2024",
        },
        {
          src: "/images/gallery_5.png",
          caption: "Sunburn level: cooked lobster ☀️",
          rotation: -6,
          date: "Summer '23",
        },
        {
          src: "/images/gallery_6.png",
          caption: "Pretending to study in the library",
          rotation: 3,
          date: "Exam Season",
        },
        {
          src: "/images/gallery_7.png",
          caption: "Staring at abstract art pretending we get it 🎨",
          rotation: -2,
          date: "Jan 2025",
        },
        {
          src: "/images/gallery_8.png",
          caption: "The matching keychains we both lost instantly",
          rotation: 5,
          date: "June '25",
        },
      ],
    },
    specialNote: {
      title: "for you... ♡",
      message: "You are the rare kind of friend people write cheesy scrapbook pages about. Never change.",
      signOff: "always in your corner.",
    },
    littleThings: {
      title: "little things",
      items: [
        "Inside jokes nobody else finds funny",
        "3 AM deep talks that solved zero world problems",
        "Songs that instantly take me back to road trips",
        "How we both knew the other was lying about being on the way",
      ],
    },
  },
  letter: {
    recipient: "Aisha",
    openingLine: "Oh, one more thing...",
    paragraphs: [
      "I'm actually really glad we ended up talking that day.",
      "Even if you did try to steal my latte.",
      "Thanks for not being a boring human.",
    ],
    signature: "— your co-conspirator",
    closingMessage: "now go do something productive 😂",
  },
  capsule: {
    title: "The Time Capsule",
    subtitle: "Pick something to open.",
    question: {
      text: "What is one memory of us that still makes you laugh out loud?",
      placeholder: "Type your answer here...",
    },
    challenge: {
      text: "Send me the absolute worst photo of me you have on your phone right now. Do it.",
    },
    futureNote: {
      text: "Come back here next year. If we're not rich by then, we're buying that island anyway.",
    },
    surprise: {
      message: "Secret drawer unlocked! (Disclaimer: I was eating instant ramen while coding this. You owe me lunch.) 🍜",
    },
    memory: {
      image: "/images/gallery_3.png",
      date: "Rainy Tuesday",
      caption: "The cookie charcoal experiment",
    },
  },
  finale: {
    heroMemoryIndex: 1,
    instruction: "tap the photo to reveal...",
    caption: "the absolute peak of our friendship",
    finalMessage: "Honestly, the dumbest moments are always the best ones.",
    finalSubtext: "Thanks for surviving me. ♡",
    signature: "— Sam",
  },
};
