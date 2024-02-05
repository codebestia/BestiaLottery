import Web3 from "web3";
import abi from "./abi.json"



const SEPOLIA_PROVIDER = "https://sepolia.infura.io/v3/bca84c0ea3d748b3b0d5c6023e4a3039";
const LIGHTLINK_PROVIDER = 'https://replicator.pegasus.lightlink.io/rpc/v1';


const provider = new Web3.providers.HttpProvider(SEPOLIA_PROVIDER);

export const web3 = new Web3(provider);

const contract = new web3.eth.Contract(abi.abi, abi.contract);



export default contract;

