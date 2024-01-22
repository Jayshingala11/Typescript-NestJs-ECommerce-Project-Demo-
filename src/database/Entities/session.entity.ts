import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('sessions')
@Index('IDX_SESSION_EXPIRATION', ['expiresAt'], { expireAfterSeconds: 3600 })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  sid: string;

  @Column({ type: 'text' })
  data: string;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
