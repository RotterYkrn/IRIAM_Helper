import { Chunk } from "effect";
import { Link } from "react-router-dom";

import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
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

    return (
        <AccordionItem
            value={title}
            className="w-full"
        >
            <AccordionTrigger className="p-2 font-bold">
                {title}
            </AccordionTrigger>
            <AccordionContent>
                {Chunk.map(projects, (p) => (
                    <Button
                        key={p.id}
                        variant={"ghost"}
                        asChild
                        className="w-full justify-start px-4 no-underline
                            overflow-hidden active:scale-100"
                        onClick={() => setIsOpenSideBar(false)}
                    >
                        <Link to={`/projects/${p.type}/${p.id}`}>
                            {p.title}
                        </Link>
                    </Button>
                ))}
            </AccordionContent>
        </AccordionItem>
    );
};

export default SideBarProjectRowPresenter;
