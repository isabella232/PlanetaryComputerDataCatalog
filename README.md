# Digital Earth Pacific Data Viewer

Digital Earth Pacific Data Viewer is built based upon [Microsoft's Planetary Computer Data Catalog](https://github.com/microsoft/PlanetaryComputerDataCatalog). Currently, (Dec 2021) DEP Data Viewer only uses [Explorer part](https://planetarycomputer.microsoft.com/explore) of Planetary Computer Data Catalog front-end app. This fork has a few customized features such as 

- ability to compare the dataset from a different point of time side by side with [slider](https://docs.microsoft.com/en-us/samples/azure-samples/azure-maps-swipe-map/azure-maps-swipe-map-module/)
- customization for Digital Earth Pacific (Showing Pacific islands area as area of interest, Adding DEP dataset to collection list)

Major parts of the documentation below is also from Microsoft Planetary Computer Data Catalog repo. 
## Requirements

- Node v14.15 (LTS)
- Yarn
- Docker
- docker-compose

## Getting started

The easiest way to ensure your node environment matches the requirements is to use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating), and in the project root, run:

```sh
nvm use
```

You can install `yarn` globally for that node version with:

```sh
npm install -g yarn
```

Now install the app dependencies and build the docs and external notebooks for the project:

```sh
./scripts/update

```

Now you can start the development server, and the site should be accessible at <http://localhost:3000>.

```sh
./scripts/server
```

To build the latest docs or external notebook, or if any new dependencies have been added, re-run `./scripts/update` (you may need to refresh the app in your browser if the site was running).

### Developing

There are four main components to the application:

1. [etl](etl/README.md) - downloads and processes external files to be included in the application build
2. [docs](docs/README.md) - a [sphinx](https://www.sphinx-doc.org/en/master/)-powered, markdown based documentation system
3. [api](api/README.md) - an Azure Function app that provides a lightweight backend
4. src - the main React application, bootstrapped from [Create React App](https://create-react-app.dev/)

#### Frontend development

First, copy `.env.sample` file to `.env`, and ensure the configuration values are set.

| Name | Value | Description |
|---|---|---|
`REACT_APP_API_ROOT`| <https://planetarycomputer-staging.microsoft.com> | The root URL for the PCE, either prod, staging or a local instance.
|`REACT_APP_AZMAPS_KEY`| Retrieve from Azure Portal| The key used to authenticate the Azure Maps inset map on a dataset detail page.
|`REACT_APP_HUB_URL`| Optional. URL to root Hub instance | Used to enable a request to launch the Hub with a specific git hosted file.|
|`REACT_APP_ONEDS_TENANT_KEY`| Lookup at <https://1dswhitelisting.azurewebsites.net/> | Telemetry key (not needed for dev)

Run `./scripts/server` to launch a development server.

#### Developing against local STAC assets

The `REACT_APP_API_ROOT` can be set to a local instance of the Metadata API if you are
prototyping changes to collections. However, as a shortcut, you can also run the
`./scripts/mockstac` script in order to locally serve a static json file from
`/mockstac/collections`. Simply alter the contents of the JSON file as you need,
and set your `REACT_APP_API_ROOT` value to `http://localhost:8866` and restart
your dev server.

#### Feature flags

A simple feature flag system is included in the application. To add a flagged feature during development:

1. Wrap the component to be shown or hidden with a `Feature` component, providing a `name`.
2. In `/utils/featureFlags.js` add an object to the list with `name`, `description`, and `active` (`bool`)
3. Use the script in `/extra/ff-bookmarklet.js` to toggle features on a running site
   1. Use a JS minifier like <https://javascript-minifier.com/> to minimize the file
   2. Add a new bookmark, and paste the minified JS as the URL. You'll likely need add the `javascript:` label back to the front of the screen.
4. Toggle feature flags on or off. Be sure that the site works in both states.
5. Remove the `Feature` component and the flag entry when the feature is mature enough to be included.

#### API development

To debug or extend the small API backend, please read the [API README](api/README.md).

#### Testing and linting

The project contains cypress end-to-end tests and jest based unit tests.

To run jest based unit test and perform linting, run `./scripts/test`.

##### Cypress

If you're on WSL2, be sure to set up your system to run the Cypress GUI:
<https://wilcovanes.ch/articles/setting-up-the-cypress-gui-in-wsl2-ubuntu-for-windows-10/>

- Install Google Chrome in your WSL2 environment (Cypress ships with a chromium-based electron browser)
- Run `yarn cypress:open` to run the GUI and debug tests, or
- Run `yarn cypress:run` to run the headless version in the terminal

Both test suites are run from CI.

## Ports

| Service                  | Port |
|--------------------------|------|
| Webpack Dev Server       | 3000 |
| Functions App Dev Server | 7071 |
| Mock STAC API Server     | 8866 |

## Scripts

| Name       | Description                                                                                                    |
|------------|----------------------------------------------------------------------------------------------------------------|
| `clean`    | Removes intermediate build files from docs and dataset codefiles                                               |
| `mockstac` | Serves contents of `/mockstac/collections` at http://localhost:8866                                            |
| `server`   | Runs frontend development server                                                                               |
| `test`     | Runs unit tests and linter                                                                                     |
| `update`   | Install dependencies and build etl and docs content. Use `--devdocs` to develop against a local notebook repo. |
| `yarn *`   | Run configured `yarn` commands like `yarn add`, `yarn lint`, `yarn test`, etc                                  |

## Deploying

Any change on `develop` branch will trigger [GitHub Action](https://github.com/developmentseed/PlanetaryComputerDataCatalog/blob/develop/.github/workflows/temporary_build.yaml) that deploys Data Viewer.
## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit <https://cla.opensource.microsoft.com>.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
