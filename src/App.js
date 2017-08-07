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

  onBookShelfChange = (book, shelf) => {
    console.log(book, shelf)
    var books = [...this.state.books]
    books[book.id].shelf=shelf
    this.setState({books: books})
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
                  <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
                  <div className="search-books-input-wrapper">
                    {/* 
                      NOTES: The search from BooksAPI is limited to a particular set of search terms.
                      You can find these search terms here:
                      https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
                      
                      However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                      you don't find a specific author or title. Every search is limited by search terms.
                    */}

                    <input 
                      type="text" 
                      placeholder="Search by title or author"
                      value={query}
                      onChange={(event) => this.updateQuery(event.target.value)}/>
                    
                  </div>
                </div>
                <div className="search-books-results">
                  <ol className="books-grid">

                     <SearchResults books={this.state.bookResults} />
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
                           onBookShelfChange={(book) => {
                             this.onBookShelfChange(book)
                           }}
                           books={
                          this.state.books.filter((book) => book.shelf === 'currentlyReading')
                        } />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">Want to Read</h2>
                      <div className="bookshelf-books">
                       <SearchResults books={
                          this.state.books.filter((book) => book.shelf === 'wantToRead')
                        } />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">Read</h2>
                      <div className="bookshelf-books">
                        <SearchResults books={
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
