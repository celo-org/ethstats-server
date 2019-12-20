import { fa, Miner } from "./fu";

export interface ChartData {
  height: number[]
  blocktime: number[]
  avgBlocktime: number
  difficulty: number[]
  uncles: number[]
  transactions: number[]
  gasSpending: number[]
  gasLimit: number[]
  miners: Miner[]
  propagation: fa
}