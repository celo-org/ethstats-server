import React, { PureComponent } from 'react'
// import { values } from "d3-collection";
import BlockTimer from './BlockTimer'
import { Node } from '../interfaces/Node'
import './Nodes.module.scss'

interface Props {
  nodes: Node[]
}

interface State {
}

class Nodes extends PureComponent<Props, State> {
  public render() {
    const { nodes } = this.props

    if (nodes.length === 0) {
      return <div>No data</div>
    }
    return (
      <div>
        <div>
          Total of { nodes.length } Nodes:
        </div>
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Latency</th>
            <th>Peers</th>
            <th>Pending</th>
            <th>Block Number</th>
            <th>Transactions</th>
            <th>Time</th>
            <th>Propagation</th>
            <th>Prop. Avg</th>
            <th>Uptime</th>
          </tr>
          </thead>
          <tbody>
          {
            nodes.map((node: Node) => {
              const {
                block,
                id,
                info,
                pending,
                propagationAvg,
                stats
              } = node
              return (
                <tr key={ id }>
                  <td>{ info.name }</td>
                  <td>
                    <pre>{ id }</pre>
                  </td>
                  <td>{ stats.latency }</td>
                  <td>{ stats.peers }</td>
                  <td>{ pending }</td>
                  <td>{ block && block.number }</td>
                  <td>{ block && block.transactions && block.transactions.length }</td>
                  <td>{ block && block.received && <BlockTimer receivedTime={block.received}/>}</td>
                  <td>{ block && block.propagation }</td>
                  <td>{ propagationAvg }</td>
                  <td>{ stats.uptime }</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Nodes
