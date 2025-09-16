[CmdletBinding(SupportsShouldProcess)]
param (
    [Parameter(Mandatory,
        HelpMessage = "The ID of the module. Must be lowercase alphanumeric and can include dashes."
    )]
    [Alias("i")]
    [ValidatePattern("^[a-z-]+$")]
    [string]
    $Id,

    [Parameter(Mandatory,
        HelpMessage = "The title of the module."
    )]
    [Alias("t")]
    [string]
    $Title,

    [Parameter(Mandatory,
        HelpMessage = "The description of the module."
    )]
    [Alias("d")]
    [string]
    $Description,

    [Parameter(Mandatory,
        HelpMessage = "The author's name for the module."
    )]
    [Alias("n")]
    [string]
    $AuthorName,

    [Parameter(Mandatory,
        HelpMessage = "The author's email for the module."
    )]
    [Alias("e")]
    [string]
    $AuthorEmail,

    [Parameter(
        HelpMessage = "The class name of the module in the sourtce code. When not specified, it will be a PascalCase version of the ID suffixed with `"Module`"."
    )]
    [Alias("c")]
    [ValidatePattern("^[A-Z][a-zA-Z0-9]*$")]
    [string]
    $ClassName
)
$ErrorActionPreference = "Stop"

function AsPascalCase($KebabCaseString) {
    $Parts = ($KebabCaseString -split '-') | ForEach-Object { $_.Substring(0, 1).ToUpper() + $_.Substring(1) }
    return $Parts -join ''
}

if ([string]::IsNullOrWhiteSpace($ClassName)) {
    $ClassName = (AsPascalCase $Id) + "Module"
    Write-Information "Class name not specified, using default: $ClassName"
}

$KebabReplacement = [PSCustomObject]@{ key = "todo-module-id"; value = $Id }
$UpperCaseKebabReplacement = [PSCustomObject]@{ key = "TODO-MODULE-ID"; value = $Id.ToUpper() }
$ClassNameReplacement = [PSCustomObject]@{ key = "TodoMyModule"; value = $ClassName }

$OperationSteps = @(
    [PSCustomObject]@{
        FilePath           = "src/lang/en.json"
        RepalcementActions = @(
            $UpperCaseKebabReplacement
        )
    },
    [PSCustomObject]@{
        FilePath           = "src/templates/dogs.hbs"
        RepalcementActions = @(
            $UpperCaseKebabReplacement 
        )
    },
    [PSCustomObject]@{
        FilePath           = "src/ts/apps/dog_browser.ts"
        RepalcementActions = @(
            $UpperCaseKebabReplacement
        )
    },
    [PSCustomObject]@{
        FilePath           = "src/ts/constants.ts"
        RepalcementActions = @(
            $KebabReplacement
        )
    },
    [PSCustomObject]@{
        FilePath           = "src/ts/module.ts"
        RepalcementActions = @(
            $ClassNameReplacement
        )
    },
    [PSCustomObject]@{
        FilePath           = "src/ts/types.ts"
        RepalcementActions = @(
            $ClassNameReplacement,
            [PSCustomObject]@{ key = "todo-module-title"; value = $Title }
        )
    },
    [PSCustomObject]@{
        FilePath           = "src/module.json"
        RepalcementActions = @(
            $KebabReplacement,
            [PSCustomObject]@{ key = "todo-module-title"; value = $Title },
            [PSCustomObject]@{ key = "todo-module-description"; value = $Description },
            [PSCustomObject]@{ key = "todo-module-author-name"; value = $AuthorName },
            [PSCustomObject]@{ key = "todo-module-author-email"; value = $AuthorEmail }
        )
    }
    [PSCustomObject]@{
        FilePath           = "package.json"
        RepalcementActions = @(
            $KebabReplacement,
            [PSCustomObject]@{ key = "todo-module-description"; value = $Description }
        )
    }
    [PSCustomObject]@{
        FilePath           = ".devcontainer/devcontainer.json"
        RepalcementActions = @(
            $KebabReplacement
        )
    }
)

foreach ($OpStep in $OperationSteps) {
    $FilePath = Join-Path -Path $PSScriptRoot -ChildPath $OpStep.FilePath
    Write-Information "Processing file: $FilePath"
    if (Test-Path -Path $FilePath) {
        $OriginalContent = Get-Content -Path $FilePath -Raw
        $NewContent = $OriginalContent
        foreach ($Action in $OpStep.RepalcementActions) {
            Write-Verbose "Replacing '$($Action.key)' with '$($Action.value)' in $FilePath"
            $NewContent = $NewContent -replace $Action.key, $Action.value
        }
        
        $ModifiedLines = @()
        if ($WhatIfPreference) {
            $OriginalLines = $OriginalContent -split "`n"
            $NewLines = $NewContent -split "`n"
            for ($i = 0; $i -lt $OriginalLines.Count; $i++) {
                if ($OriginalLines[$i] -ne $NewLines[$i]) {
                    $ModifiedLines += "Line $($i + 1):`n  Original: $($OriginalLines[$i])`n  New     : $($NewLines[$i])"
                }
            }
        }

        if ($PSCmdlet.ShouldProcess("Replacing content of $FilePath with:`n" + ($ModifiedLines -join "`n"), $FilePath, "Update content")) {
            Set-Content -Path $FilePath -Value $NewContent
            
        }
    }
    else {
        Write-Error "File not found: $FilePath"
    }
}
$VscodeDir = Join-Path -Path $PSScriptRoot -ChildPath ".vscode"
if (-not (Test-Path -Path $VscodeDir)) {
    if ($PSCmdlet.ShouldProcess($VscodeDir, "Create .vscode directory")) {
        Write-Information "Creating .vscode directory at $VscodeDir"
        New-Item -Path $VscodeDir -ItemType Directory | Out-Null
    }
}
$LaunchConfigPath = Join-Path -Path $PSScriptRoot -ChildPath ".vscode/launch.json"
if ($PSCmdlet.ShouldProcess($LaunchConfigPath, "Create default launch configuration")) {
    Write-Information "Creating default launch configuration at $LaunchConfigPath"
    $LaunchContent = `
        @"
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "msedge",
            "request": "launch",
            "name": "Launch FoundryVTT",
            "url": "http://localhost:30000/",
            "pathMapping": {
                "/modules/$Id": "`${workspaceFolder}/dist",
                "/modules/": "`${workspaceFolder}/foundry/modules",
                "/": "`${workspaceFolder}/foundry/app/public"
            }
        }
    ]
}
"@
    Set-Content -Path $LaunchConfigPath -Value $LaunchContent
}

$TaskConfigPath = Join-Path -Path $PSScriptRoot -ChildPath ".vscode/tasks.json"
if ($PSCmdlet.ShouldProcess($TaskConfigPath, "Create default task configuration")) {
    Write-Information "Creating default task configuration at $TaskConfigPath"
    $TaskContent = `
        @"
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "npm",
            "script": "build",
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "problemMatcher": [],
            "label": "npm: build",
            "detail": "tsc && vite build"
        }
    ]
}
"@
    Set-Content -Path $TaskConfigPath -Value $TaskContent
}

$TaskConfigPath = Join-Path -Path $PSScriptRoot -ChildPath ".vscode/settings.json"
if ($PSCmdlet.ShouldProcess($TaskConfigPath, "Create default settings configuration")) {
    Write-Information "Creating default settings configuration at $TaskConfigPath"
    $TaskContent = `
        @"
{
    "npm.packageManager": "npm"
}
"@
    Set-Content -Path $TaskConfigPath -Value $TaskContent
}


if (-not $WhatIfPreference) {
    Write-Information "You can now delete this script (Setup-Repo.ps1)" -InformationAction Continue
}
