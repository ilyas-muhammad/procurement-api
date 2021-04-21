import { IsNotEmpty, Length, IsString, IsDate, MaxLength } from 'class-validator';
import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import AccessToken from './AccessToken';

@Entity('auth_refresh_tokens')
export default class RefreshToken {
  @PrimaryColumn({ name: 'id' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public id: string;

  @Column({ name: 'access_token_id' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public accessTokenId: string;

  @Column({ name: 'client_id' })
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  public clientId: string;

  @Column({ name: 'expires_at' })
  @IsNotEmpty()
  @IsDate()
  public expiresAt: Date;

  @ManyToOne(() => AccessToken, (accessToken) => accessToken.refreshTokens)
  @JoinColumn({ name: 'access_token_id' })
  public accessToken?: AccessToken;
}
