import axios from "axios";

const API_URL = "https://api.coincap.io/v2/assets";

export const fetchCryptocurrencies = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const fetchCryptoDetails = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};
