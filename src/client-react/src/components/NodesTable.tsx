import React from 'react'
// @ts-ignore
import styled from 'styled-components'
// @ts-ignore
import { useTable, useSortBy } from 'react-table'
import { Node } from '../interfaces/Node'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

// @ts-ignore
function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  )

  return (
    <>
      <div>Showing {rows.length} nodes</div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup:any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column:any) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row: any, i: number) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell :any) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
    </>
  )
}

const NodesTable : React.FC<{ nodes: Node[] }> = ({ nodes }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'Name',
            accessor: 'info.name',
          },
          {
            Header: 'ID',
            accessor: 'id',
          },
          {
            Header: 'Latency',
            accessor: 'stats.latency',
          },
          {
            Header: 'Peers',
            accessor: 'stats.peers',
          },
          {
            Header: 'Pending',
            accessor: 'pending',
          },
          {
            Header: 'Block #',
            accessor: 'block.number',
          },
          {
            Header: 'Transactions',
            accessor: 'block.transactions.length',
          },
          {
            Header: 'Block Time',
            accessor: 'block.received',
          },
          {
            Header: 'Propagation',
            accessor: 'block.propagation',
          },
        ],
      },
    ],
    []
  )

  return (
    <Styles>
      <Table columns={columns} data={nodes} />
    </Styles>
  )
}

export default NodesTable
