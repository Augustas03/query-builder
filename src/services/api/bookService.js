import booksData from '../../data/books.json';

export const bookService = {
  executeQuery: async (queryData) => {
    try {
      const { parameters, responseAttributes } = queryData;
      
      // Filter books based on all parameters
      const filteredBooks = booksData.books.filter(book => {
        return parameters.every(param => {
          // Convert parameter name to lowercase to match books.json
          const bookValue = book[param.name.toLowerCase()];
          return String(bookValue).toLowerCase() === String(param.value).toLowerCase()
        });
      });

      if (filteredBooks.length === 0) {
        return { message: 'No books found' };
      }

      // Return filtered books with only requested attributes
      return filteredBooks.map(book => {
        const result = {};
        responseAttributes.forEach(attr => {
          // Convert attribute name to lowercase to match books.json
          const lowerAttr = attr.toLowerCase();
          if (book.hasOwnProperty(lowerAttr)) {
            result[attr] = book[lowerAttr]; // Keep original casing in result
          }
        });
        return result;
      });

    } catch (error) {
      console.error('Error in book service:', error);
      throw error;
    }
  }
};