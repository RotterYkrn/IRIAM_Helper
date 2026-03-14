import { Chunk } from "effect";
import { useState } from "react";
import { Link } from "react-router-dom";

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
const ProjectTopGroup = ({ title, projects }: ProjectGroupProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="w-150 border border-pink-200 rounded-md shadow">
            {/* カテゴリ名（クリックで開閉） */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3
                    bg-pink-50 hover:bg-pink-100 font-bold rounded-md
                    transition-colors"
            >
                {title}
            </button>

            {/* 子リンク一覧（開いている時だけ表示） */}
            {isOpen &&
                (projects.length !== 0 ? (
                    Chunk.map(projects, (p) => (
                        <Link
                            key={p.id}
                            to={`/projects/${p.type}/${p.id}`}
                            className="block p-3 hover:bg-gray-100
                                transition-colors"
                        >
                            {p.title}
                        </Link>
                    ))
                ) : (
                    <p className="flex p-3 items-center justify-center">
                        未登録
                    </p>
                ))}
        </div>
    );
};

export default ProjectTopGroup;
