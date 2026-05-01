import { Option } from "effect";

import CreateEnterEnduranceProjectButton from "../components/entry-endurances/CreateEnterEnduranceProjectButton";
import EnterEnduranceTopLayout from "../components/entry-endurances/EntryEnduranceTopLayout";

import { useIsExistEnterEnduranceProject } from "@/hooks/enter-endurances/useIsExistEnterEnduranceProject";

const EntryEnduranceTopPage = () => {
    const { data, error } = useIsExistEnterEnduranceProject();

    if (error) {
        return (
            <div className="flex w-full justify-center">
                通信エラーが発生しました
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 gap-4">
            <h1 className="text-3xl font-bold">毎週日曜入室100人耐久</h1>
            {Option.isNone(data) ? (
                <CreateEnterEnduranceProjectButton />
            ) : (
                <EnterEnduranceTopLayout />
            )}
        </div>
    );
};

export default EntryEnduranceTopPage;
