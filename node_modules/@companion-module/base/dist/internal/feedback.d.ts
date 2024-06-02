import type { CompanionFeedbackDefinitions } from '../module-api/feedback.js';
import type { FeedbackInstance, LearnFeedbackMessage, LearnFeedbackResponseMessage, ParseVariablesInStringMessage, ParseVariablesInStringResponseMessage, SetFeedbackDefinitionsMessage, UpdateFeedbackValuesMessage, VariablesChangedMessage } from '../host-api/api.js';
import type { LogLevel } from '../module-api/enums.js';
export declare class FeedbackManager {
    #private;
    get parseVariablesContext(): string | undefined;
    constructor(parseVariablesInString: (msg: ParseVariablesInStringMessage) => Promise<ParseVariablesInStringResponseMessage>, updateFeedbackValues: (msg: UpdateFeedbackValuesMessage) => void, setFeedbackDefinitions: (msg: SetFeedbackDefinitionsMessage) => void, log: (level: LogLevel, message: string) => void);
    getDefinitionIds(): string[];
    getInstanceIds(): string[];
    handleUpdateFeedbacks(feedbacks: {
        [id: string]: FeedbackInstance | null | undefined;
    }): void;
    handleLearnFeedback(msg: LearnFeedbackMessage): Promise<LearnFeedbackResponseMessage>;
    handleVariablesChanged(msg: VariablesChangedMessage): void;
    setFeedbackDefinitions(feedbacks: CompanionFeedbackDefinitions): void;
    checkFeedbacks(feedbackTypes: string[]): void;
    checkFeedbacksById(feedbackIds: string[]): void;
    /** @deprecated */
    _getAllFeedbacks(): Pick<FeedbackInstance, 'id' | 'feedbackId' | 'controlId' | 'options'>[];
    subscribeFeedbacks(feedbackIds: string[]): void;
    unsubscribeFeedbacks(feedbackIds: string[]): void;
}
//# sourceMappingURL=feedback.d.ts.map