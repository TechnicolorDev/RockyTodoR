import { toast } from 'react-toastify';

export const showToast = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
        toast.success(message, {
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    } else if (type === 'error') {
        toast.error(message, {
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};
