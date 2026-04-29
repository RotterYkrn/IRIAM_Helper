import { Provider } from "jotai";

import MultiEnduranceProjectLayout from "../components/multi-endurances/MultiEnduranceProjectLayout";

import { ProjectProvider } from "@/contexts/projects/ProjectProvider";
import { useProjectId } from "@/hooks/projects/useProjectId";

/**
 * 耐久企画ページ用レイアウト\
 * Routeに使用できます。
 *
 * @note URLが`/projects/endurance/:projectId`である必要があります。
 */
const MultiEnduranceProjectPage = () => {
    const projectId = useProjectId();

    return (
        <Provider>
            <ProjectProvider projectId={projectId}>
                <MultiEnduranceProjectLayout
                    key={projectId}
                    projectId={projectId}
                />
            </ProjectProvider>
        </Provider>
    );
};

export default MultiEnduranceProjectPage;
