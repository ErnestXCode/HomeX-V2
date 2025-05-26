import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_URL;


export default axios.create({
    baseURL: apiBaseUrl
})

export const axiosPrivate = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    }, 
    withCredentials: true
})

// response.data.message = jwt expired

