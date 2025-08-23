import * as dogBrowserApp from "./apps/dog_browser";
import { HookDefinitions } from "fvtt-hook-attacher";

export interface TodoMyModule
  extends foundry.packages.Module, dogBrowserApp.DogBrowserHandle {

}

export type OnInitModuleFunc = (module: TodoMyModule) => void;

export class TodoMyModuleHooks {
  static onInitModuleCallbacks: Iterable<OnInitModuleFunc> = [
    dogBrowserApp.onInitHandle,
  ];

  static HOOKS_DEFINITIONS: HookDefinitions = {
    ...dogBrowserApp.HOOKS_DEFINITIONS,
  }
}
