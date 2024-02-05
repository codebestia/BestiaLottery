import "./nav.css"
import Button from "../Button";
import { useEffect, useContext, useState } from "react";
import { ConnectionContext } from "../../context/ConnectionContext";
import { FaWallet } from "react-icons/fa6";
const Layout = ({children}) => {
    const connectionConnection = useContext(ConnectionContext);
    const connnectButtonClick = ()=>{
        if(!connectionConnection.connected){
            connectionConnection.connectWallet();
        }
    }
    const sliceAddress = (address)=>{
        return address.slice(0,5)+"....."+address.slice(37,42);
    }
    return ( 
    <div>
        <nav className="nav">
            <div>
                <h1 className="nav-header">BestiaLottery</h1>
            </div>
            <div>
                <Button icon={<FaWallet />} onClick={connnectButtonClick}>
                    {!connectionConnection.connected?(
                        "Connect Wallet"
                    ):(
                        sliceAddress(connectionConnection.connectionAddress)
                    )}
                    
                </Button>
            </div>
        </nav>
        <div className="content">
            {children}
        </div>
    </div> );
}
 
export default Layout;