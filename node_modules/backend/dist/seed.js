"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./users/user.entity");
const project_entity_1 = require("./projects/project.entity");
const task_entity_1 = require("./tasks/task.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'agile',
    entities: [user_entity_1.User, project_entity_1.Project, task_entity_1.Task],
    synchronize: true,
});
async function seed() {
    await AppDataSource.initialize();
    const user = AppDataSource.manager.create(user_entity_1.User, {
        email: 'admin@example.com',
        password: 'password',
        role: user_entity_1.UserRole.ADMIN,
    });
    await AppDataSource.manager.save(user);
    const project = AppDataSource.manager.create(project_entity_1.Project, {
        name: 'Sample Project',
        owner: user,
    });
    await AppDataSource.manager.save(project);
    const task = AppDataSource.manager.create(task_entity_1.Task, {
        title: 'Sample Task',
        description: 'This is a sample task',
        status: task_entity_1.TaskStatus.TODO,
        project,
        assignee: user,
        dueDate: new Date(),
    });
    await AppDataSource.manager.save(task);
    console.log('Seed complete');
    process.exit(0);
}
seed();
//# sourceMappingURL=seed.js.map