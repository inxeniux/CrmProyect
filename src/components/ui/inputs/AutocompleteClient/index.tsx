"use client";

import { useState } from "react";

interface Client {
  client_id: number;
  contact_name: string;
  email?: string; // Opcional para que coincida con los datos de la API
}

export default function AutoCompleteClient({
  onSelect,
}: {
  onSelect: (client: Client) => void;
}) {
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
      console.error("Error al buscar el cliente:", err);
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
        className="w-full p-2 mt-2 border rounded
                  dark:bg-dark-bg-input dark:text-dark-text-primary dark:border-dark-border-medium
                  bg-light-bg-input text-light-text-primary border-light-border-medium
                  focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50"
      />
      {filteredItems.length > 0 && (
        <ul
          className="absolute left-0 w-full border rounded mt-1 shadow-lg z-10
                       dark:bg-dark-bg-secondary dark:border-dark-border-light
                       bg-light-bg-primary border-light-border-light"
        >
          {filteredItems.map((item, index) => (
            <li
              key={item.client_id}
              className={`p-2 cursor-pointer hover:bg-light-bg-secondary dark:hover:bg-dark-bg-primary ${
                index === selectedIndex
                  ? "bg-brand-primary text-white"
                  : "dark:bg-dark-bg-secondary dark:text-dark-text-primary bg-light-bg-primary text-light-text-primary"
              }`}
              onClick={() => handleSelect(item)}
            >
              <h1>{item.contact_name}</h1>
              <p className="text-sm dark:text-dark-text-tertiary text-light-text-tertiary">
                {item.email}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
