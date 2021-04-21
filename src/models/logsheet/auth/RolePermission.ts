import { IsNotEmpty, IsInt, IsDate, IsString } from 'class-validator';
import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import Role from './Role';
import Permission from './Permission';

@Entity('auth_role_permissions')
export default class RolePermission {
  @PrimaryColumn({ name: 'role_id' })
  @IsInt()
  public roleId: number;

  @PrimaryColumn({ name: 'permission_id' })
  @IsString()
  public permissionId: string;

  @Column({
    name: 'granted_at',
    type: 'datetime',
  })
  @IsNotEmpty()
  @IsDate()
  public grantedAt: Date;

  @ManyToOne(
    () => Role,
    (role) => role.rolePermissions,
  )
  @JoinColumn({ name: 'role_id' })
  public role?: Role;

  @ManyToOne(
    () => Permission,
    (permission) => permission.rolePermissions,
  )
  @JoinColumn({ name: 'permission_id' })
  public permission?: Permission;
}
