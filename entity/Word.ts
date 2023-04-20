// Word.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Meaning } from './Meaning';
import { Phonetic } from './Phonetic';

@Entity()
export class Word {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	word: string;

	@OneToMany(() => Phonetic, (phonetic) => phonetic.word)
	phonetics: Phonetic[];

	@OneToMany(() => Meaning, (meaning) => meaning.word)
	meanings: Meaning[];
}
