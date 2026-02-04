import { toast, Bounce } from "react-toastify";

export const successToast = (message: string) => {
    return toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
        transition: Bounce,
    });
};

export const errorToast = (message: string) => {
    return toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
        transition: Bounce,
    });
};
