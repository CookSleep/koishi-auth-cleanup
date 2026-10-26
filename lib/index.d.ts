import { Context } from 'koishi';
import type { Config } from './config';
export { Config, inject, name, usage } from './config';
declare module 'koishi' {
    interface Tables {
        token: AuthToken;
    }
}
/** 官方 auth 插件的登录记录，这里只声明清理时用到的字段。 */
interface AuthToken {
    inc: number;
    expiredAt: number;
}
export declare function apply(ctx: Context, config: Config): void;
