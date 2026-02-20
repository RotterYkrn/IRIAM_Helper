import { Chunk } from "effect";
import { useState } from "react";
import { Link } from "react-router-dom";

import type { ProjectForSideBer } from "@/domain/projects/tables/Project";

type ProjectGroupProps = {
    isLoading: boolean;
    title: string;
    projects: Chunk.Chunk<ProjectForSideBer>;
};

const ProjectTopGroup = ({ isLoading, title, projects }: ProjectGroupProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="w-150 border border-pink-200 rounded-md shadow">
            {/* カテゴリ名（クリックで開閉） */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3
                    bg-pink-50 hover:bg-pink-100 transition-colors"
            >
                {title}
            </button>

            {/* 子リンク一覧（開いている時だけ表示） */}
            {isOpen &&
                (isLoading ? (
                    <p className="flex p-3 items-center justify-center">
                        読み込み中...
                    </p>
                ) : projects.length !== 0 ? (
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
