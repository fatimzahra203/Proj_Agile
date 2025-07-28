import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepo: Repository<Project>,
  ) {}

  findAll() {
    return this.projectsRepo.find({ relations: ['owner', 'tasks'] });
  }

  create(dto: any) {
    // TODO: Add validation and owner assignment
    const project = this.projectsRepo.create(dto);
    return this.projectsRepo.save(project);
  }

  update(id: number, dto: any) {
    return this.projectsRepo.update(id, dto);
  }

  remove(id: number) {
    return this.projectsRepo.delete(id);
  }
}
