import { useAtom } from "jotai";

import { Input } from "../ui/input";

import { editTitleAtom } from "@/atoms/projects/EditTitleAtom";

const TitleInput = () => {
    const [state, setState] = useAtom(editTitleAtom);

    return (
        <>
            <label
                htmlFor="project-title"
                className="relative flex flex-col items-center"
            >
                {/* 左上に配置されるキャプション */}
                <span
                    className="absolute -top-6 left-0 text-md font-medium
                        text-gray-600"
                >
                    企画タイトル
                </span>

                <div className="flex flex-col items-center">
                    <Input
                        id="project-title"
                        className="text-3xl font-bold"
                        defaultValue={state.input}
                        onChange={(e) => setState(e.target.value)}
                    />
                    {state.error && (
                        <p
                            className="absolute top-full mt-1 text-red-500
                                text-sm whitespace-nowrap"
                        >
                            {state.error}
                        </p>
                    )}
                </div>
            </label>
        </>
    );
};

export default TitleInput;
