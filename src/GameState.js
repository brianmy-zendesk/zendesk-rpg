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
        introDialogue: [
          'Hey... have you seen my stapler?',
          'I was told there would be a stapler...',
          'The new admin has to defeat the\nOrg Structure boss to move on.',
          'Something about groups and\norganizations, I think...',
          'I just want my stapler back.'
        ]
      },
      {
        type: 'mini',
        name: 'Brand & Config',
        bigBoss: 'Team & Workflow',
        miniBoss: 'Brand, business schedule, custom ticket fields',
        background: 'bg-country',
        enemyFrame: 4,
        introDialogue: [
          'Excuse me... I was told I could\nlisten to my radio at a reasonable volume.',
          'The Brand & Config boss controls\nbusiness hours and ticket fields.',
          'If you could go ahead and defeat it,\nthat would be great.',
          'And use a cover sheet on your\nTPS reports from now on.'
        ]
      },
      {
        type: 'mini',
        name: 'Workflow',
        bigBoss: 'Team & Workflow',
        miniBoss: 'Workflow',
        background: 'bg-country',
        enemyFrame: 8,
        introDialogue: [
          'I... I could set the building on fire.',
          'The Workflow boss is tough.\nTriggers, automations, views, macros...',
          'It\'s like doing a TPS report\nbut the report fights back.',
          'Good luck. You\'ll need it.'
        ]
      },
      {
        type: 'mini',
        name: 'Adding Agents',
        bigBoss: 'Team & Workflow',
        miniBoss: 'Adding agents',
        background: 'bg-country',
        enemyFrame: 4,
        introDialogue: [
          'Corporate wants you to add agents\nto the Zendesk instance.',
          'I\'ve been moved to the basement\nfour times already.',
          'Roles, permissions, invitations...\nit\'s all very complicated.',
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
        introDialogue: [
          '...',
          'Did you get the memo about\nthe TPS reports?',
          'I\'m gonna need you to go ahead\nand answer ALL these questions.',
          'If you could do that,\nthat would be terrific.',
          'Mmkay? Great.'
        ]
      }
    ],
    completionDialogue: [
      'Level 1 Complete!',
      'You have conquered Team & Workflow.',
      'The TPS Report Overlord has been\nvanquished from Support Land!',
      'But darker forces await in\nthe Channels ahead...'
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
        introDialogue: [
          'No one ever reads the articles\nI write...',
          'The Help Center boss guards all\nthe knowledge base content.',
          'Articles, sections, categories...\nit\'s a whole thing.',
          'If customers would just read\nthe articles, I wouldn\'t have\nto answer the phone.'
        ]
      },
      {
        type: 'mini',
        name: 'Messaging',
        bigBoss: 'Channels',
        miniBoss: 'Messaging',
        background: 'bg-forest',
        enemyFrame: 4,
        introDialogue: [
          'Why does anyone need to talk\nto a real person anyway?',
          'The Messaging boss controls\nweb widgets, bots, and channels.',
          'It keeps saying "How can I\nhelp you today?" over and over.',
          'Sounds like my manager,\nactually.'
        ]
      },
      {
        type: 'mini',
        name: 'Voice',
        bigBoss: 'Channels',
        miniBoss: 'Voice',
        background: 'bg-forest',
        enemyFrame: 8,
        introDialogue: [
          'The phone keeps ringing and\nringing and ringing...',
          'The Voice boss controls Talk setup,\nphone numbers, and IVR menus.',
          'Press 1 for pain.\nPress 2 for more pain.',
          'I was told there would be\nno phone calls.'
        ]
      },
      {
        type: 'big',
        name: 'The Channel Surfer',
        bigBoss: 'Channels',
        miniBoss: null,
        background: 'bg-forest',
        enemyFrame: 4,
        introDialogue: [
          'INCOMING TRANSMISSION...',
          'I am The Channel Surfer.\nI control ALL communication.',
          'Help Center. Messaging. Voice.\nNothing gets through without\nmy permission.',
          'Let\'s see if you can handle\nthe full omnichannel experience.',
          'Yeah... that\'d be great.'
        ]
      }
    ],
    completionDialogue: [
      'Level 2 Complete!',
      'You have conquered the Channels.',
      'The Channel Surfer has been\ndisconnected from Support Land!',
      'But the final challenge awaits...\nGoing Live.'
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
        introDialogue: [
          'We\'re not gonna protest.\nWe\'re not gonna do anything illegal.',
          'But somebody has to train\nthese new agents.',
          'Onboarding, resources, best\npractices... the works.',
          'Let\'s see if you know enough\nto train others.'
        ]
      },
      {
        type: 'mini',
        name: 'Email Forwarding',
        bigBoss: 'Going live',
        miniBoss: 'External email forwarding',
        background: 'bg-night-town',
        enemyFrame: 4,
        introDialogue: [
          'I swear, one more SPF record\nand I\'m setting the building on fire.',
          'The Email Forwarding boss guards\nexternal email and DNS settings.',
          'SPF, DKIM, forwarding rules...\nit\'s all very technical.',
          'Good luck. And remember:\nPC LOAD LETTER.'
        ]
      },
      {
        type: 'mini',
        name: 'Voice Config',
        bigBoss: 'Going live',
        miniBoss: 'Configure voice channel',
        background: 'bg-night-town',
        enemyFrame: 8,
        introDialogue: [
          'Just a moment please, your call\nis very important to us.',
          'The Voice Config boss handles\nnumber porting and activation.',
          'Have you ever configured\nan IVR menu? It\'s... something.',
          'I believe you have my\nphone number.'
        ]
      },
      {
        type: 'mini',
        name: 'Help Center Launch',
        bigBoss: 'Going live',
        miniBoss: 'Activate Help Center',
        background: 'bg-night-town',
        enemyFrame: 0,
        introDialogue: [
          'The Help Center is ready\nfor launch.',
          'Activation, theming, permissions...\nall the final touches.',
          'This is it. The knowledge base\ngoes public.',
          'No pressure. Just... don\'t\nbreak anything.'
        ]
      },
      {
        type: 'mini',
        name: 'Messaging Launch',
        bigBoss: 'Going live',
        miniBoss: 'Set up messaging channel',
        background: 'bg-night-town',
        enemyFrame: 4,
        introDialogue: [
          'The messaging widget is almost\nready for customers.',
          'Widget config, authentication,\nthe whole nine yards.',
          'Soon customers will be chatting\nwith your bots.',
          'I hope the bots are smarter\nthan my coworkers.'
        ]
      },
      {
        type: 'big',
        name: 'Bill Lumbergh',
        bigBoss: 'Going live',
        miniBoss: null,
        background: 'bg-caverns',
        enemyFrame: 8,
        introDialogue: [
          '...',
          'Yeahhh... hi.',
          'So if you could go ahead and\nanswer all of these questions...',
          'That would be great.',
          'I\'m also gonna need you to\ncome in on Saturday.',
          'And Sunday too. Mmkay? Thanks.'
        ]
      }
    ],
    completionDialogue: [
      'Congratulations!',
      'You have defeated Bill Lumbergh\nand conquered Support Land!',
      'Your Zendesk instance is now\nfully configured and live.',
      '"I could set the building on fire..."',
      'Just kidding. Great job, admin!'
    ]
  }
];

/** NPC names that rotate for dialogue encounters */
export const NPC_NAMES = [
  'Milton',
  'Milton',
  'Samir',
  'Michael Bolton',
  'Bill Lumbergh',
  'Milton',
  'Samir',
  'Michael Bolton',
  'Milton',
  'Samir',
  'Milton',
  'Michael Bolton',
  'Samir',
  'Milton',
  'Milton',
  'Bill Lumbergh'
];

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
