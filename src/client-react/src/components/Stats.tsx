import React, { PureComponent } from 'react'

interface Props {
  stats: any
}

interface State {
}

class Stats extends PureComponent<Props, State> {
  public render() {
    const { stats } = this.props

    if (stats.length === 0) {
      return <  div>No data</div>
    }
    return (
      <pre>
        { `${ JSON.stringify(stats[0], null, 2) }` }
      </pre>
    )
  }
}

export default Stats