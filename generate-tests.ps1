$inputFile = "c:\Users\chait\parabank_demo\ParaBank_TestCases.txt"
$outputFile = "c:\Users\chait\parabank_demo\tests\ParaBank_AllTests.spec.ts"

if (!(Test-Path "c:\Users\chait\parabank_demo\tests")) {
    New-Item -ItemType Directory -Force -Path "c:\Users\chait\parabank_demo\tests"
}

$content = Get-Content $inputFile

$tests = @()
$currentTest = $null

foreach ($line in $content) {
    if ($line.Trim().StartsWith("TC ID")) {
        if ($null -ne $currentTest) {
            $tests += $currentTest
        }
        $currentTest = @{}
        $currentTest.id = $line.Split(":", 2)[1].Trim()
    } elseif ($null -ne $currentTest) {
        if ($line.Trim().StartsWith("Module")) {
            $currentTest.module = $line.Split(":", 2)[1].Trim()
        } elseif ($line.Trim().StartsWith("Test Case Title")) {
            $currentTest.title = $line.Split(":", 2)[1].Trim()
        } elseif ($line.Trim().StartsWith("Type")) {
            $currentTest.type = $line.Split(":", 2)[1].Trim()
        }
    }
}
if ($null -ne $currentTest) {
    $tests += $currentTest
}

Write-Host "Parsed $($tests.Count) tests."

$byModule = @{}
foreach ($test in $tests) {
    if (-not $byModule.ContainsKey($test.module)) {
        $byModule[$test.module] = @()
    }
    $byModule[$test.module] += $test
}

$outContent = @"
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import testData from '../data/testData.json';

// Execute all tests independently but within a single file execution session.
// Using default Playwright fixtures ensures tests are independent.
test.describe.configure({ mode: 'parallel' });

"@

foreach ($module in $byModule.Keys) {
    $outContent += "`ntest.describe('$module', () => {`n"
    foreach ($t in $byModule[$module]) {
        $safeTitle = $t.title.Replace("'", "\'")
        $id = $t.id
        $type = $t.type
        $outContent += @"
  test('$id - $safeTitle', async ({ page }) => {
    // TODO: Implement actual steps for $id
    // Type: $type
    expect(true).toBeTruthy();
  });

"@
    }
    $outContent += "});`n"
}

$outContent | Out-File -FilePath $outputFile -Encoding utf8
Write-Host "Generated $outputFile"
