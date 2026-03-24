export type Locale = 'en' | 'zh';

type WorldItemText = {
  title: string;
  subtitle: string;
};

type WorldStageDetailText = {
  title: string;
  description: string;
  highlights: [string, string, string];
};

type WorldPlayText = {
  title: string;
  scoreLabel: string;
  spinning: string;
  texasAction: string;
  texasRevealAction: string;
  texasFoldAction: string;
  texasReplayAction: string;
  texasToastTitle: string;
  wheelAction: string;
  fortuneAction: string;
  jackpotAction: string;
  texasHands: string;
  texasResult: string;
  texasOutcome: string;
  texasPlayerLabel: string;
  texasBoardLabel: string;
  texasOpponentLabel: string;
  texasHidden: string;
  texasOutcomeWin: string;
  texasOutcomeLose: string;
  texasOutcomeTie: string;
  texasOutcomeFold: string;
  fortuneMethodLabel: string;
  fortuneMethodPlaceholder: string;
  fortuneMethodOptions: {
    zodiac: string;
    mbti: string;
    constellation: string;
  };
  zodiacLabel: string;
  zodiacPlaceholder: string;
  zodiacSelectHint: string;
  zodiacLockedHint: string;
  zodiacOptions: {
    rat: string;
    ox: string;
    tiger: string;
    rabbit: string;
    dragon: string;
    snake: string;
    horse: string;
    goat: string;
    monkey: string;
    rooster: string;
    dog: string;
    pig: string;
  };
  mbtiLabel: string;
  mbtiPlaceholder: string;
  mbtiOptions: Record<string, string>;
  constellationLabel: string;
  constellationPlaceholder: string;
  constellationOptions: Record<string, string>;
  fortuneSummary: string;
  fortuneOverall: string;
  fortuneCareer: string;
  fortuneLove: string;
  fortuneWealth: string;
  fortuneLuckyNumber: string;
  fortuneLuckyColor: string;
  fortuneLuckyTime: string;
  fortuneConstellation: string;
  fortuneMbti: string;
  fortuneZodiacTrend: string;
  fortuneGrowthAction: string;
  fortuneSocialStyle: string;
  fortuneConstellationPool: string[];
  fortuneMbtiPool: string[];
  fortuneZodiacTrendPool: string[];
  fortuneGrowthActionPool: string[];
  fortuneSocialStylePool: string[];
  fortuneScoreLabel: string;
  fortuneTierLabel: string;
  fortuneTierNames: {
    sleep: string;
    steady: string;
    good: string;
    great: string;
    legend: string;
  };
  fortuneCongratsTitle: string;
  fortuneCongratsDescription: string;
  fortuneNotReady: string;
  wheelSpins: string;
  wheelStreak: string;
  wheelRuleTitle: string;
  ruleAction: string;
  texasRuleTitle: string;
  texasRuleItems: string[];
  wheelRuleItems: string[];
  wheelZoneLabel: string;
  wheelZoneNegative: string;
  wheelZonePositive: string;
  wheelZoneNeutral: string;
  wheelZonePlus50: string;
  wheelZoneMinus50: string;
  wheelRateLabel: string;
  wheelHistoryAction: string;
  wheelHistoryTitle: string;
  wheelHistoryEmpty: string;
  wheelHistoryZone: string;
  scoreHistoryAction: string;
  scoreHistoryTitle: string;
  scoreHistoryEmpty: string;
  scoreHistoryGameLabel: string;
  scoreHistoryTotalLabel: string;
  scoreSourceLabels: {
    texas: string;
    wheel: string;
    fortune: string;
    jackpot: string;
  };
  rewardTitle: string;
  rewardDescription: string;
  rewardClose: string;
  rewardEntry: string;
  gomokuStatusLabel: string;
  gomokuMovesLabel: string;
  gomokuTurnLabel: string;
  gomokuResetAction: string;
  gomokuOutcomeIdle: string;
  gomokuOutcomeBlackWin: string;
  gomokuOutcomeWhiteWin: string;
  gomokuOutcomeDraw: string;
  gomokuBlackLabel: string;
  gomokuWhiteLabel: string;
  focusBack: string;
  enterStageAction: string;
  lastGain: string;
  jackpotWindow: string;
  jackpotOpen: string;
  jackpotClosed: string;
  handNames: {
    high_card: string;
    pair: string;
    two_pair: string;
    three_kind: string;
    straight: string;
    flush: string;
    full_house: string;
    four_kind: string;
    straight_flush: string;
  };
};

type HolidayText = {
  name: string;
  startIso: string;
  endIso: string;
};

