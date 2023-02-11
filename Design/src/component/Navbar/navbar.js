
import { Nav, Navbar, Container, NavDropdown, Button } from "react-bootstrap"
import { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Connect from "../connect/connect";
import './navbar.css';
import { Web3Context } from "../context";
import { propTypes } from "react-bootstrap/esm/Image";


const NavbarComponent = (props) => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [balanceBalloonsDEX, setBalanceBalloonsDEX] = useState()
    const [balanceETHDEX, setBalanceETHDEX] = useState()
    const [balanceBalloonsAcount, setBalanceBalloonsAcount] = useState()



    useEffect(() => {
        // console.log("11 :" + web3States.getBalloonsBalanceDEX)
        setBalanceBalloonsDEX(web3States.getBalloonsBalanceDEX)
        setBalanceETHDEX(web3States.getETHBalanceDEX)
        setBalanceBalloonsAcount(web3States.getBalloonsBalanceAccount)
    }, [web3States.getBalloonsBalanceDEX, web3States.getETHBalanceDEX, web3States.getBalloonsBalanceAccount])

    return (
        <>
            <Navbar className='class-div fs-6 '>
                <Container>

                    <Nav>
                        <Nav.Link>
                            <Connect />
                            {web3States.isFlag ?
                                <Button  value="success" className="ms-2">
                                    {balanceBalloonsAcount && web3States.getBalanceETHAcount ?
                                     balanceBalloonsAcount + " (Ballons Token)"+"_"+ web3States.getBalanceETHAcount+" (ETH)": 0}  موجودی اکانت
                                </Button>

                                : null
                            }

                        </Nav.Link>
                    </Nav>
                    <Nav.Link>
                        <Button value="success">
                            {balanceETHDEX ? balanceETHDEX + " (ETH)" : 0}      موجودی قرارداد هوشمند
                        </Button>
                        <Button value="success" className="ms-2">
                            {balanceBalloonsDEX ? balanceBalloonsDEX + " (Ballons Token)" : 0}  موجودی قرارداد هوشمند
                        </Button>

                    </Nav.Link>

                </Container>
            </Navbar>
        </>
    );
}

export default NavbarComponent