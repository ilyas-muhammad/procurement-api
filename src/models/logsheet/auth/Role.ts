import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import Permission from './Permission';
import User from './User';
import UserRole from './UserRole';
import RolePermission from './RolePermission';

export type RoleStatus = 'ACTIVE' | 'INACTIVE';

@Entity('auth_roles')
export default class Role {
  @PrimaryGeneratedColumn({ name: 'id' })
  @IsOptional()
  @IsNumber()
  public id: number;

  @Column({ name: 'name' })
  @IsNotEmpty()
  @MaxLength(100)
  public name: string;

  @Column({ name: 'status' })
  @IsNotEmpty()
  public status: RoleStatus;

  @Column({ name: 'system' })
  @IsNotEmpty()
  public system: boolean;

  @ManyToMany(
    () => Permission,
    (permission) => permission.roles,
  )
  @JoinTable({
    name: 'auth_role_permissions',
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
    },
  })
  public permissions?: Permission[];

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.role,
  )
  public rolePermissions?: RolePermission[];

  @ManyToMany(
    () => User,
    (user) => user.roles,
  )
  @JoinTable({
    name: 'auth_user_roles',
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  public users?: User[];

  @OneToMany(
    () => UserRole,
    (userRole) => userRole.role,
  )
  public userRoles?: UserRole[];
}
