import { Provider } from "jotai";
import { useParams } from "react-router-dom";

import EnduranceProjectLayoutNew from "../components/endurances-new/EnduranceProjectLayout";

const EnduranceProjectPage = () => {
    const { projectId } = useParams<{ projectId: string }>();

    if (!projectId) {
        return <div>Project ID is required.</div>;
    }

    return (
        <Provider>
            <EnduranceProjectLayoutNew
                key={projectId}
                projectId={projectId}
            />
        </Provider>
    );
};

export default EnduranceProjectPage;
