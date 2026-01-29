// Lightweight cross-platform logger for Foundly
// - mirrors logs to console
// - writes structured JSON lines to stdout/stderr so VS Code Debug Console captures them
// - tries to persist to localStorage (web) or AsyncStorage (React Native) when available

declare const window: any;

type Level = "debug" | "info" | "warn" | "error";

const LOG_KEY = "foundly_logs_v1";
const MAX_ENTRIES = 500;

// Preserve original console methods to avoid recursion when we patch them
const ORIGINAL_CONSOLE = {
  log: console.log.bind(console),
  info: console.info ? console.info.bind(console) : console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug
    ? console.debug.bind(console)
    : console.log.bind(console),
};

function now() {
  return new Date().toISOString();
}

const storage = {
  async get(): Promise<any[]> {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem(LOG_KEY);
        return raw ? JSON.parse(raw) : [];
      }
      // Try AsyncStorage (optional dependency)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AsyncStorage =
        require("@react-native-async-storage/async-storage").default;
      const raw = await AsyncStorage.getItem(LOG_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  async set(arr: any[]) {
    try {
      const trimmed = arr.slice(-MAX_ENTRIES);
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AsyncStorage =
        require("@react-native-async-storage/async-storage").default;
      await AsyncStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
    } catch {
      // ignore
    }
  },
  async clear() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(LOG_KEY);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AsyncStorage =
        require("@react-native-async-storage/async-storage").default;
      await AsyncStorage.removeItem(LOG_KEY);
    } catch {}
  },
};

export const Logger = {
  async push(level: Level, message: string, meta?: any) {
    const entry = {
      ts: now(),
      level,
      message,
      meta: meta === undefined ? null : meta,
    };

    // Mirror to console for normal development visibility
    // Use original console methods to avoid triggering patched console wrappers
    if (level === "error") ORIGINAL_CONSOLE.error("[FOUNDLY]", message, meta);
    else if (level === "warn")
      ORIGINAL_CONSOLE.warn("[FOUNDLY]", message, meta);
    else ORIGINAL_CONSOLE.log("[FOUNDLY]", message, meta);

    // Also write structured JSON to stdout/stderr so VS Code captures it when debugging
    try {
      const line = JSON.stringify(entry) + "\n";
      if (
        typeof process !== "undefined" &&
        process.stdout &&
        typeof process.stdout.write === "function"
      ) {
        if (
          level === "error" &&
          process.stderr &&
          typeof process.stderr.write === "function"
        ) {
          process.stderr.write(line);
        } else {
          process.stdout.write(line);
        }
      }
    } catch {
      // ignore
    }

    // Persist the entry if storage is available
    try {
      const arr = await storage.get();
      arr.push(entry);
      await storage.set(arr);
    } catch {
      // ignore
    }
  },
  debug(msg: string, meta?: any) {
    return this.push("debug", msg, meta);
  },
  info(msg: string, meta?: any) {
    return this.push("info", msg, meta);
  },
  warn(msg: string, meta?: any) {
    return this.push("warn", msg, meta);
  },
  error(msg: string, meta?: any) {
    return this.push("error", msg, meta);
  },
  async getStored() {
    return storage.get();
  },
  async clearStored() {
    return storage.clear();
  },
  initConsolePatch() {
    try {
      // Only patch console in web browser environments. React Native's
      // console implementation can behave differently and patching it
      // may cause recursive formatting -> stack overflows.
      if (
        typeof window === "undefined" ||
        typeof (window as any).document === "undefined"
      )
        return;
      const orig = {
        log: console.log.bind(console),
        info: console.info?.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        debug: console.debug?.bind(console),
      } as any;

      console.log = (...args: any[]) => {
        orig.log(...args);
        void this.debug(String(args[0] ?? ""), args.slice(1));
      };
      console.info = (...args: any[]) => {
        orig.info?.(...args);
        void this.info(String(args[0] ?? ""), args.slice(1));
      };
      console.warn = (...args: any[]) => {
        orig.warn(...args);
        void this.warn(String(args[0] ?? ""), args.slice(1));
      };
      console.error = (...args: any[]) => {
        orig.error(...args);
        void this.error(String(args[0] ?? ""), args.slice(1));
      };
      console.debug = (...args: any[]) => {
        orig.debug?.(...args);
        void this.debug(String(args[0] ?? ""), args.slice(1));
      };
    } catch {
      // ignore
    }
  },
};

export default Logger;
