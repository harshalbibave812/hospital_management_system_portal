import { getToken } from '../utils/auth.utils';

const BASE_URL = 'http://localhost:5000/api/patient';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

export const getDashboard = async () => {
  try {
    const res = await fetch(`${BASE_URL}/dashboard`, {
      method: 'GET',
      headers: authHeaders(),
    });
    return res.json();
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: authHeaders(),
    });
    return res.json();
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/profile/password`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    throw error;
  }
};

export const uploadPhoto = async (photo_url) => {
  try {
    const res = await fetch(`${BASE_URL}/profile/photo`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ photo_url }),
    });
    return res.json();
  } catch (error) {
    throw error;
  }
};
