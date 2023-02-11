// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title DEX Template
 * @author stevepham.eth and m00npapi.eth
 * @notice Empty DEX.sol that just outlines what features could be part of the challenge (up to you!)
 * @dev We want to create an automatic market where our contract will hold reserves of both ETH and 🎈 Balloons. These reserves will provide liquidity that allows anyone to swap between the assets.
 * NOTE: functions outlined here are what work with the front end of this branch/repo. Also return variable names that may need to be specified exactly may be referenced (if you are confused, see solutions folder in this repo and/or cross reference with front-end code).
 */
contract DEX {
    /* ========== GLOBAL VARIABLES ========== */

    using SafeMath for uint256; //outlines use of SafeMath for uint256 variables
    IERC20 token; //instantiates the imported contract
    uint256 public totalLiquidity; //total amount of liquidity provider tokens (LPTs) minted (NOTE: that LPT "price" is tied to the ratio, and thus price of the assets within this AMM)
    mapping(address => uint256) public liquidity; //liquidity of each depositor

    /* ========== EVENTS ========== */

    /**
     * @notice Emitted when ethToToken() swap transacted
     */
    event EthToTokenSwap(
        address swapper,
        string txDetails,
        uint256 ethInput,
        uint256 tokenOutput
    );

    /**
     * @notice Emitted when tokenToEth() swap transacted
     */
    event TokenToEthSwap(
        address swapper,
        string txDetails,
        uint256 tokensInput,
        uint256 ethOutput
    );

    /**
     * @notice Emitted when liquidity provided to DEX and mints LPTs.
     */
    event LiquidityProvided(
        address liquidityProvider,
        uint256 tokensInput,
        uint256 ethInput,
        uint256 liquidityMinted
    );

    /**
     * @notice Emitted when liquidity removed from DEX and decreases LPT count within DEX.
     */
    event LiquidityRemoved(
        address liquidityRemover,
        uint256 tokensOutput,
        uint256 ethOutput,
        uint256 liquidityWithdrawn
    );

    /* ========== CONSTRUCTOR ========== */

    //به عنوان ورودی می توان استفاده کرد Balloons در اینجا از آدرس کانترکت
    //ارث بری کرده IERC20 از  Balloons به این دلیل که
    constructor(address token_addr) {
        token = IERC20(token_addr); //specifies the token address that will hook into the interface and be used through the variable 'token'
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @notice initializes amount of tokens that will be transferred to the DEX itself from the erc20 contract mintee (and only them based on how Balloons.sol is written). Loads contract up with both ETH and Balloons.
     * @param tokens amount to be transferred to DEX
     * @return totalLiquidity is the number of LPTs minting as a result of deposits made to DEX contract
     * NOTE: since ratio is 1:1, this is fine to initialize the totalLiquidity (wrt to balloons) as equal to eth balance of contract.
     */
    function init(uint256 tokens) public payable returns (uint256) {
        //ایجاد استخر نقدینگی به صورت زیر
        // انتقال تعدادی اتریوم به قرارداد هوشمند
        //در دفعات بعدی هر آدرسی می تواند باشد DEX به قرارداد هوشمند  Balloons برای اولین بار انتقال تعدادی توکن از مالک قرارداد هوشمند

        require(totalLiquidity == 0, "DEX: init - already has liquidity");
        require(
            tokens > 0,
            "DEX : The value of the token is greater than zero"
        );
        require(msg.value > 0, "DEX : msg.value is greater than zero");
        totalLiquidity = address(this).balance;
        liquidity[msg.sender] = totalLiquidity;

        //you need to approve of Balloons smart contract in the front
        // بدهد تا خط زیر اجرا شود approve ،DEX در قرارداد هوشمند بالون به آدرس قرارداد هوشمند  msg.sender در قسمت فرانت برنامه
        token.transferFrom(msg.sender, address(this), tokens);
        return totalLiquidity;
    }

    /**
     * @notice returns yOutput, or yDelta for xInput (or xDelta)
     * @dev Follow along with the [original tutorial](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90) Price section for an understanding of the DEX's pricing model and for a price function to add to your contract. You may need to update the Solidity syntax (e.g. use + instead of .add, * instead of .mul, etc). Deploy when you are done.
     */
    function price(
        uint256 xInput,
        uint256 xReserves,
        uint256 yReserves
    ) public pure returns (uint256 yOutput) {
        //محاسبه کارمزد صرافی: (0.997 = 0.003 - 1) ==>اعداد ضربدر 1000 شود
        // yOutput = (977 * xInput * yReserves) / ((1000 * xReserves) + (977 * xInput))
        uint256 xInputWithFee = xInput.mul(997);
        uint256 numerator = yReserves.mul(xInputWithFee);
        uint256 denominator = (xReserves.mul(1000)).add(xInput.mul(997));
        return (numerator.div(denominator));
    }

    /**
     * @notice returns liquidity for a user. Note this is not needed typically due to the `liquidity()` mapping variable being public and having a getter as a result. This is left though as it is used within the front end code (App.jsx).
     * if you are using a mapping liquidity, then you can use `return liquidity[lp]` to get the liquidity for a user.
     *
     */
    function getLiquidity(address lp) public view returns (uint256) {
        return liquidity[lp];
    }

    function getBalanceSmartContract() public view returns (uint256) {
        return address(this).balance;
    }

    function getContractaddress() public view returns (address) {
        return address(this);
    }

    /**
     * @notice sends Ether to DEX in exchange for $BAL
     */
    function ethToToken() public payable returns (uint256 tokenOutput) {
        require(msg.value > 0, "DEX: cannot swap 0 ETH");
        uint256 ethReserve = address(this).balance.sub(msg.value);
        uint256 token_reserve = token.balanceOf(address(this));
        tokenOutput = price(msg.value, ethReserve, token_reserve);
        require(
            token.transfer(msg.sender, tokenOutput),
            "DEX: ethToToken(): reverted swap."
        );
        emit EthToTokenSwap(
            msg.sender,
            "DEX: Eth to Balloons",
            msg.value,
            tokenOutput
        );
        return tokenOutput;
    }

    /**
     * @notice sends $BAL tokens to DEX in exchange for Ether
     */
    function tokenToEth(uint256 tokenInput) public returns (uint256 ethOutput) {
        require(tokenInput > 0, "DEX: cannot swap 0 ETH");
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 ethReserve = address(this).balance;
        uint256 _ethOutput = price(tokenInput, token_reserve, ethReserve);

        //you need to approve of Balloons smart contract in the front
        // بدهد تا خط زیر اجرا شود approve ،DEX در قرارداد هوشمند بالون به آدرس قرارداد هوشمند  msg.sender در قسمت فرانت برنامه
        require(
            token.transferFrom(msg.sender, address(this), tokenInput),
            "DEX: tokenToEth(): reverted swap."
        );
        (bool send, ) = msg.sender.call{value: _ethOutput}("");
        require(send, "DEX: tokenToEth: revert in transferring eth to you!");
        emit TokenToEthSwap(
            msg.sender,
            "DEX: Balloons to ETH",
            _ethOutput,
            tokenInput
        );
        return _ethOutput;
    }

    /**
     * @notice allows deposits of $BAL and $ETH to liquidity pool
     * NOTE: parameter is the msg.value sent with this function call. That amount is used to determine the amount of $BAL needed as well and taken from the depositor.
     * NOTE: user has to make sure to give DEX approval to spend their tokens on their behalf by calling approve function prior to this function call.
     * NOTE: Equal parts of both assets will be removed from the user's wallet with respect to the price outlined by the AMM.
     */
    function takeOnMsgValueForDeposit() public view returns (uint256) {
        //محاسبه حدودی می باشد
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 ethReserve = address(this).balance;
        uint256 tokenMsgSender = token.balanceOf(msg.sender);
        return (ethReserve / token_reserve).mul(tokenMsgSender);
    }

    function deposit() public payable returns (uint256 tokensDeposited) {
        require(msg.value > 0, "DEX: Must send value when depositing");
        uint256 ethReserve = address(this).balance.sub(msg.value);
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 tokenDeposit;

        tokenDeposit = (msg.value.mul(tokenReserve) / ethReserve).add(1);
        uint256 liquidityMinted = msg.value.mul(totalLiquidity) / ethReserve;
        liquidity[msg.sender] = liquidity[msg.sender].add(liquidityMinted);
        totalLiquidity = totalLiquidity.add(liquidityMinted);

        //you need to approve of Balloons smart contract in the front
        // بدهد تا خط زیر اجرا شود approve ،DEX در قرارداد هوشمند بالون به آدرس قرارداد هوشمند  msg.sender در قسمت فرانت برنامه
        require(token.transferFrom(msg.sender, address(this), tokenDeposit));
        emit LiquidityProvided(
            msg.sender,
            liquidityMinted,
            msg.value,
            tokenDeposit
        );
        return tokenDeposit;
    }

    /**
     * @notice allows withdrawal of $BAL and $ETH from liquidity pool
     * NOTE: with this current code, the msg caller could end up getting very little back if the liquidity is super low in the pool. I guess they could see that with the UI.
     */
    function withdraw(
        uint256 amount
    ) public returns (uint256 eth_amount, uint256 token_amount) {
        require(
            liquidity[msg.sender] >= amount,
            "DEX: withdraw: sender does not have enough liquidity to withdraw."
        );
        uint256 ethReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethOutput = (amount.mul(ethReserve)).div(totalLiquidity);

        uint256 tokensOutput = amount.mul(tokenReserve).div(totalLiquidity);
        liquidity[msg.sender] = liquidity[msg.sender].sub(amount);
        totalLiquidity = totalLiquidity.sub(amount);

        (bool send, ) = msg.sender.call{value: ethOutput}("");
        require(send, "DEX: tokenToEth: revert in transferring eth to you!");
        require(token.transfer(msg.sender, tokensOutput));
        emit LiquidityRemoved(msg.sender, tokensOutput, ethOutput, amount);
        return (ethOutput, tokensOutput);
    }
}
