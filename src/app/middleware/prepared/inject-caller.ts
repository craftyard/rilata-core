import { ResultDTO, RilataRequest } from '../../controller/types';
import { JwtVerifyErrors } from '../../jwt/jwt-errors';
import { Middleware } from '../middleware';

export class InjectCallerMiddleware extends Middleware {
  process(req: RilataRequest): Response | undefined {
    let rawToken = req.headers.get('Authorization');
    if (!rawToken) {
      req.caller = {
        type: 'AnonymousUser',
      };
      return;
    }

    rawToken = rawToken?.includes('Bearer ') ? rawToken.replace('Bearer ', '') : rawToken;
    const verifyResult = this.serverResolver.getJwtVerifier().verifyToken(rawToken);
    if (verifyResult.isFailure()) {
      const respBody: ResultDTO<JwtVerifyErrors, never> = {
        success: false,
        payload: verifyResult.value,
        httpStatus: 400,
      };
      // eslint-disable-next-line consistent-return
      return new Response(JSON.stringify(respBody), { status: 400 });
    }

    req.caller = {
      type: 'DomainUser',
      userId: verifyResult.value.userId,
    };
  }
}
