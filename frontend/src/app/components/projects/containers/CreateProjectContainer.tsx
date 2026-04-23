import ProjectView from "../../ui/ProjectView";

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
    return (
        <ProjectView type={"create"}>
            <ProjectView.Action pageName={"企画新規作成"}>
                <ProjectView.CancelButton />
                <ProjectView.SaveButton
                    disabled={isSaveDisabled}
                    onSave={onSave}
                />
            </ProjectView.Action>

            <ProjectView.Header>
                <ProjectView.Title />
            </ProjectView.Header>

            <ProjectView.Body>{children}</ProjectView.Body>
        </ProjectView>
    );
};

export default CreateProjectContainer;
