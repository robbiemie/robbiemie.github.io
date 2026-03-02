import { useEffect, useRef, useState } from 'react';

type WheelZone = 'negative' | 'positive' | 'neutral' | 'plus50' | 'minus50';

type WheelResult = {
  gain: number;
  zone: WheelZone;
  probability: number;
};

type WheelHistoryItem = {
  id: number;
  gain: number;
  zone: WheelZone;
  probability: number;
  spin: number;
  time: string;
};

type WheelSegmentRange = [number, number];
type ScoreSource = 'texas' | 'wheel' | 'fortune' | 'jackpot';
type ZodiacSign = 'rat' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake' | 'horse' | 'goat' | 'monkey' | 'rooster' | 'dog' | 'pig';
export type FortuneProfileMethod = 'zodiac' | 'mbti' | 'constellation';
type FortuneTier = 'sleep' | 'steady' | 'good' | 'great' | 'legend';
type GomokuStone = 'empty' | 'black' | 'white';
type GomokuWinner = 'black' | 'white' | 'draw' | null;

type ScoreHistoryItem = {
  id: number;
  source: ScoreSource;
  baseGain: number;
  modifier: number;
  gain: number;
  total: number;
  time: string;
};

const CARD_SUITS = ['S', 'H', 'D', 'C'] as const;
const CARD_RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'] as const;
const RANK_VALUE_MAP: Record<string, number> = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  '10': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2
};

const LUCKY_COLORS = ['Ruby Red', 'Ocean Blue', 'Mint Green', 'Sun Gold', 'Sky Purple'] as const;
const LUCKY_TIMES = ['09:00-11:00', '11:00-13:00', '14:00-16:00', '17:00-19:00', '20:00-22:00'] as const;
const FORTUNE_CONSTELLATION_COUNT = 12;
const FORTUNE_MBTI_COUNT = 16;
const FORTUNE_ZODIAC_TREND_COUNT = 8;
const FORTUNE_GROWTH_ACTION_COUNT = 8;
const FORTUNE_SOCIAL_STYLE_COUNT = 8;
const ZODIAC_SIGNS: readonly ZodiacSign[] = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
const MBTI_TYPES = [
  'intj',
  'intp',
  'entj',
  'entp',
  'infj',
  'infp',
  'enfj',
  'enfp',
  'istj',
  'isfj',
  'estj',
  'esfj',
  'istp',
  'isfp',
  'estp',
  'esfp'
] as const;
const CONSTELLATION_TYPES = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces'
] as const;
const GOMOKU_SIZE = 9;

export type TexasHandCode =
  | 'high_card'
  | 'pair'
  | 'two_pair'
  | 'three_kind'
  | 'straight'
  | 'flush'
  | 'full_house'
  | 'four_kind'
  | 'straight_flush';

type TexasOutcome = 'pending' | 'win' | 'lose' | 'tie' | 'fold';

type FortuneState = {
  ready: boolean;
  locked: boolean;
  method: FortuneProfileMethod | null;
  profileValue: string;
  zodiac: ZodiacSign | null;
  lastGain: number;
  score10: number;
  tier: FortuneTier;
  overall: number;
  career: number;
  love: number;
  wealth: number;
  luckyNumber: number;
  luckyColor: string;
  luckyTime: string;
  constellationIndex: number;
  mbtiIndex: number;
  zodiacTrendIndex: number;
  growthActionIndex: number;
  socialStyleIndex: number;
};

type GameplayState = {
  totalScore: number;
  scoreHistory: readonly ScoreHistoryItem[];
  texasPlayerCards: readonly string[];
  texasBoardCards: readonly string[];
  texasOpponents: readonly string[][];
  texasHighlightPlayerHandIndices: readonly number[];
  texasHighlightOpponentHandIndices: readonly number[][];
  texasOpponentHandCodes: readonly (TexasHandCode | null)[];
  texasWinningOpponentIndices: readonly number[];
  texasLastGain: number;
  texasHands: number;
  texasHandCode: TexasHandCode;
  texasOutcome: TexasOutcome;
  texasCanReveal: boolean;
  wheelAngle: number;
  wheelSpinning: boolean;
  wheelSpins: number;
  wheelStreak: number;
  wheelLastGain: number;
  wheelZone: WheelZone;
  wheelZoneProbability: number;
  wheelGradient: string;
  wheelHistory: readonly WheelHistoryItem[];
  fortune: FortuneState;
  jackpotLastGain: number;
  gomokuBoard: readonly GomokuStone[];
  gomokuSize: number;
  gomokuCurrentPlayer: 'black' | 'white';
  gomokuWinner: GomokuWinner;
  gomokuMoves: number;
};

