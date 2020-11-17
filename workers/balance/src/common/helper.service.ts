import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HelperService {
  readonly logger = new Logger('worker:balance');

  logInfo(info: { method: string; data?: any }): void {
    const { method, data } = info;
    this.logger.log(method);
    if (data) {
      this.logger.verbose(data);
    }
  }

  logError(info: { method: string; e: any; data?: any }): void {
    const { method, e, data } = info;
    this.logger.error(method);
    console.log(e);
    if (data) {
      this.logger.verbose(data);
    }
  }

  logInfoMsg(msg: string): void {
    this.logger.log(msg);
  }

  logErrorMsg(msg: string): void {
    this.logger.error(msg);
  }

  async sleep(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let t1 = setTimeout(() => {
        clearTimeout(t1);
        t1 = null;
        resolve();
      }, ms);
    });
  }
}