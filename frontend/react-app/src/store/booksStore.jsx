export const addBook = (bookData) => {
    return fetch('/books/add', {
      method: 'POST',
      body: JSON.stringify(bookData),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  };
  
  export const borrowBook = (bookId) => {
    return fetch(`/books/borrow`, {
      method: 'POST',
      body: JSON.stringify({ bookId }),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  };
  
  export const deleteBook = (bookId) => {
    return fetch(`/books/delete/${bookId}`, { method: 'DELETE' });
  };
  
  export const getBooksList = () => {
    return fetch('/books/list').then(res => res.json());
  };
  
  export const returnBook = (bookId) => {
    return fetch(`/books/return`, {
      method: 'POST',
      body: JSON.stringify({ bookId }),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  };
  
  export const updateBook = (bookId, updatedData) => {
    return fetch(`/books/update/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  };
  
  export const getBookDetails = (bookId) => {
    return fetch(`/books/${bookId}`).then(res => res.json());
  };
  