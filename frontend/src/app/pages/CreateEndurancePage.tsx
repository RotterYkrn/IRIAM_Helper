import { Provider } from "jotai";

import CreateEnduranceProjectLayout from "../components/endurances-new/CreateEnduranceProjectLayout";

/**
 * 耐久企画新規作成ページ用レイアウト。\
 * Routeにそのまま使用できます。
 *
 * @note URLが`/projects/create/endurance`である必要があります。
 */
const CreateEndurancePage = () => {
    return (
        <Provider>
            <CreateEnduranceProjectLayout />
        </Provider>
    );
};

export default CreateEndurancePage;
