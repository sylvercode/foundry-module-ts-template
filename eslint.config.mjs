import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const browserGlobals = {
    console: "readonly",
    document: "readonly",
    window: "readonly",
    HTMLElement: "readonly",
    HTMLInputElement: "readonly",
    Event: "readonly",
    CustomEvent: "readonly",
    setTimeout: "readonly",
    clearTimeout: "readonly",
    setInterval: "readonly",
    clearInterval: "readonly",
    AbortController: "readonly",
    URL: "readonly",
    fetch: "readonly",
    navigator: "readonly",
    location: "readonly",
    performance: "readonly",
    localStorage: "readonly"
};

const nodeGlobals = {
    process: "readonly",
    Buffer: "readonly",
    __dirname: "readonly",
    __filename: "readonly",
    module: "readonly",
    require: "readonly",
    exports: "readonly"
};

const foundryGlobals = {
    foundry: "readonly",
    game: "readonly",
    Hooks: "readonly",
    libWrapper: "readonly",
    CONST: "readonly",
    PIXI: "readonly",
    ui: "readonly"
};

const sharedGlobals = {
    ...browserGlobals,
    ...nodeGlobals,
    ...foundryGlobals
};

export default [
    {
        ignores: [
            "dist/**",
            "foundry/**",
            "node_modules/**",
            "libs/**"
        ]
    },
    js.configs.recommended,
    {
        files: ["src/**/*.{ts,mts,cts}", "vite.config.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module"
            },
            globals: sharedGlobals
        },
        plugins: {
            "@typescript-eslint": tsPlugin
        },
        rules: {
            "no-undef": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                ignoreRestSiblings: true,
                caughtErrors: "none"
            }]
        }
    }
];
