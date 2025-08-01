import { DeepPartial } from "fvtt-types/utils";
import { moduleId, getGame } from "../constants";

export default class DogBrowser extends
  foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

  imageUrl?: string;

  override get title(): string {
    return getGame().i18n?.localize("TODO-MODULE-ID.dog-browser") ?? "Dog Browser";
  }

  static override DEFAULT_OPTIONS = {
    id: moduleId,
    position: {
      width: 720,
      height: 720
    },
    actions: {
      randomizeDog: this.randomizeDog
    }
  }

  static override PARTS = {
    main: {
      template: `modules/${moduleId}/templates/dogs.hbs`
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
