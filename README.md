# fluent-ip-blacklist



## Initial setup
- Create Repo
- Clone Repo
- `npm init --y`
- tsc --init`
- `npm i -D concurrently nodemon @types/node`
- create build and src directories
  - Update out dir and root dir in tsconfig.json to be build and src
- setup start scripts in package.json
```
    "scripts": {
        "start:build": "tsc -w",
        "start:run": "nodemon build/index.js",
        "start": "concurrently npm:start:*"
    },
```
- add .prettierrc
- Add `index.ts` file to src directory (with a simple console.log('hi'))
- `npm run start` to ensure setup is correct