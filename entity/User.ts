import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Dict } from './Dict';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	firstName: string;

	@OneToMany(() => Dict, (dict) => dict.userId)
	words: Dict[];
}
