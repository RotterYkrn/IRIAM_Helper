import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
    // 初回レンダリング時に画面幅を参照して初期値を設定（SSR考慮でtypeof windowチェック）
    const [isMobile, setIsMobile] = React.useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth < MOBILE_BREAKPOINT;
    });

    React.useEffect(() => {
        const mql = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
        );
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };

        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return isMobile;
}
