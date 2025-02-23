# HoneypotFrontend

## Create next app workspace

```sh
npx create-nx-workspace@latest --preset=next
```

## Run tasks

To run the dev server for your app, use:

```sh
npx nx dev <app-name>
```

To create a production bundle:

```sh
npx nx build <app-name>
```

To see all available targets to run for a project, run:

```sh
npx nx show project <app-name>
```

```sh
npx nx g @nx/next:app <app-name>
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib <lib-name>
```
