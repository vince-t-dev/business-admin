## Quick start

### Using YARN/NPM

1. Make sure you have [Node.js](https://nodejs.org/en/) installed. Make sure the installed Node version is >= 8.10.

```
yarn install
```

2. Start the app in development mode by running the following command in terminal:

```
yarn start
```

3. Open http://localhost:3000 to view it in the browser. Any changes you make to the code will be automatically reflected in the browser.

4. If you want to generate the production files, change the `homepage` value from the `package.json` to the domain name that the app will be hosted on.


## Putting it on Expresia

```
yarn build
```

1. Move files in `build` folder to `/xpr/web/` folder.

2. *Temporary workaround until XPR supports files with hash* - Rename css/js/svg, remove all dots in filename and update index.hbs file if necessary.

3. Navigate to backend `GIT Bundles` and hit `Clone` on your bundle.


## Documentation

Coming soon.