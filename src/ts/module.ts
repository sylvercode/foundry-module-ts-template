// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/module.scss";
import DogBrowser from "./apps/dogBrowser";
import { moduleId, getGame } from "./constants";
import { TodoMyModule } from "./types";

let module: TodoMyModule;

Hooks.once("init", () => {
  console.log(`Initializing ${moduleId}`);

  module = getGame().modules.get(moduleId) as TodoMyModule;
  module.dogBrowser = new DogBrowser();
});

Hooks.on("renderActorDirectory", (_: ActorDirectory, html: HTMLElement) => {
  const actionButtons = html.querySelector(".directory-header .action-buttons");
  if (!actionButtons) throw new Error("Could not find action buttons in Actor Directory");

  const button = document.createElement("button");
  button.className = "cc-sidebar-button";
  button.type = "button";
  button.textContent = "🐶";
  button.addEventListener("click", () => {
    module.dogBrowser.render({ force: true });
  });

  actionButtons.appendChild(button);
});
