import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import ProjectActionLayout from "../layouts/ProjectActionLayout";
import ProjectBodyLayout from "../layouts/ProjectBodyLayout";
import { CancelButtonBase, SaveButtonBase } from "../layouts/ProjectButtons";
import ProjectHeaderLayout from "../layouts/ProjectHeaderLayout";
import ProjectLayout from "../layouts/ProjectLayout";
import TitleInput from "../layouts/TitleInput";

import { editTitleAtom } from "@/atoms/projects/EditTitleAtom";

type Props = {
    /** 各企画固有のコンテンツ */
    children: React.ReactNode;
    /** バリデーションエラー時に、保存ボタンを無効化するためのフラグ */
    isSaveDisabled: boolean;
    onSave: () => void;
};

/**
 * 企画新規作成画面の共通レイアウト
 */
const CreateProjectContainer = ({
    children,
    isSaveDisabled,
    onSave,
}: Props) => {
    const navigate = useNavigate();
    const [titleState, setTitle] = useAtom(editTitleAtom);

    const onCancel = () => {
        navigate("/");
    };

    return (
        <ProjectLayout>
            <ProjectActionLayout pageName={"企画新規作成"}>
                <CancelButtonBase onClick={onCancel} />
                <SaveButtonBase
                    disabled={isSaveDisabled}
                    onClick={onSave}
                />
            </ProjectActionLayout>

            <ProjectHeaderLayout>
                <TitleInput
                    titleState={titleState}
                    setTitle={setTitle}
                />
            </ProjectHeaderLayout>

            <ProjectBodyLayout>{children}</ProjectBodyLayout>
        </ProjectLayout>
    );
};

export default CreateProjectContainer;
