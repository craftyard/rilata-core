import { DTO } from '../../domain/dto';

export type JwtType = 'access' | 'refresh';

export type JwtPayload<P extends DTO> = P & {
  exp: number, // jwt expires
  typ: JwtType,
}
