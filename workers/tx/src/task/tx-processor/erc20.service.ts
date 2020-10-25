import { Injectable } from '@nestjs/common';
import { RawTx, TxAssetData, TxAssetsAndData } from '../../models';
import { TxHelperService } from './tx-helper';
import { FSN_TOKEN } from '../../common';
import { WorkerClientService } from '../worker-client';

@Injectable()
export class Erc20Service {
  constructor(private workerClient: WorkerClientService) {}
  async getTxsTokensAndData(
    rawTx: RawTx,
    helper: TxHelperService,
  ): Promise<TxAssetsAndData<TxAssetData>> {
    const { log, erc20Receipts = [], ivalue, dvalue } = rawTx;
    if (!log) {
      const value = +ivalue + +dvalue / Math.pow(10, 18);
      const data = { token: FSN_TOKEN, symbol: 'FSN', value };
      return { data, tokens: [FSN_TOKEN] };
    }
    if (erc20Receipts.length === 0) {
      const erc20 = log[0].contract;
      const tokenSnapshot = await helper.getTokenSnapshot(erc20);
      if (tokenSnapshot.symbol) {
        const erc20Address = { address: erc20, erc20: true };
        this.workerClient.notifyAddressInfo([erc20Address]);
        return { tokens: [erc20], data: log };
      }
    }
    const { erc20, value } = erc20Receipts[0];
    const tokenSnapshot = await helper.getTokenSnapshot(erc20);
    const { symbol, precision } = tokenSnapshot;
    const qty = +value / Math.pow(10, precision);

    const data = { token: erc20, symbol, value: qty };
    const tokens = [erc20];

    return { data, tokens };
  }
}
