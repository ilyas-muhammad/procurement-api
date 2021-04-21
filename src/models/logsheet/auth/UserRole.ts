import { IsNotEmpty, IsInt, IsDate } from 'class-validator';
import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import User from './User';
import Role from './Role';

@Entity('auth_user_roles')
export default class UserRole {
  @PrimaryColumn({ name: 'user_id' })
  @IsInt()
  public userId: number;

  @PrimaryColumn({ name: 'role_id' })
  @IsInt()
  public roleId: number;

  @Column({
    name: 'assigned_at',
    type: 'datetime',
  })
  @IsNotEmpty()
  @IsDate()
  public assignedAt: Date;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'user_id' })
  public user?: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'role_id' })
  public role?: Role;
}
