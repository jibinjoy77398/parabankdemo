$inputFile = "c:\Users\chait\parabank_demo\tests\ParaBank_AllTests.spec.ts"
$testsDir = "c:\Users\chait\parabank_demo\tests"

$header = @"
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import testData from '../data/testData.json';

"@

$content = Get-Content $inputFile -Raw

# Extract each top-level test.describe block (module)
$pattern = "(?s)(test\.describe\('([^']+)',\s*\(\)\s*=>\s*\{)(.*?)(?=\ntest\.describe|\Z)"
$matches = [regex]::Matches($content, $pattern)

Write-Host "Found $($matches.Count) modules."

$fileMap = @{
    "Transfer Funds"   = "transferFunds.spec.ts"
    "Registration"     = "registration.spec.ts"
    "Open Account"     = "openAccount.spec.ts"
    "Account Activity" = "accountActivity.spec.ts"
    "Forgot Login"     = "forgotLogin.spec.ts"
    "UI/Navigation"    = "uiNavigation.spec.ts"
    "Request Loan"     = "requestLoan.spec.ts"
    "Update Profile"   = "updateProfile.spec.ts"
    "Bill Pay"         = "billPay.spec.ts"
    "Login"            = "login.spec.ts"
}

foreach ($match in $matches) {
    $moduleName = $match.Groups[2].Value
    $fileName = $fileMap[$moduleName]
    if (-not $fileName) {
        # sanitize name to create file name
        $fileName = ($moduleName -replace '[^a-zA-Z0-9]', '') + ".spec.ts"
    }

    $describeBlock = $match.Groups[1].Value + $match.Groups[3].Value + "`n});"

    $fileContent = $header + $describeBlock.TrimEnd()
    $outPath = Join-Path $testsDir $fileName
    $fileContent | Out-File -FilePath $outPath -Encoding utf8
    Write-Host "Created: $fileName ($moduleName)"
}

Write-Host "Done! Removing ParaBank_AllTests.spec.ts..."
Remove-Item -Path $inputFile -Force
Write-Host "Split complete."
