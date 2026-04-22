import { Input } from "@/components/ui/input";

type Props = {
    titleState: {
        input: string;
        error: string | null;
    };
    setTitle: (input: string) => void;
};

const TitleInput = ({ titleState, setTitle }: Props) => {
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

                <div className="flex flex-col justify-center items-center">
                    <Input
                        id="project-title"
                        className="text-3xl font-bold"
                        value={titleState.input}
                        aria-invalid={!!titleState.error}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {titleState.error && (
                        <p
                            className="absolute top-full mt-1 text-red-500
                                text-sm whitespace-nowrap"
                        >
                            {titleState.error}
                        </p>
                    )}
                </div>
            </label>
        </>
    );
};

export default TitleInput;
