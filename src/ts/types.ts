import DogBrowser from "./apps/dogBrowser";

export interface TodoMyModule extends foundry.packages.Module {
  dogBrowser: DogBrowser;
}
