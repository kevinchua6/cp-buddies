import { PlatformType } from "../pages";

interface PlatformJsonData {
  type: PlatformType;
  username: string;
}

export interface CodeForcesJsonData extends PlatformJsonData {
  status: string;
  result: Result[];
}

export interface Result {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: Problem;
  author: Author;
  programmingLanguage: string;
  verdict: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

export interface Problem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  points: number;
  rating: number;
  tags: string[];
}

export interface Author {
  contestId: number;
  members: Member[];
  participantType: string;
  ghost: boolean;
  startTimeSeconds: number;
}

export interface Member {
  handle: string;
}

export interface LeetCodeJsonData extends PlatformJsonData {
  type: PlatformType;
  status: string;
  message: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: {
    [key: string]: number;
  };
}
[];
