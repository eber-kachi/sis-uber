import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

const IgnoredPropertyName = Symbol('IgnoredPropertyName');

export function CustomInterceptorIgnore() {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value[IgnoredPropertyName] = true;
  };
}

@Injectable()
export class CustomInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request: any = context.switchToHttp().getRequest();
    const isIgnored = context.getHandler()[IgnoredPropertyName];
    if (isIgnored) {
      return next.handle();
    }
  }
}
