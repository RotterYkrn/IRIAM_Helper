import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

import {
    editProjectAtom,
    initializeEditProjectAtom,
} from "@/atoms/EditProjectAtom";

type Props = {
    children: React.ReactNode;
};

type ProjectProps = {
    children: React.ReactNode;
};

const Project = ({ children }: ProjectProps) => {
    return (
        <div
            className="flex flex-col h-full w-full items-center justify-center
                gap-6"
        >
            {children}
        </div>
    );
};

const Header = ({ children }: Props) => {
    return (
        <div className="flex w-full items-start justify-end gap-2">
            {children}
        </div>
    );
};

type TitleProps = {
    title: string;
    isEditing: boolean;
};

const Title = ({ title, isEditing }: TitleProps) => {
    const [state, setState] = useAtom(editProjectAtom);
    const initEdit = useSetAtom(initializeEditProjectAtom);

    useEffect(() => {
        initEdit({
            title,
        });
    }, [initEdit, title]);

    if (isEditing) {
        return (
            <input
                className="text-3xl font-bold text-center w-full"
                value={state.title}
                onChange={(e) =>
                    setState({
                        ...state,
                        title: e.target.value,
                    })
                }
            />
        );
    }

    return <h1 className="text-3xl font-bold">{title}</h1>;
};

const Body = ({ children }: Props) => {
    return (
        <div className="mt-10 flex flex-col items-center gap-6">{children}</div>
    );
};

Project.Header = Header;
Project.Title = Title;
Project.Body = Body;

export default Project;
