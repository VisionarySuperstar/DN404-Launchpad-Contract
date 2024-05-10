import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import tokenABI from "./tokenABI.json";
import { time } from "@nomicfoundation/hardhat-network-helpers";
describe("Create Collection Test", function () {
    enum SaleOption { PRESALE, STEALTH, FAIR_LAUNCH };
    let launchpadFactory: any;
    let newTokenContract: any;
    let secondTokenContract: any;
    let owner: any;
    let user: any;
    let user1: any;
    let user2: any;
    let user3: any;
    let user4: any;
    it("should deploy LaunchpadFactory and proxy contract", async function () {
        // Get the first account as the owner
        [owner, user, user1, user2, user3, user4] = await ethers.getSigners();
        console.log("\tAccount address\t", await owner.getAddress());
        const My404Instance = await ethers.getContractFactory("MyDN404");
        const my404 = await My404Instance.deploy();
        console.log('\tMy404 Contract deployed at:', await my404.getAddress());
        const LaunchpadFactoryInstance = await ethers.getContractFactory("LaunchpadFactory");
        launchpadFactory = await LaunchpadFactoryInstance.deploy(await my404.getAddress());
        console.log('\tLaunchpadFactory Contract deployed at:', await launchpadFactory.getAddress());
    })

    it("should set launchpad factory's settings including fees", async function () {
        const _creatingFee = ethers.parseEther("0.1");
        const _burnFee = ethers.parseEther("0.1");
        const _taxForDeveloper = 30;
        const _taxForMarketing = 70;
        const _taxForSell = 10;
        const _taxForBuy = 10;
        const _swapFee = 5;
        await launchpadFactory.setWalletsForLaunchpadFactory(user3, user4);

        const result = await launchpadFactory.setFeesForLaunchpadFactory(_creatingFee, _burnFee, _taxForDeveloper, _taxForMarketing, _taxForSell, _taxForBuy, _swapFee);
    })
    it("should create new collection with token name, symbol, totalsupply and so on", async function () {
        const tokenName = 'First404';
        const tokenSymbol = 'FFZF';
        const totalsupply = 1000;

        await launchpadFactory.connect(user1).createToken(tokenName, tokenSymbol, totalsupply, { value: ethers.parseEther("0.1") });
        const tokenId = await launchpadFactory.getCurrentTokenNumber();
        const newAddress = await launchpadFactory.getTokenAddress(tokenId);
        newTokenContract = new ethers.Contract(newAddress, tokenABI, ethers.provider);
        const balanceofOwner = await newTokenContract.balanceOf(user1);
        console.log("\tBalance of Owner:", balanceofOwner);
    })

    it("start setting of My404 token 1 ", async () => {
        const _saleOption = SaleOption.PRESALE;
        const _preSalePrice = BigInt("100");
        const _preSalePercent = BigInt("30");
        const _whiteListState = true;
        const _softCap = ethers.parseEther("200"); 
        const _hardCap = ethers.parseEther("300"); 
        const _minBuy = ethers.parseEther("5");
        const _maxBuy = ethers.parseEther("400") ;
        const _refundType = false;
        const _liquidityPercent = BigInt("75");
        const _listingPrice = _preSalePrice;
        const _startTime = await time.latest() + 3600;
        const _endTime = await time.latest() + 7200;
        const _lockupTime = BigInt((365 * 3600 * 12).toString());
        const _vestingPeriod = BigInt((24 * 3600 * 10).toString());
        const _vestingPercent = BigInt("10");
        const _baseURI = "ipfs://stress.jpg" ;
        const _taxForSell = BigInt(10) ;
        await newTokenContract.connect(user1).setAllOfSettings(_saleOption, _preSalePrice,
            _preSalePercent, _whiteListState, _vestingPeriod, _vestingPercent, _softCap, _hardCap, _minBuy, _maxBuy, _refundType,
            _liquidityPercent, _listingPrice, _startTime, _endTime, _lockupTime, _baseURI, _taxForSell);
        const totalSupply = await newTokenContract.totalSupply();
        const tokenAddress = await newTokenContract.getAddress();
        await newTokenContract.connect(user1).transfer(tokenAddress, totalSupply);
    })

    it("start buyTokens in presale", async () => {
        await newTokenContract.connect(user1).setWhitelist(user, true) ;

        const amount = 200 * 1e18;
        await time.increaseTo(await time.latest() + 3600);
        const payAmount = ethers.parseEther("3");
        console.log("payAmount: " + payAmount) ;
        await newTokenContract.connect(user).buyTokenDuringPreSell(BigInt(amount.toString()), { value: BigInt(payAmount) });
        

        await time.increaseTo(await time.latest() + 3600);

        //end here


        await newTokenContract.connect(user1).finish() ;

        const balanceTokenContract = await ethers.provider.getBalance(newTokenContract.getAddress());
        console.log('\tBalance of tokenContract:', ethers.formatEther(balanceTokenContract));
        const balanceUser = await ethers.provider.getBalance(user.getAddress());
        console.log('\tBalance of User:', ethers.formatEther(balanceUser));
        const balanceUser1 = await ethers.provider.getBalance(user1.getAddress());
        console.log('\tBalance of User1:', ethers.formatEther(balanceUser1));
        const tokenInUser = await newTokenContract.balanceOf(user);
        console.log('\tBalance of tokenInUser:', ethers.formatEther(tokenInUser));
    })

    // it("transfer tokens from user1 to user2", async function(){
    //     const amount = BigInt(1e18 * 100) ;
    //     await newTokenContract.connect(user1).transfer(user2, amount) ;
    //     const balanceOfUser2 = await newTokenContract.balanceOf(user2) ;
    //     console.log("\tBalance of User2:", balanceOfUser2) ;
    //     const NFTBalanceOfUser2 = await newTokenContract.erc721BalanceOf(user2) ;
    //     console.log("\tNFT Balance of User2:", NFTBalanceOfUser2) ;
    // })

})