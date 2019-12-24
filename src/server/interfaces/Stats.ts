import { BlockData } from "./BlockData";
import { Info } from "./Info";
import { BasicStats } from "./BaiscStats";

export interface Stats extends BasicStats {
  id?: string
  ip?: string
  spark?: string
  propagationAvg?: number
  name?: string
  registered?: boolean
  signer?: string
  address?: string
  pending: number
  block: BlockData
  clientTime?: number
  info?: Info
}
