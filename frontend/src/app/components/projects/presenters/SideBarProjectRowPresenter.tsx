import { Chunk } from "effect";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/apps/useAppContext";
import type { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";

type ProjectSideBarGroupProps = {
    /** セクション名 */
    title: string;
    /** サイドバーに表示する企画の情報 */
    projects: Chunk.Chunk<typeof ProjectDtoSchema.Type>;
};

/**
 * サイドバーに企画情報を表示するためのコンポーネント
 *
 * @description
 * 企画の開催状況ごとの一覧を表示するのに使います。
 */
const SideBarProjectRowPresenter = ({
    title,
    projects,
}: ProjectSideBarGroupProps) => {
    const { setIsOpenSideBar } = useAppContext();
    const [open, setOpen] = useState(true);

    return (
        <div>
            <Button
                variant="ghost"
                className="w-full justify-start active:scale-100"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className="text-xs">{open ? "▼" : "▶"}</span>
                {title}
            </Button>

            <div
                className={`overflow-hidden transition duration-300
                    ${open ? "max-h-96" : "max-h-0"} `}
            >
                <ul className="space-y-1 pl-5">
                    {Chunk.map(projects, (p) => (
                        <li key={p.id}>
                            <button
                                onClick={() => setIsOpenSideBar(false)}
                                className="text-left hover:underline"
                            >
                                <Link to={`/projects/${p.type}/${p.id}`}>
                                    {p.title}
                                </Link>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SideBarProjectRowPresenter;
