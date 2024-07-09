# BAIFA Web Crawler Setup Guide
This guide will walk you through the steps to set up the BAIFA web crawler on a remote server.

### Deploy crawler - remote server
- last updated on 2024-07-09

### Environment
- Ubuntu 22.04
- CPU: 2 Core / RAM: 4GB

## Steps
Here are the main steps to set up the compilation environment and run the crawler:

1. Set up the environment

2. Clone the repository and configure files

3. Install dependencies and set up the database

4. Run the crawler using PM2

-----
###  Set up the compilation environment
- Install Git

### Connect to the remote server and open the terminal
- Use the following command to connect to the remote server:
  ```
  ssh [user_name]@[IP_address]
  ```
- Enter the password

### Create a directory under root using sudo
- Use the following command to create the `/workspace` directory:
  ```
  sudo mkdir /workspace
  ```

### Change the owner of `/workspace` to ${user}
- Use the following command to change the owner of `/workspace` to the current user:
  ```
  sudo chown -R ${user} /workspace
  ```

### Go to the workspace directory
- Use the following command to navigate to the `/workspace` directory:
  ```
  cd /workspace
  ```

### Clone the repository from GitHub
- Use the following command to clone the BAIFA web crawler repository from GitHub:
  ```
  git clone https://github.com/CAFECA-IO/BAIFA-web-crawling.git
  ```

### Go to the BAIFA-web-crawling directory
- Use the following command to navigate to the `BAIFA-web-crawling` directory:
  ```
  cd BAIFA-web-crawling
  ```

### Set up the .env file
- Use the following command to list all files in the directory:
  ```
  ls -al
  ```
- Use the following command to copy the `.env.sample` file to `.env`:
  ```
  cp .env.sample .env
  ```
- Use the following command to edit the `.env` file:
  ```
  vi .env
  ```
- Press `i` to enter edit mode
  - Update the database URL:
    ```
    DATABASE_URL="postgresql://[name]:[password]@[host]:5432/[database_name]"
    ```
  - Update chain info, default setting is "iSunCoin" chain
    ```
    CHAIN_ID=[chain number, type: number]
    CHAIN_NAME="[chain name, type: string]"
    SYMBOL="[chain symbol, type: string]"
    DECIMAL=[chain decimal, type: number]
    RPC="[chain rpc url, type: string]"
    ```
- Press `Esc` to exit edit mode
- Type `:wq` and press `Enter` to save and exit

### Install packages
- Use the following command to install the required packages:
  ```
  npm install
  ```

### Push the database schema to the remote server
- Use the following command to push the database schema to the remote server:
  ```
  npx prisma db push --schema=./prisma/schema.prisma
  ```

### Install PM2 
- Use the following command to install PM2:
  ```
  npm install pm2 -g
  ```

### Use pm2 to run the crawler
- Use the following command to run the crawler using pm2:
  ```
  pm2 start npm --name BAIFA-CRAWLER -- start
  ```
- Use the following command to list all pm2 process
  ```
  pm2 ls
  ```

### (If needed) Terminate the pm2 process
- Use the following command to terminate the pm2 process:
  ```
  pm2 kill
  ```

### (If needed) Continuously observe the process log
- Use the following command to continuously observe the process log:
  ```
  pm2 log 0
  ```
- Press `Ctrl + C` to exit log observation

