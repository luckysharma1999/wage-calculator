import axios from "axios";

const API = axios.create({
  baseURL: "https://wage-calculator-fjir.onrender.com",
});

export default API;
