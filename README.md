<div align="center">

# Koishi Auth Cleanup

[![npm](https://img.shields.io/npm/v/koishi-plugin-auth-cleanup?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-auth-cleanup)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue?style=flat-square)](LICENSE)

**让控制台的登录记录不再无限增长**

定期清理 [Koishi](https://koishi.chat/) 控制台的过期登录记录。<br>
官方 `auth` 插件每次登录都会写入一条记录，但从不删除过期的记录，本插件替它收拾。

</div>

---

## ✨ 功能

- **定期清理**：按设定的间隔删除数据库 `token` 表中已过期的登录记录，默认每天一次。
- **只删过期记录**：仍在有效期内的登录不受影响，不会把任何设备踢下线。
- **过期后保留**：可以让过期记录再保留一段时间才删除，方便回看近期登录过的设备和 IP。
- **启动时清理**：插件启动时立即清理一次，可以关闭。

## ✅ 前置条件

- Koishi，并启用官方 `auth` 插件（`@koishijs/plugin-auth`）和任意数据库插件。

## 📦 安装

在 Koishi 控制台的插件市场中搜索 `auth-cleanup` 安装，或在 Koishi 项目目录中运行：

```bash
npm install koishi-plugin-auth-cleanup
```

## ⚙️ 配置

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `interval` | 1 天 | 清理间隔，最短 1 小时。 |
| `retention` | 0 | 登录记录过期后再保留多久才删除，0 表示过期即删除。 |
| `runOnStart` | 开启 | 插件启动时立即清理一次。 |

登录记录的有效期由 `auth` 插件的 `authTokenExpire` 决定，默认 7 天。

## ⚠️ 使用声明

- 删除的登录记录无法恢复。如需保留登录历史，请设置 `retention` 或先备份数据库。
- 本插件直接操作 `auth` 插件的 `token` 表，若 `auth` 插件日后修改表结构，可能需要随之更新。

## 📄 许可

本项目基于 [GPL-3.0](LICENSE) 开源。

## 🙏 致谢

- [Koishi](https://koishi.chat/)：机器人框架，以及本插件所清理的 `auth` 插件。
