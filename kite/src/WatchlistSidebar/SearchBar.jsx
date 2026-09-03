import { useState } from "react";
function SearchBar() {
  const [stock, setStock] = useState("");
  return (
    <div className="searchbar">
      <input
        type="text"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );
}
export default SearchBar;
