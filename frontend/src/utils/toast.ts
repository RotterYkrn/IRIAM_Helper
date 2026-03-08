import { toast, Bounce } from "react-toastify";

/**
 * 成功トーストを表示します
 * @param message トーストに含めるメッセージ
 * @returns トーストのID
 */
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

/**
 * エラートーストを表示します
 * @param message トーストに含めるメッセージ
 * @returns トーストのID
 */
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
