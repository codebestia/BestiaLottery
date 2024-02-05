import { MdAccountBalance } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState, useContext, useEffect } from "react";
import contract, {web3} from "../../contractInteractor";
import { ConnectionContext } from "../../context/ConnectionContext";
import abi from "../../abi.json"
import Button from "../../components/Button";
import Input from "../../components/Input";
import "./admin.css";
import { message, Spin } from "antd";
import { FaCopy } from "react-icons/fa6";
import { GiPodiumWinner } from "react-icons/gi";


const Admin = () => {
    const [contractBalance, setContractBalance] = useState(0);
    const [lotteryState, setLotteryState] = useState(1);
    const [recentWinner, setRecentWinner] = useState("");
    //Input Variable
    const [entryFee, setEntryFee] = useState("");
    const [reward, setReward] = useState("");
    const [fundAmount, setFundAmount] = useState("");
    const [withdrawalAmount, setWithdrawalAmount] = useState("");
    const connectionContext = useContext(ConnectionContext);
    const [pageLoading,setPageLoading] = useState(true);
    const gasPrice = 2100000;
    const gasLimit = 3000000;
    
    const sliceAddress = (address)=>{
        return address.slice(0,5)+"....."+address.slice(37,42);
    }
    const copyContract=()=>{
        navigator.clipboard.writeText(abi.contract).then(()=>{
            message.success("Contract Address Copied");
        })
    }
    const getContractBalance = async ()=>{
        const balance = await web3.eth.getBalance(abi.contract);
        const balanceInEther = web3.utils.fromWei(balance,'ether');
        setContractBalance(parseFloat(balanceInEther));
    }
    const methodsCall = async ()=>{
        setPageLoading(true);
        const lotteryState = await contract.methods.getLotteryState().call();
        const recentWinner = await contract.methods.recentWinner().call();
        setLotteryState(lotteryState);
        setRecentWinner(recentWinner);
        setPageLoading(false);
    }
    const startLottery = async ()=>{
        if(!entryFee || !reward){
            message.error("Reward and entry fee value must be specified");
            return
        }
        if(entryFee <= 0 || reward <= 0){
            message.error("Reward and entry fee must be greater than 0");
            return 
        }
        let entryFeeWei = web3.utils.toWei(entryFee,"ether");
        let rewardWei = web3.utils.toWei(reward,"ether");
        try{
            message.loading({
                content:"Transaction Processing",
                key:"updatable",
                duration: 10
            });
            await connectionContext.walletContract.methods.startLottery(parseFloat(rewardWei),parseFloat(entryFeeWei)).send({
                from: connectionContext.connectionAddress,
                gasPrice:gasPrice,
                gas: gasLimit
            });
            message.success({
                content:"Lottery has started",
                key:"updatable",
                duration: 1
            });
            setEntryFee("");
            setReward("");
            methodsCall();
        }catch(e){
            console.log(e)
            message.error("Error occured with transaction")
        }
    }
    const endLottery = async ()=>{
        try{
            message.loading({
            content:"Transaction Processing",
            key:"updatable",
            duration: 10
        });
            let nonce = await connectionContext.web3.eth.getBlockTransactionCount();
            console.log("nonce",nonce)
            await connectionContext.walletContract.methods.endLottery(nonce).send({
                from: connectionContext.connectionAddress,
                gasPrice:gasPrice,
                gas: gasLimit
            });
            message.success({
                content:"Lottery has ended",
                key:"updatable",
                duration: 1
            });
            methodsCall();
            window.location.reload();
        }catch(e){
            console.log(e);
            message.error("Error occured with transaction")
        }
        

    }
    const fundContract = async ()=>{
        if(!fundAmount){
            message.error("fund amount value must be specified");
            return
        }
        if(fundAmount <= 0){
            message.error("fund amount must be greater than 0");
            return 
        }
        try{
            message.loading({
                content:"Transaction Processing",
                key:"updatable",
                duration: 10
            });
            await connectionContext.walletContract.methods.fundContract().send({
                value: web3.utils.toWei(fundAmount,'ether'),
                from: connectionContext.connectionAddress,
                gasPrice:gasPrice,
                gas: gasLimit
            });
            message.success({
                content:"Contract funded successfully",
                key:"updatable",
                duration: 1
            });
            setFundAmount("");
            getContractBalance();
        }catch(e){
            message.error({
                content:"Error occurred wit transaction",
                key:"updatable",
                duration: 1
            })
        }
    }

    const contractWithdrawal = async ()=>{
        if(!withdrawalAmount){
            message.error("withdrawal amount value must be specified");
            return
        }
        if(withdrawalAmount <= 0){
            message.error("withdrawal amount must be greater than 0");
            return 
        }
        try{
            message.loading({
                content:"Transaction Processing",
                key:"updatable",
                duration: 10
            });
            await connectionContext.walletContract.methods.withdrawFromContract(web3.utils.toWei(withdrawalAmount,'ether')).send({
                from: connectionContext.connectionAddress,
                gasPrice:gasPrice,
                gas: gasLimit
            });
            message.success({
                content:"Withdrawal successful",
                key:"updatable",
                duration: 1
            });
            setWithdrawalAmount("");
            getContractBalance();
        }catch(e){
            message.error({
                content:"Error ocurred during transaction",
                key:"updatable",
                duration: 1
            })
        }
    }
    useEffect(()=>{
        getContractBalance();
        methodsCall();
    },[])
    return ( 
    <div className="container">
    <div className="metrics" >
        <div style={{width: "50%"}}>
            <div className="activity-block success">
            <div className="media">
                <div className="media-body">
                    <h2 className="font-weight-bold"><span className="">{contractBalance}</span> eth</h2>
                    <p>Contract Balance</p>
                </div>
                <span ><MdAccountBalance /></span>
            </div>
            <div className="row">
                <div className="progress ">
                <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ><span className="trackerball"></span></div>
                </div>
            </div>
            <span className="bg-icon"><MdAccountBalance /></span>
            </div>
        </div>
        <div style={{width: "50%"}}>
        <div className="activity-block success">
            <div className="media">
                <div className="media-body">
                <h2 className="font-weight-bold"><span className="mobile-text">{sliceAddress(abi.contract)}</span>&nbsp;<span className="copy-button" onClick={copyContract}><FaCopy  size={15} /></span></h2>
                <p>Contract Address</p>
                </div>
                <span><FaMapMarkerAlt /></span>
            </div>
            <div className="row">
                <div className="progress ">
                <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ><span className="trackerball"></span></div>
                </div>
            </div>
            <span className="bg-icon"><FaMapMarkerAlt /></span>
        </div>
        </div>
        <div style={{width: "50%"}}>
        <div className="activity-block success">
            <div className="media">
                <div className="media-body">
                <h2 className="font-weight-bold"><span className="mobile-text">{sliceAddress(recentWinner)}</span></h2>
                <p>Recent Winner</p>
                </div>
                <span><GiPodiumWinner /></span>
            </div>
            <div className="row">
                <div className="progress ">
                <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ><span className="trackerball"></span></div>
                </div>
            </div>
            <span className="bg-icon"><GiPodiumWinner /></span>
        </div>
        </div>
    </div>
    <div className="content-body">
        <div className="flex-center">
            <div className="form-box">
                <div className="form-group">
                    {pageLoading ? (
                    <div className="flex-center" style={{padding:10}}>
                        <Spin />
                    </div>):(
                        <>
                            {lotteryState == 1?(
                        <>
                            <div className="side-form-group">
                        <div>
                            <Input value={entryFee} onChange={(e)=>setEntryFee(e.target.value)} type="number" label="Entry Fee (eth)" placeholder="e.g 0.01" />
                        </div>
                            <div>
                                <Input value={reward} onChange={(e)=>setReward(e.target.value)} type="number" label="Reward (eth)" placeholder="e.g 1" />
                            </div>
                        </div>
                        <div className="flex-center">
                            <Button onClick={()=>startLottery()}>Start Lottery</Button>
                        </div>
                        </>
                    ):(
                        <div className="flex-center">
                            <Button onClick={()=>endLottery()}>End Lottery</Button>
                        </div>
                    )}
                        </>
                    )}
                </div>
                <div className="form-group flex" style={{alignItems:"flex-end"}}>
                    <div style={{flex:1}}>
                        <Input value={fundAmount} onChange={(e)=>setFundAmount(e.target.value)} type="number" label='Fund Amount (eth)' placeholder="e.g 2" />
                    </div>
                    <div><Button onClick={()=>fundContract()}>Fund Contract</Button></div>
                </div>
                <div className="form-group flex" style={{alignItems:"flex-end"}}>
                    <div style={{flex:1}}>
                        <Input value={withdrawalAmount} onChange={(e)=>setWithdrawalAmount(e.target.value)} type="number" label='Withdrawal Amount (eth)' placeholder="e.g 2" />
                    </div>
                    <div><Button onClick={()=>contractWithdrawal()}>Contract Withdrawal</Button></div>
                </div>
            </div>
        </div>
    </div>
</div> );
}
 
export default Admin;