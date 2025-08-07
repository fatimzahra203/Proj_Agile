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

  async findOne(id: number): Promise<Project> {
  return this.projectRepository.findOne({
    where: { id },
    relations: ['team', 'tasks'],
  });
}


  async update(id: number, updateProjectDto: CreateProjectDto): Promise<Project> {
  const project = await this.projectRepository.findOne({
    where: { id },
    relations: ['team'],
  });
  if (!project) {
    throw new NotFoundException(`Project with ID ${id} not found`);
  }

  // Only update fields that are present in the payload
  if (typeof updateProjectDto.name !== 'undefined') {
    project.name = updateProjectDto.name;
  }
  if (typeof updateProjectDto.description !== 'undefined') {
    project.description = updateProjectDto.description;
  }
  if (typeof updateProjectDto.startDate !== 'undefined') {
    project.startDate = updateProjectDto.startDate;
  }
  if (typeof updateProjectDto.wipLimit !== 'undefined') {
    project.wipLimit = updateProjectDto.wipLimit;
  }

  // Always update team, even if empty or missing
  if (Array.isArray(updateProjectDto.team)) {
    if (updateProjectDto.team.length > 0) {
      const teamUsers = await this.userRepository.findByIds(updateProjectDto.team);
      project.team = teamUsers;
    } else {
      project.team = [];
    }
  }

  return this.projectRepository.save(project);
}
}