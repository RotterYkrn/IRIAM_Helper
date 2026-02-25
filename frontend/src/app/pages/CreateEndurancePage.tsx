import { Provider } from "jotai";

import CreateEnduranceProjectLayout from "../components/endurances-new/CreateEnduranceProjectLayoutOld";

const CreateEndurancePage = () => {
    return (
        <Provider>
            <CreateEnduranceProjectLayout />
        </Provider>
    );
};

export default CreateEndurancePage;
