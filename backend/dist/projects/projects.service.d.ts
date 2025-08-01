import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto';
import { User } from '../users/user.entity';
export declare class ProjectsService {
    private readonly projectRepository;
    private readonly userRepository;
    constructor(projectRepository: Repository<Project>, userRepository: Repository<User>);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(): Promise<Project[]>;
    delete(id: number): Promise<void>;
}
