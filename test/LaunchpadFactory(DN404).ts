import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import tokenABI from "./tokenABI.json";
import { time } from "@nomicfoundation/hardhat-network-helpers";
describe("Create Collection Test", function () {
    enum SaleOption{PRESALE, STEALTH, FAIR_LAUNCH};
    let launchpadFactory:any;
    let newTokenContract:any;
    let secondTokenContract:any;
    let owner:any;
    let user:any;
    let user1:any;
    let user2:any;
    let user3:any;
    let user4:any;
    it("should deploy LaunchpadFactory and proxy contract", async function(){
        // Get the first account as the owner
        [owner, user, user1, user2, user3, user4] = await ethers.getSigners();
        console.log("\tAccount address\t", await owner.getAddress());
        const MyDN404Instance = await ethers.getContractFactory("MyDN404") ;
        const myDN404 = await MyDN404Instance.deploy() ;
        console.log('\tMyDN404 Contract deployed at:', await myDN404.getAddress());
        const LaunchpadFactoryInstance = await ethers.getContractFactory("LaunchpadFactory");
        launchpadFactory = await LaunchpadFactoryInstance.deploy(await myDN404.getAddress());
        console.log('\tLaunchpadFactory Contract deployed at:', await launchpadFactory.getAddress());
    })

    it("should set launchpad factory's settings including fees", async function(){
        const _creatingFee = ethers.parseEther("0.1");
        const _burnFee = ethers.parseEther("0.1"); 
        const _taxForDeveloper = 30 ; 
        const _taxForMarketing = 70 ; 
        const _taxForSell = 10 ;
        const _taxForBuy = 10; 
        const _swapFee = 5 ;
        await launchpadFactory.setWalletsForLaunchpadFactory(user3, user4) ;

        const result = await launchpadFactory.setFeesForLaunchpadFactory(_creatingFee, _burnFee, _taxForDeveloper, _taxForMarketing, _taxForSell, _taxForBuy, _swapFee);    
    })
    it("should create new collection with token name, symbol, totalsupply and so on", async function(){
        const tokenName = 'FirstDN404';
        const tokenSymbol = 'FDNFZF';
        const totalsupply = 10000 ;
        
        await launchpadFactory.connect(user1).createToken(tokenName, tokenSymbol, totalsupply, {value:ethers.parseEther("0.1")});
        const tokenId = await launchpadFactory.getCurrentTokenNumber() ;
        console.log('\tToken ID:', tokenId);
        const newAddress = await launchpadFactory.getTokenAddress(tokenId);
        console.log('\tNew Address:', newAddress) ;
        newTokenContract = new ethers.Contract(newAddress, tokenABI, ethers.provider) ;
        
    })

    it("should check if token name, symbol and totalsupply are correct", async () => {
        const name = await newTokenContract.name();
        const symbol = await newTokenContract.symbol();
        const totalSupply = await newTokenContract.totalSupply();
        const decimals = await newTokenContract.decimals();
        console.log("name: ", name);
        console.log("symbol: ", symbol) ;
        console.log("totalSupply: ", totalSupply) ;
        console.log("decimals: ", decimals) ;
    })
    it("start setting of MyDN404 token 1 ", async () =>{
        const _saleOption = SaleOption.PRESALE ;
        const _affiliateOption = false ;
        const _preSalePrice = ethers.parseEther("0.1") ;
        const _preSalePercent = 50 ;
        const _whiteListState = false ;
        const _softCap = ethers.parseEther("10") ;
        const _hardCap = ethers.parseEther("25") ;
        const _minBuy = 1 ;
        const _maxBuy = 100 ;
        const _refundType = false ;
        const _liquidityPercent = 51 ;
        const _listingPrice = _preSalePrice ;
        const _startTime = await time.latest() + 3600 ;
        const _endTime = await time.latest() + 7200 ;
        const _lockupTime = 365 * 3600 * 12 ;
        await newTokenContract.connect(user1).setAllOfSettings(_saleOption, _affiliateOption, _preSalePrice,
            _preSalePercent, _whiteListState, _softCap, _hardCap, _minBuy, _maxBuy, _refundType,
            _liquidityPercent, _listingPrice, _startTime, _endTime, _lockupTime);
        const totalSupply = await newTokenContract.totalSupply();
        const tokenAddress = await newTokenContract.getAddress() ;
        await newTokenContract.connect(user1).transfer(tokenAddress, totalSupply) ;
    })

    it("start buyTokens in presale", async () => {
        const amount = 5;
        const payValues = await newTokenContract.connect(user).getPriceForBuyingTokenDuringPreSell(amount) ;
        console.log("payValues: " + payValues) ;
        await time.increaseTo(await time.latest() + 3600) ;
        await newTokenContract.connect(user).buyTokenDuringPreSell(amount, {value:payValues});
        const balanceOfLaunchpadFactory = await ethers.provider.getBalance(launchpadFactory.getAddress());
        console.log('\tBalance of LaunchpadFactory:', balanceOfLaunchpadFactory);
        const tokenInUser = await ethers.provider.getBalance(newTokenContract.getAddress()) ;
        console.log('\tBalance of user:', tokenInUser);
    })

    it("should create another collection with token name, symbol, totalsupply and so on", async function(){
        const tokenName = 'SecondDN404';
        const tokenSymbol = 'SDNFZF';
        const totalsupply = 10000 ;
        await launchpadFactory.connect(user2).createToken(tokenName, tokenSymbol, totalsupply, {value:ethers.parseEther("0.1")});
        const tokenId = await launchpadFactory.getCurrentTokenNumber() ;
        console.log('\tToken ID:', tokenId);
        const newAddress = await launchpadFactory.getTokenAddress(tokenId);
        console.log('\tNew Address:', newAddress) ;
        secondTokenContract = new ethers.Contract(newAddress, tokenABI, ethers.provider) ;
    })
    
    it("should check if token name, symbol and totalsupply are correct", async () => {
        const name = await secondTokenContract.name();
        const symbol = await secondTokenContract.symbol();
        const totalSupply = await secondTokenContract.totalSupply();
        const decimals = await secondTokenContract.decimals();
        console.log("name: ", name);
        console.log("symbol: ", symbol) ;
        console.log("totalSupply: ", totalSupply) ;
        console.log("decimals: ", decimals) ;
    })
    it("start setting of MyDN404 token 2 ", async () =>{
        const _saleOption = SaleOption.PRESALE ;
        const _affiliateOption = false ;
        const _preSalePrice = ethers.parseEther("0.1") ;
        const _preSalePercent = 50 ;
        const _whiteListState = false ;
        const _softCap = ethers.parseEther("10") ;
        const _hardCap = ethers.parseEther("25") ;
        const _minBuy = 1 ;
        const _maxBuy = 100 ;
        const _refundType = false ;
        const _liquidityPercent = 51 ;
        const _listingPrice = _preSalePrice ;
        const _startTime = await time.latest() + 3600 ;
        const _endTime = await time.latest() + 7200 ;
        const _lockupTime = 365 * 3600 * 12 ;
        await secondTokenContract.connect(user2).setAllOfSettings(_saleOption, _affiliateOption, _preSalePrice,
            _preSalePercent, _whiteListState, _softCap, _hardCap, _minBuy, _maxBuy, _refundType,
            _liquidityPercent, _listingPrice, _startTime, _endTime, _lockupTime);
        const totalSupply = await secondTokenContract.totalSupply();
        const tokenAddress = await secondTokenContract.getAddress() ;
        await secondTokenContract.connect(user2).transfer(tokenAddress, totalSupply) ;
    })
    
    it("start buyTokens in presale", async () => {
        const amount = 5;
        const payValues = await secondTokenContract.connect(user).getPriceForBuyingTokenDuringPreSell(amount) ;
        await time.increaseTo(await time.latest() + 3600) ;
        await secondTokenContract.connect(user).buyTokenDuringPreSell(amount, {value:payValues});
        const balanceOfLaunchpadFactory = await ethers.provider.getBalance(launchpadFactory.getAddress());
        console.log('\tBalance of LaunchpadFactory:', balanceOfLaunchpadFactory);
        const tokenInUser = await ethers.provider.getBalance(secondTokenContract.getAddress()) ;
        console.log('\tBalance of user:', tokenInUser);
    })
})