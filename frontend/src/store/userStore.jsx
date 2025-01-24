export const deleteUser = (userId) => {
    return fetch(`/users/delete/${userId}`, { method: 'DELETE' });
  };
  
  export const getUserDetails = (userId) => {
    return fetch(`/users/details/${userId}`).then(res => res.json());
  };
  
  export const getUsersList = () => {
    return fetch('/users/list').then(res => res.json());
  };
  
  export const loginUser = (credentials) => {
    return fetch('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  };
  
  export const registerUser = (userData) => {
    return fetch('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  };
  
  export const updateUser = (userId, updatedData) => {
    return fetch(`/users/update/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  };
  