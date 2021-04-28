# fluent-ip-blacklist

- How I [approached this challenge?](./docs/approach.md)
  - Use the link above to view my notes on how I approached this challenge

# Getting started (Locally)
- Download and unzip or clone the repo to your local computer
- Ensure you have the latest version of [NodeJS](https://nodejs.org/en/download/)
- The following commands are completed from the __terminal__ in the root directory of the application unless otherwise stated
- `npm i`
- `npm run start`
- Once you have seen a few thousand lines of IP addresses added followed by the following:
  ```
  [start:run] Quickly sorting 224,0,0,0,3
  [start:run] Add 
  [start:run] Adding 
  [start:run] ...
  ```, then you are ready to test the api from the address bar (or Postman/Insomnia if you prefer)
- Now switch to your __browser__ while keeping your terminal available (with application running)
  > __NOTE__ The IP addresses used in these directions may change by the time you use them. Please refer to the
  > originating GitHub file or view the terminal output for current IP listings :smile:
- Select an IP address that was added to the list (visible in terminal) and add it to the api call:
  - `localhost:8080/api/v1/ip/blocked?ipAddress=224.0.0.1`
- You should get a response of `{blocked: true}` which means it shouldn't be allowed through
- Now change it to one not listed such as `http://localhost:8080/api/v1/ip/blocked?ipAddress=223.255.255.12`

- Want to mess around a bit? There are two other GET routes that could be fun (make sure you can see the terminal):
  - `http://localhost:8080/walk`
  - `http://localhost:8080/test`  

# Deployment to AWS
- Using Packer with Terraform enables a high availability deployment process
- `packer init fluent.pkr.hcl`
- `packer validate fluent.pkr.hcl`
- `packer build fluent.pkr.hcl`
- (Check the AMI) -- ami-033bf633d41bf098a -- from the packer build is used in Terraform config file
- `terraform init`
- `terraform validate`
- `terraform plan`
- `terraform apply`

- SSH into EC2, use ec2-user for troubleshooting

