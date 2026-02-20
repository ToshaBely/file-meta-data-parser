import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DocumentMetaData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: true })
  title: string | null;

  @Column('varchar', { nullable: true })
  decisionType: string | null;

  @Column('date', { nullable: true })
  dateOfDecision: string | null; // YYYY-MM-DD

  @Column('varchar', { nullable: true })
  office: string | null;

  @Column('varchar', { nullable: true })
  court: string | null;

  @Column('varchar', { nullable: true })
  caseNumber: string | null;

  @Column('text', { nullable: true })
  summaryCase: string | null;

  @Column('text', { nullable: true })
  summaryConclusion: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @Column('timestamp', { nullable: true, default: null })
  deletedAt: string | null;
}
