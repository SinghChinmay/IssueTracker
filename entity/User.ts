import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	firstName: string;
}
