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
npx nx show project apps/<app-name>
```

```sh
npx nx g @nx/next:app apps/<app-name>

# Create next app without app router and src directory
✔ What unit test runner should be used? · none
✔ Which E2E test runner would you like to use? · none
✔ Would you like to use the App Router (recommended)? (Y/n) · false
✔ Would you like to use `src/` directory? (Y/n) · false
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib <lib-name>
```
