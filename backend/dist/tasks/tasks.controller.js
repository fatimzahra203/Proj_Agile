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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("./tasks.service");
const task_entity_1 = require("./task.entity");
const dto_1 = require("./dto");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async findAll(projectId) {
        if (projectId) {
            return this.tasksService.findByProject(projectId);
        }
        return this.tasksService.findAll();
    }
    async findUnassigned() {
        try {
            const tasks = await this.tasksService.findUnassigned();
            if (!Array.isArray(tasks)) {
                return [];
            }
            return tasks;
        }
        catch (error) {
            console.error('Error in /tasks/unassigned:', error);
            throw new common_1.BadRequestException('Failed to fetch unassigned tasks');
        }
    }
    async findByProject(projectId) {
        const numProjectId = Number(projectId);
        if (isNaN(numProjectId)) {
            throw new common_1.BadRequestException(`Invalid project id: ${projectId}`);
        }
        return this.tasksService.findByProject(numProjectId);
    }
    async findByAssignee(userId) {
        const numUserId = Number(userId);
        if (isNaN(numUserId)) {
            throw new common_1.BadRequestException(`Invalid user id: ${userId}`);
        }
        return this.tasksService.findByAssignee(numUserId);
    }
    getTest() {
        return { ok: true };
    }
    async findOne(id) {
        const numId = Number(id);
        if (isNaN(numId)) {
            throw new common_1.BadRequestException(`Invalid task id: ${id}`);
        }
        return this.tasksService.findOne(numId);
    }
    async create(createTaskDtos) {
        if (!Array.isArray(createTaskDtos)) {
            throw new common_1.BadRequestException('Request body must be an array of tasks');
        }
        return Promise.all(createTaskDtos.map(dto => this.tasksService.create(dto)));
    }
    async update(id, updateTaskDto) {
        const numId = Number(id);
        if (isNaN(numId)) {
            throw new common_1.BadRequestException(`Invalid task id: ${id}`);
        }
        return this.tasksService.update(numId, updateTaskDto);
    }
    async remove(id) {
        const numId = Number(id);
        if (isNaN(numId)) {
            throw new common_1.BadRequestException(`Invalid task id: ${id}`);
        }
        return this.tasksService.remove(numId);
    }
    async updateStatus(id, status) {
        const numId = Number(id);
        if (isNaN(numId)) {
            throw new common_1.BadRequestException(`Invalid task id: ${id}`);
        }
        return this.tasksService.updateStatus(numId, status);
    }
    async assignTask(id, body) {
        const numId = Number(id);
        if (isNaN(numId)) {
            throw new common_1.BadRequestException(`Invalid task id: ${id}`);
        }
        return this.tasksService.assignTask(numId, body.userId);
    }
    async unassignTask(id) {
        const numId = Number(id);
        if (isNaN(numId)) {
            throw new common_1.BadRequestException(`Invalid task id: ${id}`);
        }
        return this.tasksService.unassignTask(numId);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unassigned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findUnassigned", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findByProject", null);
__decorate([
    (0, common_1.Get)('assignee/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findByAssignee", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "getTest", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AssignTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "assignTask", null);
__decorate([
    (0, common_1.Post)(':id/unassign'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "unassignTask", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map