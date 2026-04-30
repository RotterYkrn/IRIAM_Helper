import { Option } from "effect";

import CreateEnterEnduranceProjectButton from "../components/entry-endurances/CreateEnterEnduranceProjectButton";

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
        <div className="flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl font-bold">毎週日曜入室100人耐久</h1>
            {Option.isNone(data) ? (
                <CreateEnterEnduranceProjectButton />
            ) : (
                <p>
                    毎週日曜日に開催される、入室者数100人を目指す耐久企画のトップページです。
                </p>
            )}
        </div>
    );
};

export default EntryEnduranceTopPage;
