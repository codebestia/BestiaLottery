import os
from brownie import Lottery
from scripts.helpers import get_account
import json


def deploy_lottery():
    account = get_account()
    lottery = Lottery.deploy({'from':account})
    abi = lottery.abi
    address = lottery.address
    print(abi)
    path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),'frontend','src')
    if os.path.exists(path):
        with open(path+"/abi.json","w") as file:
            contract_data = {
                'abi':abi,
                'contract': address
            }
            json.dump(contract_data,file)
            
    return lottery

def main():
    deploy_lottery()
