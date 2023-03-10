import "./styles.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = async () => {
    setData(null);
    setLoading(true);
    try {
      if (searchTerm !== "") {
        const { data } = await axios.get(
          `https://dummyjson.com/products/search?q=${searchTerm}`
        );
        setData(data.products);
        if (searchTerm !== undefined && !searchHistory.includes(searchTerm)) {
          setSearchHistory([...searchHistory, searchTerm]);
          localStorage.setItem(
            "searchHistory",
            JSON.stringify([...searchHistory, searchTerm])
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const debounce = (cb) => {
    let timer;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        cb(...args);
      }, 1000);
    };
  };

  const handleSearchChange = debounce((event) =>
    setSearchTerm(event.target.value)
  );

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <label>
        Search:
        <input type="search" onChange={handleSearchChange} />
      </label>
      {searchTerm && data && (
        <div>
          <h1>Data:</h1>
          <pre>
            {data.map((item, index) => {
              return <p key={index}>{item.title}</p>;
            })}
          </pre>
        </div>
      )}
      {loading && <p>Loading!!</p>}
      <h2>Search History:</h2>
      <ul>
        {searchHistory &&
          searchHistory.map((term, index) => (
            <li key={index} onClick={() => handleHistoryClick(term)}>
              {term}
            </li>
          ))}
        {searchHistory.length === 0 && <p>Search History is empty</p>}
      </ul>
    </div>
  );
}

export default App;
