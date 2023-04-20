// Phonetic.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Word } from './Word';

@Entity()
export class Phonetic {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	text: string;

	@Column()
	audio: string;

	@Column()
	sourceUrl: string;

	@Column()
	licenseName: string;

	@Column()
	licenseUrl: string;

	@ManyToOne(() => Word, (word) => word.phonetics)
	word: Word;
}
