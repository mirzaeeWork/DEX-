import './home.css'
import { Col, Container, Button, Row, ToastContainer, Toast } from "react-bootstrap"
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from "../context";


const EthToToken = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [myShowToast, setMyShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [amountETH, setAmountETH] = useState()
    let getBalloonsBalanceAccount, getBalanceETHAcount, getBalloonsBalanceDEX, getETHBalanceDEX, takeOnMsgValueForDeposit,getLiquidityAcount
    let UpdateWeb3States = { ...web3States }



    async function ethToToken() {

        if (web3States.contractBalloons && web3States.contractDEX) {
            setMyShowToast(false)

            if (web3States.getBalanceETHAcount > amountETH
                && amountETH > 0) {
                contineuEthToToken()
            } else {
                setMessage("ورودی وارد شده کمتر از موجودی اکانت و بزرگتر از صفر باشد")
                setShow(true)
            }
        } else {

            setMessage("ابتدا به کیف پول خود وصل شوید")
            setShow(true)

        }
    }

    async function contineuEthToToken() {
        const DexAddress = await web3States.contractDEX.methods.getContractaddress().call();
        web3States.contractDEX.methods.ethToToken().send({
            from: web3States.account
            , value: web3States.web3.utils.toWei(amountETH.toString(), 'ether')
        }).then(async result => {
            setShow(true)
            setMyShowToast(true)
            setAmountETH("")
            let num = web3States.web3.utils.fromWei(result.events.EthToTokenSwap.returnValues[3], 'ether');
            setMessage(`مقدار ${Number(num).toFixed(4)}  توکن به موجودی اکانت اضافه شد`)
            getBalloonsBalanceDEX = await web3States.contractBalloons.methods.balanceOf(DexAddress).call()
            getBalloonsBalanceDEX = Number(web3States.web3.utils.fromWei(getBalloonsBalanceDEX, 'ether')).toFixed(3);
            getETHBalanceDEX = await web3States.contractDEX.methods.getBalanceSmartContract().call()
            getETHBalanceDEX = Number(web3States.web3.utils.fromWei(getETHBalanceDEX, 'ether')).toFixed(3);
            getBalloonsBalanceAccount = await web3States.contractBalloons.methods.balanceOf(web3States.account).call()
            getBalloonsBalanceAccount = Number(web3States.web3.utils.fromWei(getBalloonsBalanceAccount, 'ether')).toFixed(3);
            getBalanceETHAcount = await web3States.web3.eth.getBalance(web3States.account);
            getBalanceETHAcount = Number(web3States.web3.utils.fromWei(getBalanceETHAcount, 'ether')).toFixed(3);
            takeOnMsgValueForDeposit=(getETHBalanceDEX/getBalloonsBalanceDEX)*getBalloonsBalanceAccount 
            takeOnMsgValueForDeposit=Number(takeOnMsgValueForDeposit).toFixed(5)
            getLiquidityAcount=await web3States.contractDEX.methods.getLiquidity(web3States.account).call()
            getLiquidityAcount = Number(web3States.web3.utils.fromWei(getLiquidityAcount, 'ether')).toFixed(5)

            UpdateWeb3States.getLiquidityAcount=getLiquidityAcount


            UpdateWeb3States.takeOnMsgValueForDeposit = takeOnMsgValueForDeposit

            UpdateWeb3States.getBalloonsBalanceAccount = getBalloonsBalanceAccount
            UpdateWeb3States.getBalanceETHAcount = getBalanceETHAcount
            UpdateWeb3States.getBalloonsBalanceDEX = getBalloonsBalanceDEX
            UpdateWeb3States.getETHBalanceDEX = getETHBalanceDEX
            setWeb3State(UpdateWeb3States)

        }).catch((error) => {
            setShow(true)
            setMessage("انتقال توکن انجام نشد")

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
                            <strong className="text-white ms-auto">پیام</strong>
                        </Toast.Header>
                        <Toast.Body className="bg-light">{message}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Col>

            <Container >
                <Row className='d-flex d-flex justify-content-around mt-3' >
                    <Col  className='d-flex flex-column align-self-stretch py-4 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>
                        <label className=' mt-1'>مقدار ETH</label>
                        <input type="number" id='AmountETH' className='form-control mt-1' name='AmountETH' value={amountETH} onChange={(e) => setAmountETH(e.target.value)} placeholder='تعداد ETH' />
                        <Button className='mt-3' onClick={ethToToken} value="success">
                            دریافت توکن (ethToToken)
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default EthToToken;