import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dict')
export class Dict {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	userId: string;

	@Column()
	word: string;

	@Column({ nullable: true })
	data: string;
}
