import { IsNotEmpty, IsOptional, IsInt, MaxLength, IsDate } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import UserRole from './UserRole';
import Role from './Role';

export type Gender = 'MALE' | 'FEMALE';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';

@Entity('auth_users')
export default class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  @IsOptional()
  @IsInt()
  public id: number;

  @Column({ name: 'username' })
  @IsNotEmpty()
  @MaxLength(100)
  public username: string;

  @Column({ name: 'password' })
  @IsNotEmpty()
  public password: string;

  @Column({ name: 'name' })
  @IsNotEmpty()
  @MaxLength(100)
  public name: string;

  @Column({ name: 'status' })
  @IsNotEmpty()
  public status: UserStatus;

  @Column({ name: 'system' })
  public system: boolean;

  @Column({ name: 'job_title', type: String, nullable: true })
  @IsOptional()
  @MaxLength(200)
  public jobTitle?: string | null;

  @Column({ name: 'organization_id' })
  @IsNotEmpty()
  @IsInt()
  public organizationId: number;

  @Column({ name: 'gender' })
  @IsNotEmpty()
  public gender: Gender;

  @Column({ name: 'phone', type: String, nullable: true })
  @IsOptional()
  @MaxLength(30)
  public phone?: string | null;

  @Column({ name: 'nip', type: String, nullable: true })
  @IsOptional()
  @MaxLength(50)
  public nip?: string | null;

  @Column({ name: 'photo', type: String, nullable: true })
  @IsOptional()
  @MaxLength(200)
  public photo?: string | null;

  @Column({
    name: 'registered_at',
    type: 'datetime',
  })
  @IsNotEmpty()
  @IsDate()
  public registeredAt: Date;

  @ManyToMany(
    () => Role,
    (role) => role.users,
  )
  @JoinTable({
    name: 'auth_user_roles',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  public roles?: Role[];

  @OneToMany(
    () => UserRole,
    (userRole) => userRole.user,
  )
  public userRoles?: UserRole[];
}
