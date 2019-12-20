import React, { Component } from 'react'
import ReconnectingWebSocket from "reconnecting-websocket"
import getenv from 'getenv'
import Charts from "./Charts"
import Stats from "./Stats"
import BlockStats from "./BlockStats"
import ClientStats from "./ClientStats"

interface Props {
}

interface Event {
  action: string,
  data: any
}

interface State {
  ws: ReconnectingWebSocket,
  events: Event[]
}

const ethstatsURI = getenv("REACT_APP_WS_ETHSTATS", "ws://localhost:3000/primus/")

class EthStats extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const ws = new ReconnectingWebSocket(ethstatsURI)

    ws.addEventListener('message', (event) => {
      this.putEvent(JSON.parse(event.data))
    })

    this.state = {
      ws,
      events: []
    }
  }

  public getDataByAction(action: string) {
    return this.state.events
      .filter(event => event.action === action)
      .map(event => event.data)
      .reverse()
  }

  private putEvent(event: Event) {
    const { events } = this.state
    events.push(event)

    if (event.action === "client-ping") {
      event.data.clientTime = (new Date()).getTime()
    }
    this.setState({ events })
  }

  public render() {
    return (
      <div>
        <ClientStats ping={ this.getDataByAction("client-ping") }/>
        <Stats stats={ this.getDataByAction("stats") }/>
        <BlockStats blocks={ this.getDataByAction("block") }/>
        <Charts charts={ this.getDataByAction("charts") }/>
      </div>
    )
  }
}

export default EthStats