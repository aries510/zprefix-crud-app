import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getItems = async () => {
      try {
        const apiFetchResponse = await fetch("http://localhost:8080/items");
        if(!apiFetchResponse.ok) {
          throw new Error(`Failed to fetch: ${apiFetchResponse.status}`)
        };
        const fetchItemsOutput = await apiFetchResponse.json();
        setItems(fetchItemsOutput);
      } catch(error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    };
    getItems();
  }, []);

  const createNewItem = async (newItem) => {
    try {
      const postItemResponse = await fetch("http://localhost:8080/items", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if(!postItemResponse) {
        throw new Error(`Create failed: ${postItemResponse.status}`);
      };
      const itemCreatedSuccessfully = await postItemResponse.json();
      setItems((items) => [...items, itemCreatedSuccessfully]);
    } catch(error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className='header'>
        <h1>Z-Prefix CRUD Inventory App</h1>
      </div>
    </>
  )
}

export default App
