import { Validators } from "./Validators";
import { PropagationTime } from "./PropagationTime";

export interface Block {
  number?: number
  hash?: string
  parentHash?: string
  miner?: string
  difficulty?: string
  totalDifficulty?: string
  gasLimit?: number
  gasUsed?: number
  timestamp?: number
  time?: number
  height: number
  arrival?: number
  validators?: Validators
  received?: number
  trusted?: boolean
  arrived?: number
  fork?: number
  forks?: Block[]
  block?: Block
  propagation?: number
  propagTimes?: PropagationTime[]
  transactions?: any[]
  uncles?: any[]
}
