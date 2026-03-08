import { Schema } from "effect";
import { useNavigate } from "react-router-dom";

import ProjectView from "./ProjectView";

import { ProjectStatusSchema } from "@/domain/projects/tables/Project";

type CreateProjectLayoutProps = {
    /** 各企画固有のコンテンツ */
    children: React.ReactNode;
    /** バリデーションエラー時に、保存ボタンを無効化するためのフラグ */
    isSaveDisabled: boolean;
    onSave: () => void;
};

/**
 * 企画新規作成画面の共通レイアウト
 */
const CreateProjectLayout = ({
    children,
    isSaveDisabled,
    onSave,
}: CreateProjectLayoutProps) => {
    const navigate = useNavigate();

    const onCancel = () => {
        navigate("/");
    };

    return (
        <ProjectView
            projectStatus={Schema.decodeSync(ProjectStatusSchema)("scheduled")}
            isEdit={true}
        >
            <ProjectView.Action pageName={"企画新規作成"}>
                <ProjectView.CancelButton onCancel={onCancel} />
                <ProjectView.SaveButton
                    disabled={isSaveDisabled}
                    onSave={onSave}
                />
            </ProjectView.Action>

            <ProjectView.Header>
                <ProjectView.Title title={""} />
            </ProjectView.Header>

            <ProjectView.Body>{children}</ProjectView.Body>
        </ProjectView>
    );
};

export default CreateProjectLayout;
