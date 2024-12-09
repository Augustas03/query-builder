import { useEffect } from 'react';
import { bookService } from '../services/api/bookService';

const QueryList = ({ queries, onRemove, onResultUpdate }) => {
    console.log("query", queries)
  useEffect(() => {
    const intervals = queries.map(query => {
      return setInterval(() => {
        executeQuery(query);
      }, parseInt(query.interval) * 60 * 1000); // Convert string interval to number
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [queries]);

  const executeQuery = async (query) => {
    try {
      // Pass the entire query object
      console.log(query);
      const result = await bookService.executeQuery(query);
      onResultUpdate(query.queryName, result);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  };

  return (
    <div>
      {queries.map((query) => (
        <div key={query.queryName}>
          <span>{query.queryName}</span>
          <span>Every {query.interval} min</span>
          <span>API: {query.api}</span>
          <button onClick={() => onRemove(query.queryName)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default QueryList;