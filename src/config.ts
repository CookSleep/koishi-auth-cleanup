import { Schema, Time } from 'koishi'

export const name = 'auth-cleanup'
export const inject = ['database', 'auth']

export interface Config {
    interval: number
    retention: number
    runOnStart: boolean
}

export const Config: Schema<Config> = Schema.object({
    interval: Schema.natural()
        .role('ms')
        .min(Time.hour)
        .default(Time.day)
        .description('清理间隔'),
    retention: Schema.natural()
        .role('ms')
        .default(0)
        .description('登录记录过期后再保留多久才删除，0 表示过期即删除'),
    runOnStart: Schema.boolean()
        .default(true)
        .description('插件启动时立即清理一次')
}).description('清理设置')

export const usage = `## auth-cleanup
定期清理 Koishi 控制台的过期登录记录。

### 为什么需要
控制台每次登录都会在数据库的 \`token\` 表中写入一条登录记录，也就是「个人资料」页里的登录设备列表。官方 \`auth\` 插件只在登录时检查记录是否过期，从不删除，记录会一直累积。

### 清理范围
- 只删除已过期的登录记录，仍在有效期内的登录不受影响，不会把任何设备踢下线。
- 登录记录的有效期由 \`auth\` 插件的 \`authTokenExpire\` 决定，默认 7 天。
- 设置 \`retention\` 后，过期记录会再保留一段时间才删除，方便回看近期登录过的设备和 IP。

### 前置条件
需要启用官方 \`auth\` 插件和任意数据库插件。`
