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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./task.entity");
const user_entity_1 = require("../users/user.entity");
const project_entity_1 = require("../projects/project.entity");
let TasksService = class TasksService {
    constructor(tasksRepository, projectsRepository, usersRepository) {
        this.tasksRepository = tasksRepository;
        this.projectsRepository = projectsRepository;
        this.usersRepository = usersRepository;
    }
    async create(createTaskDto) {
        const { projectId, assigneeId } = createTaskDto, taskDetails = __rest(createTaskDto, ["projectId", "assigneeId"]);
        const task = this.tasksRepository.create(taskDetails);
        if (projectId) {
            const project = await this.projectsRepository.findOne({
                where: { id: projectId },
            });
            if (!project) {
                throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
            }
            task.project = project;
        }
        if (assigneeId) {
            const assignee = await this.usersRepository.findOne({
                where: { id: assigneeId },
            });
            if (!assignee) {
                throw new common_1.NotFoundException(`User with ID ${assigneeId} not found`);
            }
            task.assignee = assignee;
        }
        return this.tasksRepository.save(task);
    }
    async findAll() {
        return this.tasksRepository.find({
            relations: ['project', 'assignee'],
        });
    }
    async findOne(id) {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['project', 'assignee'],
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    async update(id, updateTaskDto) {
        const { projectId, assigneeId } = updateTaskDto, taskDetails = __rest(updateTaskDto, ["projectId", "assigneeId"]);
        await this.findOne(id);
        await this.tasksRepository.update(id, taskDetails);
        if (projectId !== undefined || assigneeId !== undefined) {
            const task = await this.findOne(id);
            if (projectId !== undefined) {
                if (projectId === null) {
                    task.project = null;
                }
                else {
                    const project = await this.projectsRepository.findOne({
                        where: { id: projectId },
                    });
                    if (!project) {
                        throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
                    }
                    task.project = project;
                }
            }
            if (assigneeId !== undefined) {
                if (assigneeId === null) {
                    task.assignee = null;
                }
                else {
                    const assignee = await this.usersRepository.findOne({
                        where: { id: assigneeId },
                    });
                    if (!assignee) {
                        throw new common_1.NotFoundException(`User with ID ${assigneeId} not found`);
                    }
                    task.assignee = assignee;
                }
            }
            await this.tasksRepository.save(task);
        }
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.tasksRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
    }
    async updateStatus(id, status) {
        const task = await this.findOne(id);
        if (!Object.values(task_entity_1.TaskStatus).includes(status)) {
            throw new common_1.NotFoundException(`Invalid status value: ${status}`);
        }
        task.status = status;
        const saved = await this.tasksRepository.save(task);
        console.log(`Task ${id} status updated to:`, status);
        return saved;
    }
    async findByProject(projectId) {
        return this.tasksRepository.find({
            where: { project: { id: projectId } },
            relations: ['assignee'],
        });
    }
    async findByAssignee(userId) {
        return this.tasksRepository.find({
            where: { assignee: { id: userId } },
            relations: ['project'],
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map