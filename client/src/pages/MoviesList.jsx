import React, { Component } from 'react'
import api from '../api'
import { useTable, usePagination } from 'react-table'

import { Wrapper, Update, Delete } from './styled-components/MoviesListSC'
import '../style/movieslist.css'

class UpdateMovie extends Component {
  updateMovie = event => {
      event.preventDefault()

      window.location.href = `/movies/update/${this.props.id}`
  }

  render() {
      return <Update onClick={this.updateMovie}>Update</Update>
  }
}

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
    const { movies } = this.state

    function Table({columns, data}) {
      const {
        getTableProps,
        getTableBodyProps,
        prepareRow,
        headerGroups,
        //rows,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        previousPage,
        nextPage,
        setPageSize,
        state: {pageIndex, pageSize},
      } = useTable({
        columns,
        data,
        initialState: {pageIndex: 0}
      }, usePagination)

      // Render the UI for your table
      return (
      <div>
        {console.log(JSON.stringify({
            pageIndex,
            pageSize,
            pageCount,
            canNextPage,
            canPreviousPage
          }))}
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
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="pagination">
         <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
           {'<<'}
         </button>{' '}
         <button onClick={() => previousPage()} disabled={!canPreviousPage}>
           {'<'}
         </button>{' '}
         <button onClick={() => nextPage()} disabled={!canNextPage}>
           {'>'}
         </button>{' '}
         <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
           {'>>'}
         </button>{' '}
         <span>
           Page{' '}
           <strong>
             {pageIndex + 1} of {pageOptions.length }{' '}
           </strong>
         </span>
         <span>
           | Go to page:{' '}
           <input
             type="number"
             defaultValue={pageIndex + 1}
             onChange={e => {
               const page = e.target.value ? Number(e.target.value) - 1 : 0
               gotoPage(page)
             }}
             style={{ width: '100px' }}
           />
         </span>{' '}
         <select
           value={pageSize}
           onChange={e => {
             setPageSize(Number(e.target.value))
           }}
         >
           {[10, 20, 30, 40, 50].map(function(pageSize){
             return(
               <option key={pageSize} value={pageSize}>
                Show {pageSize}
               </option>
             )
           })}
         </select>
       </div>
       </div>
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
      },{
          Header: '',
          accessor: 'Update',
          Cell: function(props) {
              return (
                  <span>
                      <UpdateMovie id={props.row.original._id} />
                  </span>
              )
          },
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
