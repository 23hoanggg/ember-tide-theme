#Requires -Version 7.0
<#
.SYNOPSIS
    Backs up a folder to a zip archive.
.PARAMETER Source
    The folder to back up.
.EXAMPLE
    ./Backup.ps1 -Source C:\Projects -Keep 5
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory)]
    [ValidateScript({ Test-Path $_ -PathType Container })]
    [string] $Source,

    [string] $Destination = "$env:USERPROFILE\Backups",
    [ValidateRange(1, 100)]
    [int] $Keep = 7,
    [switch] $Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$MaxSize = 2GB
$Flags = 0x1F

enum BackupState { Pending; Running; Done }

class BackupJob {
    [string] $Path
    [BackupState] $State = [BackupState]::Pending
    hidden [datetime] $Started

    BackupJob([string] $path) { $this.Path = $path }

    [string] ToString() { return "Job($($this.Path), $($this.State))" }
}

function Remove-OldBackups {
    param([string] $Folder, [int] $Count)
    Get-ChildItem -Path $Folder -Filter '*.zip' |
        Sort-Object LastWriteTime -Descending |
        Select-Object -Skip $Count |
        ForEach-Object { Remove-Item $_.FullName -WhatIf:$WhatIfPreference }
}

$job = [BackupJob]::new($Source)
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$target = Join-Path $Destination "backup-$stamp.zip"

try {
    if (-not (Test-Path $Destination)) { New-Item -ItemType Directory -Path $Destination | Out-Null }
    $size = (Get-ChildItem $Source -Recurse | Measure-Object Length -Sum).Sum
    if ($size -gt $MaxSize -and -not $Force) {
        throw "Source is too large: $([math]::Round($size / 1MB, 2)) MB`n"
    }
    if ($PSCmdlet.ShouldProcess($target, 'Compress')) {
        Compress-Archive -Path "$Source\*" -DestinationPath $target -Force:$Force
        $job.State = [BackupState]::Done
    }
    Remove-OldBackups -Folder $Destination -Count $Keep
}
catch [System.IO.IOException] {
    Write-Error "I/O failure: $_"
}
finally {
    Write-Host "$job finished" -ForegroundColor Green
}
$result = @{ Path = $target; Ok = $true; Count = $null; Hex = $Flags -band 0xF }
