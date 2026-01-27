import { useState } from "react";
import { Link } from "react-router-dom";

type Project = {
    id: string;
    title: string;
};

type ProjectGroupProps = {
    title: string;
    projects: Project[];
};

const ProjectGroup = ({ title, projects }: ProjectGroupProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 font-medium
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
                    {projects.map((p) => (
                        <li key={p.id}>
                            <button className="text-left hover:underline">
                                <Link to={`/projects/${p.id}`}>{p.title}</Link>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProjectGroup;
