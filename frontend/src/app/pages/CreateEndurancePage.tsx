import { Provider } from "jotai";

import CreateEnduranceProjectLayout from "../components/endurances/CreateEnduranceProjectLayout";

const CreateEndurancePage = () => {
    return (
        <Provider>
            <CreateEnduranceProjectLayout />
        </Provider>
    );
};

export default CreateEndurancePage;
