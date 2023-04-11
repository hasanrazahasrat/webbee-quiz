import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workshop } from './workshop.entity';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Workshop, (workshop) => workshop.event)
    workshops: Workshop[];

    @Column({ type: 'datetime' })
    createdAt: string;
}
