import { Provider } from "jotai";

import EnterEnduranceDetailLayout from "../components/enter-endurances/EnterEnduranceDetailLayout";

const EnterEnduranceDetailPage = () => {
    return (
        <Provider>
            <div className="flex flex-col items-center justify-center p-4 gap-4">
                <h1 className="text-3xl font-bold">毎週日曜入室100人耐久</h1>
                <EnterEnduranceDetailLayout />
            </div>
        </Provider>
    );
};

export default EnterEnduranceDetailPage;
