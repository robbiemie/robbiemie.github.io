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
  birthdayLabel: string;
  birthdayPlaceholder: string;
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
      githubButton: 'GitHub'
    },
    world: {
      kicker: 'Choose A World',
      title: 'Four simple stages. Instant fun. Hard to stop.',
      stageLabel: 'Stage',
      detailLabel: 'Stage Rules',
      items: [
        { title: "Texas Hold'em", subtitle: 'Deal and score in one tap. Easy to understand.' },
        { title: 'Lucky Wheel', subtitle: 'Spin fast, hit rewards, chase streaks.' },
        { title: 'Birthday Fortune', subtitle: 'Enter your birthday and reveal today fortune.' },
        { title: 'Jackpot Rush', subtitle: 'Combine wheel + slots for combo bursts.' }
      ],
      details: [
        {
          title: "Texas Hold'em: Fast Showdown",
          description: 'Deal 2 hole cards + 3 board cards, then score by poker hand strength.',
          highlights: [
            'Single button flow: tap to deal a full hand.',
            'Readable hand ranking with instant score payout.',
            'Strong hands trigger bigger rewards and excitement.'
          ]
        },
        {
          title: 'Lucky Wheel: Near-Miss Loop',
          description: 'Wheel outcomes use frequent near-miss moments to encourage one more spin.',
          highlights: [
            '3-second spin cycle, no dead time.',
            'Streak meter fills every spin, win or lose.',
            'Light bonuses every 3 spins, big bonus every 10.'
          ]
        },
        {
          title: 'Birthday Fortune: Daily Hook',
          description: 'Input birthday once, get personalized daily fortune and lucky hints instantly.',
          highlights: [
            'Simple date input, one-tap generation.',
            'Daily changing results keep revisit motivation.',
            'Clear fortune dimensions: career, love, wealth.'
          ]
        },
        {
          title: 'Jackpot Rush: Controlled Chaos',
          description: 'Alternate between wheel and slots to build combo multipliers and peak excitement.',
          highlights: [
            'Wheel rewards boost next slot round multiplier.',
            'Jackpot window appears every 60 seconds.',
            'Clear fail-safe: no long loss streaks for new players.'
          ]
        }
      ],
      play: {
        title: 'Playground',
        scoreLabel: 'Total Score',
        spinning: 'Spinning...',
        texasAction: 'Deal Cards',
        texasRevealAction: 'Reveal Showdown',
        wheelAction: 'Spin Wheel',
        fortuneAction: 'Generate Fortune',
        jackpotAction: 'Rush Jackpot',
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
        birthdayLabel: 'Birthday',
        birthdayPlaceholder: 'YYYY-MM-DD',
        fortuneSummary: 'Today Fortune',
        fortuneOverall: 'Overall',
        fortuneCareer: 'Career',
        fortuneLove: 'Love',
        fortuneWealth: 'Wealth',
        fortuneLuckyNumber: 'Lucky Number',
        fortuneLuckyColor: 'Lucky Color',
        fortuneLuckyTime: 'Lucky Time',
        fortuneNotReady: 'Enter your birthday to generate today fortune.',
        wheelSpins: 'Wheel Spins',
        wheelStreak: 'Hot Streak',
        lastGain: 'Last Gain',
        jackpotWindow: 'Jackpot Window',
        jackpotOpen: 'OPEN',
        jackpotClosed: 'Next Window',
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
      githubButton: 'GitHub'
    },
    world: {
      kicker: '选择一个世界',
      title: '四个超简单关卡，上手即爽，越玩越上头。',
      stageLabel: '关卡',
      detailLabel: '关卡规则',
      items: [
        { title: '德州扑克牌', subtitle: '一键发牌就能玩，规则直观易懂。' },
        { title: '幸运转盘', subtitle: '快速转动拿奖励，连击越转越爽。' },
        { title: '生日运势', subtitle: '输入生日，生成今日专属运势。' },
        { title: '头奖冲刺', subtitle: '转盘+老虎机联动，爆发感最强。' }
      ],
      details: [
        {
          title: '德州扑克牌：快速摊牌',
          description: '每次发 2 张手牌 + 3 张公共牌，按牌型强度即时结算得分。',
          highlights: ['只需一个按钮：点击发完整牌局。', '牌型结果清晰可读，反馈直接。', '强牌触发更高奖励，刺激继续挑战。']
        },
        {
          title: '幸运转盘：擦边上瘾回路',
          description: '通过高频“差一点就中”的结果设计，持续刺激玩家再来一次。',
          highlights: ['每次转盘约 3 秒，几乎无等待。', '无论输赢都累积连击能量。', '每 3 次给小奖，每 10 次触发大奖。']
        },
        {
          title: '生日运势：每日留存点',
          description: '输入生日即可快速生成当日运势，用轻反馈驱动“每天来看看”。',
          highlights: ['日期输入简单，一键生成。', '结果按日期变化，天然具备日更动力。', '运势维度清晰：事业、感情、财运。']
        },
        {
          title: '头奖冲刺：双系统联动',
          description: '转盘奖励会强化下一轮老虎机倍率，制造连续爆发的“高潮窗口”。',
          highlights: ['转盘命中可叠加老虎机倍率。', '每 60 秒开放一次头奖冲刺窗口。', '新手保护机制避免长时间连败。']
        }
      ],
      play: {
        title: '可玩演示',
        scoreLabel: '总分',
        spinning: '转动中...',
        texasAction: '发牌开局',
        texasRevealAction: '开牌比大小',
        wheelAction: '转动转盘',
        fortuneAction: '生成运势',
        jackpotAction: '冲刺头奖',
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
        birthdayLabel: '生日',
        birthdayPlaceholder: 'YYYY-MM-DD',
        fortuneSummary: '今日运势',
        fortuneOverall: '综合',
        fortuneCareer: '事业',
        fortuneLove: '感情',
        fortuneWealth: '财运',
        fortuneLuckyNumber: '幸运数字',
        fortuneLuckyColor: '幸运色',
        fortuneLuckyTime: '幸运时段',
        fortuneNotReady: '请输入生日，生成今日运势。',
        wheelSpins: '转盘次数',
        wheelStreak: '连击热度',
        lastGain: '本次得分',
        jackpotWindow: '头奖窗口',
        jackpotOpen: '进行中',
        jackpotClosed: '下次开启',
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
