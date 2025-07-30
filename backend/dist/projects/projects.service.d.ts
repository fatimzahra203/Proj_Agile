import { Repository } from 'typeorm';
import { Project } from './project.entity';
export declare class ProjectsService {
    private projectsRepo;
    constructor(projectsRepo: Repository<Project>);
    findAll(): Promise<Project[]>;
    create(dto: any): Promise<Project[]>;
    update(id: number, dto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
