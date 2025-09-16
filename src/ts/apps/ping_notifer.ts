import { LibWrapperBaseCallback, LibWrapperBaseCallbackArgs, LibWrapperWrapperDefinitions } from "fvtt-lib-wrapper-types";

export const LIBWRAPPER_PATCHS: Iterable<LibWrapperWrapperDefinitions> = [
    {
        target: "foundry.canvas.Canvas.prototype.ping",
        fn: ping_Wrapped,
        type: "WRAPPER"
    }
];

function ping_Wrapped(this: foundry.canvas.Canvas, wrapped: LibWrapperBaseCallback, ...args: LibWrapperBaseCallbackArgs): Promise<boolean> {
    const result = wrapped.apply(this, args);
    ping.call(this);
    return result;
}


function ping(this: foundry.canvas.Canvas) {
    ui.notifications?.info("PING!");
}
