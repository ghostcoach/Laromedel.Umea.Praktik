# Variables
$projectName = "lar-dig-tecken"
$projectNameCamel = "LarDigTecken"
$appDisplayName = "Lär dig tecken"
$projectRoot = "projects/$projectName"
$sharedTemplates = "shared/templates"
$uiComponentsAssets = "dist/ui-components/src/assets"
$stylesPath = "projects/$projectName/src/styles/styles.scss"
$jsonPath = "angular.json"

# Step 1: Generate a New Project with SCSS
ng generate application $projectName --style=scss --ssr false

# Step 2: Ensure styles folder exists, then move styles.scss
$stylesDir = "$projectRoot/src/styles"
if (!(Test-Path -Path $stylesDir))
{
    New-Item -ItemType Directory -Path $stylesDir
}
Move-Item "$projectRoot/src/styles.scss" "$stylesDir/styles.scss"

# Copy web.config from shared templates to project src
Copy-Item "$sharedTemplates/web-template.config" "$projectRoot/src/web.config"

# Replace favicon.ico with favicon from shared templates
Copy-Item "$sharedTemplates/favicon-template.ico" "$projectRoot/public/favicon.ico" -Force


# Step 3: Modify the angular.json file directly by parsing it as JSON
$jsonContent = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Modify the specific project
if ($jsonContent.projects.$projectName)
{
    # Update styles array
    $jsonContent.projects.$projectName.architect.build.options.styles = @($stylesPath)
    $jsonContent.projects.$projectName.architect.test.options.styles = @($stylesPath)

    # Inject assets from ui-components
    $jsonContent.projects.$projectName.architect.build.options.assets += @(
        @{
            glob = "**/*"
            input = "$uiComponentsAssets"
            output = "/assets/"
        },
        "$projectRoot/src/web.config"
    )

    # Add assets [] to architect.build.configurations.development
    $jsonContent.projects.$projectName.architect.build.configurations.development = @{
        optimization = $false
        extractLicenses = $false
        sourceMap = $true
        assets = @(
            @{
                glob = "**/*"
                input = "$projectRoot/public"
                output = "/assets"
            }
        )
    }

    # Remove /public from architect.build.options.assets
    $jsonContent.projects.$projectName.architect.build.options.assets = $jsonContent.projects.$projectName.architect.build.options.assets | Where-Object { $_.input -ne "$projectRoot/public" }
}

# Save the modified angular.json
$jsonContent | ConvertTo-Json -Depth 100 | Out-File $jsonPath -Encoding UTF8

# Step 4: Copy ESLint configuration file
Copy-Item "$sharedTemplates/.eslintrc-template.json" "$projectRoot/.eslintrc.json"

# Step 5: Copy YAML templates and replace placeholders (lowercase project name)
Copy-Item "$sharedTemplates/assets-template.yml" "$projectRoot/assets.yml"
Copy-Item "$sharedTemplates/frontend-template.yml" "$projectRoot/frontend.yml"
(Get-Content "$projectRoot/assets.yml" -Encoding UTF8) -replace 'app-name', $projectName | Set-Content "$projectRoot/assets.yml" -Encoding UTF8
(Get-Content "$projectRoot/frontend.yml" -Encoding UTF8) -replace 'app-name', $projectName | Set-Content "$projectRoot/frontend.yml" -Encoding UTF8

# Step 6: Replace CamelCase placeholders in YAML files (CamelCase project name)
(Get-Content "$projectRoot/assets.yml" -Encoding UTF8) -replace 'AppName', $projectNameCamel | Set-Content "$projectRoot/assets.yml" -Encoding UTF8
(Get-Content "$projectRoot/frontend.yml" -Encoding UTF8) -replace 'AppName', $projectNameCamel | Set-Content "$projectRoot/frontend.yml" -Encoding UTF8

# Step 7: Replace app.component.html and app.component.ts
Copy-Item "$sharedTemplates/app-template.component.html" "$projectRoot/src/app/app.component.html"
Copy-Item "$sharedTemplates/app-template.component.ts" "$projectRoot/src/app/app.component.ts"

# Step 8: Delete app.component.scss and app.component.spec.ts if it exists
Remove-Item -Path "$projectRoot/src/app/app.component.scss" -ErrorAction SilentlyContinue
Remove-Item -Path "$projectRoot/src/app/app.component.spec.ts" -ErrorAction SilentlyContinue

# Step 8: Copy home folder and its contents to the new project
Copy-Item "$sharedTemplates/home" "$projectRoot/src/app" -Recurse

# Step 9: Replace index.html with template and set AppDisplayName
Copy-Item "$sharedTemplates/index-template.html" "$projectRoot/src/index.html"
$indexContent = (Get-Content "$projectRoot/src/index.html" -Raw -Encoding UTF8) -replace '\[AppDisplayName\]', $appDisplayName
[System.IO.File]::WriteAllBytes("$projectRoot/src/index.html",[System.Text.Encoding]::UTF8.GetBytes($indexContent))

# Step 10: Copy home folder and its contents to the new project if not already present
$homeDir = "$projectRoot/src/app/home"
if (!(Test-Path -Path $homeDir))
{
    Copy-Item "$sharedTemplates/home" "$projectRoot/src/app" -Recurse
}
else
{
    Write-Host "Home directory already exists; skipping copy."
}

# Step 11: Replace routing and config files
Copy-Item "$sharedTemplates/app.routes-template.ts" "$projectRoot/src/app/app.routes.ts"
Copy-Item "$sharedTemplates/app.config-template.ts" "$projectRoot/src/app/app.config.ts"

# Step 12: Ensure styles directory exists, then replace styles.scss with template
if (!(Test-Path -Path "$projectRoot/src/styles"))
{
    New-Item -ItemType Directory -Path "$projectRoot/src/styles" -Force -ErrorAction SilentlyContinue
}
Copy-Item "$sharedTemplates/styles-template.scss" "$projectRoot/src/styles/styles.scss"



# Final message
Write-Host "Project setup complete for $projectName."
Write-Host "App display name set to '$appDisplayName' in 'index.html'."
Write-Host "######## SMOKE TESTS ########"

# Smoke Test 1: Check for .eslintrc.json
if (Test-Path "$projectRoot/.eslintrc.json")
{
    Write-Host "Smoke Test 1: ESLint configuration file (.eslintrc.json) exists - PASSED"
}
else
{
    Write-Host "Smoke Test 1: ESLint configuration file (.eslintrc.json) does not exist - FAILED"
}

# Smoke Test 2: Check for Component Files
$componentPath = "$projectRoot/src/app/home"
if ((Test-Path "$componentPath/home-location.component.ts") -and (Test-Path "$componentPath/home-location.component.html") -and (Test-Path "$componentPath/home-location.component.scss"))
{
    Write-Host "Smoke Test 2: 'home-location' component files exist - PASSED"
}
else
{
    Write-Host "Smoke Test 2: 'home-location' component files are missing - FAILED"
}

# Smoke Test 4: Verify ng build
Write-Host "Smoke Test 5: Building the application..."
$buildResult = & cmd /c "ng build $projectName" | Out-String
if ($buildResult -match "Browser application bundle generation complete")
{
    Write-Host "Smoke Test 5: Application built successfully - PASSED"
}
else
{
    Write-Host "Smoke Test 5: Application build failed - FAILED"
}

Write-Host "######## END OF SMOKE TESTS ########"
# Path to angular.json
$angularJsonPath = "angular.json"

# Run Prettier on angular.json
& npx prettier --write $angularJsonPath


Write-Host "######## END OF SCRIPT ########"

# Serve the application
ng serve $projectName --open
