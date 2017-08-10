import React from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import SearchResults from './components/SearchResults'

class BooksApp extends React.Component {
  state = {
    showSearchPage: true,
    books: [],
    bookResults: []
  }
  componentDidMount(){
    
    BooksAPI.getAll().then((books) =>  {
      this.setState({books})
    })
    
  }
  updateQuery = (query) => {
    this.setState({ query: query.trim() })

    BooksAPI.search(query,10).then((results) => {
      this.setState({"bookResults": results})
    })
  }
  onResultsShelfChange = (book, shelf) => {
      BooksAPI.update(book, shelf).then(
        BooksAPI.getAll().then((bookResults) =>  {
          this.setState({bookResults})
        })
      )
  }
  onBookShelfChange = (book, shelf) => {
     BooksAPI.update(book, shelf).then(
        BooksAPI.getAll().then((books) =>  {
          this.setState({books})
        })
      )   
  }
  clearQuery = () => {
    this.setState({ query: '' })
  }
 

  render() {
    const { books, bookResults, query} = this.state
    return (
      <div className="app">
          <Route exact path="/search" render={() => (
              <div className="search-books">
                <div className="search-books-bar">
                  <Link className="close-search" to="/">Close</Link>
                  <div className="search-books-input-wrapper">
                  
                    <input 
                      type="text" 
                      placeholder="Search by title or author"
                      value={query}
                      onChange={(event) => this.updateQuery(event.target.value)}/>
                    
                  </div>
                </div>
                <div className="search-books-results">
                  <ol className="books-grid">

                     <SearchResults onBookShelfChange={(book, shelf) => {
                             this.onBookShelfChange(book, shelf)
                           }} books={this.state.bookResults} />
                  </ol>
                </div>
              </div>
            
          )}/>
           <Route exact path="/" render={() => (
              <div className="list-books">          
                <div className="list-books-title">
                  <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                  <div>
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">Currently Reading</h2>
                      <div className="bookshelf-books">
                        <SearchResults 
                           onBookShelfChange={(book, shelf) => {
                             this.onBookShelfChange(book, shelf)
                           }} 
                           books={this.state.books.filter((book) => book.shelf === 'currentlyReading')
                        } />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">Want to Read</h2>
                      <div className="bookshelf-books">
                       <SearchResults onBookShelfChange={(book, shelf) => {
                             this.onBookShelfChange(book, shelf)
                           }}  books={
                          this.state.books.filter((book) => book.shelf === 'wantToRead')
                        } />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">Read</h2>
                      <div className="bookshelf-books">
                        <SearchResults onBookShelfChange={(book, shelf) => {
                             this.onBookShelfChange(book, shelf)
                           }}  books={
                          this.state.books.filter((book) => book.shelf === 'read')
                        } />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="open-search">
                  <Link to="/search" onClick={() => this.setState({ showSearchPage: true })}>Add a book</Link>
                </div>
              </div>
         )}/>   
      </div>
    )
  }
}

export default BooksApp
