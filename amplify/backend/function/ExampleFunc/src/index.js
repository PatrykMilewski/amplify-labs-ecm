"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../../../../node_modules/@dazn/lambda-powertools-correlation-ids/index.js
var require_lambda_powertools_correlation_ids = __commonJS({
  "../../../../../node_modules/@dazn/lambda-powertools-correlation-ids/index.js"(exports, module2) {
    var DEBUG_LOG_ENABLED = "debug-log-enabled";
    var CorrelationIds = class {
      constructor(context = {}) {
        this.context = context;
      }
      clearAll() {
        this.context = {};
      }
      replaceAllWith(ctx) {
        this.context = ctx;
      }
      set(key, value) {
        if (!key.startsWith("x-correlation-")) {
          key = "x-correlation-" + key;
        }
        this.context[key] = value;
      }
      get() {
        return this.context;
      }
      get debugLoggingEnabled() {
        return this.context[DEBUG_LOG_ENABLED] === "true";
      }
      set debugLoggingEnabled(enabled) {
        this.context[DEBUG_LOG_ENABLED] = enabled ? "true" : "false";
      }
      static clearAll() {
        globalCorrelationIds.clearAll();
      }
      static replaceAllWith(...args) {
        globalCorrelationIds.replaceAllWith(...args);
      }
      static set(...args) {
        globalCorrelationIds.set(...args);
      }
      static get() {
        return globalCorrelationIds.get();
      }
      static get debugLoggingEnabled() {
        return globalCorrelationIds.debugLoggingEnabled;
      }
      static set debugLoggingEnabled(enabled) {
        globalCorrelationIds.debugLoggingEnabled = enabled;
      }
    };
    __name(CorrelationIds, "CorrelationIds");
    if (!global.CORRELATION_IDS) {
      global.CORRELATION_IDS = new CorrelationIds();
    }
    var globalCorrelationIds = global.CORRELATION_IDS;
    module2.exports = CorrelationIds;
  }
});

// ../../../../../node_modules/@dazn/lambda-powertools-logger/index.js
var require_lambda_powertools_logger = __commonJS({
  "../../../../../node_modules/@dazn/lambda-powertools-logger/index.js"(exports, module2) {
    var CorrelationIds = require_lambda_powertools_correlation_ids();
    var LogLevels = {
      DEBUG: 20,
      INFO: 30,
      WARN: 40,
      ERROR: 50
    };
    var DEFAULT_CONTEXT = {
      awsRegion: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
      functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
      functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
      environment: process.env.ENVIRONMENT || process.env.STAGE
    };
    var Logger = class {
      constructor({
        correlationIds = CorrelationIds,
        level = process.env.LOG_LEVEL
      } = {}) {
        this.correlationIds = correlationIds;
        this.level = (level || "DEBUG").toUpperCase();
        this.originalLevel = this.level;
        if (correlationIds.debugEnabled) {
          this.enableDebug();
        }
      }
      get context() {
        return {
          ...DEFAULT_CONTEXT,
          ...this.correlationIds.get()
        };
      }
      isEnabled(level) {
        return level >= (LogLevels[this.level] || LogLevels.DEBUG);
      }
      appendError(params, err) {
        if (!err) {
          return params;
        }
        return {
          ...params || {},
          errorName: err.name,
          errorMessage: err.message,
          stackTrace: err.stack
        };
      }
      log(levelName, message, params) {
        const level = LogLevels[levelName];
        if (!this.isEnabled(level)) {
          return;
        }
        const logMsg = {
          ...this.context,
          ...params,
          level,
          sLevel: levelName,
          message
        };
        const consoleMethods = {
          DEBUG: console.debug,
          INFO: console.info,
          WARN: console.warn,
          ERROR: console.error
        };
        consoleMethods[levelName](JSON.stringify(
          { message, ...params, ...logMsg },
          (key, value) => typeof value === "bigint" ? value.toString() : value
        ));
      }
      debug(msg, params) {
        this.log("DEBUG", msg, params);
      }
      info(msg, params) {
        this.log("INFO", msg, params);
      }
      warn(msg, params, err) {
        const parameters = !err && params instanceof Error ? this.appendError({}, params) : this.appendError(params, err);
        this.log("WARN", msg, parameters);
      }
      error(msg, params, err) {
        const parameters = !err && params instanceof Error ? this.appendError({}, params) : this.appendError(params, err);
        this.log("ERROR", msg, parameters);
      }
      enableDebug() {
        this.level = "DEBUG";
        return () => this.resetLevel();
      }
      resetLevel() {
        this.level = this.originalLevel;
      }
      static debug(...args) {
        globalLogger.debug(...args);
      }
      static info(...args) {
        globalLogger.info(...args);
      }
      static warn(...args) {
        globalLogger.warn(...args);
      }
      static error(...args) {
        globalLogger.error(...args);
      }
      static enableDebug() {
        return globalLogger.enableDebug();
      }
      static resetLevel() {
        globalLogger.resetLevel();
      }
      static get level() {
        return globalLogger.level;
      }
    };
    __name(Logger, "Logger");
    var globalLogger = new Logger();
    module2.exports = Logger;
  }
});

// index.ts
var lib_exports = {};
__export(lib_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(lib_exports);
var import_lambda_powertools_logger = __toESM(require_lambda_powertools_logger());
var handler = /* @__PURE__ */ __name(async (event) => {
  import_lambda_powertools_logger.default.info("Input event", event);
  return "Successfully processed DynamoDB record";
}, "handler");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=index.js.map
