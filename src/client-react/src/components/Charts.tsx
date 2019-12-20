import React, { PureComponent } from 'react'

interface Props {
  charts: any
}

interface State {
}

class Charts extends PureComponent<Props, State> {
  public render() {
    const { charts } = this.props

    if (charts.length === 0) {
      return <  div>No data</div>
    }
    return (
      <div>
        charts: { charts[0].height[0] }
      </div>
    )
  }
}

export default Charts