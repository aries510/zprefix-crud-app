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

  const updateItem = async (id, specifiedFields) => {
    try {
      const updateItemResponse = await fetch(`http://localhost:8080/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specifiedFields),
      });
      if(!updateItemResponse) {
        throw new Error(`Update failed: ${updateItemResponse.status}`)
      };
      const updateItemSuccessful = await updateItemResponse.json();
      setItems((items) => items.map((item) => (item.id === id ? updateItemSuccessful : item)));
    } catch(error) {
      setError(error.message);
    };
  };

  const deleteItem = async (id) => {
    try {
      const deleteItemResponse = await fetch(`http://localhost:8080/items/${id}`, {
        method: 'DELETE',
      });
      if(!deleteItemResponse) {
        throw new Error(`Delete failed: ${deleteItemResponse.status}`)
      };
      setItems((items) => items.filter((item) => item.id !== id))
    } catch(error) {
      setError(error.message);
    };
  };

  if(loading) {
    return (
      <div className='loading'>
        <h1 className='loading-header'>Loading....</h1>
      </div>
    )
  };

  return (
    <main>
      <header className='header'>
        <h1>Z-Prefix CRUD Inventory App</h1>
        <span className='item-count'>{items.length} items</span>
        <button onClick={() => createNewItem()}>Add New Item</button>
      </header>

      {error && (
        <div>
          Error: {error}
        </div>
      )}

      {items.length === 0 ? (
        <p className='empty-items'>No items to display</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className='item-list'>
              <div className='item-row'>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>QTY: {item.qty}</p>
                <p>Owner: {item.owner.first_name} {item.owner.last_name}</p>
              </div>
              <div className='item-row-btn'>
                <button onClick={() => updateItem(item.id, item)}>
                  Edit
                </button>
                <button onClick={() => deleteItem(item.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default App
