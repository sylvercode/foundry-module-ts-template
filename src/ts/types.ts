import * as dogBrowserApp from "./apps/dog_browser";
import type { LibWrapperWrapperDefinitions } from "fvtt-lib-wrapper-types";
import { HookDefinitions } from "fvtt-hook-attacher";
import { PingNotifier } from "./apps/ping_notifer";

export interface TodoMyModule
  extends foundry.packages.Module, dogBrowserApp.DogBrowserHandle {

}

export type OnInitModuleFunc = (module: TodoMyModule) => void;

export class TodoMyModuleHooks {
  static ON_INIT_MODULE_CALLBACKS: Iterable<OnInitModuleFunc> = [
    dogBrowserApp.onInitHandle,
  ];

  static LIBWRAPPER_PATCHS: Iterable<LibWrapperWrapperDefinitions> = Array.from(
    PingNotifier.LIBWRAPPER_PATCHS,
  );

  static HOOKS_DEFINITION_SET: HookDefinitions[] = [
    dogBrowserApp.HOOKS_DEFINITIONS,
  ]
}
