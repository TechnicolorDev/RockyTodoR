import axios, { AxiosError, AxiosResponse } from 'axios';
import { LoginResponse } from "../Providers/interfaces/interfaces";
import {axiosInterceptors} from "./interceptors";

axios.defaults.baseURL = process.env.APP_URL;
const API_KEY = process.env.APP_KEY;


axiosInterceptors();

interface LoggedOutOrNeverLoggedInResponse {
    message: string;
    isLoggedIn: false;
    isLoggedOutOrNeverLoggedIn: true;
}
let debounceTimer: NodeJS.Timeout;

export const validateSession = async (): Promise<LoginResponse> => {
    clearTimeout(debounceTimer);

    return new Promise<LoginResponse>((resolve, reject) => {
        debounceTimer = setTimeout(async () => {
            try {
                const response = await axios.get<LoginResponse>('/api/login', {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                    },
                });

                if (response?.data?.isLoggedOutOrNeverLoggedIn === true) {
                    console.log("No session found. Redirecting to login page.");
                    resolve({
                        message: "No session found. User is not logged in.",
                        isLoggedOutOrNeverLoggedIn: true,
                    } as LoginResponse);
                }

                resolve(response.data || { message: "Unknown error occurred during session validation." } as LoginResponse);
            } catch (error: any) {
                if (error?.response?.status === 401) {
                    console.log("Unauthorized. Redirecting to login page.");
                    resolve({ message: "Unauthorized. Please log in again.", isLoggedIn: false } as LoginResponse);
                }

                console.error("Error during session validation:", error);
                resolve({ message: "Session validation failed. Please try again.", isLoggedIn: false } as LoginResponse);
            }
        }, 300);
    });
};
