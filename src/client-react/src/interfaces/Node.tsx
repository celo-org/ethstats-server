export interface Node {
  block: Block
  history: number[]
  id: string
  info: Info
  pending: number
  propagationAvg: number
  stats: Stats
}

export interface Info {
  api: boolean
  canUpdateHistory: boolean
  client: string
  name: string
  net: string
  node: string
  os: string
  os_v: string
  port: number
  protocol: string
}

export interface Stats {
  active: boolean
  elected: boolean
  gasPrice: number
  hashrate: number
  latency: string
  mining: boolean
  peers: number
  syncing: boolean
  uptime: number
}

export interface Block {
  number: number
  hash: string
  arrived: number
  blockRemain: number
  difficulty: string
  epochSize: number
  fork: number
  gasLimit: number
  gasUsed: number
  miner: string
  parentHash: string
  propagation: number
  received: number
  stateRoot: number
  time: number
  timestamp: number
  totalDifficulty: string
  transactions: any[]
  transactionsRoot: string
  trusted: boolean
  uncles: any[]
  validators: any
}
