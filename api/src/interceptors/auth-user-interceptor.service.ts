import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserEntity } from '../modules/user/user.entity';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log(context);
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    const user = <UserEntity>request.user;
    // console.log(user);
    // ContextService.setAuthUser(user);

    return next.handle();
  }
}
