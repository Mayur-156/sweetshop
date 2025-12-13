const API_URL = "http://localhost:8000/api";

// ======================
// AUTH APIs
// ======================
export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ======================
// SWEETS APIs
// ======================
export const getSweets = async () => {
  const res = await fetch(`${API_URL}/sweets`);
  return res.json();
};

// 👑 ADMIN: ADD SWEET ✅
export const addSweet = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/sweets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// 👑 ADMIN: DELETE SWEET ✅
export const deleteSweet = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/sweets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

// 🔍 SEARCH SWEETS
export const searchSweets = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== "" && params[key] !== undefined) {
      cleanParams[key] = params[key];
    }
  });

  const query = new URLSearchParams(cleanParams).toString();
  const res = await fetch(`${API_URL}/sweets/search?${query}`);
  return res.json();
};

// ======================
// PURCHASE API
// ======================
export const buySweet = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/purchase/buy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// 👑 ADMIN: RESTOCK SWEET
export const restockSweet = async (sweetId, quantity) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/sweets/${sweetId}/restock`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    }
  );

  return res.json();
};
