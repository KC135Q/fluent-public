# fluent-ip-blacklist

- some docs would be nice

# Deployment

- packer init fluent.pkr.hcl
- packer validate fluent.pkr.hcl
- packer build fluent.pkr.hcl
- (Check the AMI) -- ami-033bf633d41bf098a
- terraform init
- terraform validate
- terraform plan
- terraform apply

- SSH into EC2, use ec2-user , not root

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
