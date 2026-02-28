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
      title: 'Each world is a way to think.',
      stageLabel: 'Stage',
      detailLabel: 'Stage Brief',
      items: [
        { title: 'Grass World', subtitle: 'Start with courage, finish with kindness.' },
        { title: 'Desert World', subtitle: 'Heat reveals what comfort hides.' },
        { title: 'Ice World', subtitle: 'Calm thinking saves momentum.' },
        { title: 'Sky World', subtitle: 'Perspective turns fear into play.' }
      ],
      details: [
        {
          title: 'Grass World Mission',
          description: 'Build baseline habits and keep execution simple.',
          highlights: ['Start with one clear daily target.', 'Prefer consistency over intensity.', 'Close each day with a short review.']
        },
        {
          title: 'Desert World Mission',
          description: 'Operate well under pressure and scarce resources.',
          highlights: ['Focus on must-win priorities first.', 'Reduce noise and cut low-value tasks.', 'Use checkpoints to protect momentum.']
        },
        {
          title: 'Ice World Mission',
          description: 'Improve decision quality with calm structure.',
          highlights: ['Slow down before high-impact choices.', 'Document assumptions before execution.', 'Review outcomes and update rules.']
        },
        {
          title: 'Sky World Mission',
          description: 'Scale perspective from tasks to long-term direction.',
          highlights: ['Connect daily work to bigger goals.', 'Design for flexibility and reuse.', 'Share context so teams align faster.']
        }
      ]
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
      title: '每一个世界都是一种思考方式。',
      stageLabel: '关卡',
      detailLabel: '关卡说明',
      items: [
        { title: '草原世界', subtitle: '以勇气出发，以温柔收束。' },
        { title: '沙漠世界', subtitle: '炎热会暴露舒适所隐藏的东西。' },
        { title: '冰雪世界', subtitle: '冷静思考能保留节奏。' },
        { title: '天空世界', subtitle: '视角会把恐惧变成游戏。' }
      ],
      details: [
        {
          title: '草原世界任务',
          description: '建立稳定习惯，让执行路径保持简单清晰。',
          highlights: ['每天只设一个核心目标。', '持续性优先于爆发力。', '收尾时做一次简短复盘。']
        },
        {
          title: '沙漠世界任务',
          description: '在高压和资源有限的环境下保持效率。',
          highlights: ['先完成必须赢下的优先项。', '降低噪音，砍掉低价值任务。', '设置检查点，保护推进节奏。']
        },
        {
          title: '冰雪世界任务',
          description: '用冷静结构提升关键决策质量。',
          highlights: ['高影响决策前先放慢节奏。', '执行前先写清关键假设。', '复盘结果并更新决策规则。']
        },
        {
          title: '天空世界任务',
          description: '把视角从任务提升到长期方向。',
          highlights: ['把日常动作连接到长期目标。', '方案设计保留弹性和复用性。', '共享上下文，让协作更快对齐。']
        }
      ]
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
