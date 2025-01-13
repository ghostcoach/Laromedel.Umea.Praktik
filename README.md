# LaromedelUmea

## Adding a New Project

> Tip! The script New-Project.ps1 can be used to automate the process of adding a new project.

### Step 1: Generate a New Project

1. **Create a new project**:
   Run the following command to generate a new application within the workspace:

   ```bash
   ng generate application <project-name>
   ```

2. **Move `styles.scss` to a separate folder**:
   Move `styles.scss` to `src/styles/styles.scss`:

   ```powershell
   mv projects/<project-name>/src/styles.scss projects/<project-name>/src/styles/styles.scss
   ```

3. **Update `angular.json`** with the new path to `styles.scss`:
   Update the `styles` array in `angular.json` to include the new path:

    ```json
    "styles": [
      "projects/<project-name>/src/styles/styles.scss"
    ],
    ```

### Step 2: Configure Project Settings

1. **Add shared styles**:
   In `angular.json`, under the build options for the project, add a path to the shared styles:

   ```json
   "stylePreprocessorOptions": {
     "includePaths": [
       "shared/styles/"
     ]
   },
   ```

2. **Add ESLint configuration**:
   In `angular.json`, under the lint options for the project, add the following configuration:

   ```json
   "lint": {
     "builder": "@angular-eslint/builder:lint",
     "options": {
       "lintFilePatterns": [
         "projects/<project-name>/**/*.ts",
         "projects/<project-name>/**/*.html"
       ]
     }
   }
   ```

3. **Add UI-components assets globally**:
   To include `ui-components` assets globally, update the `assets` array in `angular.json`:

   ```json
   "assets": [
     {
       "glob": "**/*",
       "input": "dist/ui-components/src/assets",
       "output": "/assets/"
     }
   ]
   ```

4. **Include `web.config` in assets**:
   Copy `/shared/templates/web-template.config` as `web.config` to `/projects/<project-name>/src/`:

   ```powershell
   cp shared/templates/web-template.config projects/<project-name>/src/web.config
   ```

   Then update the `assets` array in `angular.json`:

   ```json
   "assets": [
     {
       "glob": "web.config",
       "input": "projects/<project-name>/src",
       "output": "/"
     }
   ]
   ```

### Step 3: Configure Template Files

1. **Copy YAML templates**:
   Copy `/shared/templates/assets-template.yml` as `assets.yml` and `/shared/templates/frontend-template.yml` as
   `frontend.yml`:

   ```powershell
   cp shared/templates/assets-template.yml projects/<project-name>/assets.yml
   cp shared/templates/frontend-template.yml projects/<project-name>/frontend.yml
   ```

2. **Replace placeholders in YAML files**:
   Replace `app-name` with `<project-name>` (lowercase) in `assets.yml` and `frontend.yml`:

   ```powershell
   (Get-Content projects/<project-name>/assets.yml) -replace '[app-name]', '<project-name>' | Set-Content projects/<project-name>/assets.yml
   (Get-Content projects/<project-name>/frontend.yml) -replace '[app-name]', '<project-name>' | Set-Content projects/<project-name>/frontend.yml
   ```

   Replace `[AppName]` with `ProjectName` (CamelCase) in `assets.yml` and `frontend.yml`:

   ```powershell
   (Get-Content projects/<project-name>/assets.yml) -replace '[AppName]', 'ProjectName' | Set-Content projects/<project-name>/assets.yml
   (Get-Content projects/<project-name>/frontend.yml) -replace '[AppName]', 'ProjectName' | Set-Content projects/<project-name>/frontend.yml
   ```

### Step 4: Standard Component Setup

1. **Replace app component templates**:
   Replace `app.component.html` and `app.component.ts` with templates from `shared/templates`:

   ```powershell
   cp shared/templates/app.component-template.html projects/<project-name>/src/app/app.component.html
   cp shared/templates/app.component-template.ts projects/<project-name>/src/app/app.component.ts
   ```

2. **Delete SCSS file**:
   Delete the `app.component.scss` file:

   ```powershell
   rm projects/<project-name>/src/app/app.component.scss
   ```

3. **Replace index.html**:
   Replace `index.html` with a template from `shared/templates`:

   ```powershell
   cp shared/templates/index-template.html projects/<project-name>/src/index.html
   ```

4. **Replace display name**:
   Replace `[AppDisplayName]` with `ProjectDisplayName` in `index.html`:

   ```powershell
   (Get-Content projects/<project-name>/src/index.html) -replace '[AppDisplayName]', 'ProjectDisplayName' | Set-Content projects/<project-name>/src/index.html
   ```

5. **Copy home-location folder from shared/templates/home to project**:

   ```powershell
    cp -r shared/templates/home projects/<project-name>/src/app/home
   ```

6. **Replace routing and config files**:
   Replace `app.routes.ts` and `app.config.ts` with templates:

   ```powershell
   cp shared/templates/app.routes-template.ts projects/<project-name>/src/app/app.routes.ts
   cp shared/templates/app.config-template.ts projects/<project-name>/src/app/app.config.ts
   ```

### Checklist

- [ ] Add `@UntilDestroy` decorator to all components
- [ ] Set `changeDetection: ChangeDetectionStrategy.OnPush` for all components
- [ ] No selector for location components
