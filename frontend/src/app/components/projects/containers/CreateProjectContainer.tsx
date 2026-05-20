import { useNavigate } from "react-router-dom";

import ProjectView from "../../ui/ProjectView";

type Props = {
    /** 各企画固有のコンテンツ */
    children: React.ReactNode;
    /** バリデーションエラー時に、保存ボタンを無効化するためのフラグ */
    canSave: boolean;
    isSaving: boolean;
    onSave: () => void;
};

/**
 * 企画新規作成画面の共通レイアウト
 */
const CreateProjectContainer = ({
    children,
    canSave,
    isSaving,
    onSave,
}: Props) => {
    const navigate = useNavigate();

    const onCancel = () => {
        if (!confirm("内容を破棄しますか？")) {
            return;
        }
        navigate("/");
    };

    return (
        <ProjectView type={"create"}>
            <ProjectView.Action pageName={"企画新規作成"}>
                <ProjectView.CancelButton
                    disabled={isSaving}
                    onClick={onCancel}
                />
                <ProjectView.SaveButton
                    disabled={!canSave || isSaving}
                    onSave={onSave}
                />
            </ProjectView.Action>

            <ProjectView.Body>
                <ProjectView.Title />
                {children}
            </ProjectView.Body>
        </ProjectView>
    );
};

export default CreateProjectContainer;
