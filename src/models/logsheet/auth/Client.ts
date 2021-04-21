import { IsNotEmpty, Length, IsString } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('auth_clients')
export default class Client {
  @PrimaryColumn({ name: 'id' })
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  public id: string;

  @Column({ name: 'secret' })
  @IsNotEmpty()
  @Length(15, 100)
  public secret: string;

  @Column({ name: 'name' })
  @IsNotEmpty()
  @Length(5, 100)
  public name: string;
}
