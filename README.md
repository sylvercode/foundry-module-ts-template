# FoundryVTT Module Template w/ Typescript

This repo is meant to be used as a starting point for creating your own FoundryVTT module with [Typescript][2]. If you are using Github you can get started by clicking the green `Use this template` button in the upper-right.

Check out [our blog post][4] for a walkthrough of the codebase.

## What's in the box

Out of the box this template adds a button to the top of the Actors directory. Clicking it brings up a modal with a button that will load a picture of a random dog from the [Dog API][3]. This demonstrates how to perform some common tasks such as render templates and call external APIs, and hopefully provides a decent starting point for developing your own module.

### dev container

A dev container [configuration](.devcontainer/devcontainer.json) ([see][5]) is provided. It is recomemnded to make a personal configuration with mounts to you foundry installation and data folder for easier testing and debuggin. copy the `.devcontainer/devcontainer.json` to `.devcontainer/personal/devcontainer.json` and follow instruction in comments. This personal folder and suggested mount point are set to be ignored by git.

## Todo

If you have just created a new project with this template there are a few changes you should make to start:

- [ ] Update the values in `src/module.json`. At minimum you should change `id`, `title`, and `description`. It is also recommended that you add a `contacts` field.
- [ ] Start using a new module prefix for localizations. The localizations in `src/languages/en.json` are all prefixed with `TODO-MY-MODULE.` to distinguish them from any other installed translations. You should choose a new prefix for your module and use it for any new translations you add, and remove the existing translation entries as they become unnecessary.
- [ ] Change `TodoMyModule` class in types

### Automatic script

Alternatively, you can run the powershell script [Setup-Repo.ps1](Setup-Repo.ps1) to make the changes for you. It also generate a default `.vscode/launch.json` and `.vscode/tasks.json` ready to use.

```pwsh
./Setup-Repo.ps1 module-id "Module Title" "Module description" "Author Name" "Author Email" [ModuleClassName] [-WhatIf]
```

[1]: https://foundryvtt.com/
[2]: https://www.typescriptlang.org/
[3]: https://dog.ceo/dog-api/
[4]: https://bringingfire.com/blog/intro-to-foundry-module-development
[5]: https://code.visualstudio.com/docs/devcontainers/containers
