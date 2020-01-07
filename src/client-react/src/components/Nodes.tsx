import React, { Component, PureComponent } from 'react'
// import { values } from "d3-collection";
import BlockTimer from './BlockTimer'
import { Node } from '../interfaces/Node'
import './Nodes.module.scss'

// @ts-ignore
const objectSort = (array, sortBy) => {
  return  array.sort((a:any, b:any) =>
    sortBy.direction*((a[sortBy.prop]  > b[sortBy.prop]) ? 1 : -1))
}

interface Props {
  nodes: Node[]
}

interface State {
  sortBy: any
}


class Nodes extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      sortBy: {
        prop:'id',
        direction: 1
      }
    }
    this.handleSort = this.handleSort.bind(this);
  }

  private handleSort(prop: string) {
    console.log("sortby", prop)
    const { sortBy } = this.state
    let direction = -1
    if ( sortBy.prop === prop) {
      direction = - sortBy.direction
    }
    this.setState({
      sortBy:  {
        prop: prop,
        direction: direction
      }
    })
  }

  public render() {
    const { nodes } = this.props
    const { sortBy } = this.state
    const nodesHeaders = {
      name: {text: "Name"},
      id: {text: "ID"},
      latency: {text: "Latency"},
      peers: {text: "Peers"},
      pending: {text: "Pending"},
      blockNumber: {text: "Block Number"},
      transactions: {text: "Transactions"},
      received: {text: "Time"},
      propagation: {text: "Propagation"},
      history: {text: "History"},
      propagationAvg: {text: "Prop. Avg"},
      uptime: {text: "Uptime"}
    }

    const nodesData = nodes.map(node => {
      const {
        block,
        id,
        info,
        history,
        pending,
        propagationAvg,
        stats
      } = node
      return {
        id,
        pending,
        propagationAvg,
        name: info.name,
        latency: parseInt(stats.latency),
        peers: stats.peers,
        blockNumber: block && block.number,
        transactions: block && block.transactions && block.transactions.length,
        received: block && block.received,
        propagation: block && block.propagation,
        history: history || [],
        uptime: stats.uptime
      }
    })
    const sortedNodesData = objectSort(nodesData, sortBy)
    return (
      <NodesTable
        data={ sortedNodesData }
        headers={ nodesHeaders }
        handleSort={ this.handleSort }/>
    )
  }

}



const NodesTable : React.FC<{ data: any[], headers: any, handleSort: any}> = ({ data, headers, handleSort }) => {
  if (data.length === 0) {
    return <div>No data</div>
  }
  return (
    <div>
      <div>
        Total of { data.length } Nodes:
      </div>
      <table>
        <thead>
        <tr>
          { Object.entries(headers).map(([key, value]) => {
            return (
              // @ts-ignore
              <th key={key} onClick={() => handleSort(key)}>{ value && value.text as any }</th>
            )})
          }
        </tr>
        </thead>
        <tbody>
        {
          data.map((data: any) => {
            return (
              <tr key={ data.id }>
                <td>{ data.name }</td>
                <td>
                  <pre>{ data.id }</pre>
                </td>
                <td>{ data.latency }</td>
                <td>{ data.peers }</td>
                <td>{ data.pending }</td>
                <td>{ data.blockNumber }</td>
                <td>{ data.transactions }</td>
                <td>{ data.received && <BlockTimer receivedTime={data.received}/>}</td>
                <td>{ data.propagation }</td>
                <td>

                </td>
                <td>{ data.propagationAvg }</td>
                <td>{ data.uptime }</td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </div>
  )
}

export default Nodes
