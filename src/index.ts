import { Context } from 'koishi'
import type { Config } from './config'

export { Config, inject, name, usage } from './config'

declare module 'koishi' {
    interface Tables {
        token: AuthToken
    }
}

/** 官方 auth 插件的登录记录，这里只声明清理时用到的字段。 */
interface AuthToken {
    inc: number
    expiredAt: number
}

export function apply(ctx: Context, config: Config) {
    const logger = ctx.logger('auth-cleanup')
    let running = false

    async function cleanup() {
        if (running) return
        running = true
        try {
            const before = Date.now() - config.retention
            const { removed } = await ctx.database.remove('token', {
                expiredAt: { $lt: before }
            })
            if (removed) logger.info('已删除 %d 条过期登录记录', removed)
        } catch (error) {
            logger.warn('清理过期登录记录失败', error)
        } finally {
            running = false
        }
    }

    if (config.runOnStart) ctx.on('ready', cleanup)
    ctx.setInterval(cleanup, config.interval)
}
