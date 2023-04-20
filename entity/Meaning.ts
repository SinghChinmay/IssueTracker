// Meaning.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Definition } from './Definition';
import { Word } from './Word';

@Entity()
export class Meaning {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	partOfSpeech: string;

	@ManyToOne(() => Word, (word) => word.meanings)
	word: Word;

	@OneToMany(() => Definition, (definition) => definition.meaning)
	definitions: Definition[];
}
