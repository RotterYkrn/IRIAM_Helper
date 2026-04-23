import type React from "react";

import { Button } from "@/components/ui/button";

type Props = React.ComponentPropsWithoutRef<"button"> & {
    isVisible?: boolean;
};

export const EditButtonBase = ({ isVisible = true, ...props }: Props) => {
    if (!isVisible) {
        return null;
    }

    return <Button {...props}>編集</Button>;
};

export const SaveButtonBase = ({ isVisible = true, ...props }: Props) => {
    if (!isVisible) {
        return null;
    }

    return <Button {...props}>保存</Button>;
};

export const CancelButtonBase = ({ isVisible = true, ...props }: Props) => {
    if (!isVisible) {
        return null;
    }

    return <Button {...props}>キャンセル</Button>;
};

export const DuplicateButtonBase = ({ isVisible = true, ...props }: Props) => {
    if (!isVisible) {
        return null;
    }

    return <Button {...props}>コピー</Button>;
};

export const DeleteButtonBase = ({ isVisible = true, ...props }: Props) => {
    if (!isVisible) {
        return null;
    }

    return (
        <Button
            {...props}
            variant={"destructive"}
        >
            削除
        </Button>
    );
};

export const ActivateButtonBase = ({ isVisible = true, ...props }: Props) => {
    if (!isVisible) {
        return null;
    }

    return (
        <Button
            {...props}
            className="bg-green-600 hover:bg-green-600/80"
        >
            企画開始
        </Button>
    );
};

export const FinishButtonBase = ({ isVisible = true, ...props }: Props) => {
    if (!isVisible) {
        return null;
    }

    return (
        <Button
            {...props}
            className="bg-red-600 hover:bg-red-600/80"
        >
            企画終了
        </Button>
    );
};
