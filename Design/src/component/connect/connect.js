import { Button, Col, Toast, ToastContainer } from "react-bootstrap"
import { useState, useContext, useEffect } from 'react';
import Web3 from "web3";
import { AbiBalloons } from "../ABI/AbiBalloons";
import { AbiDEX } from "../ABI/AbiDex";
import { Web3Context } from "../context";

const Connect = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [account, setAccount] = useState();

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const DexAddress = "0x8805f72D4B44404e2a203d14DA6A5EcAFdfEE7C0"

    window.ethereum.on('accountsChanged', (accounts) => {
        connectToWallet()
    });

    window.ethereum.on('chainChanged', (chainId) => {
        setAccount()
    });
    async function connectToWallet() {
        let web3, contractBalloons, contractDex;
        if (typeof window.ethereum !== "undefined") {

            let accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            web3 = new Web3(Web3.givenProvider);
            web3.eth.getChainId().then(async res => {
                if (res == "80001") {
                    setAccount(accounts[0])
                    contractBalloons = new web3.eth.Contract(AbiBalloons, "0x8984756A61CA2740a1762E0d0b30100BDC5872E5")
                    contractDex = new web3.eth.Contract(AbiDEX, "0x8805f72D4B44404e2a203d14DA6A5EcAFdfEE7C0");
                    let getBalloonsBalanceAccount, getBalloonsBalanceDEX, getETHBalanceDEX,
                        getBalanceETHAcount, takeOnMsgValueForDeposit,getLiquidityAcount
                    if (contractBalloons && contractDex) {
                        getBalloonsBalanceDEX = await contractBalloons.methods.balanceOf(DexAddress).call()
                        getBalloonsBalanceDEX = Number(web3.utils.fromWei(getBalloonsBalanceDEX, 'ether')).toFixed(3);
                        getETHBalanceDEX = await contractDex.methods.getBalanceSmartContract().call()
                        getETHBalanceDEX = Number(web3.utils.fromWei(getETHBalanceDEX, 'ether')).toFixed(3);
                        getBalloonsBalanceAccount = await contractBalloons.methods.balanceOf(accounts[0]).call()
                        getBalloonsBalanceAccount = Number(web3.utils.fromWei(getBalloonsBalanceAccount, 'ether')).toFixed(3);
                        getBalanceETHAcount = await web3.eth.getBalance(accounts[0]);
                        getBalanceETHAcount = Number(web3.utils.fromWei(getBalanceETHAcount, 'ether')).toFixed(3);
                        takeOnMsgValueForDeposit = (getETHBalanceDEX / getBalloonsBalanceDEX) * getBalloonsBalanceAccount
                        takeOnMsgValueForDeposit = Number(takeOnMsgValueForDeposit).toFixed(5)
                        getLiquidityAcount=await contractDex.methods.getLiquidity(accounts[0]).call()
                        getLiquidityAcount = Number(web3.utils.fromWei(getLiquidityAcount, 'ether')).toFixed(5)
                    }
                    setWeb3State({
                        web3: web3, contractBalloons: contractBalloons, contractDEX: contractDex, account: accounts[0],
                        getBalloonsBalanceAccount: getBalloonsBalanceAccount, getBalloonsBalanceDEX: getBalloonsBalanceDEX
                        , getETHBalanceDEX: getETHBalanceDEX, isFlag: true, getBalanceETHAcount: getBalanceETHAcount,
                        takeOnMsgValueForDeposit: takeOnMsgValueForDeposit ,getLiquidityAcount:getLiquidityAcount
                    })



                } else {
                    setMessage("mumbai شبکه تستی مد نظر می باشد")
                    setShow(true)
                }
            })
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            setMessage("متامسک را نصب کنید")
            setShow(true)
        }
    }

    async function startApp() {
        let web3, contractBalloons, contractDex, getBalloonsBalanceDEX, getETHBalanceDEX;
        web3 = new Web3('https://rpc-mumbai.maticvigil.com');
        contractBalloons = new web3.eth.Contract(AbiBalloons, "0x8984756A61CA2740a1762E0d0b30100BDC5872E5")
        contractDex = new web3.eth.Contract(AbiDEX, "0x8805f72D4B44404e2a203d14DA6A5EcAFdfEE7C0");
        getBalloonsBalanceDEX = await contractBalloons.methods.balanceOf(DexAddress).call()
        getBalloonsBalanceDEX = Number(web3.utils.fromWei(getBalloonsBalanceDEX, 'ether')).toFixed(2);
        getETHBalanceDEX = await contractDex.methods.getBalanceSmartContract().call()
        getETHBalanceDEX = Number(web3.utils.fromWei(getETHBalanceDEX, 'ether')).toFixed(2);

        setWeb3State({
            web3: web3, contractBalloons: null, contractDEX: null, account: null
            , getBalloonsBalanceAccount: null,
            getBalloonsBalanceDEX: getBalloonsBalanceDEX, getETHBalanceDEX: getETHBalanceDEX
        })


    }

    useEffect(() => {
        startApp()
    }, [])



    return (
        <>
            <Col xs={6}>
                <ToastContainer className="p-3" position="top-center">
                    <Toast onClose={() => setShow(false)}
                        show={show} delay={5000} autohide>
                        <Toast.Header className="text-white bg-danger">
                            <strong className="ms-auto">خطا</strong>
                        </Toast.Header>
                        <Toast.Body className="bg-light">{message}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Col>
            <Button onClick={connectToWallet} value="success">
                {account ? (account.substring(0, 4) + '...' + account.slice(-4)) : 'اتصال به کیف پول'}
            </Button>
        </>
    );
}

export default Connect