type GameplayActions = {
  playTexas: () => void;
  revealTexas: () => void;
  foldTexas: () => void;
  playWheel: () => void;
  playFortune: (value: string, method: FortuneProfileMethod) => void;
  playJackpot: (index: number) => void;
  resetJackpot: () => void;
};

type DealtCard = {
  rank: string;
  suit: string;
};

type HandScore = {
  handCode: TexasHandCode;
  rankLevel: number;
  kickers: number[];
};

type BestHandResult = {
  score: HandScore;
  indices: number[];
};

const TEXAS_HAND_BASE_GAIN: Record<TexasHandCode, number> = {
  high_card: 1,
  pair: 2,
  two_pair: 3,
  three_kind: 4,
  straight: 5,
  flush: 6,
  full_house: 7,
  four_kind: 9,
  straight_flush: 11
};

const TEXAS_OUTCOME_MULTIPLIER: Record<TexasOutcome, number> = {
  pending: 0,
  win: 1.2,
  tie: 0.6,
  lose: -0.8,
  fold: 0
};

const TEXAS_MIN_TOTAL_SCORE = -20;

const calculateTexasGain = (handCode: TexasHandCode, outcome: TexasOutcome): number => {
  const baseGain = TEXAS_HAND_BASE_GAIN[handCode];
  const multiplier = TEXAS_OUTCOME_MULTIPLIER[outcome];
  const nextGain = Math.round(baseGain * multiplier);
  if (outcome === 'lose') {
    return Math.min(nextGain, -1);
  }
  return Math.max(nextGain, 1);
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const hashSeed = (value: string): number => {
  let seed = 0;
  for (let index = 0; index < value.length; index += 1) {
    seed = (seed * 31 + value.charCodeAt(index)) % 2147483647;
  }
  return seed;
};

const isStraight = (values: number[]): { ok: boolean; high: number } => {
  const sortedUniqueValues = Array.from(new Set(values)).sort((a, b) => a - b);
  if (sortedUniqueValues.length !== 5) {
    return { ok: false, high: 0 };
  }

  const normalStraight = sortedUniqueValues[4] - sortedUniqueValues[0] === 4;
  if (normalStraight) {
    return { ok: true, high: sortedUniqueValues[4] };
  }

  if (sortedUniqueValues.join(',') === '2,3,4,5,14') {
    return { ok: true, high: 5 };
  }

  return { ok: false, high: 0 };
};

const evaluateFiveCards = (cards: DealtCard[]): HandScore => {
  const values = cards.map((card) => RANK_VALUE_MAP[card.rank]);
  const valueCounts = new Map<number, number>();
  const suitCounts = new Map<string, number>();

  values.forEach((value) => {
    valueCounts.set(value, (valueCounts.get(value) ?? 0) + 1);
  });

  cards.forEach((card) => {
    suitCounts.set(card.suit, (suitCounts.get(card.suit) ?? 0) + 1);
  });

  const flush = Array.from(suitCounts.values()).some((count) => count === 5);
  const straightCheck = isStraight(values);

  const orderedGroups = Array.from(valueCounts.entries()).sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }
    return right[0] - left[0];
  });

  if (straightCheck.ok && flush) {
    return { handCode: 'straight_flush', rankLevel: 9, kickers: [straightCheck.high] };
  }
  if (orderedGroups[0][1] === 4) {
    return { handCode: 'four_kind', rankLevel: 8, kickers: [orderedGroups[0][0], orderedGroups[1][0]] };
  }
  if (orderedGroups[0][1] === 3 && orderedGroups[1][1] === 2) {
    return { handCode: 'full_house', rankLevel: 7, kickers: [orderedGroups[0][0], orderedGroups[1][0]] };
  }
  if (flush) {
    return { handCode: 'flush', rankLevel: 6, kickers: [...values].sort((a, b) => b - a) };
  }
  if (straightCheck.ok) {
    return { handCode: 'straight', rankLevel: 5, kickers: [straightCheck.high] };
  }
  if (orderedGroups[0][1] === 3) {
    const rest = orderedGroups.slice(1).map((item) => item[0]).sort((a, b) => b - a);
    return { handCode: 'three_kind', rankLevel: 4, kickers: [orderedGroups[0][0], ...rest] };
  }
  if (orderedGroups[0][1] === 2 && orderedGroups[1][1] === 2) {
    const highPair = Math.max(orderedGroups[0][0], orderedGroups[1][0]);
    const lowPair = Math.min(orderedGroups[0][0], orderedGroups[1][0]);
    const kicker = orderedGroups[2][0];
    return { handCode: 'two_pair', rankLevel: 3, kickers: [highPair, lowPair, kicker] };
  }
  if (orderedGroups[0][1] === 2) {
    const rest = orderedGroups.slice(1).map((item) => item[0]).sort((a, b) => b - a);
    return { handCode: 'pair', rankLevel: 2, kickers: [orderedGroups[0][0], ...rest] };
  }

  return { handCode: 'high_card', rankLevel: 1, kickers: [...values].sort((a, b) => b - a) };
};

