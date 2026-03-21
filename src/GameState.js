/**
 * Central game progression config and state for Support Land.
 * Defines all 3 levels: boss sequences, NPC dialogues, and progression.
 */

export const LEVELS = [
  // ===== LEVEL 1: Team & Workflow =====
  {
    name: 'Team & Workflow',
    background: 'bg-country',
    overworldTint: null,
    bosses: [
      {
        type: 'mini',
        name: 'Org Structure',
        bigBoss: 'Team & Workflow',
        miniBoss: 'Org structure',
        background: 'bg-country',
        enemyFrame: 0,
        bossSprite: 'office-dwight-schrute',
        introDialogue: [
          'Excuse me... have you seen my stapler?',
          'Oh, you\'re the new admin.\nI was told there would be one.',
          'The Org Structure boss is up ahead.\nGroups, organizations, that sort of thing.',
          'I... I could help you, but\nthey moved my desk again.',
          'Just... be careful, okay?'
        ]
      },
      {
        type: 'mini',
        name: 'Brand & Config',
        bigBoss: 'Team & Workflow',
        miniBoss: 'Brand, business schedule, custom ticket fields',
        background: 'bg-country',
        enemyFrame: 4,
        bossSprite: 'office-stanley-hudson',
        introDialogue: [
          'Oh... it\'s you again. Good.',
          'The Brand & Config boss is next.\nBusiness hours, ticket fields, all that.',
          'I tried to configure my own brand\nonce but they said I wasn\'t authorized.',
          'They also took my radio.\nI was told I could listen at\na reasonable volume.'
        ]
      },
      {
        type: 'mini',
        name: 'Workflow',
        bigBoss: 'Team & Workflow',
        miniBoss: 'Workflow',
        background: 'bg-country',
        enemyFrame: 8,
        bossSprite: 'office-kevin-malone',
        introDialogue: [
          'I... I don\'t like this place.',
          'The Workflow boss is tough.\nTriggers, automations, views, macros...',
          'It\'s like filling out a TPS report\nbut the report fights back.',
          'I believe in you though.\nMore than I believe in\nthis building\'s fire safety.'
        ]
      },
      {
        type: 'mini',
        name: 'Adding Agents',
        bigBoss: 'Team & Workflow',
        miniBoss: 'Adding agents',
        background: 'bg-country',
        enemyFrame: 4,
        bossSprite: 'office-andy-bernard',
        introDialogue: [
          'They keep adding new people but\nno one ever introduces themselves to me.',
          'This boss is about adding agents.\nRoles, permissions, invitations...',
          'I was never given proper permissions\nmyself. I just sort of... exist here.',
          'At least they haven\'t taken\nmy stapler. Yet.'
        ]
      },
      {
        type: 'big',
        name: 'The TPS Report Overlord',
        bigBoss: 'Team & Workflow',
        miniBoss: null,
        background: 'bg-country',
        enemyFrame: 8,
        bossSprite: 'office-david-wallace',
        introDialogue: [
          '...',
          'Oh no. That\'s the TPS Report Overlord.',
          'It\'s the big boss of this level.\nIt knows everything about\nTeam & Workflow.',
          'I... I would run, but they moved\nthe exit again.',
          'You\'re going to have to answer\nALL of its questions. Good luck.'
        ]
      }
    ],
    completionDialogue: [
      'You... you actually did it.',
      'The TPS Report Overlord is gone.\nTeam & Workflow is safe.',
      'I\'m so happy I could...\nwell, I won\'t set anything on fire.',
      'But there\'s more ahead.\nThe Channels are waiting.'
    ]
  },

  // ===== LEVEL 2: Channels =====
  {
    name: 'Channels',
    background: 'bg-forest',
    overworldTint: 0x88aa88,
    bosses: [
      {
        type: 'mini',
        name: 'Help Center',
        bigBoss: 'Channels',
        miniBoss: 'Help Center',
        background: 'bg-forest',
        enemyFrame: 0,
        bossSprite: 'office-angela-martin',
        introDialogue: [
          'I wrote a Help Center article once.\nNo one read it.',
          'This boss guards all the\nknowledge base content.',
          'Articles, sections, categories...\nit\'s a whole thing.',
          'Maybe if I put my stapler in\nan article someone would\nfinally pay attention.'
        ]
      },
      {
        type: 'mini',
        name: 'Messaging',
        bigBoss: 'Channels',
        miniBoss: 'Messaging',
        background: 'bg-forest',
        enemyFrame: 4,
        bossSprite: 'office-ryan-howard',
        introDialogue: [
          'No one ever messages me.\nNot even the bots.',
          'This boss controls web widgets,\nbots, and messaging channels.',
          'It keeps saying "How can I\nhelp you today?" over and over.',
          'I asked it for my stapler\nand it just sent me a knowledge\nbase article.'
        ]
      },
      {
        type: 'mini',
        name: 'Voice',
        bigBoss: 'Channels',
        miniBoss: 'Voice',
        background: 'bg-forest',
        enemyFrame: 8,
        bossSprite: 'office-creed-bratton',
        introDialogue: [
          'The phone keeps ringing and\nno one ever answers it.',
          'This boss controls Talk setup,\nphone numbers, and IVR menus.',
          'I was told there would be\nno phone calls in this job.',
          'That was a lie.'
        ]
      },
      {
        type: 'big',
        name: 'The Channel Surfer',
        bigBoss: 'Channels',
        miniBoss: null,
        background: 'bg-forest',
        enemyFrame: 4,
        bossSprite: 'office-jan-levinson',
        introDialogue: [
          '...',
          'Oh no. That\'s The Channel Surfer.\nThe big boss of this level.',
          'It controls ALL the channels.\nHelp Center. Messaging. Voice.\nEverything.',
          'I tried to submit a ticket about\nmy stapler through every channel.\nNone of them worked.',
          'Be careful. This one is... angry.'
        ]
      }
    ],
    completionDialogue: [
      'The Channel Surfer is defeated.\nAll channels are open again.',
      'You\'re really good at this.\nBetter than anyone here.',
      'But the final challenge is ahead.\nGoing Live.',
      'And... Lumbergh is waiting.'
    ]
  },

  // ===== LEVEL 3: Going Live =====
  {
    name: 'Going Live',
    background: 'bg-night-town',
    overworldTint: 0x6666aa,
    bosses: [
      {
        type: 'mini',
        name: 'Training Agents',
        bigBoss: 'Going live',
        miniBoss: 'Training agents',
        background: 'bg-night-town',
        enemyFrame: 0,
        bossSprite: 'office-toby-flenderson',
        introDialogue: [
          'We\'re getting close to going live.\nI can feel it.',
          'This boss is about training agents.\nOnboarding, resources, best practices.',
          'Nobody ever trained me.\nI just showed up one day and\nthey gave me a desk.',
          'Well... they gave me a desk\nat first.'
        ]
      },
      {
        type: 'mini',
        name: 'Email Forwarding',
        bigBoss: 'Going live',
        miniBoss: 'External email forwarding',
        background: 'bg-night-town',
        enemyFrame: 4,
        bossSprite: 'office-jim-halpert',
        introDialogue: [
          'This next one is about\nemail forwarding. DNS stuff.',
          'SPF, DKIM, forwarding rules...\nit\'s all very technical.',
          'I forwarded an email about\nmy stapler once. It bounced.',
          'PC LOAD LETTER.\nWhat does that even mean?'
        ]
      },
      {
        type: 'mini',
        name: 'Voice Config',
        bigBoss: 'Going live',
        miniBoss: 'Configure voice channel',
        background: 'bg-night-town',
        enemyFrame: 8,
        bossSprite: 'office-oscar-martinez',
        introDialogue: [
          'This boss handles voice configuration.\nNumber porting and activation.',
          'Have you ever configured\nan IVR menu? It\'s... something.',
          'I called the support line once\nand was on hold for three hours.',
          'I believe you have my\nphone number. No one else does.'
        ]
      },
      {
        type: 'mini',
        name: 'Help Center Launch',
        bigBoss: 'Going live',
        miniBoss: 'Activate Help Center',
        background: 'bg-night-town',
        enemyFrame: 0,
        bossSprite: 'office-meredith-palmer',
        introDialogue: [
          'The Help Center is almost\nready to go public.',
          'Activation, theming, permissions...\nall the final touches.',
          'I\'m a little nervous.\nWhat if no one reads it?',
          'What if EVERYONE reads it?\nThat might be worse.'
        ]
      },
      {
        type: 'mini',
        name: 'Messaging Launch',
        bigBoss: 'Going live',
        miniBoss: 'Set up messaging channel',
        background: 'bg-night-town',
        enemyFrame: 4,
        bossSprite: 'office-darryl-philbin',
        introDialogue: [
          'Almost there. The messaging widget\nis nearly ready for customers.',
          'Widget config, authentication,\nthe whole nine yards.',
          'Soon customers will be chatting\naway. With bots, mostly.',
          'I wish someone would chat\nwith me. Even a bot would be nice.'
        ]
      },
      {
        type: 'big',
        name: 'Bill Lumbergh',
        bigBoss: 'Going live',
        miniBoss: null,
        background: 'bg-caverns',
        enemyFrame: 8,
        bossSprite: 'office-michael-scott',
        introDialogue: [
          '...',
          'Oh no. It\'s him. It\'s Lumbergh.',
          'He\'s the one who keeps moving\nmy desk. And taking my stapler.',
          'This is the final boss.\nEverything you\'ve learned\ncomes down to this.',
          'If you defeat him, maybe...\nmaybe I\'ll finally get\nmy stapler back.',
          'Please. I\'m counting on you.'
        ]
      }
    ],
    completionDialogue: [
      'You... you defeated Lumbergh.',
      'I can\'t believe it.\nSupport Land is free.',
      'Your Zendesk instance is fully\nconfigured and live.',
      'And look... he dropped something.',
      'MY STAPLER! You got my stapler back!',
      'Thank you. You\'re the best admin\nI\'ve ever met.'
    ]
  }
];

/** Milton is the permanent guide NPC throughout the game */
export const NPC_NAME = 'Milton';

/**
 * Gets the current boss config based on level and boss index.
 */
export function getBossConfig(levelIndex, bossIndex) {
  const level = LEVELS[levelIndex];
  if (!level) return null;
  return level.bosses[bossIndex] || null;
}

/**
 * Gets total number of bosses in a level.
 */
export function getBossCount(levelIndex) {
  const level = LEVELS[levelIndex];
  return level ? level.bosses.length : 0;
}

/**
 * Gets total possible XP across all questions.
 */
export function getTotalPossibleXP() {
  return 200 * 20; // approximate: 200 questions, avg 20 XP
}
