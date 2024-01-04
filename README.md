## Deploy crawler - remote server
- last updated on 2024-01-xx

### Environment
- Ubuntu 22.04
- CPU:2 Core / RAM:4GB

### Step
- setup compilation environment
  - Git
- connect to remote server, open terminal:  
  - ssh [user_name]@[IP_address]
  - [password]
- create directory under root using sudo
  - sudo mkdir /workspace
-  change owner's of /workspace to ${user}
   - sudo chown -R ${user} /workspace
- go to workspace
  - cd /workspace
- clone repo from gitHub
  - git clone https://github.com/CAFECA-IO/BAIFA-web-crawling.git
- go to BAIFA-web-crawling
  - cd BAIFA-web-crawling
- install package
  - npm install
- set database url
  - nano ~/.bash_profile
- in nano, input below and update:[name]、[password]、[host]、[database_name]
  - export DATABASE_URL="postgresql://[name]:[password]@[host]:5432/[database_name]"
  - Ctrl + O > Enter > Ctrl + X
- in terminal, apply the bash_profile
  - source ~/.bash_profile
- push the schema into the remote server
  - npx prisma db push --schema=./prisma/schema.prisma 
- use pm2 to run the crawler
  - pm2 start npm --name BAIFA-CRAWLER -- start
- (if needed) terminate the pm2 process
  - pm2 kill
- (if needed) continuously observe the process log
  - pm2 log 0 
  - ctrl + C to exit