/**
 * ◈ @workspace/error
 * Master fault tolerance, error boundaries, module crash isolation,
 * and client telemetry crash reporter for MoonWitness OS.
 */

export { ErrorBoundary, type ErrorBoundaryProps } from "./error-boundary"
export { ModuleGuard, type ModuleGuardProps } from "./module-guard"
export {
  reportCrash,
  onCrash,
  initGlobalCrashHandler,
  type CrashReport,
  type CrashReportListener,
} from "./crash-reporter"
