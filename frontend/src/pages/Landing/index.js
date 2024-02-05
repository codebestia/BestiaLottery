import { useContext, useEffect, useState } from "react";
import { ConnectionContext } from "../../context/ConnectionContext";
import contract from "../../contractInteractor";
import Placeholder from "../../components/Placeholder";
import Button from "../../components/Button";
import { FaEthereum, FaArrowRightToBracket, FaUsers  } from "react-icons/fa6";
import { FaCoins } from "react-icons/fa";
import { GiPodiumWinner, GiTrophyCup  } from "react-icons/gi";
import "./landing.css"
import { message } from "antd";
import Admin from "../Admin";
import Loader from "../../components/Loader";
const Landing = () => {
    const connectionContext = useContext(ConnectionContext);
    const [isOwner, setIsOwner] = useState(false);
    const [lotteryState, setLotteryState] = useState(1);
    const [navigation, setNavigation] = useState(1);
    const [recentWinner, setRecentWinner] = useState("");
    const [players, setPlayers] = useState([]);
    const [entryFee, setEntryFee] = useState(0);
    const [reward, setReward] = useState(0);
    const [loading, setLoading] = useState(true);
    const sliceAddress = (address)=>{
        return address.slice(0,5)+"....."+address.slice(37,42);
    }
    const weiToEth = (eth)=>{
        return connectionContext.web3.utils.fromWei(eth,'ether')
    }
    const methodsCall = async ()=>{
       const lotteryState = await contract.methods.getLotteryState().call();
       const recentWinner = await contract.methods.recentWinner().call();
       const players = await contract.methods.getPunters().call();
       const entryFee = await contract.methods.entryFee().call();
       const reward = await contract.methods.lotteryPrice().call();
       setLotteryState(parseInt(lotteryState));
       setPlayers(players);
       setRecentWinner(recentWinner);
       setEntryFee(weiToEth(parseInt(entryFee)));
       setReward(weiToEth(parseInt(reward)));
       setLoading(false);
    //    console.log(parseInt(lotteryState));
    //    console.log(players);
    //    console.log(reward);
    //    console.log(entryFee);
       
    //    console.log(punters);
       
    }
    const enterLottery = ()=>{
        const enterLotteryAsync = async ()=>{
            // try{
                await connectionContext.walletContract.methods.enterLottery().send({
                'from': connectionContext.connectionAddress,
                'value': connectionContext.web3.utils.toWei(entryFee,'ether')
            })
            message.success("You have entered the lottery");
            // }catch(e){
                // message.error("An error occured");

            // }
            methodsCall();
        }
        enterLotteryAsync();
    }
    
    useEffect(()=>{

        async function effector(){
        if (connectionContext.web3){
            // let balance = await connectionContext.web3.eth.getBalance(connectionContext.connectionAddress);
            let owner = await contract.methods.owner().call();
            setIsOwner(owner == connectionContext.connectionAddress);
            methodsCall();
        } 
        }
        effector();
        
        
        
    },[connectionContext.connected])

    return (<>
    
    {connectionContext.connected?(
        
        <div>
            {loading && (<Loader />)}
            <div className="top-nav">
                <Button onClick={()=>setNavigation(1)} active={navigation == 1}>Lottery</Button>
                {isOwner && (<Button onClick={()=>setNavigation(2)} active={navigation == 2} >Admin</Button>)}
            </div>
            {
                navigation == 1 &&(
                    <div className="content">
                        <h1 className="page-header">Welcome to Bestia Lottery </h1>
                        {
                            lotteryState == 1?(
                                <>
                                <h1 className="big-header">Lottery is closed</h1>
                                {recentWinner == connectionContext.connectionAddress &&(
                                    <div className="flex-center trophy-section">
                                        <h2>Congratulations to winning the recent lottery.</h2>
                                        <div>
                                            <span>
                                                <GiTrophyCup color="gold" />
                                            </span>
                                        </div>
                                    </div>  
                                )}
                                
                                </>
                            ):(
                                <div className="container">
                                    <div className="metrics">
                                        <div>
                                            <div className="activity-block success">
                                            <div className="media">
                                                <div className="media-body">
                                                    <h2 className="font-weight-bold"><span className="">{entryFee}</span> eth</h2>
                                                    <p>Entry Fee</p>
                                                </div>
                                                <span ><FaEthereum /></span>
                                            </div>
                                            <div className="row">
                                                <div className="progress ">
                                                <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ><span className="trackerball"></span></div>
                                                </div>
                                            </div>
                                            <span className="bg-icon"><FaEthereum /></span>
                                            </div>
                                        </div>
                                        <div>
                                        <div className="activity-block success">
                                            <div className="media">
                                                <div className="media-body">
                                                <h2 className="font-weight-bold"><span className="">{reward}</span> eth</h2>
                                                <p>Lottery Price</p>
                                                </div>
                                                <span><FaCoins /></span>
                                            </div>
                                            <div className="row">
                                                <div className="progress ">
                                                <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ><span className="trackerball"></span></div>
                                                </div>
                                            </div>
                                            <span className="bg-icon"><FaCoins /></span>
                                            </div>
                                        </div>
                                        <div>
                                        <div className="activity-block success">
                                            <div className="media">
                                                <div className="media-body">
                                                <h2 className="font-weight-bold"><span className="">{players.length}</span></h2>
                                                <p>Number of Players</p>
                                                </div>
                                                <span><FaUsers /></span>
                                            </div>
                                            <div className="row">
                                                <div className="progress ">
                                                <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ><span className="trackerball"></span></div>
                                                </div>
                                            </div>
                                            <span className="bg-icon"><FaUsers /></span>
                                        </div>
                                        </div>
                                        <div>
                                        <div className="activity-block success">
                                            <div className="media">
                                                <div className="media-body">
                                                <h2 className="font-weight-bold mobile-text"><span className="">{sliceAddress(recentWinner)}</span></h2>
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
                                            {!players.includes(connectionContext.connectionAddress)?(
                                                <Button onClick={enterLottery} icon={<FaArrowRightToBracket size={20} />}><strong>Enter Lottery</strong></Button>
                                            ):(
                                                <Button active={true}><strong>You have entered the lottery</strong></Button>
                                            )}
                                            
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            }
            {
                navigation == 2 &&(
                    <Admin />
                )
            }
        </div>
    ):(
        <Placeholder />
    )}
    </> );
}
 
export default Landing;