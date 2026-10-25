import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = await axios.post(baseUrl, newObject, config);
  return request.data;
};

const createComment = async (newObject) => {
  const { content } = newObject;
  
  const response = await fetch(`${baseUrl}/${newObject.id}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content })
  });

  if (!response.ok) {
    throw new Error('Failed to create comment');
  }

  return await response.json()
}

const update = async (newObject) => {
  const url = `${baseUrl}/${newObject.id}`;

  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(url, newObject, config);
  return response.data;
};

const remove = async (id) => {
  const url = `${baseUrl}/${id}`;

  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(url, config);
  return response.data;
};

export default {
  setToken,
  getAll,
  create,
  createComment,
  update,
  remove,
};
