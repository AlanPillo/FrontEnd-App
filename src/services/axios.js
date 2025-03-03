import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sistemadentistcitas.onrender.com', // URL del backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
