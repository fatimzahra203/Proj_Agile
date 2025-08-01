import { Controller, Post, Body, Get, Delete, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  async findAll() {
    return this.projectsService.findAll(); 
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.projectsService.delete(id);
    return { message: `Project with ID ${id} deleted successfully` };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: CreateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }
}