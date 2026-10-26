var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Config: () => Config,
  apply: () => apply,
  inject: () => inject,
  name: () => name,
  usage: () => usage
});
module.exports = __toCommonJS(index_exports);

// src/config.ts
var import_koishi = require("koishi");
var name = "auth-cleanup";
var inject = ["database", "auth"];
var Config = import_koishi.Schema.object({
  interval: import_koishi.Schema.natural().role("ms").min(import_koishi.Time.hour).default(import_koishi.Time.day).description("清理间隔"),
  retention: import_koishi.Schema.natural().role("ms").default(0).description("登录记录过期后再保留多久才删除，0 表示过期即删除"),
  runOnStart: import_koishi.Schema.boolean().default(true).description("插件启动时立即清理一次")
}).description("清理设置");
var usage = `## auth-cleanup
定期清理 Koishi 控制台的过期登录记录。

### 为什么需要
控制台每次登录都会在数据库的 \`token\` 表中写入一条登录记录，也就是「个人资料」页里的登录设备列表。官方 \`auth\` 插件只在登录时检查记录是否过期，从不删除，记录会一直累积。

### 清理范围
- 只删除已过期的登录记录，仍在有效期内的登录不受影响，不会把任何设备踢下线。
- 登录记录的有效期由 \`auth\` 插件的 \`authTokenExpire\` 决定，默认 7 天。
- 设置 \`retention\` 后，过期记录会再保留一段时间才删除，方便回看近期登录过的设备和 IP。

### 前置条件
需要启用官方 \`auth\` 插件和任意数据库插件。`;

// src/index.ts
function apply(ctx, config) {
  const logger = ctx.logger("auth-cleanup");
  let running = false;
  async function cleanup() {
    if (running) return;
    running = true;
    try {
      const before = Date.now() - config.retention;
      const { removed } = await ctx.database.remove("token", {
        expiredAt: { $lt: before }
      });
      if (removed) logger.info("已删除 %d 条过期登录记录", removed);
    } catch (error) {
      logger.warn("清理过期登录记录失败", error);
    } finally {
      running = false;
    }
  }
  __name(cleanup, "cleanup");
  if (config.runOnStart) ctx.on("ready", cleanup);
  ctx.setInterval(cleanup, config.interval);
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  inject,
  name,
  usage
});
