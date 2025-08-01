import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto';
import { User } from '../users/user.entity';

// Define DeepPartial locally
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Create a partial project object
    const projectData: DeepPartial<Project> = {
      name: createProjectDto.name,
      description: createProjectDto.description,
      startDate: createProjectDto.startDate,
      wipLimit: createProjectDto.wipLimit,
    };

    // Handle team relationship
    if (createProjectDto.team && createProjectDto.team.length > 0) {
      const teamUsers = await this.userRepository.findByIds(createProjectDto.team);
      projectData.team = teamUsers; // Assign User[] to team
    }

    // Create and save the project
    const project = this.projectRepository.create(projectData);
    return this.projectRepository.save(project);
  }
}