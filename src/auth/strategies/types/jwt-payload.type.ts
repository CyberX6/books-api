import { Session } from 'src/session/entities/session.entity';
import { User } from '../../../users/entities/user.entity';

export type JwtPayloadType = User & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
