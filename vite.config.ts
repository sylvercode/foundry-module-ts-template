import path from "node:path";
import * as fsPromises from "fs/promises";
import copy from "rollup-plugin-copy";
import { defineConfig, Plugin } from "vite";

const moduleVersion = process.env.MODULE_VERSION;
const githubProject = process.env.GH_PROJECT;
const githubTag = process.env.GH_TAG;

console.log(process.env.VSCODE_INJECTION);

export default defineConfig({
  resolve: {
    alias: {
      "fvtt-hook-attacher": path.resolve(process.cwd(), "libs/fvtt-hook-attacher/index.ts"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      input: "src/ts/module.ts",
      output: {
        dir: "dist/scripts",
        entryFileNames: "module.js",
        format: "es",
      },
    },
  },
  plugins: [
    updateModuleManifestPlugin(),
    copy({
      targets: [
        { src: "src/lang", dest: "dist" },
        { src: "src/packs", dest: "dist" },
        { src: "src/templates", dest: "dist" },
      ],
      hook: "writeBundle",
    }),
    copy({
      targets: [
        { src: "dist/scripts/assets/*.css", dest: "dist/styles/", rename: "module.css" },
      ],
      hook: "writeBundle",
    }),
  ],
});

function updateModuleManifestPlugin(): Plugin {
  return {
    name: "update-module-manifest",
    async writeBundle(): Promise<void> {
      const packageContents = JSON.parse(
        await fsPromises.readFile("./package.json", "utf-8")
      ) as Record<string, unknown>;
      const version = moduleVersion || (packageContents.version as string);
      const manifestContents: string = await fsPromises.readFile(
        "src/module.json",
        "utf-8"
      );
      const manifestJson = JSON.parse(manifestContents) as Record<
        string,
        unknown
      >;
      manifestJson["version"] = version;
      if (githubProject) {
        const baseUrl = `https://github.com/${githubProject}/releases`;
        manifestJson["manifest"] = `${baseUrl}/latest/download/module.json`;
        if (githubTag) {
          manifestJson[
            "download"
          ] = `${baseUrl}/download/${githubTag}/module.zip`;
        }
      }
      await fsPromises.writeFile(
        "dist/module.json",
        JSON.stringify(manifestJson, null, 4)
      );
    },
  };
}
