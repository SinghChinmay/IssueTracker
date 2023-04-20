import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User'; // Assuming you have a User entity
import { Word } from './Word';

@Entity('dict')
export class Dict {
	@PrimaryGeneratedColumn()
	id: string;

	@ManyToOne(() => User, (user) => user.id)
	userId: User;

	@OneToOne(() => Word)
	@JoinColumn()
	word: Word;
}
