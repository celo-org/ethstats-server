import Block from './Block'

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
