import { useEffect, useState } from "react";
import {
  getSweets,
  buySweet,
  addSweet,
  deleteSweet,
  searchSweets,
  restockSweet, // ✅ NEW
} from "../services/api";

export default function Home() {
  const [sweets, setSweets] = useState([]);

  // 🔍 SEARCH STATE
  const [searchName, setSearchName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 👑 ADMIN ADD
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // 👑 ADMIN RESTOCK
  const [restockQty, setRestockQty] = useState({});

  const role = localStorage.getItem("role");

  const loadSweets = async () => {
    const data = await getSweets();
    setSweets(data);
  };

  useEffect(() => {
    loadSweets();
  }, []);

  // 🔍 SEARCH
  const handleSearch = async () => {
    const data = await searchSweets({
      name: searchName,
      minPrice,
      maxPrice,
    });
    setSweets(data);
  };

  const handleReset = () => {
    setSearchName("");
    setMinPrice("");
    setMaxPrice("");
    loadSweets();
  };

  // 🛒 BUY
  const handleBuy = async (sweetId) => {
    const res = await buySweet({ sweetId, quantity: 1 });
    if (res?.message) alert(res.message);
    loadSweets();
  };

  // 👑 ADD SWEET
  const handleAddSweet = async () => {
    if (!name || !price || !quantity) {
      alert("All fields required");
      return;
    }

    await addSweet({ name, price, quantity });
    setName("");
    setPrice("");
    setQuantity("");
    loadSweets();
  };

  // 👑 DELETE
  const handleDelete = async (id) => {
    await deleteSweet(id);
    loadSweets();
  };

  // 👑 RESTOCK
  const handleRestock = async (id) => {
    const qty = restockQty[id];
    if (!qty || qty <= 0) {
      alert("Enter valid quantity");
      return;
    }

    await restockSweet(id, qty);
    setRestockQty({ ...restockQty, [id]: "" });
    loadSweets();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>🍬 Sweet Shop</h2>

      {/* 🔍 SEARCH BAR */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        <input placeholder="Search by name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {/* 👑 ADMIN ADD PANEL */}
      {role === "admin" && (
        <div style={{ border: "2px solid gold", padding: "15px", margin: "20px auto", maxWidth: "500px", borderRadius: "10px" }}>
          <h3>👑 Admin Panel</h3>

          <input placeholder="Sweet Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

          <button onClick={handleAddSweet}>Add Sweet</button>
        </div>
      )}

      {/* 🍬 SWEETS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", maxWidth: "1000px", margin: "auto" }}>
        {sweets.map((s) => (
          <div key={s._id} style={{ border: "1px solid #444", borderRadius: "10px", padding: "15px", background: "#1e1e1e", color: "#fff" }}>
            <h3>{s.name}</h3>
            <p>Category: {s.category}</p>
            <p>Price: ₹{s.price}</p>
            <p>Available: {s.quantity}</p>

            <button disabled={s.quantity === 0} onClick={() => handleBuy(s._id)}>
              Buy
            </button>

            {/* 👑 ADMIN ACTIONS */}
            {role === "admin" && (
              <>
                <button style={{ marginLeft: "10px", background: "red", color: "white" }} onClick={() => handleDelete(s._id)}>
                  Delete
                </button>

                <div style={{ marginTop: "10px" }}>
                  <input
                    type="number"
                    placeholder="Restock qty"
                    value={restockQty[s._id] || ""}
                    onChange={(e) =>
                      setRestockQty({ ...restockQty, [s._id]: e.target.value })
                    }
                  />
                  <button onClick={() => handleRestock(s._id)}>Restock</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
