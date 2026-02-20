import { Provider } from "jotai";

import CreateEnduranceProjectLayoutNew from "../components/endurances-new/CreateEnduranceProjectLayout";

const CreateEndurancePage = () => {
    return (
        <Provider>
            <CreateEnduranceProjectLayoutNew />
        </Provider>
    );
};

export default CreateEndurancePage;
