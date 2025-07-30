import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(): Promise<import("./project.entity").Project[]>;
    create(dto: any): Promise<import("./project.entity").Project[]>;
    update(id: string, dto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
