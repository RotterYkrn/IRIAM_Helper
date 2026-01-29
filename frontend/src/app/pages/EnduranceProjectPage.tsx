import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import EnduranceProjectLayout from "../EnduranceProjectLayout";

import { projectIdAtom } from "@/atoms/projectIdAtom";

const ProjectPage = () => {
    const { projectId } = useParams<{ projectId: string }>();

    const setProjectId = useSetAtom(projectIdAtom);
    useEffect(() => {
        setProjectId(projectId ?? null);
    }, [projectId, setProjectId]);

    if (!projectId) {
        return <div>Project ID is required.</div>;
    }

    return (
        <>
            <EnduranceProjectLayout projectId={projectId} />
        </>
    );
};

export default ProjectPage;
