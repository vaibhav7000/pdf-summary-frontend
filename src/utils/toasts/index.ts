import { Bounce, Slide, toast } from "react-toastify";

type ToastType = "success" | "info" | "error" | "warning" | "default";

function generateToastDefault(message: string, type: ToastType = "default") {
    toast(message, {
        type,
        position: "top-right",
        transition: Bounce,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        delay: 300
    })
}

export default generateToastDefault;