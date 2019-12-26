import React, { Component } from 'react'
import ReconnectingWebSocket from "reconnecting-websocket"
import getenv from 'getenv'
import Nodes from "./Nodes"
import { Node } from "../interfaces/Node"

interface Props {
}

interface Event {
  action: string,
  data: any
}

interface State {
  ws: ReconnectingWebSocket,
  nodes: {[Key: string]: Node}
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
      nodes: {}
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
    return (
      <div>
        <Nodes nodes={ Object.values(this.state.nodes) }/>
      </div>
    )
  }
}

export default CeloStats
