// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/module.scss";
import { MODULE_ID } from "./constants";
import { TodoMyModule as Module, TodoMyModuleHooks as ModuleHooks } from "./types";
import { HooksAttacher } from "fvtt-hook-attacher";

let module: Module;

Hooks.once("init", () => {
  console.log(`Initializing ${MODULE_ID}`);

  module = game?.modules?.get(MODULE_ID) as Module;
  for (const callback of ModuleHooks.ON_INIT_MODULE_CALLBACKS) {
    callback(module);
  }

  if (!libWrapper) {
    console.warn("LibWrapper not found. Some features may not work as expected.");
    return;
  }

  for (const patch of ModuleHooks.LIBWRAPPER_PATCHS) {
    libWrapper.register(MODULE_ID, patch.target, patch.fn, patch.type, patch.options);
  }
});

HooksAttacher.attachHooks(ModuleHooks.HOOKS_DEFINITIONS_SET);
