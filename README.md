# Foundry VTT Module Template (TypeScript)

This repository is a starting point for creating a Foundry VTT module with TypeScript. If you are using GitHub, click the green "Use this template" button to get started.

This template is based on the work of [BringingFire/foundry-module-ts-template](https://github.com/BringingFire/foundry-module-ts-template) with the following changes:

- Updated for Foundry V13.
- Directory structure aligned with the Foundry documentation.
- Hook methods decentralized into their own components.

## Other branchs

See the other branchs for variations:

- **lib-wrapper**: For [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) template.
- *more to come*

## What’s included

Out of the box, this template adds a button to the top of the Actors directory. Clicking it opens a modal with a button that loads a random dog image from the [Dog API][3]. This demonstrates common tasks such as rendering templates, calling external APIs, organizing code, and styling with SCSS.

### libWrapper

This variation of the template adds support for [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper). It triggers a "PING!" notification when a user pings the canvas. See What next below for how to register wrappers.

## Dev container

A dev container configuration is provided at [.devcontainer/devcontainer.json](.devcontainer/devcontainer.json) ([see][5]).

Recommended: create a personal configuration with mounts to your Foundry installation and data folder for easier testing and debugging. Copy `.devcontainer/devcontainer.json` to `.devcontainer/personal/devcontainer.json` and follow the instructions in the comments. The personal folder and suggested mount points are ignored by git.

## Getting started (Todo)

If you just created a project from this template, make these changes first:

- [ ] Update values in `src/module.json`. At minimum change `id`, `title`, and `description`. It is also recommended to add a `contacts` field.
- [ ] Choose a localization prefix. Replace `TODO-MY-MODULE.*` entries in `src/lang/en.json` with your own prefix, and remove entries you do not need.
- [ ] Rename/update `TodoMyModule` in `src/ts/types.ts` and `src/ts/module.ts`.

## Automated setup

Alternatively, run the PowerShell script [Setup-Repo.ps1](Setup-Repo.ps1) to apply these changes automatically. It also generates default `.vscode/launch.json` and `.vscode/tasks.json`.

```pwsh
./Setup-Repo.ps1 module-id "Module Title" "Module description" "Author Name" "Author Email" [ModuleClassName] [-WhatIf]
```

## What next

Create a new Application class and register its hooks in `TodoMyModuleHooks.HOOKS_DEFINITIONS` and/or add an init callback in `TodoMyModuleHooks.ON_INIT_MODULE_CALLBACKS`. See [src/ts/types.ts](./src/ts/types.ts).

### libWrapper

Define wrapper callbacks in your Application class and add them to `TodoMyModuleHooks.LIBWRAPPER_PATCHS`.

[1]: https://foundryvtt.com/
[2]: https://www.typescriptlang.org/
[3]: https://dog.ceo/dog-api/
[4]: https://bringingfire.com/blog/intro-to-foundry-module-development
[5]: https://code.visualstudio.com/docs/devcontainers/containers
