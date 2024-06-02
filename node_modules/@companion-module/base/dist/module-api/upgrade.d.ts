import type { CompanionFeedbackButtonStyleResult } from './feedback.js';
import type { CompanionOptionValues } from './input.js';
/** Additional utilities for Upgrade Scripts */
export interface CompanionUpgradeContext<TConfig> {
    /**
     * Current configuration of the module.
     * This cannot be changed
     */
    readonly currentConfig: Readonly<TConfig>;
}
/**
 * The items for an upgrade script to upgrade
 */
export interface CompanionStaticUpgradeProps<TConfig> {
    /**
     * The module config to upgrade, if any
     */
    config: TConfig | null;
    /**
     * The actions to upgrade
     */
    actions: CompanionMigrationAction[];
    /**
     * The feedbacks to upgrade
     */
    feedbacks: CompanionMigrationFeedback[];
}
/**
 * The result of an upgrade script
 */
export interface CompanionStaticUpgradeResult<TConfig> {
    /**
     * The updated config, if any changes were made
     */
    updatedConfig: TConfig | null;
    /**
     * Any changed actions
     */
    updatedActions: CompanionMigrationAction[];
    /**
     * Any changed feedbacks
     */
    updatedFeedbacks: CompanionMigrationFeedback[];
}
/**
 * The definition of an upgrade script function
 */
export type CompanionStaticUpgradeScript<TConfig> = (context: CompanionUpgradeContext<TConfig>, props: CompanionStaticUpgradeProps<TConfig>) => CompanionStaticUpgradeResult<TConfig>;
/**
 * An action that could be upgraded
 */
export interface CompanionMigrationAction {
    /** The unique id for this action */
    readonly id: string;
    /** The unique id for the location of this action */
    readonly controlId: string;
    /** The id of the action definition */
    actionId: string;
    /** The user selected options for the action */
    options: CompanionOptionValues;
}
/**
 * A feedback that could be upgraded
 */
export interface CompanionMigrationFeedback {
    /** The unique id for this feedback */
    readonly id: string;
    /** The unique id for the location of this feedback */
    readonly controlId: string;
    /** The id of the feedback definition */
    feedbackId: string;
    /** The user selected options for the feedback */
    options: CompanionOptionValues;
    /**
     * If the feedback is being converted to a boolean feedback, the style can be set here.
     * If it is already a boolean feedback or is a different type of feedback, this will be ignored.
     */
    style?: Partial<CompanionFeedbackButtonStyleResult>;
    /**
     * Only valid for a boolean feedback.
     * True if this feedback has been inverted inside Companion, you do not have access to this when the feedback is executed.
     */
    isInverted: boolean;
}
/**
 * A helper upgrade script, which does nothing.
 * Useful to replace a script which is no longer needed
 */
export declare const EmptyUpgradeScript: CompanionStaticUpgradeScript<any>;
/**
 * Definition of how to convert options to style properties for boolean feedbacks
 */
export interface CompanionUpgradeToBooleanFeedbackMap {
    [feedback_id: string]: true | {
        [option_key: string]: 'text' | 'size' | 'color' | 'bgcolor' | 'alignment' | 'pngalignment' | 'png64';
    } | undefined;
}
/**
 * A helper script to automate the bulk of the process to upgrade feedbacks from 'advanced' to 'boolean'.
 * There are some built-in rules for properties names based on the most common cases.
 * @param upgradeMap The feedbacks to upgrade and the properties to convert
 */
export declare function CreateConvertToBooleanFeedbackUpgradeScript<TConfig = unknown>(upgradeMap: CompanionUpgradeToBooleanFeedbackMap): CompanionStaticUpgradeScript<TConfig>;
/**
 * A helper script to automate the bulk of the process to upgrade feedbacks from having a module defined 'invert' field, to use the builtin one.
 * The feedback definitions must be updated manually, this can only help update existing usages of the feedback.
 * @param upgradeMap The feedbacks to upgrade and the id of the option to convert
 */
export declare function CreateUseBuiltinInvertForFeedbacksUpgradeScript<TConfig = unknown>(upgradeMap: Record<string, string>): CompanionStaticUpgradeScript<TConfig>;
//# sourceMappingURL=upgrade.d.ts.map