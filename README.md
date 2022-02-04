## Quick start

### Using yarn/npm

1. Install all dependencies with: `yarn install`.

2. Start the app in development mode by running: `yarn start`.

3. http://localhost:3000 should launch on your browser. Changes will be instantly reflected when working in development mode and automatically compiled when building in the production environment.

4. When generating production files, change the `homepage` value from the `package.json` to directory that the app will be hosted on.


## Putting it on Expresia

1. Builds the app for production with `yarn build`.

2. Move files in `build` folder to `/xpr/web/` folder.

3. *Temporary workaround until XPR supports rendering files with multiple dots* - Rename css/js/svg, remove all dots in filename and update index.hbs file if necessary.

4. Navigate to backend `GIT Bundles` and hit `Clone` on your bundle.


## Documentation

Visit `https://www.expresia.com/resources/getting-started/development/my-business-integration/`