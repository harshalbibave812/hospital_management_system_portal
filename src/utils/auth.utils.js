export const saveToken = (token) => localStorage.setItem('hms_token', token);
export const getToken = () => localStorage.getItem('hms_token');
export const removeToken = () => localStorage.removeItem('hms_token');

export const saveUser = (user) => localStorage.setItem('hms_user', JSON.stringify(user));
export const getUser = () => {
  const u = localStorage.getItem('hms_user');
  return u ? JSON.parse(u) : null;
};
export const removeUser = () => localStorage.removeItem('hms_user');

export const logout = () => { removeToken(); removeUser(); };
