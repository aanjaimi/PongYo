import axios from "axios";

export const fetcher = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5000",
});
