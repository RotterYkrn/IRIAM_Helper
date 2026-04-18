import { Chunk } from "effect";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";

type ProjectGroupProps = {
    /** セクション名 */
    title: string;
    /** トップページに表示する企画の情報 */
    projects: Chunk.Chunk<typeof ProjectDtoSchema.Type>;
};

/**
 * トップページに企画情報を表示するためのコンポーネント
 *
 * @description
 * 企画の開催状況ごとの一覧を表示するのに使います。
 */
const TopProjectRowPresenter = ({ title, projects }: ProjectGroupProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="w-150 border border-pink-200 rounded-md shadow">
            {/* カテゴリ名（クリックで開閉） */}
            <Button
                size={"lg"}
                className={`w-full bg-pink-50 hover:bg-pink-100 border-none
                    text-black font-bold
                    ${isOpen ? "rounded-t-md" : "rounded-md"} active:scale-100`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
            </Button>

            {/* 子リンク一覧（開いている時だけ表示） */}
            {isOpen &&
                (projects.length !== 0 ? (
                    Chunk.map(projects, (p) => (
                        <Button
                            key={p.id}
                            variant={"ghost"}
                            size={"lg"}
                            asChild
                            className="w-full justify-start px-3
                                active:scale-100"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Link to={`/projects/${p.type}/${p.id}`}>
                                {p.title}
                            </Link>
                        </Button>
                    ))
                ) : (
                    <p className="flex p-3 items-center justify-center">
                        未登録
                    </p>
                ))}
        </div>
    );
};

export default TopProjectRowPresenter;
