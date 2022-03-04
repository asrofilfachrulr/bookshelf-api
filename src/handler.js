const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBookData = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBookData);

  const isAdded = books.filter((book) => book.id === id).length > 0;

  if (isAdded) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request) => {
  const { name: nameQuery, reading: readingQuery, finished: finishedQuery } = request.query;

  if (nameQuery !== undefined) {
    const filteredBook = books.filter((book) => {
      const splittedBookName = book.name.toLowerCase().split(' ');
      const exp = splittedBookName.some((chunk) => chunk === nameQuery.toLowerCase());
      return exp;
    });
    const formatedBooks = filteredBook.map((book) => {
      const { id, name, publisher } = book;
      return { id, name, publisher };
    });

    const response = {
      status: 'success',
      data: {
        books:
          formatedBooks,
      },
    };
    return response;
  }

  if (readingQuery !== undefined) {
    if (readingQuery === '1') {
      const filteredBook = books.filter((book) => book.reading);
      const formatedBooks = filteredBook.map((book) => {
        const { id, name, publisher } = book;
        return { id, name, publisher };
      });
      const response = {
        status: 'success',
        data: {
          books:
            formatedBooks,
        },
      };
      return response;
    }
    if (readingQuery === '0') {
      const filteredBook = books.filter((book) => !book.reading);
      const formatedBooks = filteredBook.map((book) => {
        const { id, name, publisher } = book;
        return { id, name, publisher };
      });
      const response = {
        status: 'success',
        data: {
          books:
            formatedBooks,
        },
      };
      return response;
    }
  }

  if (finishedQuery !== undefined) {
    if (finishedQuery === '1') {
      const filteredBook = books.filter((book) => book.finished);
      const formatedBooks = filteredBook.map((book) => {
        const { id, name, publisher } = book;
        return { id, name, publisher };
      });
      const response = {
        status: 'success',
        data: {
          books:
            formatedBooks,
        },
      };
      return response;
    }
    if (finishedQuery === '0') {
      const filteredBook = books.filter((book) => !book.finished);
      const formatedBooks = filteredBook.map((book) => {
        const { id, name, publisher } = book;
        return { id, name, publisher };
      });
      const response = {
        status: 'success',
        data: {
          books:
            formatedBooks,
        },
      };
      return response;
    }
  }

  const formatedBooks = books.map((book) => {
    const { id, name, publisher } = book;
    return { id, name, publisher };
  });

  const response = {
    status: 'success',
    data: {
      books:
        formatedBooks,
    },
  };
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const thisBook = books.filter((b) => b.id === bookId)[0];

  if (thisBook === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book:
        thisBook,
    },
  });
  response.code(200);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
