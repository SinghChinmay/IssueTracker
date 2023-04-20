// Definition.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Meaning } from './Meaning';

@Entity()
export class Definition {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	definition: string;

	@Column('simple-array')
	synonyms: string[];

	@Column('simple-array')
	antonyms: string[];

	@Column({ nullable: true })
	example: string;

	@ManyToOne(() => Meaning, (meaning) => meaning.definitions)
	meaning: Meaning;
}
