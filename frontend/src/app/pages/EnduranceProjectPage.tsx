import { useParams } from "react-router-dom";

import EnduranceProjectLayout from "../EnduranceProjectLayout";

const ProjectPage = () => {
    const { projectId } = useParams<{ projectId: string }>();

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
