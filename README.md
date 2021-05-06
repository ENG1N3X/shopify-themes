# Commands

| Task | Description |
| - | - |
| start | run `dev`, `reloader` and `shopify:watch` tasks simultaneously in parallel |
| dev | bundle and watch for changes in `src/` files with webpack |
| build | create minified production files for Shopify in `shopify/assets/` directory |
| reloader | run an HTTP server and WebSocket server for remote auto-reloading |
| lint | run `lint:js` and `lint:css` tasks in sequence |
| lint:js | lint `.js` and `.vue` files inside the `src/` directory |
| lint:css | lint the `<style></style>` section of `.vue` files, `.css`, `.sass` and `.scss` files inside the `src/` directory |
| shopify:watch | watch for changes in the `shopify/` directory and upload to the dev store |
| shopify:init | initialize a theme on remote Shopify store and create a Shopify config file for the specified environment (Run in the root directory of your project) |
| shopify:themes | list all themes with IDs from the provided store. Takes two arguments `--password` and `--store` |
| deploy:dev | upload the `shopify/` directory to the dev store |
| deploy:live | upload the `shopify/` directory to the live store |
| settings:dev | download `settings_data.json` from the dev store |
| settings:live | download `settings_data.json` from the live store |
| open:dev | open/preview theme on the dev store |
| open:live | open/preview theme on the live store |

## Deploying
> first, make sure the configuration for the `live` environment is initialized.

```sh
$ npm run build # bundle js, css and other assets like images/fonts with webpack
$ npm run deploy:live # deploy shopify/ directory
```

> There is a safety mechanism in place, which won't allow you to deploy to an already published theme on the **live** store. If you want to deploy regardless use the `--allow-live` flag.

```sh
$ npm run deploy:live -- --allow-live
```

> By default, the deploy task overrides all files on the remote store, if any changes were made through the Shopify theme editor you might want to download the `settings_data.json` file before deploying:

```sh
$ npm run settings:live
```

### Development with a team
The `shopify:init` task always creates a new theme with a unique ID for the provided store. Sometimes it can be useful to connect to an existing initialized theme (e.g. when multiple people deploy to the same live environment).

1. Run the following command to list all themes from the provided store and write down the ID for the theme in question:

```sh
$ npm run shopify:themes -- --password [your-api-password] --store [your-store.myshopify.com]
```

2. Copy and rename the Shopify sample config file:

```sh
$ cp .config/shopify/shopify.sample.yml .config/shopify/shopify.live.yml # or copy and rename manually
```

### Template contains
```bash
- src/css/**/*.scss
- src/js/**/*.js
- src/vue/**/*.vue
- assets/bundle.js.liquid
- layout/404.liquid
- section/page-contact-template.liquid
- section/product-recommendations.liquid
- section/404-template.liquid
- section/search-template.liquid
- templates/cart.ajax.liquid & snippets/cart-snippet.liquid
- snippets/styles-snippet.liquid
- snippets/scripts-snippet.liquid
- snippets/fonts-snippet.liquid
- snippets/pagination-snippet.liquid
- snippets/product-snippet.liquid
- snippets/product-schema-snippet.liquid
- snippets/article-snippet.liquid
- snippets/breadcrumbs-snippet.liquid
- snippets/collection-filters-snippet.liquid
```