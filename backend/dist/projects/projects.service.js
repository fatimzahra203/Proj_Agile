"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./project.entity");
const user_entity_1 = require("../users/user.entity");
let ProjectsService = class ProjectsService {
    constructor(projectRepository, userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    async create(createProjectDto) {
        const projectData = {
            name: createProjectDto.name,
            description: createProjectDto.description,
            startDate: createProjectDto.startDate,
            wipLimit: createProjectDto.wipLimit,
        };
        if (createProjectDto.team && createProjectDto.team.length > 0) {
            const teamUsers = await this.userRepository.findByIds(createProjectDto.team);
            projectData.team = teamUsers;
        }
        const project = this.projectRepository.create(projectData);
        return this.projectRepository.save(project);
    }
    async findAll() {
        return this.projectRepository.find({
            relations: ['team', 'tasks'],
        });
    }
    async delete(id) {
        const result = await this.projectRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
    }
    async update(id, updateProjectDto) {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['team'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        const projectData = {
            name: updateProjectDto.name,
            description: updateProjectDto.description,
            startDate: updateProjectDto.startDate,
            wipLimit: updateProjectDto.wipLimit,
        };
        if (updateProjectDto.team && updateProjectDto.team.length > 0) {
            const teamUsers = await this.userRepository.findByIds(updateProjectDto.team);
            projectData.team = teamUsers;
        }
        else {
            projectData.team = [];
        }
        Object.assign(project, projectData);
        return this.projectRepository.save(project);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map