import { LibWrapperBaseCallback, LibWrapperBaseCallbackArgs, LibWrapperWrapperDefinitions } from "fvtt-lib-wrapper-types";

export class PingNotifier {

    static readonly LIBWRAPPER_PATCHS: LibWrapperWrapperDefinitions[] = [
        {
            target: "foundry.canvas.Canvas.prototype.ping",
            fn: PingNotifier.ping_Wrapped,
            type: "WRAPPER"
        }
    ];

    static ping_Wrapped(this: foundry.canvas.Canvas, wrapped: LibWrapperBaseCallback, ...args: LibWrapperBaseCallbackArgs): Promise<boolean> {
        const result = wrapped.apply(this, args);
        PingNotifier.ping.call(this);
        return result;
    }


    static ping(this: foundry.canvas.Canvas) {
        ui.notifications?.info("PING!");
    }
}
