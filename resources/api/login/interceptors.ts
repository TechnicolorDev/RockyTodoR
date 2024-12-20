import axios, {AxiosError, AxiosResponse} from "axios";

export const UNAUTHORIZED = 401;
export const INTERNAL_SERVER_ERROR = 500;

let hasLoggedUnauthorizedMessage = false;
let hasLoggedSessionExpiredMessage = false;
let hasLoggedValidationFailedMessage = false;

const resetLoggingFlags = () => {
    setTimeout(() => {
        hasLoggedUnauthorizedMessage = false;
        hasLoggedSessionExpiredMessage = false;
        hasLoggedValidationFailedMessage = false;
    }, 300000);
};

export const axiosInterceptors = () => {
    axios.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error: AxiosError) => {
            const status = error.response?.status;

            if (status === UNAUTHORIZED) {
                if (!hasLoggedUnauthorizedMessage) {
                    console.log('Unauthorized request - Session expired or invalid.');
                    hasLoggedUnauthorizedMessage = true;
                }
                resetLoggingFlags();
                return Promise.resolve({
                    data: { message: 'Unauthorized. Please log in again.' },
                    status: UNAUTHORIZED,
                    statusText: 'Unauthorized',
                    headers: error.response?.headers,
                    config: error.config,
                });
            }

            if (status === INTERNAL_SERVER_ERROR) {
                if (!hasLoggedValidationFailedMessage) {
                    console.log('Internal server error occurred.');
                    hasLoggedValidationFailedMessage = true;
                }
                resetLoggingFlags();
                return Promise.resolve({
                    data: { message: 'Server error. Please try again later.' },
                    status: INTERNAL_SERVER_ERROR,
                    statusText: 'Internal Server Error',
                    headers: error.response?.headers,
                    config: error.config,
                });
            }

            return Promise.reject(error);
        }
    );

    axios.interceptors.request.use(
        (config) => config,
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );
};