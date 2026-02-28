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
  fortuneSummary: string;
  fortuneOverall: string;
  fortuneCareer: string;
  fortuneLove: string;
  fortuneWealth: string;
  fortuneLuckyNumber: string;
  fortuneLuckyColor: string;
  fortuneLuckyTime: string;
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
  holiday: {
    label: string;
    nextPrefix: string;
    ended: string;
    items: HolidayText[];
  };
};

export const messages: Record<Locale, Messages> = {
  en: {
    localeLabel: 'Language',
    hero: {
      titleLines: ['Jump Into', 'Your Next', 'Bright World'],
      description: 'Learn with consistency. Keep moving forward.',
      startButton: 'Start Adventure',
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
        { title: 'Zodiac Fortune', subtitle: 'Pick once. Reveal today luck.' },
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
          title: 'Zodiac Fortune: One Pick',
          description: 'Choose one zodiac sign and lock it.',
          highlights: [
            'Simple selector.',
            'One-time choice.',
            'Career, love, wealth.'
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
        wheelAction: 'Spin Wheel',
        fortuneAction: 'Generate Fortune',
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
        zodiacLabel: 'Zodiac Sign',
        zodiacPlaceholder: 'Select one zodiac sign',
        zodiacSelectHint: 'One pick only. Confirm first.',
        zodiacLockedHint: 'Locked. You cannot change it now.',
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
        fortuneSummary: 'Today Fortune',
        fortuneOverall: 'Overall',
        fortuneCareer: 'Career',
        fortuneLove: 'Love',
        fortuneWealth: 'Wealth',
        fortuneLuckyNumber: 'Lucky Number',
        fortuneLuckyColor: 'Lucky Color',
        fortuneLuckyTime: 'Lucky Time',
        fortuneNotReady: 'Select one zodiac sign to generate today fortune.',
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
        wheelRuleItems: ['Reward zone: +1 to +3 (20%)', 'Penalty zone: -1 to -3 (20%)', 'Neutral zone: 0 (58%)', 'Rare zone: +10 or -8 (2%)'],
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
          fortune: 'Birthday Fortune',
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
    holiday: {
      label: 'China 2026 Holiday Countdown',
      nextPrefix: 'Next',
      ended: 'All 2026 holidays have started.',
      items: [
        { name: "New Year's Day", startIso: '2026-01-01T00:00:00+08:00', endIso: '2026-01-03T23:59:59+08:00' },
        { name: 'Spring Festival', startIso: '2026-02-15T00:00:00+08:00', endIso: '2026-02-23T23:59:59+08:00' },
        { name: 'Qingming Festival', startIso: '2026-04-04T00:00:00+08:00', endIso: '2026-04-06T23:59:59+08:00' },
        { name: 'Labor Day', startIso: '2026-05-01T00:00:00+08:00', endIso: '2026-05-05T23:59:59+08:00' },
        { name: 'Dragon Boat Festival', startIso: '2026-06-19T00:00:00+08:00', endIso: '2026-06-21T23:59:59+08:00' },
        { name: 'Mid-Autumn Festival', startIso: '2026-09-25T00:00:00+08:00', endIso: '2026-09-27T23:59:59+08:00' },
        { name: 'National Day', startIso: '2026-10-01T00:00:00+08:00', endIso: '2026-10-07T23:59:59+08:00' }
      ]
    }
  },
  zh: {
    localeLabel: '语言',
    hero: {
      titleLines: ['走向你的', '下一个', '广阔世界'],
      description: '持续学习，稳步向前。',
      startButton: '开始探索',
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
        { title: '生肖运势', subtitle: '一次选择，今日解读。' },
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
          title: '生肖运势：单次选择',
          description: '选择一个生肖后即锁定。',
          highlights: ['选择简单。', '仅可一次。', '维度清楚。']
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
        wheelAction: '转动转盘',
        fortuneAction: '生成运势',
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
        zodiacLabel: '生肖',
        zodiacPlaceholder: '请选择一个生肖',
        zodiacSelectHint: '生肖只可选一次，请先确认。',
        zodiacLockedHint: '已锁定，当前不可更改。',
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
        fortuneSummary: '今日运势',
        fortuneOverall: '综合',
        fortuneCareer: '事业',
        fortuneLove: '感情',
        fortuneWealth: '财运',
        fortuneLuckyNumber: '幸运数字',
        fortuneLuckyColor: '幸运色',
        fortuneLuckyTime: '幸运时段',
        fortuneNotReady: '请选择一个生肖，生成今日运势。',
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
        wheelRuleItems: ['加分区：+1 到 +3（20%）', '扣分区：-1 到 -3（20%）', '不变区：0（58%）', '稀有区：+10 或 -8（2%）'],
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
          fortune: '生日运势',
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
    holiday: {
      label: '中国 2026 放假倒计时',
      nextPrefix: '下一个',
      ended: '2026 年节假日已全部开始。',
      items: [
        { name: '元旦', startIso: '2026-01-01T00:00:00+08:00', endIso: '2026-01-03T23:59:59+08:00' },
        { name: '春节', startIso: '2026-02-15T00:00:00+08:00', endIso: '2026-02-23T23:59:59+08:00' },
        { name: '清明节', startIso: '2026-04-04T00:00:00+08:00', endIso: '2026-04-06T23:59:59+08:00' },
        { name: '劳动节', startIso: '2026-05-01T00:00:00+08:00', endIso: '2026-05-05T23:59:59+08:00' },
        { name: '端午节', startIso: '2026-06-19T00:00:00+08:00', endIso: '2026-06-21T23:59:59+08:00' },
        { name: '中秋节', startIso: '2026-09-25T00:00:00+08:00', endIso: '2026-09-27T23:59:59+08:00' },
        { name: '国庆节', startIso: '2026-10-01T00:00:00+08:00', endIso: '2026-10-07T23:59:59+08:00' }
      ]
    }
  }
};
