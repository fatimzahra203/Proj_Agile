import { DataSource } from 'typeorm';
import { User, UserRole } from './users/user.entity';
import { Project } from './projects/project.entity';
import { Task, TaskStatus } from './tasks/task.entity';

// TODO: Adjust connection options as needed
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'agile',
  entities: [User, Project, Task],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const user = AppDataSource.manager.create(User, {
    email: 'admin@example.com',
    password: 'password', // TODO: Hash in real seed
    role: UserRole.ADMIN,
  });
  await AppDataSource.manager.save(user);

  const project = AppDataSource.manager.create(Project, {
    name: 'Sample Project',
    owner: user,
  });
  await AppDataSource.manager.save(project);

  const task = AppDataSource.manager.create(Task, {
    title: 'Sample Task',
    description: 'This is a sample task',
    status: TaskStatus.TODO,
    project,
    assignee: user,
    dueDate: new Date(),
  });
  await AppDataSource.manager.save(task);

  console.log('Seed complete');
  process.exit(0);
}

seed();