type Messages = {
  localeLabel: string;
  hero: {
    titleLines: [string, string, string];
    description: string;
    startButton: string;
    toolsButton: string;
    healthButton: string;
    knowledgeButton: string;
    blogButton: string;
    githubButton: string;
    lockedHint: string;
  };
  world: {
    kicker: string;
    title: string;
    stageLabel: string;
    items: WorldItemText[];
    detailLabel: string;
    details: WorldStageDetailText[];
    play: WorldPlayText;
  };
  muyu: {
    kicker: string;
    title: string;
    description: string;
    tip: string;
    totalLabel: string;
    rewardHint: string;
    rewardTitle: string;
    rewardDescription: string;
    rewardClose: string;
    rewardEntry: string;
    comboLabel: string;
    comboBurstText: string;
    burstText: string;
  };
  holiday: {
    label: string;
    nextPrefix: string;
    ended: string;
    panelExpand: string;
    panelCollapse: string;
    customLabel: string;
    customNameLabel: string;
    customDateLabel: string;
    customNamePlaceholder: string;
    customDatePlaceholder: string;
    customStartAction: string;
    customClearAction: string;
    customCountdownPrefix: string;
    customEmpty: string;
    customExpired: string;
    items: HolidayText[];
  };
  health: {
    kicker: string;
    title: string;
    description: string;
    backHome: string;
    backTools: string;
    profileTitle: string;
    profileDescription: string;
    dateLabel: string;
    weightLabel: string;
    heightLabel: string;
    genderLabel: string;
    genderMale: string;
    genderFemale: string;
    genderOther: string;
    genderValue: Record<'male' | 'female' | 'other', string>;
    bodyFatLabel: string;
    waistLabel: string;
    targetWeightLabel: string;
    noteLabel: string;
    notePlaceholder: string;
    bmiLabel: string;
    bmiRangeCopy: string;
    healthyWeightLabel: string;
    deltaLabel: string;
    rangeUnderweight: string;
    rangeNormal: string;
    rangeOverweight: string;
    rangeObese: string;
    ranges: Record<'underweight' | 'normal' | 'overweight' | 'obese', string>;
    saveAction: string;
    clearAction: string;
    deleteAction: string;
    trendTitle: string;
    latestLabel: string;
    noData: string;
    dimensions: Record<'day' | 'week' | 'month' | 'year', string>;
    chartTypes: Record<'line' | 'area' | 'bar', string>;
    metrics: Record<'bmi' | 'weight' | 'bodyFat', string>;
    metricValueLabels: Record<'bmi' | 'weight' | 'bodyFat', string>;
    recordsTitle: string;
    recordsCount: string;
  };
  tools: {
    kicker: string;
    title: string;
    description: string;
    backHome: string;
    subRouteLabel: string;
    overviewNav: string;
    htmlNav: string;
    jsonNav: string;
    urlNav: string;
    regexNav: string;
    chatNav: string;
    healthNav: string;
    formatterTitle: string;
    formatterDescription: string;
    validatorTitle: string;
    validatorDescription: string;
    jsonTitle: string;
    jsonDescription: string;
    urlTitle: string;
    urlDescription: string;
    regexTitle: string;
    regexDescription: string;
    chatTitle: string;
    chatDescription: string;
    healthTitle: string;
    healthDescription: string;
    sourceLabel: string;
    outputLabel: string;
    regexPatternLabel: string;
    regexFlagsLabel: string;
    regexResultTitle: string;
    sourcePlaceholder: string;
    jsonPlaceholder: string;
    urlPlaceholder: string;
    regexPatternPlaceholder: string;
    regexTextPlaceholder: string;
    formatAction: string;
    validateAction: string;
    previewAction: string;
    previewTitle: string;
    previewEmpty: string;
    regexRunAction: string;
    chatSendAction: string;
    chatResetAction: string;
    chatShowSettingsAction: string;
    chatHideSettingsAction: string;
    jsonFormatAction: string;
    jsonValidateAction: string;
    jsonSnakeCaseAction: string;
    urlEncodeAction: string;
    urlDecodeAction: string;
    clearAction: string;
    copyAction: string;
    validatePass: string;
    validateFailPrefix: string;
    jsonValidatePass: string;
    jsonValidateFailPrefix: string;
    jsonSnakeCaseDone: string;
    regexInvalidPrefix: string;
    regexNoMatch: string;
    regexMatchCount: string;
    regexMatchItem: string;
    regexGroupsLabel: string;
    chatGreeting: string;
    chatSending: string;
    chatRemoteOn: string;
    chatRemoteOff: string;
    chatInputLabel: string;
    chatInputPlaceholder: string;
    chatUserLabel: string;
    chatAssistantLabel: string;
    chatEndpointLabel: string;
    chatEndpointPlaceholder: string;
    chatModelLabel: string;
    chatModelPlaceholder: string;
    chatApiKeyLabel: string;
    chatApiKeyPlaceholder: string;
    chatSystemPromptLabel: string;
    chatSystemPromptPlaceholder: string;
    healthDateLabel: string;
    healthWeightLabel: string;
    healthHeightLabel: string;
    healthGenderLabel: string;
    healthGenderMale: string;
    healthGenderFemale: string;
    healthGenderOther: string;
    healthGenderValue: Record<'male' | 'female' | 'other', string>;
    healthBmiLabel: string;
    healthBmiRangeCopy: string;
    healthRangeUnderweight: string;
    healthRangeNormal: string;
    healthRangeOverweight: string;
    healthRangeObese: string;
    healthRanges: Record<'underweight' | 'normal' | 'overweight' | 'obese', string>;
    healthSaveAction: string;
    healthClearAction: string;
    healthTrendTitle: string;
    healthLatestLabel: string;
    healthNoData: string;
    healthDimensions: Record<'day' | 'week' | 'month' | 'year', string>;
    healthChartTypes: Record<'line' | 'area' | 'bar', string>;
    healthRecordsTitle: string;
    healthRecordsCount: string;
  };
};

