import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import Role from './Role';
import RolePermission from './RolePermission';

@Entity('auth_permissions')
export default class Permission {
  @PrimaryColumn({ name: 'id' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  public id: string;

  @Column({ name: 'name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public name: string;

  @Column({ name: 'description' })
  @IsString()
  @MaxLength(200)
  public description: string;

  @ManyToMany(
    () => Role,
    (role) => role.permissions,
  )
  @JoinTable({
    name: 'auth_role_permissions',
    joinColumn: {
      name: 'permission_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  public roles?: Role[];

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  public rolePermissions?: RolePermission[];
}
