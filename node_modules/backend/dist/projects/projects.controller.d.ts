import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto): Promise<import("./project.entity").Project>;
    findAll(): Promise<import("./project.entity").Project[]>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