export const messages: Record<Locale, Messages> = {
  en: {
    localeLabel: 'Language',
    hero: {
      titleLines: ['Jump Into', 'Your Next', 'Bright World'],
      description: 'Learn with consistency. Keep moving forward.',
      startButton: 'Start Adventure',
      toolsButton: 'Frontend Tools',
      healthButton: 'Health Hub',
      knowledgeButton: 'Knowledge Base',
      blogButton: 'CSDN Blog',
      githubButton: 'GitHub',
      lockedHint: 'Unlock at score > 5'
    },
    world: {
      kicker: 'Choose A World',
      title: 'Four stages. Quick to learn, fun to replay.',
      stageLabel: 'Stage',
      detailLabel: 'Stage Rules',
      items: [
        { title: "Texas Hold'em", subtitle: 'Deal fast. Compare hands. Score.' },
        { title: 'Lucky Wheel', subtitle: 'One spin. One result. Keep going.' },
        { title: 'Astro Persona', subtitle: 'One-time profile. Welfare stage.' },
        { title: 'Gomoku Duel', subtitle: 'Connect five before the AI.' }
      ],
      details: [
        {
          title: "Texas Hold'em: Quick Hand",
          description: 'Deal, reveal, and score by hand rank.',
          highlights: [
            'One-tap deal flow.',
            'Clear hand ranking.',
            'Better hand, higher score.'
          ]
        },
        {
          title: 'Lucky Wheel: Fast Loop',
          description: 'Quick spins with clear risk and reward.',
          highlights: [
            'Short spin cycle.',
            'Visible probability zones.',
            'Small wins, rare big hits.'
          ]
        },
        {
          title: 'Astro Persona: Welfare Stage',
          description: 'One run gives a 0-10 score. No penalty.',
          highlights: [
            'One-time generation.',
            'Score only, no deduction.',
            'Tiered luck result.'
          ]
        },
        {
          title: 'Gomoku Duel: Simple Tactics',
          description: 'You play black. AI plays white.',
          highlights: [
            'Tap to place.',
            'Five in a row wins.',
            'Win, lose, draw scoring.'
          ]
        }
      ],
      play: {
        title: 'Playground',
        scoreLabel: 'Total Score',
        spinning: 'Spinning...',
        texasAction: 'Deal Cards',
        texasRevealAction: 'Reveal Showdown',
        texasFoldAction: 'Fold',
        texasReplayAction: 'Quick Replay',
        texasToastTitle: 'Texas Result',
        wheelAction: 'Spin Wheel',
        fortuneAction: 'Generate Profile',
        jackpotAction: 'Restart Board',
        texasHands: 'Hands Played',
        texasResult: 'Best Hand',
        texasOutcome: 'Round Result',
        texasPlayerLabel: 'Your Hand',
        texasBoardLabel: 'Board',
        texasOpponentLabel: 'Opponent',
        texasHidden: 'Hidden',
        texasOutcomeWin: 'You Win',
        texasOutcomeLose: 'You Lose',
        texasOutcomeTie: 'Tie',
        texasOutcomeFold: 'Folded',
        fortuneMethodLabel: 'Profile By',
        fortuneMethodPlaceholder: 'Select one method',
        fortuneMethodOptions: {
          zodiac: 'Chinese Zodiac',
          mbti: 'MBTI',
          constellation: 'Constellation'
        },
        zodiacLabel: 'Zodiac Sign',
        zodiacPlaceholder: 'Select one zodiac sign',
        zodiacSelectHint: 'One pick only. Confirm before generating.',
        zodiacLockedHint: 'Locked after generation. You cannot change it now.',
        zodiacOptions: {
          rat: 'Rat',
          ox: 'Ox',
          tiger: 'Tiger',
          rabbit: 'Rabbit',
          dragon: 'Dragon',
          snake: 'Snake',
          horse: 'Horse',
          goat: 'Goat',
          monkey: 'Monkey',
          rooster: 'Rooster',
          dog: 'Dog',
          pig: 'Pig'
        },
        mbtiLabel: 'MBTI Type',
        mbtiPlaceholder: 'Select one MBTI type',
        mbtiOptions: {
          intj: 'INTJ - Architect',
          intp: 'INTP - Logician',
          entj: 'ENTJ - Commander',
          entp: 'ENTP - Debater',
          infj: 'INFJ - Advocate',
          infp: 'INFP - Mediator',
          enfj: 'ENFJ - Protagonist',
          enfp: 'ENFP - Campaigner',
          istj: 'ISTJ - Logistician',
          isfj: 'ISFJ - Defender',
          estj: 'ESTJ - Executive',
          esfj: 'ESFJ - Consul',
          istp: 'ISTP - Virtuoso',
          isfp: 'ISFP - Adventurer',
          estp: 'ESTP - Entrepreneur',
          esfp: 'ESFP - Entertainer'
        },
        constellationLabel: 'Constellation',
        constellationPlaceholder: 'Select one constellation',
        constellationOptions: {
          aries: 'Aries',
          taurus: 'Taurus',
          gemini: 'Gemini',
          cancer: 'Cancer',
          leo: 'Leo',
          virgo: 'Virgo',
          libra: 'Libra',
          scorpio: 'Scorpio',
          sagittarius: 'Sagittarius',
          capricorn: 'Capricorn',
          aquarius: 'Aquarius',
          pisces: 'Pisces'
        },
        fortuneSummary: 'Astro Profile',
        fortuneOverall: 'Overall',
        fortuneCareer: 'Career',
        fortuneLove: 'Love',
        fortuneWealth: 'Wealth',
        fortuneLuckyNumber: 'Lucky Number',
        fortuneLuckyColor: 'Lucky Color',
        fortuneLuckyTime: 'Lucky Time',
        fortuneConstellation: 'Constellation Archetype',
        fortuneMbti: 'MBTI Signal',
        fortuneZodiacTrend: 'Zodiac Trend',
        fortuneGrowthAction: 'Growth Action',
        fortuneSocialStyle: 'Social Style',
        fortuneConstellationPool: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
        fortuneMbtiPool: ['INTJ Strategist', 'INTP Analyst', 'ENTJ Commander', 'ENTP Debater', 'INFJ Advocate', 'INFP Mediator', 'ENFJ Mentor', 'ENFP Campaigner', 'ISTJ Inspector', 'ISFJ Protector', 'ESTJ Executive', 'ESFJ Coordinator', 'ISTP Craftsman', 'ISFP Creator', 'ESTP Challenger', 'ESFP Performer'],
        fortuneZodiacTrendPool: [
          'Rat energy boosts rapid decisions today.',
          'Ox rhythm favors stable long-term moves.',
          'Tiger momentum supports bold breakthroughs.',
          'Rabbit luck rewards gentle but firm choices.',
          'Dragon timing is ideal for public visibility.',
          'Snake intuition helps you read hidden signals.',
          'Horse pace unlocks high execution output.',
          'Pig aura attracts helpful collaboration.'
        ],
        fortuneGrowthActionPool: [
          'Pick one hard task and finish it in 25 minutes.',
          'Move one pending plan into a visible checklist.',
          'Send one concise update to reduce uncertainty.',
          'Cut one low-value meeting from your schedule.',
          'Use a 2-step goal: start now, refine later.',
          'Protect one deep-work block with no interruptions.',
          'Turn one idea into a public, testable draft.',
          'Close the day with a three-line retro note.'
        ],
        fortuneSocialStylePool: ['Connector', 'Builder', 'Spark', 'Anchor', 'Explorer', 'Mediator', 'Driver', 'Visionary'],
        fortuneScoreLabel: 'Score',
        fortuneTierLabel: 'Tier',
        fortuneTierNames: {
          sleep: 'Dormant',
          steady: 'Stable',
          good: 'Rising',
          great: 'Skyline',
          legend: 'Overdrive'
        },
        fortuneCongratsTitle: 'Luck Surge',
        fortuneCongratsDescription: 'Congrats! Your profile score is off the charts today.',
        fortuneNotReady: 'Select one method and one option to generate your profile.',
        wheelSpins: 'Wheel Spins',
        wheelStreak: 'Hot Streak',
        wheelRuleTitle: 'Wheel Rules',
        ruleAction: 'Rules',
        texasRuleTitle: "Texas Rules",
        texasRuleItems: [
          'Hand rank (high to low): Straight Flush > Four of a Kind > Full House > Flush > Straight > Three of a Kind > Two Pair > Pair > High Card.',
          'Flush: five cards of the same suit. Straight: five consecutive ranks. Straight Flush: both flush and straight.',
          'Four of a Kind: four cards of the same rank. Full House: three of a kind + one pair.',
          'Three of a Kind: three same-rank cards. Two Pair: two different pairs. Pair: one pair.',
          'Base score by hand: 11, 9, 7, 6, 5, 4, 3, 2, 1.',
          'Outcome multipliers: Win x1.2, Tie x0.6, Lose x-0.8.',
          'Final score = round(Base x Multiplier).',
          'Minimum per round: win/tie at least +1, lose at most -1.',
          'Total score floor for Texas: -20.'
        ],
        wheelRuleItems: ['Reward zone: +1 to +3 (44%)', 'Penalty zone: -1 to -3 (44%)', 'Neutral zone: 0 (10%)', 'Rare zone: +10 (0.5%) or -8 (1.5%)'],
        wheelZoneLabel: 'Hit Zone',
        wheelZoneNegative: 'Penalty Zone',
        wheelZonePositive: 'Reward Zone',
        wheelZoneNeutral: 'Neutral Zone',
        wheelZonePlus50: 'Big Bonus',
        wheelZoneMinus50: 'Big Trap',
        wheelRateLabel: 'Rate',
        wheelHistoryAction: 'View Records',
        wheelHistoryTitle: 'Spin Records',
        wheelHistoryEmpty: 'No records yet.',
        wheelHistoryZone: 'Zone',
        scoreHistoryAction: 'Score Details',
        scoreHistoryTitle: 'Global Score Log',
        scoreHistoryEmpty: 'No score records yet.',
        scoreHistoryGameLabel: 'Game',
        scoreHistoryTotalLabel: 'Total',
        scoreSourceLabels: {
          texas: "Texas Hold'em",
          wheel: 'Lucky Wheel',
          fortune: 'Astro Persona',
          jackpot: 'Jackpot Rush'
        },
        rewardTitle: 'Reward Unlocked',
        rewardDescription: 'Your total score reached 10. Scan this QR code to claim your bonus.',
        rewardClose: 'Close',
        rewardEntry: 'Reward',
        gomokuStatusLabel: 'Board Status',
        gomokuMovesLabel: 'Moves',
        gomokuTurnLabel: 'Current Turn',
        gomokuResetAction: 'Restart Board',
        gomokuOutcomeIdle: 'In Progress',
        gomokuOutcomeBlackWin: 'You Win',
        gomokuOutcomeWhiteWin: 'AI Wins',
        gomokuOutcomeDraw: 'Draw',
        gomokuBlackLabel: 'Black',
        gomokuWhiteLabel: 'White',
        focusBack: 'Back To Stages',
        enterStageAction: 'Enter Stage',
        lastGain: 'Last Gain',
        jackpotWindow: 'Board Status',
        jackpotOpen: 'You Win',
        jackpotClosed: 'AI Wins',
        handNames: {
          high_card: 'High Card',
          pair: 'Pair',
          two_pair: 'Two Pair',
          three_kind: 'Three of a Kind',
          straight: 'Straight',
          flush: 'Flush',
          full_house: 'Full House',
          four_kind: 'Four of a Kind',
          straight_flush: 'Straight Flush'
        }
      }
    },
    muyu: {
      kicker: 'Zen Arcade',
      title: 'Cyber Wooden Fish',
      description: 'Tap the wooden fish to stack merit and enter a calm flow state.',
      tip: 'Mainstream loop: tap, feedback, accumulate, repeat.',
      totalLabel: 'Total Merit',
      rewardHint: 'Reward unlocks at 100 taps: +10 bonus',
      rewardTitle: 'Muyu Reward +10',
      rewardDescription: '100 taps reached. Scan the QR code to claim your +10 reward.',
      rewardClose: 'Close',
      rewardEntry: 'Reward',
      comboLabel: 'Combo',
      comboBurstText: 'Zen Combo',
      burstText: 'Merit +1'
    },
    holiday: {
      label: 'China 2026 Holiday Countdown',
      nextPrefix: 'Next',
      ended: 'All 2026 holidays have started.',
      panelExpand: 'Expand',
      panelCollapse: 'Collapse',
      customLabel: 'Custom Countdown',
      customNameLabel: 'Name',
      customDateLabel: 'Date',
      customNamePlaceholder: 'Enter countdown name',
      customDatePlaceholder: 'Select target date',
      customStartAction: 'Start',
      customClearAction: 'Clear',
      customCountdownPrefix: 'Target',
      customEmpty: 'Set a name and date to start.',
      customExpired: 'Target date reached.',
      items: [
        { name: "New Year's Day", startIso: '2026-01-01T00:00:00+08:00', endIso: '2026-01-03T23:59:59+08:00' },
        { name: 'Spring Festival', startIso: '2026-02-15T00:00:00+08:00', endIso: '2026-02-23T23:59:59+08:00' },
        { name: 'Qingming Festival', startIso: '2026-04-04T00:00:00+08:00', endIso: '2026-04-06T23:59:59+08:00' },
        { name: 'Labor Day', startIso: '2026-05-01T00:00:00+08:00', endIso: '2026-05-05T23:59:59+08:00' },
        { name: 'Dragon Boat Festival', startIso: '2026-06-19T00:00:00+08:00', endIso: '2026-06-21T23:59:59+08:00' },
        { name: 'Mid-Autumn Festival', startIso: '2026-09-25T00:00:00+08:00', endIso: '2026-09-27T23:59:59+08:00' },
        { name: 'National Day', startIso: '2026-10-01T00:00:00+08:00', endIso: '2026-10-07T23:59:59+08:00' }
      ]
    },
    health: {
      kicker: 'Health Lab',
      title: 'Body Metrics & Trends',
      description: 'Record your body data, estimate health state, and watch multi-metric trends evolve over time.',
      backHome: 'Back Home',
      backTools: 'Back Tools',
      profileTitle: 'Profile Input',
      profileDescription: 'Fill today’s snapshot, then save it to your local timeline.',
      dateLabel: 'Date',
      weightLabel: 'Weight (kg)',
      heightLabel: 'Height (cm)',
      genderLabel: 'Gender',
      genderMale: 'Male',
      genderFemale: 'Female',
      genderOther: 'Other',
      genderValue: {
        male: 'Male',
        female: 'Female',
        other: 'Other'
      },
      bodyFatLabel: 'Body Fat (%)',
      waistLabel: 'Waist (cm)',
      targetWeightLabel: 'Target Weight (kg)',
      noteLabel: 'Daily Note',
      notePlaceholder: 'Sleep, workout, meals, or anything worth recording',
      bmiLabel: 'Current BMI',
      bmiRangeCopy: 'Reference range',
      healthyWeightLabel: 'Healthy Weight',
      deltaLabel: 'Gap To Target',
      rangeUnderweight: 'Underweight: below 18.5',
      rangeNormal: 'Healthy: 18.5 - 23.9',
      rangeOverweight: 'Overweight: 24 - 27.9',
      rangeObese: 'Obese: 28 and above',
      ranges: {
        underweight: 'Underweight',
        normal: 'Healthy',
        overweight: 'Overweight',
        obese: 'Obese'
      },
      saveAction: 'Save Record',
      clearAction: 'Clear Records',
      deleteAction: 'Delete',
      trendTitle: 'Trend Deck',
      latestLabel: 'Latest',
      noData: 'No health records yet.',
      dimensions: {
        day: 'Day',
        week: 'Week',
        month: 'Month',
        year: 'Year'
      },
      chartTypes: {
        line: 'Line',
        area: 'Area',
        bar: 'Bar'
      },
      metrics: {
        bmi: 'BMI',
        weight: 'Weight',
        bodyFat: 'Body Fat'
      },
      metricValueLabels: {
        bmi: 'BMI',
        weight: 'Weight',
        bodyFat: 'Body Fat'
      },
      recordsTitle: 'History',
      recordsCount: '{count} records'
    },
    tools: {
      kicker: 'Toolbox',
      title: 'Frontend Utilities',
      description: 'A lightweight toolbox for daily markup cleanup and quick checks.',
      backHome: 'Back Home',
      subRouteLabel: 'Tool Navigation',
      overviewNav: 'Overview',
      htmlNav: 'HTML',
      jsonNav: 'JSON',
      urlNav: 'URL',
      regexNav: 'Regex',
      chatNav: 'AI Chat',
      healthNav: 'Health',
      formatterTitle: 'HTML Formatter',
      formatterDescription: 'Normalize indentation and structure for readable HTML.',
      validatorTitle: 'HTML Validator',
      validatorDescription: 'Run a quick structural check for tag pairing issues.',
      jsonTitle: 'JSON Formatter',
      jsonDescription: 'Format and validate JSON in one place.',
      urlTitle: 'URL Encoder / Decoder',
      urlDescription: 'Quick encode or decode for query and path text.',
      regexTitle: 'Regex Visualizer',
      regexDescription: 'Test regex and visualize matched ranges.',
      chatTitle: 'AI Chat',
      chatDescription: 'A lightweight chat window with optional OpenAI-compatible endpoint settings.',
      healthTitle: 'Health Tracker',
      healthDescription: 'Track body metrics, compute BMI, and view animated trends across time ranges.',
      sourceLabel: 'Source',
      outputLabel: 'Output',
      regexPatternLabel: 'Pattern',
      regexFlagsLabel: 'Flags',
      regexResultTitle: 'Visual Result',
      sourcePlaceholder: '<div><h1>Hello</h1><p>world</p></div>',
      jsonPlaceholder: '{"name":"Robbie","skills":["React","TypeScript"]}',
      urlPlaceholder: 'name=Robbie Yang&stack=frontend tools',
      regexPatternPlaceholder: 'e.g. \\b[a-zA-Z]{4}\\b',
      regexTextPlaceholder: 'Input text for regex matching',
      formatAction: 'Format HTML',
      validateAction: 'Validate HTML',
      previewAction: 'Preview',
      previewTitle: 'Preview',
      previewEmpty: 'No HTML to preview.',
      regexRunAction: 'Run Regex',
      chatSendAction: 'Send',
      chatResetAction: 'Clear Chat',
      chatShowSettingsAction: 'Show Settings',
      chatHideSettingsAction: 'Hide Settings',
      jsonFormatAction: 'Format JSON',
      jsonValidateAction: 'Validate JSON',
      jsonSnakeCaseAction: 'To snake_case',
      urlEncodeAction: 'Encode URL',
      urlDecodeAction: 'Decode URL',
      clearAction: 'Clear',
      copyAction: 'Copy',
      validatePass: 'Structure check passed.',
      validateFailPrefix: 'Structure issue:',
      jsonValidatePass: 'JSON is valid.',
      jsonValidateFailPrefix: 'JSON issue:',
      jsonSnakeCaseDone: 'Converted JSON keys to snake_case.',
      regexInvalidPrefix: 'Regex issue:',
      regexNoMatch: 'No match.',
      regexMatchCount: 'Match count',
      regexMatchItem: 'Match',
      regexGroupsLabel: 'Groups',
      chatGreeting: 'Chat module is ready. Configure endpoint and API key to connect a real model.',
      chatSending: 'Waiting for response...',
      chatRemoteOn: 'Remote model mode enabled',
      chatRemoteOff: 'Local demo mode (endpoint/api key not configured)',
      chatInputLabel: 'Message',
      chatInputPlaceholder: 'Type your prompt, then send or press Ctrl/Cmd + Enter',
      chatUserLabel: 'You',
      chatAssistantLabel: 'Assistant',
      chatEndpointLabel: 'Endpoint',
      chatEndpointPlaceholder: 'https://your-domain/v1/chat/completions',
      chatModelLabel: 'Model',
      chatModelPlaceholder: 'gpt-4o-mini',
      chatApiKeyLabel: 'API Key',
      chatApiKeyPlaceholder: 'sk-...',
      chatSystemPromptLabel: 'System Prompt',
      chatSystemPromptPlaceholder: 'Set behavior instructions for the assistant',
      healthDateLabel: 'Date',
      healthWeightLabel: 'Weight (kg)',
      healthHeightLabel: 'Height (cm)',
      healthGenderLabel: 'Gender',
      healthGenderMale: 'Male',
      healthGenderFemale: 'Female',
      healthGenderOther: 'Other',
      healthGenderValue: {
        male: 'Male',
        female: 'Female',
        other: 'Other'
      },
      healthBmiLabel: 'Current BMI',
      healthBmiRangeCopy: 'Reference range',
      healthRangeUnderweight: 'Underweight: below 18.5',
      healthRangeNormal: 'Healthy: 18.5 - 23.9',
      healthRangeOverweight: 'Overweight: 24 - 27.9',
      healthRangeObese: 'Obese: 28 and above',
      healthRanges: {
        underweight: 'Underweight',
        normal: 'Healthy',
        overweight: 'Overweight',
        obese: 'Obese'
      },
      healthSaveAction: 'Save Record',
      healthClearAction: 'Clear Records',
      healthTrendTitle: 'BMI Trend',
      healthLatestLabel: 'Latest',
      healthNoData: 'No health records yet.',
      healthDimensions: {
        day: 'Day',
        week: 'Week',
        month: 'Month',
        year: 'Year'
      },
      healthChartTypes: {
        line: 'Line',
        area: 'Area',
        bar: 'Bar'
      },
      healthRecordsTitle: 'History',
      healthRecordsCount: '{count} records'
    }
  },
  zh: {
    localeLabel: '语言',
    hero: {
      titleLines: ['走向你的', '下一个', '广阔世界'],
      description: '持续学习，稳步向前。',
      startButton: '开始探索',
      toolsButton: '前端工具箱',
      healthButton: '健康中心',
      knowledgeButton: '前端知识库',
      blogButton: '技术博客',
      githubButton: 'GitHub',
      lockedHint: '分数超过 5 分后解锁'
    },
    world: {
      kicker: '选择一个世界',
      title: '四个关卡，易上手，耐玩。',
      stageLabel: '关卡',
      detailLabel: '关卡规则',
      items: [
        { title: '德州扑克牌', subtitle: '快速发牌，直接结算。' },
        { title: '幸运转盘', subtitle: '一转一结算，节奏快。' },
        { title: '星象人格', subtitle: '福利关卡，一次生成。' },
        { title: '五子棋对弈', subtitle: '先连五子即获胜。' }
      ],
      details: [
        {
          title: '德州扑克牌：快节奏',
          description: '发牌、开牌、按牌型结算。',
          highlights: ['一键发牌。', '牌型清晰。', '强牌高分。']
        },
        {
          title: '幸运转盘：快循环',
          description: '高频结算，奖惩直观。',
          highlights: ['转动快。', '区间清晰。', '小奖常见，大奖稀有。']
        },
        {
          title: '星象人格：福利关',
          description: '一次生成，0-10 打分，无扣分项。',
          highlights: ['仅生成一次。', '只加分不减分。', '按等级判定画像。']
        },
        {
          title: '五子棋对弈：轻策略',
          description: '你执黑先手，AI 执白应对。',
          highlights: ['点击落子。', '连五即胜。', '胜负平都有分。']
        }
      ],
      play: {
        title: '可玩演示',
        scoreLabel: '总分',
        spinning: '转动中...',
        texasAction: '发牌开局',
        texasRevealAction: '开牌比大小',
        texasFoldAction: '弃牌',
        texasReplayAction: '再来一局',
        texasToastTitle: '德州结算',
        wheelAction: '转动转盘',
        fortuneAction: '生成人格画像',
        jackpotAction: '重开棋盘',
        texasHands: '已玩局数',
        texasResult: '当前牌型',
        texasOutcome: '对局结果',
        texasPlayerLabel: '你的手牌',
        texasBoardLabel: '公共牌',
        texasOpponentLabel: '对手',
        texasHidden: '暗牌',
        texasOutcomeWin: '你赢了',
        texasOutcomeLose: '你输了',
        texasOutcomeTie: '平局',
        texasOutcomeFold: '已弃牌',
        fortuneMethodLabel: '筛选方式',
        fortuneMethodPlaceholder: '请选择一种方式',
        fortuneMethodOptions: {
          zodiac: '生肖',
          mbti: 'MBTI',
          constellation: '星座'
        },
        zodiacLabel: '生肖',
        zodiacPlaceholder: '请选择一个生肖',
        zodiacSelectHint: '仅可选择一次，请确认后生成。',
        zodiacLockedHint: '生成后将锁定，当前不可更改。',
        zodiacOptions: {
          rat: '鼠',
          ox: '牛',
          tiger: '虎',
          rabbit: '兔',
          dragon: '龙',
          snake: '蛇',
          horse: '马',
          goat: '羊',
          monkey: '猴',
          rooster: '鸡',
          dog: '狗',
          pig: '猪'
        },
        mbtiLabel: 'MBTI',
        mbtiPlaceholder: '请选择一个 MBTI',
        mbtiOptions: {
          intj: 'INTJ - 建筑师',
          intp: 'INTP - 逻辑学家',
          entj: 'ENTJ - 指挥官',
          entp: 'ENTP - 辩论家',
          infj: 'INFJ - 提倡者',
          infp: 'INFP - 调停者',
          enfj: 'ENFJ - 主人公',
          enfp: 'ENFP - 竞选者',
          istj: 'ISTJ - 物流师',
          isfj: 'ISFJ - 守卫者',
          estj: 'ESTJ - 总经理',
          esfj: 'ESFJ - 执政官',
          istp: 'ISTP - 鉴赏家',
          isfp: 'ISFP - 探险家',
          estp: 'ESTP - 企业家',
          esfp: 'ESFP - 表演者'
        },
        constellationLabel: '星座',
        constellationPlaceholder: '请选择一个星座',
        constellationOptions: {
          aries: '白羊座',
          taurus: '金牛座',
          gemini: '双子座',
          cancer: '巨蟹座',
          leo: '狮子座',
          virgo: '处女座',
          libra: '天秤座',
          scorpio: '天蝎座',
          sagittarius: '射手座',
          capricorn: '摩羯座',
          aquarius: '水瓶座',
          pisces: '双鱼座'
        },
        fortuneSummary: '星象人格画像',
        fortuneOverall: '综合',
        fortuneCareer: '事业',
        fortuneLove: '感情',
        fortuneWealth: '财运',
        fortuneLuckyNumber: '幸运数字',
        fortuneLuckyColor: '幸运色',
        fortuneLuckyTime: '幸运时段',
        fortuneConstellation: '星座原型',
        fortuneMbti: 'MBTI 信号',
        fortuneZodiacTrend: '生肖趋势',
        fortuneGrowthAction: '成长行动',
        fortuneSocialStyle: '社交风格',
        fortuneConstellationPool: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
        fortuneMbtiPool: ['INTJ 策略家', 'INTP 分析师', 'ENTJ 指挥官', 'ENTP 辩论家', 'INFJ 倡导者', 'INFP 调停者', 'ENFJ 教练型', 'ENFP 活力派', 'ISTJ 检查官', 'ISFJ 守护者', 'ESTJ 执行官', 'ESFJ 协调者', 'ISTP 实干家', 'ISFP 创作家', 'ESTP 挑战者', 'ESFP 表演者'],
        fortuneZodiacTrendPool: [
          '鼠系能量偏快，适合速决。',
          '牛系节奏稳，适合打基础。',
          '虎系推进强，适合攻坚任务。',
          '兔系气场柔和，适合协调沟通。',
          '龙系曝光位高，适合主动表达。',
          '蛇系洞察在线，适合策略布局。',
          '马系执行拉满，适合冲刺产出。',
          '猪系协作运强，适合联动合作。'
        ],
        fortuneGrowthActionPool: [
          '先完成一个最难任务的第一步。',
          '把一个想法改成可执行清单。',
          '给关键协作者发一条短更新。',
          '删掉一个低价值安排。',
          '先做 MVP，再做优化。',
          '为深度工作保留 40 分钟。',
          '把一个成果公开展示出来。',
          '睡前复盘三件做对的事。'
        ],
        fortuneSocialStylePool: ['连接者', '建造者', '点火者', '稳定器', '探索者', '调和者', '推进者', '愿景者'],
        fortuneScoreLabel: '得分',
        fortuneTierLabel: '等级',
        fortuneTierNames: {
          sleep: '休眠',
          steady: '平稳',
          good: '上扬',
          great: '高涨',
          legend: '爆棚'
        },
        fortuneCongratsTitle: '画像爆棚',
        fortuneCongratsDescription: '恭喜你，今日人格画像评分爆棚！',
        fortuneNotReady: '请选择一种方式并选择对应项，生成人格画像。',
        wheelSpins: '转盘次数',
        wheelStreak: '连击热度',
        wheelRuleTitle: '转盘规则',
        ruleAction: '查看规则',
        texasRuleTitle: '德州规则',
        texasRuleItems: [
          '牌型大小（从大到小）：同花顺 > 四条 > 葫芦 > 同花 > 顺子 > 三条 > 两对 > 一对 > 高牌。',
          '同花：5 张花色相同。顺子：5 张点数连续。同花顺：同时满足同花和顺子。',
          '四条：4 张点数相同。葫芦：三条 + 一对。',
          '三条：3 张点数相同。两对：两组不同的对子。一对：1 组对子。',
          '牌型基础分依次为：11、9、7、6、5、4、3、2、1。',
          '胜负系数：赢局 x1.2，平局 x0.6，输局 x-0.8。',
          '单局得分 = round(基础分 x 系数)。',
          '单局最小保护：赢/平至少 +1，输局最多 -1。',
          '德州总分下限保护：-20。'
        ],
        wheelRuleItems: ['加分区：+1 到 +3（44%）', '扣分区：-1 到 -3（44%）', '不变区：0（10%）', '稀有区：+10（0.5%）或 -8（1.5%）'],
        wheelZoneLabel: '命中区间',
        wheelZoneNegative: '扣分区',
        wheelZonePositive: '加分区',
        wheelZoneNeutral: '不变区',
        wheelZonePlus50: '大奖区',
        wheelZoneMinus50: '陷阱区',
        wheelRateLabel: '概率',
        wheelHistoryAction: '查看记录',
        wheelHistoryTitle: '转盘记录',
        wheelHistoryEmpty: '暂无记录。',
        wheelHistoryZone: '区间',
        scoreHistoryAction: '得分明细',
        scoreHistoryTitle: '全局得分流水',
        scoreHistoryEmpty: '暂无得分记录。',
        scoreHistoryGameLabel: '游戏',
        scoreHistoryTotalLabel: '累计',
        scoreSourceLabels: {
          texas: '德州扑克牌',
          wheel: '幸运转盘',
          fortune: '星象人格',
          jackpot: '头奖冲刺'
        },
        rewardTitle: '奖励已解锁',
        rewardDescription: '你的总分已达到 10 分，扫描下方二维码领取奖励。',
        rewardClose: '关闭',
        rewardEntry: '奖励入口',
        gomokuStatusLabel: '棋局状态',
        gomokuMovesLabel: '步数',
        gomokuTurnLabel: '当前回合',
        gomokuResetAction: '重开棋盘',
        gomokuOutcomeIdle: '进行中',
        gomokuOutcomeBlackWin: '你赢了',
        gomokuOutcomeWhiteWin: 'AI 获胜',
        gomokuOutcomeDraw: '平局',
        gomokuBlackLabel: '黑子',
        gomokuWhiteLabel: '白子',
        focusBack: '返回关卡',
        enterStageAction: '进入关卡',
        lastGain: '本次得分',
        jackpotWindow: '棋局状态',
        jackpotOpen: '你赢了',
        jackpotClosed: 'AI 获胜',
        handNames: {
          high_card: '高牌',
          pair: '一对',
          two_pair: '两对',
          three_kind: '三条',
          straight: '顺子',
          flush: '同花',
          full_house: '葫芦',
          four_kind: '四条',
          straight_flush: '同花顺'
        }
      }
    },
    muyu: {
      kicker: '禅意互动',
      title: '赛博木鱼',
      description: '敲击木鱼，累积功德，进入稳定节奏。',
      tip: '主流玩法：敲击反馈、数字累积、循环上瘾。',
      totalLabel: '累计功德',
      rewardHint: '敲击 100 次可解锁 +10 奖励',
      rewardTitle: '木鱼奖励 +10',
      rewardDescription: '已达成 100 次敲击，扫描二维码领取 +10 奖励。',
      rewardClose: '关闭',
      rewardEntry: '奖励入口',
      comboLabel: '连击',
      comboBurstText: '禅意连击',
      burstText: '功德 +1'
    },
    holiday: {
      label: '中国 2026 放假倒计时',
      nextPrefix: '下一个',
      ended: '2026 年节假日已全部开始。',
      panelExpand: '展开',
      panelCollapse: '收起',
      customLabel: '自定义倒计时',
      customNameLabel: '名称',
      customDateLabel: '日期',
      customNamePlaceholder: '输入倒计时名称',
      customDatePlaceholder: '选择目标日期',
      customStartAction: '开始',
      customClearAction: '清除',
      customCountdownPrefix: '目标',
      customEmpty: '请先设置名称和日期。',
      customExpired: '目标日期已到达。',
      items: [
        { name: '元旦', startIso: '2026-01-01T00:00:00+08:00', endIso: '2026-01-03T23:59:59+08:00' },
        { name: '春节', startIso: '2026-02-15T00:00:00+08:00', endIso: '2026-02-23T23:59:59+08:00' },
        { name: '清明节', startIso: '2026-04-04T00:00:00+08:00', endIso: '2026-04-06T23:59:59+08:00' },
        { name: '劳动节', startIso: '2026-05-01T00:00:00+08:00', endIso: '2026-05-05T23:59:59+08:00' },
        { name: '端午节', startIso: '2026-06-19T00:00:00+08:00', endIso: '2026-06-21T23:59:59+08:00' },
        { name: '中秋节', startIso: '2026-09-25T00:00:00+08:00', endIso: '2026-09-27T23:59:59+08:00' },
        { name: '国庆节', startIso: '2026-10-01T00:00:00+08:00', endIso: '2026-10-07T23:59:59+08:00' }
      ]
    },
    health: {
      kicker: '健康模块',
      title: '身体数据与趋势',
      description: '记录身体指标，计算健康状态，并用多指标趋势图观察长期变化。',
      backHome: '返回首页',
      backTools: '返回工具页',
      profileTitle: '今日数据',
      profileDescription: '填写今天的身体数据，保存到本地健康时间线。',
      dateLabel: '日期',
      weightLabel: '体重 (kg)',
      heightLabel: '身高 (cm)',
      genderLabel: '性别',
      genderMale: '男',
      genderFemale: '女',
      genderOther: '其他',
      genderValue: {
        male: '男',
        female: '女',
        other: '其他'
      },
      bodyFatLabel: '体脂率 (%)',
      waistLabel: '腰围 (cm)',
      targetWeightLabel: '目标体重 (kg)',
      noteLabel: '每日备注',
      notePlaceholder: '记录睡眠、训练、饮食或体感',
      bmiLabel: '当前 BMI',
      bmiRangeCopy: '健康参考范围',
      healthyWeightLabel: '健康体重区间',
      deltaLabel: '距目标差值',
      rangeUnderweight: '偏瘦：低于 18.5',
      rangeNormal: '健康：18.5 - 23.9',
      rangeOverweight: '超重：24 - 27.9',
      rangeObese: '肥胖：28 及以上',
      ranges: {
        underweight: '偏瘦',
        normal: '健康',
        overweight: '超重',
        obese: '肥胖'
      },
      saveAction: '保存记录',
      clearAction: '清空记录',
      deleteAction: '删除',
      trendTitle: '趋势面板',
      latestLabel: '最新',
      noData: '暂无健康记录。',
      dimensions: {
        day: '日',
        week: '周',
        month: '月',
        year: '年'
      },
      chartTypes: {
        line: '折线',
        area: '面积',
        bar: '柱状'
      },
      metrics: {
        bmi: 'BMI',
        weight: '体重',
        bodyFat: '体脂'
      },
      metricValueLabels: {
        bmi: 'BMI',
        weight: '体重',
        bodyFat: '体脂'
      },
      recordsTitle: '历史记录',
      recordsCount: '{count} 条记录'
    },
    tools: {
      kicker: '工具集合',
      title: '前端工具合集',
      description: '先搭一个轻量可用的工具页，后续可持续扩展。',
      backHome: '返回首页',
      subRouteLabel: '工具导航',
      overviewNav: '总览',
      htmlNav: 'HTML',
      jsonNav: 'JSON',
      urlNav: 'URL',
      regexNav: '正则',
      chatNav: 'AI 聊天',
      healthNav: '健康',
      formatterTitle: 'HTML 格式化',
      formatterDescription: '统一缩进和结构，便于阅读与提交。',
      validatorTitle: 'HTML 结构校验',
      validatorDescription: '快速检查标签闭合与嵌套问题。',
      jsonTitle: 'JSON 格式化',
      jsonDescription: '在同一处完成 JSON 格式化与校验。',
      urlTitle: 'URL 编解码',
      urlDescription: '快速处理查询参数与路径文本。',
      regexTitle: '正则可视化',
      regexDescription: '输入正则与文本，直观查看命中区间。',
      chatTitle: 'AI 聊天窗口',
      chatDescription: '内置轻量聊天模块，可选配置 OpenAI 兼容接口。',
      healthTitle: '健康记录',
      healthDescription: '记录身体数据，实时计算 BMI，并按时间维度展示炫酷趋势。',
      sourceLabel: '输入',
      outputLabel: '输出',
      regexPatternLabel: '表达式',
      regexFlagsLabel: '标记',
      regexResultTitle: '可视化结果',
      sourcePlaceholder: '<div><h1>Hello</h1><p>world</p></div>',
      jsonPlaceholder: '{"name":"Robbie","skills":["React","TypeScript"]}',
      urlPlaceholder: 'name=Robbie Yang&stack=frontend tools',
      regexPatternPlaceholder: '例如：\\b[a-zA-Z]{4}\\b',
      regexTextPlaceholder: '输入待匹配文本',
      formatAction: '格式化 HTML',
      validateAction: '校验 HTML',
      previewAction: '预览',
      previewTitle: '预览',
      previewEmpty: '暂无可预览内容。',
      regexRunAction: '执行匹配',
      chatSendAction: '发送',
      chatResetAction: '清空会话',
      chatShowSettingsAction: '展开配置',
      chatHideSettingsAction: '收起配置',
      jsonFormatAction: '格式化 JSON',
      jsonValidateAction: '校验 JSON',
      jsonSnakeCaseAction: '转下划线',
      urlEncodeAction: 'URL 编码',
      urlDecodeAction: 'URL 解码',
      clearAction: '清空',
      copyAction: '复制',
      validatePass: '结构校验通过。',
      validateFailPrefix: '结构异常：',
      jsonValidatePass: 'JSON 校验通过。',
      jsonValidateFailPrefix: 'JSON 异常：',
      jsonSnakeCaseDone: '已转换为下划线 key。',
      regexInvalidPrefix: '正则异常：',
      regexNoMatch: '未命中。',
      regexMatchCount: '命中数量',
      regexMatchItem: '命中',
      regexGroupsLabel: '分组',
      chatGreeting: '聊天模块已就绪。可配置 endpoint 与 api key 后连接真实模型。',
      chatSending: '模型回复中...',
      chatRemoteOn: '已启用远程模型模式',
      chatRemoteOff: '本地演示模式（未配置 endpoint 或 api key）',
      chatInputLabel: '输入内容',
      chatInputPlaceholder: '输入问题后发送，或按 Ctrl/Cmd + Enter',
      chatUserLabel: '你',
      chatAssistantLabel: '助手',
      chatEndpointLabel: '接口地址',
      chatEndpointPlaceholder: 'https://your-domain/v1/chat/completions',
      chatModelLabel: '模型名称',
      chatModelPlaceholder: 'gpt-4o-mini',
      chatApiKeyLabel: 'API Key',
      chatApiKeyPlaceholder: 'sk-...',
      chatSystemPromptLabel: '系统提示词',
      chatSystemPromptPlaceholder: '设置助手行为与回复风格',
      healthDateLabel: '日期',
      healthWeightLabel: '体重 (kg)',
      healthHeightLabel: '身高 (cm)',
      healthGenderLabel: '性别',
      healthGenderMale: '男',
      healthGenderFemale: '女',
      healthGenderOther: '其他',
      healthGenderValue: {
        male: '男',
        female: '女',
        other: '其他'
      },
      healthBmiLabel: '当前 BMI',
      healthBmiRangeCopy: '健康参考范围',
      healthRangeUnderweight: '偏瘦：低于 18.5',
      healthRangeNormal: '健康：18.5 - 23.9',
      healthRangeOverweight: '超重：24 - 27.9',
      healthRangeObese: '肥胖：28 及以上',
      healthRanges: {
        underweight: '偏瘦',
        normal: '健康',
        overweight: '超重',
        obese: '肥胖'
      },
      healthSaveAction: '保存记录',
      healthClearAction: '清空记录',
      healthTrendTitle: 'BMI 趋势',
      healthLatestLabel: '最新',
      healthNoData: '暂无健康记录。',
      healthDimensions: {
        day: '日',
        week: '周',
        month: '月',
        year: '年'
      },
      healthChartTypes: {
        line: '折线',
        area: '面积',
        bar: '柱状'
      },
      healthRecordsTitle: '历史记录',
      healthRecordsCount: '{count} 条记录'
    }
  }
};
