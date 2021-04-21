import { IsNotEmpty, Length, IsString, IsInt, IsDate, MaxLength } from 'class-validator';
import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import RefreshToken from './RefreshToken';
import timestampTransformer from '../../transformer/timestamp';

@Entity('auth_access_tokens')
export default class AccessToken {
  @PrimaryColumn({ name: 'id' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public id: string;

  @Column({ name: 'client_id' })
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  public clientId: string;

  @Column({ name: 'user_id', nullable: true })
  @IsInt()
  public userId?: number;

  @Column({ name: 'scope', nullable: true })
  @IsString()
  public scope?: string;

  @Column({ name: 'expires_at', transformer: timestampTransformer })
  @IsNotEmpty()
  @IsDate()
  public expiresAt: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.accessToken)
  public refreshTokens?: RefreshToken[];
}
