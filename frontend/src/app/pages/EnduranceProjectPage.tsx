import { Provider } from "jotai";

import EnduranceProjectLayout from "../components/endurances-new/EnduranceProjectLayout";

import { ProjectProvider } from "@/contexts/projects/ProjectProvider";
import { useProjectId } from "@/hooks/projects/useProjectId";

/**
 * 耐久企画ページ用レイアウト\
 * Routeに使用できます。
 *
 * @note URLが`/projects/endurance/:projectId`である必要があります。
 */
const EnduranceProjectPage = () => {
    const projectId = useProjectId();

    return (
        <Provider>
            <ProjectProvider projectId={projectId}>
                <EnduranceProjectLayout key={projectId} />
            </ProjectProvider>
        </Provider>
    );
};

export default EnduranceProjectPage;
