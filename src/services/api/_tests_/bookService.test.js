import { bookService } from '../bookService';

describe('bookService', () => {
  it('should filter books by title', async () => {
    const queryData = {
      parameters: [{ name: 'title', value: '1984' }],
      responseAttributes: ['Title', 'Author']
    };

    const result = await bookService.executeQuery(queryData);
    expect(result[0]).toEqual({
      Title: '1984',
      Author: 'George Orwell'
    });
  });

  it('should handle case insensitive search', async () => {
    const queryData = {
      parameters: [{ name: 'Author', value: 'GEORGE ORWELL' }],
      responseAttributes: ['Title']
    };

    const result = await bookService.executeQuery(queryData);
    expect(result[0].Title).toBe('1984');
  });

  it('should return empty message when no books found', async () => {
    const queryData = {
      parameters: [{ name: 'title', value: 'nonexistent book' }],
      responseAttributes: ['Title']
    };

    const result = await bookService.executeQuery(queryData);
    expect(result).toEqual({ message: 'No books found' });
  });
});     