const compareHands = (left: HandScore, right: HandScore): number => {
  if (left.rankLevel !== right.rankLevel) {
    return left.rankLevel > right.rankLevel ? 1 : -1;
  }

  const length = Math.max(left.kickers.length, right.kickers.length);
  for (let index = 0; index < length; index += 1) {
    const leftValue = left.kickers[index] ?? 0;
    const rightValue = right.kickers[index] ?? 0;
    if (leftValue !== rightValue) {
      return leftValue > rightValue ? 1 : -1;
    }
  }

  return 0;
};

const buildBestHandFromSeven = (cards: DealtCard[]): BestHandResult => {
  let bestScore = evaluateFiveCards(cards.slice(0, 5));
  let bestIndices = [0, 1, 2, 3, 4];

  for (let first = 0; first < cards.length - 4; first += 1) {
    for (let second = first + 1; second < cards.length - 3; second += 1) {
      for (let third = second + 1; third < cards.length - 2; third += 1) {
        for (let fourth = third + 1; fourth < cards.length - 1; fourth += 1) {
          for (let fifth = fourth + 1; fifth < cards.length; fifth += 1) {
            const nextScore = evaluateFiveCards([cards[first], cards[second], cards[third], cards[fourth], cards[fifth]]);
            if (compareHands(nextScore, bestScore) > 0) {
              bestScore = nextScore;
              bestIndices = [first, second, third, fourth, fifth];
            }
          }
        }
      }
    }
  }

  return { score: bestScore, indices: bestIndices };
};

const formatCard = (card: DealtCard): string => {
  const suitMap: Record<string, string> = {
    S: '♠',
    H: '♥',
    D: '♦',
    C: '♣'
  };

  return `${card.rank}${suitMap[card.suit]}`;
};

const getTodayKey = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isZodiacValid = (zodiac: string): zodiac is ZodiacSign => {
  return ZODIAC_SIGNS.includes(zodiac as ZodiacSign);
};

const isMbtiValid = (value: string): boolean => {
  return MBTI_TYPES.includes(value as (typeof MBTI_TYPES)[number]);
};

const isConstellationValid = (value: string): boolean => {
  return CONSTELLATION_TYPES.includes(value as (typeof CONSTELLATION_TYPES)[number]);
};

const getFortuneTier = (score10: number): FortuneTier => {
  if (score10 >= 9) return 'legend';
  if (score10 >= 7) return 'great';
  if (score10 >= 5) return 'good';
  if (score10 >= 3) return 'steady';
  return 'sleep';
};

const createShuffledDeck = (): DealtCard[] => {
  const deck = CARD_SUITS.flatMap((suit) => CARD_RANKS.map((rank) => ({ rank, suit })));
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }
  return deck;
};

const pickWheelResult = (): WheelResult => {
  const roll = Math.random() * 100;

  if (roll < 44) {
    const outcomes = [-1, -2, -2, -3] as const;
    return { gain: outcomes[randomInt(0, outcomes.length - 1)], zone: 'negative', probability: 44 };
  }

  if (roll < 88) {
    const outcomes = [1, 2, 2, 3] as const;
    return { gain: outcomes[randomInt(0, outcomes.length - 1)], zone: 'positive', probability: 44 };
  }

  if (roll < 98) {
    return { gain: 0, zone: 'neutral', probability: 10 };
  }

  if (roll < 98.5) {
    return { gain: 10, zone: 'plus50', probability: 0.5 };
  }

  return { gain: -8, zone: 'minus50', probability: 1.5 };
};

const WHEEL_ZONE_TOTAL_DEGREES: Record<WheelZone, number> = {
  negative: 158.4,
  positive: 158.4,
  neutral: 36,
  plus50: 1.8,
  minus50: 5.4
};

const WHEEL_ZONE_SPAN_RATIOS: Record<WheelZone, readonly number[]> = {
  negative: [0.25, 0.08, 0.18, 0.12, 0.22, 0.15],
  positive: [0.2, 0.14, 0.1, 0.22, 0.08, 0.26],
  neutral: [0.36, 0.18, 0.24, 0.12, 0.1],
  plus50: [1],
  minus50: [0.4, 0.6]
};

const WHEEL_ZONE_COLORS: Record<WheelZone, string> = {
  negative: '#ff8f84',
  positive: '#7fd870',
  neutral: '#8ec4ff',
  plus50: '#ffd44e',
  minus50: '#ef4f45'
};

