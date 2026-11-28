import { DurableObject } from 'cloudflare:workers';
import { handleRequest, VisitStorage } from './counter.mjs';

export class VisitCounter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.records = new VisitStorage(ctx.storage);
    ctx.blockConcurrencyWhile(async () => {
      if (await ctx.storage.getAlarm() === null) await this.scheduleCleanup();
    });
  }

  record(country, device) {
    this.records.record(country, device);
  }

  readCounts() {
    return this.records.readCounts();
  }

  recordQrOpen() {
    this.records.recordQrOpen();
  }

  readQrCount() {
    return this.records.readTotal();
  }

  async alarm() {
    this.records.prune();
    await this.scheduleCleanup();
  }

  scheduleCleanup() {
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    return this.ctx.storage.setAlarm(tomorrow);
  }
}

export default { fetch: handleRequest };
