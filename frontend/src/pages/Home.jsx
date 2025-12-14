import { useEffect, useState } from "react";
import {
  getSweets,
  buySweet,
  addSweet,
  deleteSweet,
  searchSweets,
  restockSweet,
} from "../services/api";

export default function Home() {
  const [sweets, setSweets] = useState([]);

  // SEARCH
  const [searchName, setSearchName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ADMIN ADD
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // RESTOCK
  const [restockQty, setRestockQty] = useState({});

  const role = localStorage.getItem("role");

  const loadSweets = async () => {
    const data = await getSweets();
    setSweets(data);
  };

  useEffect(() => {
    loadSweets();
  }, []);

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

  const handleBuy = async (sweetId) => {
    const res = await buySweet({ sweetId, quantity: 1 });
    if (res?.message) alert(res.message);
    loadSweets();
  };

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

  const handleDelete = async (id) => {
    await deleteSweet(id);
    loadSweets();
  };

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
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #020617, #0f172a)",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      {/* TITLE */}
      <h1
        style={{
          textAlign: "center",
          color: "#facc15",
          marginBottom: "25px",
          fontSize: "40px",
        }}
      >
        🍬 Sweet Shop
      </h1>

      {/* SEARCH BAR */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Search sweet"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {/* ADMIN PANEL */}
      {role === "admin" && (
        <div
          style={{
            margin: "35px auto",
            maxWidth: "600px",
            padding: "25px",
            borderRadius: "14px",
            background: "#020617",
            border: "1px solid #facc15",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <h3 style={{ color: "#facc15", marginBottom: "15px" }}>
            👑 Admin Panel
          </h3>

          <input
            placeholder="Sweet Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button onClick={handleAddSweet} style={{ marginTop: "10px" }}>
            Add Sweet
          </button>
        </div>
      )}

      {/* SWEET CARDS */}
      <div
        style={{
          marginTop: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "26px",
          width: "100%",
        }}
      >
        {sweets.map((s) => (
          <div
            key={s._id}
            style={{
              background: "#020617",
              borderRadius: "18px",
              padding: "20px",
              color: "#e5e7eb",
              boxShadow: "0 15px 40px rgba(0,0,0,0.45)",
              transition: "transform 0.2s",
            }}
          >
            <h3 style={{ color: "#facc15", marginBottom: "8px" }}>
              {s.name}
            </h3>

            <p>💰 Price: ₹{s.price}</p>
            <p>
              📦 Stock:{" "}
              <span style={{ color: s.quantity === 0 ? "red" : "#22c55e" }}>
                {s.quantity}
              </span>
            </p>

            <button
              style={{
                width: "100%",
                marginTop: "12px",
                background: "#22c55e",
                color: "#020617",
                fontWeight: "bold",
              }}
              disabled={s.quantity === 0}
              onClick={() => handleBuy(s._id)}
            >
              Buy
            </button>

            {role === "admin" && (
              <>
                <button
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    background: "#ef4444",
                    color: "#fff",
                  }}
                  onClick={() => handleDelete(s._id)}
                >
                  Delete
                </button>

                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginTop: "8px",
                  }}
                >
                  <input
                    type="number"
                    placeholder="Qty"
                    value={restockQty[s._id] || ""}
                    onChange={(e) =>
                      setRestockQty({
                        ...restockQty,
                        [s._id]: e.target.value,
                      })
                    }
                    style={{ flex: 1 }}
                  />
                  <button onClick={() => handleRestock(s._id)}>
                    +
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
