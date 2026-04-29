import { Provider } from "jotai";

import CreateMultiEnduranceProjectLayout from "../components/multi-endurances/CreateMultiEnduranceProjectLayout";

const CreateMultiEndurancePage = () => {
    return (
        <Provider>
            <CreateMultiEnduranceProjectLayout />
        </Provider>
    );
};

export default CreateMultiEndurancePage;