const createWheelSegmentsData = (): { segments: Record<WheelZone, WheelSegmentRange[]>; gradient: string } => {
  const segments: Record<WheelZone, WheelSegmentRange[]> = {
    negative: [],
    positive: [],
    neutral: [],
    plus50: [],
    minus50: []
  };

  const buildSpans = (zone: WheelZone): number[] => {
    const totalDegrees = WHEEL_ZONE_TOTAL_DEGREES[zone];
    const ratios = WHEEL_ZONE_SPAN_RATIOS[zone];
    const spans = ratios.map((ratio) => totalDegrees * ratio);
    const consumed = spans.reduce((sum, span) => sum + span, 0);
    const diff = totalDegrees - consumed;
    spans[spans.length - 1] += diff;
    return spans;
  };

  const spanPool: Record<WheelZone, number[]> = {
    negative: buildSpans('negative'),
    positive: buildSpans('positive'),
    neutral: buildSpans('neutral'),
    plus50: buildSpans('plus50'),
    minus50: buildSpans('minus50')
  };

  // Mixed big/small slices, avoiding the previous evenly repeated pattern.
  const plan: WheelZone[] = [
    'negative',
    'neutral',
    'positive',
    'negative',
    'positive',
    'neutral',
    'negative',
    'plus50',
    'positive',
    'negative',
    'neutral',
    'positive',
    'minus50',
    'negative',
    'positive',
    'neutral',
    'negative',
    'positive',
    'minus50',
    'negative'
  ];

  let cursor = 0;
  const gradientStops: string[] = [];

  plan.forEach((zone, index) => {
    const span = spanPool[zone].shift();
    if (!span) {
      return;
    }
    const start = cursor;
    const end = index === plan.length - 1 ? 360 : cursor + span;
    segments[zone].push([start, end]);
    gradientStops.push(`${WHEEL_ZONE_COLORS[zone]} ${start.toFixed(3)}deg ${end.toFixed(3)}deg`);
    cursor = end;
  });

  return {
    segments,
    gradient: `conic-gradient(from 0deg, ${gradientStops.join(', ')})`
  };
};

const WHEEL_SEGMENTS_DATA = createWheelSegmentsData();
const WHEEL_ZONE_SEGMENTS = WHEEL_SEGMENTS_DATA.segments;
const WHEEL_GRADIENT = WHEEL_SEGMENTS_DATA.gradient;

const pickWheelAngle = (zone: WheelZone): number => {
  const segments = WHEEL_ZONE_SEGMENTS[zone];
  const totalSpan = segments.reduce((sum, [start, end]) => sum + (end - start), 0);
  let cursor = Math.random() * totalSpan;

  for (const [start, end] of segments) {
    const span = end - start;
    if (cursor <= span) {
      return start + Math.random() * span;
    }
    cursor -= span;
  }

  const [fallbackStart, fallbackEnd] = segments[segments.length - 1];
  return fallbackStart + Math.random() * (fallbackEnd - fallbackStart);
};

const createGomokuBoard = (): GomokuStone[] => {
  return Array.from({ length: GOMOKU_SIZE * GOMOKU_SIZE }, () => 'empty' as GomokuStone);
};

const isInsideGomoku = (row: number, col: number, size: number): boolean => {
  return row >= 0 && row < size && col >= 0 && col < size;
};

const countDirectionalStones = (
  board: readonly GomokuStone[],
  size: number,
  row: number,
  col: number,
  rowDelta: number,
  colDelta: number,
  stone: Exclude<GomokuStone, 'empty'>
): number => {
  let count = 0;
  let nextRow = row + rowDelta;
  let nextCol = col + colDelta;
  while (isInsideGomoku(nextRow, nextCol, size) && board[nextRow * size + nextCol] === stone) {
    count += 1;
    nextRow += rowDelta;
    nextCol += colDelta;
  }
  return count;
};

const hasFiveInRow = (board: readonly GomokuStone[], size: number, index: number, stone: Exclude<GomokuStone, 'empty'>): boolean => {
  const row = Math.floor(index / size);
  const col = index % size;
  const directions: Array<[number, number]> = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1]
  ];

  return directions.some(([rowDelta, colDelta]) => {
    const positiveCount = countDirectionalStones(board, size, row, col, rowDelta, colDelta, stone);
    const negativeCount = countDirectionalStones(board, size, row, col, -rowDelta, -colDelta, stone);
    return 1 + positiveCount + negativeCount >= 5;
  });
};

const findImmediateWinningMove = (board: readonly GomokuStone[], size: number, stone: Exclude<GomokuStone, 'empty'>): number | null => {
  for (let index = 0; index < board.length; index += 1) {
    if (board[index] !== 'empty') {
      continue;
    }
    const trialBoard = [...board];
    trialBoard[index] = stone;
    if (hasFiveInRow(trialBoard, size, index, stone)) {
      return index;
    }
  }
  return null;
};

