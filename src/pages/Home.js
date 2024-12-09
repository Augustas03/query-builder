import { useState } from 'react';
import AddQuery from '../components/addQuery';
import QueryResults from '../components/QueryResults';
import QueryList from '../components/QueryList'

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [queries, setQueries] = useState([]);
    const [queryResults, setQueryResults] = useState({});

    const handleAddQuery = (query) => {
      setQueries(prev => [...prev, query])
      setShowModal(false)
    };

    const handleRemoveQuery = (queryName) => {
      setQueries(prev => prev.filter(query => query.queryName !== queryName));
      setQueryResults(prev => {
          const newResults = { ...prev };
          delete newResults[queryName];
          return newResults;
      });
  };

  const handleResultUpdate = (queryName, result) => {
    setQueryResults(prev => ({
        ...prev,
        [queryName]: result
    }));
  };

    return (
        <div>              
            <h1>Scheduled Queries</h1>
            <button onClick={() => setShowModal(true)}>Add</button>
            
            <QueryList 
                queries={queries}
                onRemove={handleRemoveQuery}
                onResultUpdate={handleResultUpdate}
            />

            {showModal && (
                <AddQuery 
                    onSave={handleAddQuery}
                    onClose={() => setShowModal(false)}
                />
            )}

            <QueryResults results={queryResults} /> 
        </div>
    );
};

export default Home;