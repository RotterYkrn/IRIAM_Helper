import { Provider } from "jotai";
import { useParams } from "react-router-dom";

import EnduranceProjectLayout from "../components/endurances-new/EnduranceProjectLayout";

/**
 * 耐久企画ページ用レイアウト\
 * Routeに使用できます。
 *
 * @note URLが`/projects/endurance/:projectId`である必要があります。
 */
const EnduranceProjectPage = () => {
    const { projectId } = useParams<{ projectId: string }>();

    if (!projectId) {
        return <div>Project ID is required.</div>;
    }

    return (
        <Provider>
            <EnduranceProjectLayout
                key={projectId}
                projectId={projectId}
            />
        </Provider>
    );
};

export default EnduranceProjectPage;
