import axios from "axios";
import { TELEGRAM_BOT_TOKEN } from "../constants";


const axiosInstance = axios.create({
    baseURL: `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`,
    method: "post",
});


export default axiosInstance