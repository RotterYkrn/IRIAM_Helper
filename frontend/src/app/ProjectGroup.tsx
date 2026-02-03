import { Chunk } from "effect";
import { useState } from "react";
import { Link } from "react-router-dom";

import type { ProjectForSideBer } from "@/domain/projects/tables/Project";

type ProjectGroupProps = {
    title: string;
    projects: Chunk.Chunk<ProjectForSideBer>;
};

const ProjectGroup = ({ title, projects }: ProjectGroupProps) => {
    const [open, setOpen] = useState(true);

    return (
        <div>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full rounded items-center gap-2 font-medium
                    hover:bg-neutral-300"
            >
                <span className="text-xs">{open ? "▼" : "▶"}</span>
                {title}
            </button>

            <div
                className={`overflow-hidden transition duration-300
                    ${open ? "mt-2 max-h-96" : "max-h-0"} `}
            >
                <ul className="space-y-1 pl-5">
                    {Chunk.map(projects, (p) => (
                        <li key={p.id}>
                            <button className="text-left hover:underline">
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

export default ProjectGroup;
