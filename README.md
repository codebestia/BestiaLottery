
# BestiaLottery
A simple lottery application built with react, brownie and solidity. admins start up lottery and users can enter the lottery and after admins end the lottery the system chooses the winner. this project is deployed to the sepolia blockchain. get sepolia faucets to interact with it.

## Features

- Smart Contract: The application ensures security and transparency by using smart contract for storing data and collecting contributions.
- Decentralized Lottery Entry: The Admin i.e the person that deployed the contract to the blockchain start up a lottery, funds the lottery and users can enter the lottery with eth.
- User Friendly Interface: The application is built with react and it provides an intuitive and responsive user interface for easy interaction.




## Prerequisites
- Python
- Node Js
- Brownie (python)
- Solidity
- npm/yarn

#### Note: the smart contract can be deployed with brownie if user has experience with brownie or it could be copied from the contracts/contract folder and sent to remix for deployment and then replace the content of the abi.json file in the frontend/src folder with the abi and contract in an json format and seen in the abi.json file. The main contrat to be deployed is the CrowndFundFactory.sol with the CrowdFund.sol as its dependency.
## Run Locally
### Creating a Python Virtual Environment for Brownie

**Note:** you can skip to no. 12 if you want to perform the actions specified by the previous note.

1. Choose a folder for the project
2. Open cmd or bash in the project directory
3. Create a virtual environment (make sure you have python installed and virtualenv installed as a pip package)
```bash
  virtualenv env
```
4. if you dont virtualenv installed, you can install it by running
```bash
  pip install virtualenv
```
5. Activate the virtualenv, run
```bash
  env\Scripts\activate
```
### Installation
6. Clone the project

```bash
  git clone https://github.com/codebestia/BestiaLottery.git
```

7. Go to the project directory
```bash
  cd CrowdFundUs
```

8. Install dependencies for brownie

```bash
  cd contract
  pip install -r requirements.txt
```
9. Create a .env file and add the following environment variables to the file
`PRIVATE_KEY` - your wallet account private key that will be used to deploy the project 
`
`WEB3_INFURA_PROJECT_ID` (optional) - for deploying to other chain using infura provider and your infura project id.

10. Add network (for deploying to a blockchain not in brownie networks list e.g lightlink-pegasus) (optional)
```bash
  brownie networks add lightlink-pegasus host=https://replicator.pegasus.lightlink.io/rpc/v1 chainid=1891 explorer=https://pegasus.lightlink.io/
``` 
**Note:** run the command below to see all the brownie network list
```bash
  brownie networks list
```

11. Compile the smart contract with brownie
```bash
  brownie compile
  brownie run scripts/deploy --network lightlink-pegasus
```
**Note:** if you want to deploy to other networks replace lightlink-pegasus with the name of the network. run
```bash
  brownie networks list
```
to see all available network

12. Install the dependencies for react
```bash
cd frontend # navigate into the frontend in the CrowdFundUs folder
npm install   # or yarn install
```
13. Start the react server

```bash
  npm run start
```
14. Access the application at http://localhost:3000 in your web browser.


## Usage

1. Connect your Ethereum wallet to the application.
2. Enter Lottery if the lottery is open
3. Create Lottery (for admins)
4. End and Fund Lottery for admins.


## Screenshots

Lottery Page
![Lottery Page](https://res.cloudinary.com/ds81lsf2c/image/upload/v1707124588/lottery-page1_h4dpe8.jpg)

![Lottery Page](https://res.cloudinary.com/ds81lsf2c/image/upload/v1707124589/lottery-page2_t3yv51.jpg)


Admin Page
![Admin Page](https://res.cloudinary.com/ds81lsf2c/image/upload/v1707124588/admin-page_wed3rg.jpg)


## License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

