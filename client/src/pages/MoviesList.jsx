import React, { Component } from 'react'
import api from '../api'
import { useTable } from 'react-table'

import styled from 'styled-components'
import '../style/movieslist.css'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

class DeleteMovie extends Component {
    deleteMovie = event => {
        event.preventDefault()
        if (window.confirm(`Do tou want to delete the movie ${this.props.id} permanently?`)) {
            api.deleteMovieById(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteMovie}>Delete</Delete>
    }
}

class MoviesList extends Component {
  state = {
    movies: [],
    columns: [],
    isLoading: false,
  }

//We want to call the api to get movies!
componentDidMount = async () => {
  this.setState({isLoading: true})

  await api.getAllMovies().then( movies => {
    this.setState({movies: movies.data.data})
  }).catch(err => {
    console.log(err)
  })
}

render() {
    const { movies, isLoading } = this.state

    function Table({columns, data}) {
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({
        columns,
        data,
      })

      // Render the UI for your table
      return (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(
              (row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                )}
            )}
          </tbody>
        </table>
      )
    }

    const columns = [{
         Header: 'ID',
         accessor: '_id',
         filterable: true,
     },
     {
         Header: 'Name',
         accessor: 'name',
         filterable: true,
     },
     {
         Header: 'Rating',
         accessor: 'rating',
         filterable: true,
     },
     {
         Header: 'Time',
         accessor: (props) => props.time.join(' | ')
     },{
        Header: '',
        accessor: 'Delete',
        Cell: function(props) {
            return (
                <span>
                    <DeleteMovie id={props.row.original._id} />
                </span>
            )
        }
      }]

     let showTable = true
      if (!movies.length) {
          showTable = false
      }

    return (
      <Wrapper>
            {showTable && (
                <Table columns={columns} data={movies} />
            )}
      </Wrapper>
    )
  }
}

export default MoviesList
