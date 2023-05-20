import React, { useEffect, useState } from "react";
import axios from "axios";

const Component2 = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/items");
        console.log(response.data);
        setItems(Object.values(response.data.items));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>; // Render a loading indicator while fetching data
  }

  return (
    <div>
      <h1>Component 2</h1>
      <h2>Items</h2>
      <ul>
        {items.length > 0 ? (
          items.map((item) => <li key={item.id}>{item.name}</li>)
        ) : (
          <li>No items to display</li>
        )}
      </ul>
    </div>
  );
};

export default Component2;