const countNeighborStones = (board: readonly GomokuStone[], size: number, row: number, col: number, stone: Exclude<GomokuStone, 'empty'>): number => {
  let count = 0;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }
      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      if (isInsideGomoku(nextRow, nextCol, size) && board[nextRow * size + nextCol] === stone) {
        count += 1;
      }
    }
  }
  return count;
};

const pickStrategicAiMove = (board: readonly GomokuStone[], size: number): number => {
  const center = Math.floor(size / 2);
  let bestIndex = -1;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < board.length; index += 1) {
    if (board[index] !== 'empty') {
      continue;
    }
    const row = Math.floor(index / size);
    const col = index % size;
    const centerDistance = Math.abs(row - center) + Math.abs(col - center);
    const whiteNeighbors = countNeighborStones(board, size, row, col, 'white');
    const blackNeighbors = countNeighborStones(board, size, row, col, 'black');
    const score = whiteNeighbors * 6 + blackNeighbors * 5 - centerDistance;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  return bestIndex;
};

export const useWorldStageGameplay = (): GameplayState & GameplayActions => {
  const timeoutRefs = useRef<number[]>([]);
  const texasRoundRef = useRef<{ player: DealtCard[]; board: DealtCard[]; opponents: DealtCard[][] } | null>(null);
  const texasRevealLockedRef = useRef(false);
  const totalScoreRef = useRef(0);

  const [totalScore, setTotalScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<readonly ScoreHistoryItem[]>([]);

  const [texasPlayerCards, setTexasPlayerCards] = useState<readonly string[]>([]);
  const [texasBoardCards, setTexasBoardCards] = useState<readonly string[]>([]);
  const [texasOpponents, setTexasOpponents] = useState<readonly string[][]>([]);
  const [texasHighlightPlayerHandIndices, setTexasHighlightPlayerHandIndices] = useState<readonly number[]>([]);
  const [texasHighlightOpponentHandIndices, setTexasHighlightOpponentHandIndices] = useState<readonly number[][]>([]);
  const [texasOpponentHandCodes, setTexasOpponentHandCodes] = useState<readonly (TexasHandCode | null)[]>([]);
  const [texasWinningOpponentIndices, setTexasWinningOpponentIndices] = useState<readonly number[]>([]);
  const [texasLastGain, setTexasLastGain] = useState(0);
  const [texasHands, setTexasHands] = useState(0);
  const [texasHandCode, setTexasHandCode] = useState<TexasHandCode>('high_card');
  const [texasOutcome, setTexasOutcome] = useState<TexasOutcome>('pending');
  const [texasCanReveal, setTexasCanReveal] = useState(false);

  const [wheelAngle, setWheelAngle] = useState(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelSpins, setWheelSpins] = useState(0);
  const [wheelStreak, setWheelStreak] = useState(0);
  const [wheelLastGain, setWheelLastGain] = useState(0);
  const [wheelZone, setWheelZone] = useState<WheelZone>('neutral');
  const [wheelZoneProbability, setWheelZoneProbability] = useState(10);
  const [wheelHistory, setWheelHistory] = useState<readonly WheelHistoryItem[]>([]);

  const [fortune, setFortune] = useState<FortuneState>({
    ready: false,
    locked: false,
    method: null,
    profileValue: '',
    zodiac: null,
    lastGain: 0,
    score10: 0,
    tier: 'sleep',
    overall: 0,
    career: 0,
    love: 0,
    wealth: 0,
    luckyNumber: 0,
    luckyColor: LUCKY_COLORS[0],
    luckyTime: LUCKY_TIMES[0],
    constellationIndex: 0,
    mbtiIndex: 0,
    zodiacTrendIndex: 0,
    growthActionIndex: 0,
    socialStyleIndex: 0
  });

  const [jackpotLastGain, setJackpotLastGain] = useState(0);
  const [gomokuBoard, setGomokuBoard] = useState<readonly GomokuStone[]>(() => createGomokuBoard());
  const [gomokuCurrentPlayer, setGomokuCurrentPlayer] = useState<'black' | 'white'>('black');
  const [gomokuWinner, setGomokuWinner] = useState<GomokuWinner>(null);
  const [gomokuMoves, setGomokuMoves] = useState(0);

  useEffect(() => {
    totalScoreRef.current = totalScore;
  }, [totalScore]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  const addScore = (baseGain: number, source: ScoreSource, minTotalScore?: number): number => {
    const previousTotalScore = totalScoreRef.current;
    const mergedScore = previousTotalScore + baseGain;
    const nextTotalScore = typeof minTotalScore === 'number' ? Math.max(mergedScore, minTotalScore) : mergedScore;
    const appliedGain = nextTotalScore - previousTotalScore;

    totalScoreRef.current = nextTotalScore;
    setTotalScore(nextTotalScore);

    const historyItem: ScoreHistoryItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      source,
      baseGain,
      modifier: appliedGain - baseGain,
      gain: appliedGain,
      total: nextTotalScore,
      time: new Date().toLocaleTimeString('en-US', { hour12: false })
    };
    setScoreHistory((items) => [historyItem, ...items].slice(0, 40));
    return appliedGain;
  };

  const queueTimeout = (handler: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      handler();
      timeoutRefs.current = timeoutRefs.current.filter((id) => id !== timeoutId);
    }, delay);
    timeoutRefs.current.push(timeoutId);
  };

  const playTexas = () => {
    const deck = createShuffledDeck();
    const player = [deck.shift(), deck.shift()].filter(Boolean) as DealtCard[];
    const opponents = [
      [deck.shift(), deck.shift()].filter(Boolean) as DealtCard[],
      [deck.shift(), deck.shift()].filter(Boolean) as DealtCard[]
    ];
    const board = [deck.shift(), deck.shift(), deck.shift(), deck.shift(), deck.shift()].filter(Boolean) as DealtCard[];

    texasRoundRef.current = { player, board, opponents };

    setTexasPlayerCards(player.map(formatCard));
    setTexasBoardCards(board.map(formatCard));
    setTexasOpponents(opponents.map(() => ['🂠', '🂠']));
    setTexasHighlightPlayerHandIndices([]);
    setTexasHighlightOpponentHandIndices([[], []]);
    setTexasOpponentHandCodes([null, null]);
    setTexasWinningOpponentIndices([]);
    setTexasHandCode('high_card');
    setTexasOutcome('pending');
    setTexasLastGain(0);
    setTexasCanReveal(true);
    texasRevealLockedRef.current = false;
    setTexasHands((value) => value + 1);
  };

  const revealTexas = () => {
    if (!texasCanReveal || !texasRoundRef.current || texasRevealLockedRef.current) {
      return;
    }
    texasRevealLockedRef.current = true;

    const { player, board, opponents } = texasRoundRef.current;
    const playerBest = buildBestHandFromSeven([...player, ...board]);
    const playerScore = playerBest.score;
    const opponentBestResults = opponents.map((opponent) => buildBestHandFromSeven([...opponent, ...board]));
    const opponentScores = opponentBestResults.map((result) => result.score);

    const bestOpponentScore = opponentScores.reduce((best, current) => (compareHands(current, best) > 0 ? current : best));
    const compareWithBestOpponent = compareHands(playerScore, bestOpponentScore);
    const hasOpponentEqualPlayer = opponentScores.some((score) => compareHands(score, playerScore) === 0);
    const winningOpponentIndices = opponentScores
      .map((score, index) => ({ score, index }))
      .filter((entry) => compareHands(entry.score, bestOpponentScore) === 0)
      .map((entry) => entry.index);

    const outcome: TexasOutcome = compareWithBestOpponent > 0 ? 'win' : compareWithBestOpponent < 0 ? 'lose' : hasOpponentEqualPlayer ? 'tie' : 'win';
    const gain = calculateTexasGain(playerScore.handCode, outcome);

    setTexasOpponents(opponents.map((cards) => cards.map(formatCard)));
    setTexasHandCode(playerScore.handCode);
    setTexasHighlightPlayerHandIndices(playerBest.score.handCode === 'high_card' ? [] : playerBest.indices.filter((index) => index < 2));
    setTexasHighlightOpponentHandIndices(
      opponentBestResults.map((result) => (result.score.handCode === 'high_card' ? [] : result.indices.filter((index) => index < 2)))
    );
    setTexasOpponentHandCodes(opponentBestResults.map((result) => result.score.handCode));
    setTexasWinningOpponentIndices(outcome === 'win' ? [] : winningOpponentIndices);
    setTexasOutcome(outcome);
    const appliedGain = addScore(gain, 'texas', TEXAS_MIN_TOTAL_SCORE);
    setTexasLastGain(appliedGain);
    setTexasCanReveal(false);
  };

  const foldTexas = () => {
    if (!texasCanReveal || !texasRoundRef.current) {
      return;
    }

    const { board, opponents } = texasRoundRef.current;
    const opponentBestResults = opponents.map((opponent) => buildBestHandFromSeven([...opponent, ...board]));
    const opponentScores = opponentBestResults.map((result) => result.score);
    const bestOpponentScore = opponentScores.reduce((best, current) => (compareHands(current, best) > 0 ? current : best));
    const winningOpponentIndices = opponentScores
      .map((score, index) => ({ score, index }))
      .filter((entry) => compareHands(entry.score, bestOpponentScore) === 0)
      .map((entry) => entry.index);

    setTexasOpponents(opponents.map((cards) => cards.map(formatCard)));
    setTexasOutcome('fold');
    setTexasHighlightPlayerHandIndices([]);
    setTexasHighlightOpponentHandIndices(
      opponentBestResults.map((result) => (result.score.handCode === 'high_card' ? [] : result.indices.filter((index) => index < 2)))
    );
    setTexasOpponentHandCodes(opponentBestResults.map((result) => result.score.handCode));
    setTexasWinningOpponentIndices(winningOpponentIndices);
    setTexasLastGain(0);
    setTexasCanReveal(false);
  };

  const playWheel = () => {
    if (wheelSpinning) {
      return;
    }

    setWheelSpinning(true);
    const result = pickWheelResult();
    const targetAngle = pickWheelAngle(result.zone);
    setWheelAngle((angle) => {
      const normalizedCurrentAngle = ((angle % 360) + 360) % 360;
      const deltaToTarget = (targetAngle - normalizedCurrentAngle + 360) % 360;
      return angle + 1440 + deltaToTarget;
    });

    queueTimeout(() => {
      const nextSpinCount = wheelSpins + 1;
      const historyItem: WheelHistoryItem = {
        id: Date.now(),
        gain: result.gain,
        zone: result.zone,
        probability: result.zone === 'neutral' ? 10 : result.probability,
        spin: nextSpinCount,
        time: new Date().toLocaleTimeString('en-US', { hour12: false })
      };

      setWheelSpinning(false);
      setWheelSpins(nextSpinCount);
      const appliedGain = addScore(result.gain, 'wheel');
      setWheelLastGain(appliedGain);
      setWheelZone(result.zone);
      setWheelZoneProbability(result.zone === 'neutral' ? 10 : result.probability);
      setWheelStreak((value) => (result.gain > 0 ? value + 1 : 0));
      setWheelHistory((items) => [historyItem, ...items].slice(0, 24));
    }, 1120);
  };

  const playFortune = (value: string, method: FortuneProfileMethod) => {
    if (fortune.locked) {
      return;
    }

    const normalizedValue = value.trim().toLowerCase();
    const isValidInput =
      (method === 'zodiac' && isZodiacValid(normalizedValue)) ||
      (method === 'mbti' && isMbtiValid(normalizedValue)) ||
      (method === 'constellation' && isConstellationValid(normalizedValue));

    if (!isValidInput) {
      setFortune((prevState) => ({
        ...prevState,
        ready: false,
        method: null,
        profileValue: '',
        lastGain: 0,
        score10: 0,
        tier: 'sleep',
        constellationIndex: 0,
        mbtiIndex: 0,
        zodiacTrendIndex: 0,
        growthActionIndex: 0,
        socialStyleIndex: 0
      }));
      return;
    }

    const dayKey = getTodayKey();
    const seedBase = `${method}-${normalizedValue}`;
    const seed = hashSeed(`${seedBase}-${dayKey}`);
    const overall = seed % 101;
    const career = hashSeed(`${seedBase}-career-${dayKey}`) % 101;
    const love = hashSeed(`${seedBase}-love-${dayKey}`) % 101;
    const wealth = hashSeed(`${seedBase}-wealth-${dayKey}`) % 101;
    const luckyNumber = (seed % 9) + 1;
    const luckyColor = LUCKY_COLORS[seed % LUCKY_COLORS.length];
    const luckyTime = LUCKY_TIMES[seed % LUCKY_TIMES.length];
    const constellationIndex = hashSeed(`${seedBase}-constellation-${dayKey}`) % FORTUNE_CONSTELLATION_COUNT;
    const mbtiIndex = hashSeed(`${seedBase}-mbti-${dayKey}`) % FORTUNE_MBTI_COUNT;
    const zodiacTrendIndex = hashSeed(`${seedBase}-zodiac-trend-${dayKey}`) % FORTUNE_ZODIAC_TREND_COUNT;
    const growthActionIndex = hashSeed(`${seedBase}-growth-action-${dayKey}`) % FORTUNE_GROWTH_ACTION_COUNT;
    const socialStyleIndex = hashSeed(`${seedBase}-social-style-${dayKey}`) % FORTUNE_SOCIAL_STYLE_COUNT;

    const averageFortune = Math.round((overall + career + love + wealth) / 4);
    const score10 = Math.max(0, Math.min(10, Math.round(averageFortune / 10)));
    const nextGain = score10;
    const tier = getFortuneTier(score10);

    const appliedGain = addScore(nextGain, 'fortune');
    setFortune({
      ready: true,
      locked: true,
      method,
      profileValue: normalizedValue,
      zodiac: method === 'zodiac' && isZodiacValid(normalizedValue) ? normalizedValue : null,
      lastGain: appliedGain,
      score10,
      tier,
      overall,
      career,
      love,
      wealth,
      luckyNumber,
      luckyColor,
      luckyTime,
      constellationIndex,
      mbtiIndex,
      zodiacTrendIndex,
      growthActionIndex,
      socialStyleIndex
    });
  };

  const resetJackpot = () => {
    setGomokuBoard(createGomokuBoard());
    setGomokuCurrentPlayer('black');
    setGomokuWinner(null);
    setGomokuMoves(0);
    setJackpotLastGain(0);
  };

  const playJackpot = (index: number) => {
    if (index < 0 || index >= GOMOKU_SIZE * GOMOKU_SIZE || gomokuWinner) {
      return;
    }

    const boardDraft = [...gomokuBoard];
    if (boardDraft[index] !== 'empty') {
      return;
    }

    boardDraft[index] = 'black';
    let nextMoves = gomokuMoves + 1;

    if (hasFiveInRow(boardDraft, GOMOKU_SIZE, index, 'black')) {
      const gain = 6;
      const appliedGain = addScore(gain, 'jackpot');
      setGomokuBoard(boardDraft);
      setGomokuCurrentPlayer('black');
      setGomokuWinner('black');
      setGomokuMoves(nextMoves);
      setJackpotLastGain(appliedGain);
      return;
    }

    const emptyCells = boardDraft
      .map((stone, cellIndex) => ({ stone, cellIndex }))
      .filter((cell) => cell.stone === 'empty')
      .map((cell) => cell.cellIndex);

    if (emptyCells.length === 0) {
      const gain = 2;
      const appliedGain = addScore(gain, 'jackpot');
      setGomokuBoard(boardDraft);
      setGomokuCurrentPlayer('black');
      setGomokuWinner('draw');
      setGomokuMoves(nextMoves);
      setJackpotLastGain(appliedGain);
      return;
    }

    const aiWinningMove = findImmediateWinningMove(boardDraft, GOMOKU_SIZE, 'white');
    const aiBlockingMove = findImmediateWinningMove(boardDraft, GOMOKU_SIZE, 'black');
    const strategicMove = pickStrategicAiMove(boardDraft, GOMOKU_SIZE);
    const aiIndex =
      aiWinningMove ?? aiBlockingMove ?? (strategicMove >= 0 ? strategicMove : emptyCells[randomInt(0, emptyCells.length - 1)]);
    boardDraft[aiIndex] = 'white';
    nextMoves += 1;

    if (hasFiveInRow(boardDraft, GOMOKU_SIZE, aiIndex, 'white')) {
      const gain = -4;
      const appliedGain = addScore(gain, 'jackpot');
      setGomokuBoard(boardDraft);
      setGomokuCurrentPlayer('white');
      setGomokuWinner('white');
      setGomokuMoves(nextMoves);
      setJackpotLastGain(appliedGain);
      return;
    }

    const hasEmptyAfterAi = boardDraft.some((stone) => stone === 'empty');
    if (!hasEmptyAfterAi) {
      const gain = 2;
      const appliedGain = addScore(gain, 'jackpot');
      setGomokuBoard(boardDraft);
      setGomokuCurrentPlayer('black');
      setGomokuWinner('draw');
      setGomokuMoves(nextMoves);
      setJackpotLastGain(appliedGain);
      return;
    }

    setGomokuBoard(boardDraft);
    setGomokuCurrentPlayer('black');
    setGomokuWinner(null);
    setGomokuMoves(nextMoves);
    setJackpotLastGain(0);
  };

  return {
    totalScore,
    scoreHistory,
    texasPlayerCards,
    texasBoardCards,
    texasOpponents,
    texasHighlightPlayerHandIndices,
    texasHighlightOpponentHandIndices,
    texasOpponentHandCodes,
    texasWinningOpponentIndices,
    texasLastGain,
    texasHands,
    texasHandCode,
    texasOutcome,
    texasCanReveal,
    wheelAngle,
    wheelSpinning,
    wheelSpins,
    wheelStreak,
    wheelLastGain,
    wheelZone,
    wheelZoneProbability,
    wheelGradient: WHEEL_GRADIENT,
    wheelHistory,
    fortune,
    jackpotLastGain,
    gomokuBoard,
    gomokuSize: GOMOKU_SIZE,
    gomokuCurrentPlayer,
    gomokuWinner,
    gomokuMoves,
    playTexas,
    revealTexas,
    foldTexas,
    playWheel,
    playFortune,
    playJackpot,
    resetJackpot
  };
};
