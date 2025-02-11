"use client";

import { useState } from "react";

interface Funnel {
  funnel_id: number;
  name: string;
}

export default function AutoComplete({ onSelect }: { onSelect: (funnel: Funnel) => void }) {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Funnel[]>([]);
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

  const handleSelect = (funnel: Funnel) => {
    setQuery(funnel.name);
    setFilteredItems([]);

    // Enviar los datos al componente padre
    onSelect(funnel);
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
      const response = await fetch(`/api/search/${name}`);
      const data: Funnel[] = await response.json();

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
        placeholder="Buscar una campaña..."
        className="w-full p-2 border-none bg-gray-100 rounded-xl"
      />
      {filteredItems.length > 0 && (
        <ul className="absolute left-0 w-full bg-white border rounded-xl mt-1 shadow-lg z-10">
          {filteredItems.map((item, index) => (
            <li
              key={item.funnel_id}
              className={`p-2 cursor-pointer ${
                index === selectedIndex ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => handleSelect(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
