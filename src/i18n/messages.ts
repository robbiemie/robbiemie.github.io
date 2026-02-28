export type Locale = 'en' | 'zh';

type WorldItemText = {
  title: string;
  subtitle: string;
};

type ShowcaseItemText = {
  title: string;
  description: string;
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
  };
  world: {
    kicker: string;
    title: string;
    stageLabel: string;
    items: WorldItemText[];
  };
  showcase: {
    kicker: string;
    title: string;
    items: ShowcaseItemText[];
  };
  knowledge: {
    kicker: string;
    title: string;
    description: string;
    action: string;
  };
  future: {
    kicker: string;
    title: string;
    placeholders: string[];
    description: string;
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
      knowledgeButton: 'Front End Knowledge Lib'
    },
    world: {
      kicker: 'Choose A World',
      title: 'Each world is a way to think.',
      stageLabel: 'Stage',
      items: [
        { title: 'Grass World', subtitle: 'Start with courage, finish with kindness.' },
        { title: 'Desert World', subtitle: 'Heat reveals what comfort hides.' },
        { title: 'Ice World', subtitle: 'Calm thinking saves momentum.' },
        { title: 'Sky World', subtitle: 'Perspective turns fear into play.' }
      ]
    },
    showcase: {
      kicker: 'Playbook',
      title: 'Ideas that stay useful under pressure.',
      items: [
        {
          title: 'Power-Up Mindset',
          description: 'Small upgrades, repeated daily, beat random bursts of effort.'
        },
        {
          title: 'Co-Op Thinking',
          description: 'Strong teams win by sharing intent, not only tasks.'
        },
        {
          title: 'Boss-Level Focus',
          description: 'The final 10 percent is where the real craft appears.'
        }
      ]
    },
    knowledge: {
      kicker: 'Keep Learning',
      title: 'A long-running knowledge base for notes, patterns, and reflections.',
      description: 'Visit the library and continue from any chapter at your own pace.',
      action: 'Enter Keep Learning'
    },
    future: {
      kicker: 'Coming Next',
      title: 'Reserved fifth screen for upcoming content.',
      placeholders: ['Module Placeholder A', 'Module Placeholder B', 'Module Placeholder C'],
      description: 'Placeholder slot reserved for future business modules.'
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
      knowledgeButton: '前端知识库'
    },
    world: {
      kicker: '选择一个世界',
      title: '每一个世界都是一种思考方式。',
      stageLabel: '关卡',
      items: [
        { title: '草原世界', subtitle: '以勇气出发，以温柔收束。' },
        { title: '沙漠世界', subtitle: '炎热会暴露舒适所隐藏的东西。' },
        { title: '冰雪世界', subtitle: '冷静思考能保留节奏。' },
        { title: '天空世界', subtitle: '视角会把恐惧变成游戏。' }
      ]
    },
    showcase: {
      kicker: '方法库',
      title: '压力之下仍然好用的思路。',
      items: [
        {
          title: '升级心态',
          description: '小幅度持续升级，胜过偶发式努力。'
        },
        {
          title: '协作思维',
          description: '强队伍胜在共享意图，而不只是分配任务。'
        },
        {
          title: '终局专注',
          description: '最后的10%，往往决定作品的质感。'
        }
      ]
    },
    knowledge: {
      kicker: '持续学习',
      title: '一个长期演进的知识库，记录笔记、模式和反思。',
      description: '随时进入知识库，从任意章节继续。',
      action: '进入 Keep Learning'
    },
    future: {
      kicker: '下一步',
      title: '第五屏预留给后续内容。',
      placeholders: ['模块占位 A', '模块占位 B', '模块占位 C'],
      description: '这里预留给后续业务模块。'
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
