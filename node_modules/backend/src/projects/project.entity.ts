import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ default: 5 })
  wipLimit: number;

  @ManyToMany(() => User, (user) => user.projectsAsTeamMember)
  @JoinTable({
    name: 'project_users', // Junction table name
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  team: User[]; // Array of Users (team members)

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}