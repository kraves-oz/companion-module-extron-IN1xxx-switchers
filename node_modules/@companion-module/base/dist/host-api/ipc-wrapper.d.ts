/**
 * Signature for the handler functions
 */
type HandlerFunction<T extends (...args: any) => any> = (data: Parameters<T>[0]) => HandlerReturnType<T>;
type HandlerReturnType<T extends (...args: any) => any> = ReturnType<T> extends never ? Promise<void> : Promise<ReturnType<T>>;
type HandlerFunctionOrNever<T> = T extends (...args: any) => any ? HandlerFunction<T> : never;
/** Map of handler functions */
export type IpcEventHandlers<T extends object> = {
    [K in keyof T]: HandlerFunctionOrNever<T[K]>;
};
type ParamsIfReturnIsNever<T extends (...args: any[]) => any> = ReturnType<T> extends never ? Parameters<T> : never;
type ParamsIfReturnIsValid<T extends (...args: any[]) => any> = ReturnType<T> extends never ? never : Parameters<T>;
export interface IpcCallMessagePacket {
    direction: 'call';
    name: string;
    payload: string;
    callbackId: number | undefined;
}
export interface IpcResponseMessagePacket {
    direction: 'response';
    callbackId: number;
    success: boolean;
    payload: string;
}
export declare class IpcWrapper<TOutbound extends {
    [key: string]: any;
}, TInbound extends {
    [key: string]: any;
}> {
    #private;
    constructor(handlers: IpcEventHandlers<TInbound>, sendMessage: (message: IpcCallMessagePacket | IpcResponseMessagePacket) => void, defaultTimeout: number);
    sendWithCb<T extends keyof TOutbound>(name: T, msg: ParamsIfReturnIsValid<TOutbound[T]>[0], defaultResponse?: () => Error, timeout?: number): Promise<ReturnType<TOutbound[T]>>;
    sendWithNoCb<T extends keyof TOutbound>(name: T, msg: ParamsIfReturnIsNever<TOutbound[T]>[0]): void;
    receivedMessage(msg: IpcCallMessagePacket | IpcResponseMessagePacket): void;
}
export {};
//# sourceMappingURL=ipc-wrapper.d.ts.map