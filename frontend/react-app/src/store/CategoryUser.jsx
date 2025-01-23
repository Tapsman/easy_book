export const addCategory = (categoryData) => {
    return fetch('/categories/add', {
      method: 'POST',
      body: JSON.stringify(categoryData),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  };
  
  export const getCategoryDetails = (categoryId) => {
    return fetch(`/categories/details/${categoryId}`).then(res => res.json());
  };
  
  export const getCategoriesList = () => {
    return fetch('/categories/list').then(res => res.json());
  };
  
  export const updateCategory = (categoryId, updatedData) => {
    return fetch(`/categories/update/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  };
  