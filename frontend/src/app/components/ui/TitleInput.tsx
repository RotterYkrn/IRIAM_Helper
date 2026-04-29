import InputField from "./InputField";

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
            <InputField
                label="企画タイトル"
                error={titleState.error}
                setValue={setTitle}
                value={titleState.input}
                className="text-3xl font-bold w-120"
            />
        </>
    );
};

export default TitleInput;
