import './home.css'
import { Col, Alert, Container, Button, Row, ToastContainer, Toast, Form } from "react-bootstrap"
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from "../context";
import NavbarComponent from '../Navbar/navbar';
import EthToToken from './ethToToken';
import TokenToEth from './tokenToEth';
import Deposit from './deposit';
import Withdraw from './withdraw';


const Home = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [myShowToast, setMyShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [amountETH, setAmountETH] = useState()
    const [amountBalloons, setAmountBalloons] = useState()
    let getBalloonsBalanceAccount, getBalanceETHAcount, getBalloonsBalanceDEX, getETHBalanceDEX, takeOnMsgValueForDeposit, getLiquidityAcount
    let UpdateWeb3States = { ...web3States }



    async function InitDex() {

        if (web3States.contractBalloons && web3States.contractDEX) {

            if (web3States.getBalanceETHAcount > amountETH && web3States.getBalloonsBalanceAccount > amountBalloons
                && amountETH > 0 && amountBalloons > 0) {
                contineuInit()
            } else {
                setMessage("ورودیها وارد شده کمتر از موجودی اکانت و بزرگتر از صفر باشد")
                setShow(true)
            }
        } else {

            setMessage("ابتدا به کیف پول خود وصل شوید")
            setShow(true)

        }
    }

    async function contineuInit() {
        const DexAddress = await web3States.contractDEX.methods.getContractaddress().call();
        const Amount = Number(amountBalloons) * 10 ** 18;
        web3States.contractBalloons.methods.approve(DexAddress, Amount.toString()).send({
            from: web3States.account
        }).then(res => {
            web3States.contractDEX.methods.init(Amount.toString()).send({
                from: web3States.account
                , value: web3States.web3.utils.toWei(amountETH.toString(), 'ether')
            }).then(async result => {
                setShow(true)
                setMyShowToast(true)
                setAmountETH("")
                setAmountBalloons("")
                setMessage(`مقدار ${Number(amountETH).toFixed(4)} اتر و مقدار ${Number(amountBalloons).toFixed(4)}  توکن در استخر نقدینگی قرار گرفت`)
                getBalloonsBalanceDEX = await web3States.contractBalloons.methods.balanceOf(DexAddress).call()
                getBalloonsBalanceDEX = Number(web3States.web3.utils.fromWei(getBalloonsBalanceDEX, 'ether')).toFixed(3);
                getETHBalanceDEX = await web3States.contractDEX.methods.getBalanceSmartContract().call()
                getETHBalanceDEX = Number(web3States.web3.utils.fromWei(getETHBalanceDEX, 'ether')).toFixed(3);
                getBalloonsBalanceAccount = await web3States.contractBalloons.methods.balanceOf(web3States.account).call()
                getBalloonsBalanceAccount = Number(web3States.web3.utils.fromWei(getBalloonsBalanceAccount, 'ether')).toFixed(3);
                getBalanceETHAcount = await web3States.web3.eth.getBalance(web3States.account);
                getBalanceETHAcount = Number(web3States.web3.utils.fromWei(getBalanceETHAcount, 'ether')).toFixed(3);
                takeOnMsgValueForDeposit = (getETHBalanceDEX / getBalloonsBalanceDEX) * getBalloonsBalanceAccount
                takeOnMsgValueForDeposit = Number(takeOnMsgValueForDeposit).toFixed(5)
                getLiquidityAcount = await web3States.contractDEX.methods.getLiquidity(web3States.account).call()
                getLiquidityAcount = Number(web3States.web3.utils.fromWei(getLiquidityAcount, 'ether')).toFixed(5)

                UpdateWeb3States.getLiquidityAcount = getLiquidityAcount
                UpdateWeb3States.takeOnMsgValueForDeposit = takeOnMsgValueForDeposit
                UpdateWeb3States.getBalloonsBalanceAccount = getBalloonsBalanceAccount
                UpdateWeb3States.getBalanceETHAcount = getBalanceETHAcount
                UpdateWeb3States.getBalloonsBalanceDEX = getBalloonsBalanceDEX
                UpdateWeb3States.getETHBalanceDEX = getETHBalanceDEX

            }).catch((error) => {
                setShow(true)
                setMessage("فقط برای بار اول قابل اجراست و یا موجودی اتر کافی نیست یا موجودی توکن کافی نیست")

            })
        }).catch((error) => {
            setShow(true)
            setMessage("آدرس صفر مجاز نیست")

        })

    }



    useEffect(() => {
    },);


    return (
        <>
            <Col xs={6}>
                <ToastContainer className="p-3" position="top-center">
                    <Toast onClose={() => setShow(false)}
                        show={show} delay={5000} autohide>
                        <Toast.Header className={myShowToast ? "bg-success" : "bg-danger"}  >
                            <strong className="text-white me-auto">پیام</strong>
                        </Toast.Header>
                        <Toast.Body className="bg-light">{message}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Col>

            <NavbarComponent />
            <Container dir='rtl' className='mb-3'>
                <Row className='d-flex justify-content-around my-3 text-dark fs-4'>
                    <Col xs={12} md={12} className="text-center">
                        Dex
                    </Col>

                </Row>


                <Row className='d-flex  justify-content-around ' >
                    <Col xs={12} md={6} className='d-flex flex-column align-self-stretch py-3 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>
                        <label>مقدار ETH</label>
                        <input type="number" id='AmountETH' className='form-control mt-1' name='AmountETH' value={amountETH} onChange={(e) => setAmountETH(e.target.value)} placeholder='تعداد ETH' />
                        <label className=' mt-3'>مقدار Balloons</label>
                        <input type="number" id='AmountBalloons' className='form-control mt-2' name='AmountBalloons' value={amountBalloons} onChange={(e) => setAmountBalloons(e.target.value)} placeholder='تعداد Bolloons' />
                        <Button className='mt-3' onClick={InitDex} value="success">
                            آغاز کردن (Init)
                        </Button>
                    </Col>
                </Row>
                <Row className='d-flex  justify-content-around  mt-3'>
                    <Col xs={12} md={6}>
                        <EthToToken />
                    </Col>
                    <Col xs={12} md={6}>
                        <TokenToEth />
                    </Col>
                    <Col xs={12} md={6}>
                        <Deposit />
                    </Col>
                    <Col xs={12} md={6}>
                        <Withdraw />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home;