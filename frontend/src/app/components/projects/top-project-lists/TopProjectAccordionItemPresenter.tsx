import { Chunk } from "effect";
import { Link } from "react-router-dom";

import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
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
const TopProjectAccordionItemPresenter = ({
    title,
    projects,
}: ProjectGroupProps) => {
    return (
        <AccordionItem
            value={title}
            className="w-full border border-pink-200 rounded-md shadow"
        >
            <AccordionTrigger className="bg-pink-50 hover:bg-pink-100 px-3 py-2
                font-bold">
                {title}
            </AccordionTrigger>
            <AccordionContent>
                {projects.length !== 0 ? (
                    Chunk.map(projects, (p) => (
                        <Button
                            key={p.id}
                            variant={"ghost"}
                            size={"lg"}
                            asChild
                            className="w-full justify-start px-4 no-underline
                                overflow-hidden active:scale-100"
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
                )}
            </AccordionContent>
        </AccordionItem>
    );
};

export default TopProjectAccordionItemPresenter;
