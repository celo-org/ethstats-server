import React, { PureComponent } from 'react'

interface Props {
  blocks: any
}

interface State {
}

class BlockStats extends PureComponent<Props, State> {
  public render() {
    const { blocks } = this.props

    if (blocks.length === 0) {
      return <  div>No data</div>
    }
    return (
      <pre>
        { JSON.stringify(blocks[0].block, null, 2) }
      </pre>
    )
  }
}

export default BlockStats