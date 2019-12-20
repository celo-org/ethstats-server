import React, { PureComponent } from 'react'

interface Props {
  ping: any
}

interface State {
}

class ClientStats extends PureComponent<Props, State> {
  public render() {
    const { ping } = this.props

    if (ping.length === 0) {
      return <  div>No data</div>
    }
    return (
      <div>
        latency: { (ping[0].clientTime - ping[0].serverTime) / 1000 }s
      </div>
    )
  }
}

export default ClientStats