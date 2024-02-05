// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";


contract Lottery{
    using SafeMathChainlink for uint256;
    address public owner;
    address payable[] public punters;
    address[] public players;
    uint256 public entryFee; // Entry fee is in eth - wei denomination
    uint256 public lotteryPrice; // lottery price is in eth - wei denomination

    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }
    LOTTERY_STATE public currentLotteryState;
    uint256 randomNumber;
    address payable public recentWinner;
    event RecentWinner(address winnerAddress);
    event RandomNumber(uint256 _randomNumber);
    
    constructor() public {
        owner = msg.sender;
        currentLotteryState = LOTTERY_STATE.CLOSED;

    }
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }
    function getLotteryState() public view returns(LOTTERY_STATE){
        return currentLotteryState;
    }
    function getRecentWinner() public view returns(address){
        return recentWinner;
    }
    function getPunters() public view returns (address[] memory){
        return players;
    }
    function setEntryFee(uint256 _entryFee) internal onlyOwner {
        entryFee = _entryFee;
    }
    function setLotteryPrice(uint256 _lotteryPrice) internal onlyOwner {
        lotteryPrice = _lotteryPrice;
    }

    function startLottery(uint256 _lotteryPrice, uint256 _entryFee) public onlyOwner{
        require(currentLotteryState == LOTTERY_STATE.CLOSED,"Lottery is not closed");
        currentLotteryState = LOTTERY_STATE.OPEN;
        setLotteryPrice(_lotteryPrice);
        setEntryFee(_entryFee);
    }
    function enterLottery() public payable {
        // $50 minimum
        require(currentLotteryState == LOTTERY_STATE.OPEN);
        require(msg.value == entryFee, "Invalid Entry fee");
        punters.push(payable(msg.sender));
        players.push(msg.sender);
    }
     function endLottery(uint256 nonce) public onlyOwner {
        require(lotteryPrice <= address(this).balance, "Insufficient funds");
        if(players.length <= 0){
            currentLotteryState = LOTTERY_STATE.CLOSED;
            setEntryFee(0);
            setLotteryPrice(0);
        }else{
          randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    nonce, // nonce is preditable (aka, transaction number)
                    msg.sender, // msg.sender is predictable
                    block.difficulty, // can actually be manipulated by the miners!
                    block.timestamp // timestamp is predictable
                )
            )
        ); 
        
        uint256 indexOfWinner = randomNumber% punters.length; // Unsafe Randomness
        currentLotteryState = LOTTERY_STATE.CALCULATING_WINNER;
        recentWinner = punters[indexOfWinner];
        recentWinner.transfer(lotteryPrice);
        punters = new address payable[](0);
        players = new address[](0);
        currentLotteryState = LOTTERY_STATE.CLOSED;
        emit RecentWinner(recentWinner);
        emit RandomNumber(randomNumber);  
        }
        
    }
    function fundContract() public payable onlyOwner{

    }
    function withdrawFromContract(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds");
        payable(owner).transfer(amount);
    }


}