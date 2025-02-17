"use client";

import { useState } from "react";

interface Client {
  client_id: number;
  contact_name: string;
}

export default function AutoCompleteClient({ onSelect }: { onSelect: (client: Client) => void }) {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Client[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredItems([]);
    } else {
      handleSearchFunnel(value);
      setSelectedIndex(-1);
    }
  };

  const handleSelect = (client: Client) => {
    setQuery(client.contact_name);
    setFilteredItems([]);

    // Enviar los datos al componente padre
    onSelect(client);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && selectedIndex < filteredItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (e.key === "ArrowUp" && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  const handleSearchFunnel = async (name: string) => {
    try {
      const response = await fetch(`/api/search/${name}?table=client`);
      const data: Client[] = await response.json();

      if (response.ok) {
        setFilteredItems(data);
      }
    } catch (err) {
      console.error("Error al buscar el embudo:", err);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Buscar un cliente..."
        className="w-full p-2 mt-2 border-gray-200 bg-white rounded"
      />
      {filteredItems.length > 0 && (
        <ul className="absolute left-0 w-full bg-white border rounded mt-1 shadow-lg z-10">
          {filteredItems.map((item, index) => (
            <li
              key={item.client_id}
              className={`p-2 cursor-pointer ${
                index === selectedIndex ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => handleSelect(item)}
            >
             
              <h1>{item.contact_name}</h1>
              <p  className="text-gray-600 text-sm">{item.email}</p>
          
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
