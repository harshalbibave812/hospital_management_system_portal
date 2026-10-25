const BASE_URL = 'http://localhost:5000/api/auth';

export const fetchRoles = async () => {
  try {
    const res = await fetch(`${BASE_URL}/roles`);
    return res.json();
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    throw error;
  }
};

export const sendOtp = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    throw error;
  }
};
