import type { CompanionStaticUpgradeScript } from '../module-api/upgrade.js';
import type { EncodeIsVisible } from '../host-api/api.js';
import type { CompanionInputFieldBase } from '../module-api/input.js';
export declare function serializeIsVisibleFn<T extends CompanionInputFieldBase>(options: T[]): EncodeIsVisible<T>[];
export interface InstanceBaseProps<TConfig> {
    id: string;
    upgradeScripts: CompanionStaticUpgradeScript<TConfig>[];
    _isInstanceBaseProps: boolean;
}
export declare function isInstanceBaseProps<TConfig>(obj: unknown): obj is InstanceBaseProps<TConfig>;
//# sourceMappingURL=base.d.ts.map