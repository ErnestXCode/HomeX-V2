import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_URL;


export default axios.create({
    baseURL: apiBaseUrl
})

