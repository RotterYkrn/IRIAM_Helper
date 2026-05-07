import { Provider } from "jotai";

import EnterEnduranceDetailLayout from "../components/enter-endurances/EnterEnduranceDetailLayout";

const EnterEnduranceDetailPage = () => {
    return (
        <Provider>
            <EnterEnduranceDetailLayout />
        </Provider>
    );
};

export default EnterEnduranceDetailPage;
