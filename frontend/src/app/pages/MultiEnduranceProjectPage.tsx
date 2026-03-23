import { Schema } from "effect";
import { Provider } from "jotai";
import { useParams } from "react-router-dom";

import MultiEnduranceProjectLayout from "../components/multi-endurances/MultiEnduranceProjectLayout";

import { ProjectIdSchema } from "@/domain/projects/tables/Project";

/**
 * 耐久企画ページ用レイアウト\
 * Routeに使用できます。
 *
 * @note URLが`/projects/endurance/:projectId`である必要があります。
 */
const MultiEnduranceProjectPage = () => {
    const { projectId } = useParams<{ projectId: string }>();

    if (!projectId) {
        return <div>Project ID is required.</div>;
    }

    return (
        <Provider>
            <MultiEnduranceProjectLayout
                key={projectId}
                projectId={Schema.decodeSync(ProjectIdSchema)(projectId)}
            />
        </Provider>
    );
};

export default MultiEnduranceProjectPage;
