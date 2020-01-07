import React, { Component } from 'react'
import ReconnectingWebSocket from "reconnecting-websocket"
import getenv from 'getenv'
import Nodes from "./Nodes"
import { Node } from "../interfaces/Node"
import Block from "../interfaces/Block"
import NodesTable from "./NodesTable";
import BlockTimer from "./BlockTimer";


const StatsContext = React.createContext({
  sortBy: {
    prop:'id',
    direction: 1
  }
})

interface Props {
}

interface Event {
  action: string,
  data: any
}

interface ChainState {
  bestBlock: Block
}

interface State {
  ws: ReconnectingWebSocket,
  nodes: {[Key: string]: Node},
  chainState: ChainState
}

const ethstatsURI = getenv("REACT_APP_WS_ETHSTATS", "ws://localhost:3000/primus/")

class CeloStats extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const ws = new ReconnectingWebSocket(ethstatsURI)

    ws.addEventListener('message', (event) => {
      this.putEvent(JSON.parse(event.data))
    })
    this.state = {
      ws,
      nodes: {},
      chainState: {
      // @ts-ignore
        bestBlock: {}
      }
    }
  }

  private putEvent(event: Event) {
    const { id } = event.data
    const nodes = this.addNodeIfNeeded(id)

    if (event.action === "init") {
      const { info } = event.data
      console.log("init", info)
      this.setState({ nodes })
    } else if (["add", "block", "pending", "stats"].includes(event.action)) {
      nodes[id] = { ...nodes[id], ...event.data }
      this.setState({ nodes })
    }

    if (event.action === "block") {
      const { chainState } = this.state
      if (!chainState.bestBlock.number ||
        event.data.block.number > chainState.bestBlock.number) {
        chainState.bestBlock = event.data.block
        this.setState( {chainState})
      }
    }
  }

  private addNodeIfNeeded(id: string) {
    const { nodes } = this.state
    if ( id && !nodes[id] ) {
      nodes[id] = {
        id,
        block: {},
        info: {},
        stats: {}
      } as Node
      this.setState({ nodes })
    }
    return nodes
  }

  public render() {
    const { chainState, nodes } = this.state
    return (
      <StatsContext.Provider value={
        {
          sortBy: { prop: 'id', direction: 1 }
        }
      }>
        <div>
          <div>
            Best block: { chainState.bestBlock.number }
          </div>
          <div>
            Last block: <BlockTimer receivedTime={chainState.bestBlock.arrived}/>
          </div>
          <Nodes nodes={ Object.values(nodes) }/>
          {/*<NodesTable nodes={ Object.values(nodes) }/>*/}
        </div>
      </StatsContext.Provider>
    )
  }
}

export default CeloStats
