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
        FilePath           = "src/languages/en.json"
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
        FilePath           = "src/ts/apps/dogBrowser.ts"
        RepalcementActions = @(
            $UpperCaseKebabReplacement
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
            $ClassNameReplacement
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
)

foreach ($OpStep in $OperationSteps) {
    Write-Debug "Processing file: $($OpStep.FilePath) in directory: $PSScriptRoot"
    $FilePath = Join-Path -Path $PSScriptRoot -ChildPath $OpStep.FilePath
    if (Test-Path -Path $FilePath) {
        $OriginalContent = Get-Content -Path $FilePath -Raw
        $NewContent = $OriginalContent
        foreach ($Action in $OpStep.RepalcementActions) {
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

if (-not $WhatIfPreference) {
    Write-Information "You can now delete this script (Setup-Repo)" -InformationAction Continue
}
