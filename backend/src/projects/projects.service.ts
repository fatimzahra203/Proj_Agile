import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['team', 'tasks'], // Load team and tasks relationships
    });
  }

  async delete(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async update(id: number, updateProjectDto: CreateProjectDto): Promise<Project> {
  const project = await this.projectRepository.findOne({
    where: { id },
    relations: ['team'],
  });
  if (!project) {
    throw new NotFoundException(`Project with ID ${id} not found`);
  }

  const projectData: DeepPartial<Project> = {
    name: updateProjectDto.name,
    description: updateProjectDto.description,
    startDate: updateProjectDto.startDate,
    wipLimit: updateProjectDto.wipLimit,
  };

  if (updateProjectDto.team && updateProjectDto.team.length > 0) {
    const teamUsers = await this.userRepository.findByIds(updateProjectDto.team);
    projectData.team = teamUsers;
  } else {
    projectData.team = [];
  }

  Object.assign(project, projectData);
  return this.projectRepository.save(project);
}
}