import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '../../../shared/services/config.service';

@Injectable()
export class WhatsappService {
  private baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.whatsappUrl.url;
  }

  public sendMessage(message: string, number: string) {
    const data = { number, message };
    return this.httpService.post(this.baseUrl + `/send-message`, data).pipe(
      map((axiosResponse) => {
        return axiosResponse.data;
      }),
    );
  }
}
