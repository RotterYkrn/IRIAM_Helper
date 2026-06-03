import type { EnduranceRepository } from "@/repositories/endurances/endurance.repository";
import type { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";
import type { MultiEnduranceRepository } from "@/repositories/multi-endurances/multi-endurance.repository";
import type { ProjectRepository } from "@/repositories/projects/project.repository";

export type AppServices =
    | ProjectRepository
    | EnduranceRepository
    | MultiEnduranceRepository
    | EnterEnduranceRepository;
