import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateEnduranceProject } from "@/hooks/useCreateEnduranceProject";

const CreateEndurancePage = () => {
    const [title, setTitle] = useState("");
    const [targetCount, setTargetCount] = useState(100);

    const navigate = useNavigate();
    const createMutation = useCreateEnduranceProject();

    const handleCreate = async () => {
        try {
            const projectId = await createMutation.mutateAsync({
                title,
                targetCount,
            });

            navigate(`/projects/${projectId}`);
        } catch (e) {
            console.error(e);
            alert("作成に失敗しました");
        }
    };

    return (
        <div>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="耐久タイトル"
            />

            <input
                type="number"
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
            />

            <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
            >
                作成
            </button>
        </div>
    );
};

export default CreateEndurancePage;
