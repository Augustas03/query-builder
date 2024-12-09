
const QueryResults = ({ results }) => {
    return (
      <div>
        <h2>Query Results</h2>
        {Object.entries(results).map(([queryName, result]) => (
          <div key={queryName}>
            <h3>{queryName}</h3>
            <p>{JSON.stringify(result)}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default QueryResults;