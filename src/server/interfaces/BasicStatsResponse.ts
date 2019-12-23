import { BasicStats } from "./BaiscStats";

export interface BasicStatsResponse {
  id: string,
  stats: BasicStats,
  history?: number[]
}