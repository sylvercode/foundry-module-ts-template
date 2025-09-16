import { DeepPartial } from "fvtt-types/utils";
import { MODULE_ID } from "../constants";
import { HookDefinitions } from "fvtt-hook-attacher";

export interface DogBrowserHandle {
  dogBrowser: DogBrowser;
}

let dogBrowserHandle: DogBrowserHandle;

export function onInitHandle(handle: DogBrowserHandle): void {
  dogBrowserHandle = handle;
  dogBrowserHandle.dogBrowser = new DogBrowser();
}

function renderActorDirectory(_: ActorDirectory, html: HTMLElement): void {
  const actionButtons = html.querySelector(".directory-header .action-buttons");
  if (!actionButtons) throw new Error("Could not find action buttons in Actor Directory");

  const button = document.createElement("button");
  button.className = "cc-sidebar-button";
  button.type = "button";
  button.textContent = "🐶";
  button.addEventListener("click", () => {
    dogBrowserHandle.dogBrowser.render({ force: true });
  });

  actionButtons.appendChild(button);
}

export const HOOKS_DEFINITIONS: Iterable<HookDefinitions> = [{
  on: {
    name: "renderActorDirectory",
    callback: renderActorDirectory
  }
}];

class DogBrowser extends
  foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

  imageUrl?: string;

  override get title(): string {
    return game.i18n?.localize("TODO-MODULE-ID.dog-app.dog-browser") ?? "Dog Browser";
  }

  static override DEFAULT_OPTIONS = {
    id: MODULE_ID,
    position: {
      width: 720,
      height: 720
    },
    actions: {
      randomizeDog: DogBrowser.randomizeDog
    }
  }

  static override PARTS = {
    main: {
      template: `modules/${MODULE_ID}/templates/dogs.hbs`
    }
  }

  protected override async _preparePartContext(
    partId: string,
    context: foundry.applications.api.ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<foundry.applications.api.HandlebarsApplicationMixin.RenderOptions>
  ): Promise<foundry.applications.api.ApplicationV2.RenderContextOf<this>> {
    const partContext = await super._preparePartContext(partId, context, options);

    Object.assign(context, {
      imageUrl: this.imageUrl
    });

    return partContext;
  }

  static async randomizeDog(this: DogBrowser, _event: PointerEvent, _target: HTMLElement) {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    if (response.status != 200) {
      ui.notifications?.error(
        `Unexpected response fetching new dog image: ${response.status}: ${response.statusText}`
      );
      return;
    }
    this.imageUrl = (await response.json()).message;
    this.render();
  }
}
