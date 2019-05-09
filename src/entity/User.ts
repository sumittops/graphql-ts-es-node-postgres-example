import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User extends BaseEntity { 
    @PrimaryGeneratedColumn("uuid") id: string;

    @Column({ length: 100 }) name: string;

    @Column("varchar", { length: 255 }) email: string;

    @Column("varchar", { length: 255 }) password: string;
}