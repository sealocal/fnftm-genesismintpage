import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import Accordion from "react-bootstrap/Accordion";
import 'bootstrap/dist/css/bootstrap.min.css';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! Go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 2) {
      newMintAmount = 2;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <>
      <Navbar style={{backgroundColor: "#000000" }}>
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/config/images/logo.png"              
              height="30"
              className="d-inline-block align-top"
            />{' '}          
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">                           
            </Nav>
            <Nav>
            <StyledLink target={"_blank"} href="https://twitter.com/futurenftmints">
              <img
                alt=""
                src="/config/images/twitter.png"              
                height="30"
                className="d-inline-block align-top"  
                margin="10"            
              />{' '}&nbsp;&nbsp;
            </StyledLink>
            <StyledLink target={"_blank"} href="https://discord.gg/futurenftmints">
              <img
                alt=""
                src="/config/images/discord.png"              
                height="30"
                className="d-inline-block align-top"                           
              />{' '}&nbsp;&nbsp;&nbsp;
            </StyledLink> 
            {/* 
            <StyledLink target={"_blank"} href="https://discord.gg/futurenftmints">
              <img
                alt=""
                src="/config/images/opensea.png"              
                height="30"
                className="d-inline-block align-top"                           
              />{' '}&nbsp;&nbsp;&nbsp;
            </StyledLink> 
            */} 

            {/*
            <Button style={{ backgroundColor: "#F83700", border: "#F83700" }}
              onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                getData();
              } }
            >
              Connect Wallet
            </Button>     
            */} 

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid style={{ backgroundImage: "linear-gradient(#000000 40%, #A11692, #BD2164)" }}>
        <Row style={{ paddingTop: "50px" }}>
          <Col md={1}></Col>
          <Col md={6}>
            <Row style={{ color: "#ffffff", fontSize:"3em"}}>
              <Col>Genesis NFT</Col>
            </Row>
            <Row style={{ paddingTop: "20px", color: "#ffffff", fontSize:"1.25em" }}>
              <Col>Direct access to the most in-depth, transparent NFT analysis to guide your buying decisions.</Col>
            </Row>
            <Row style={{ paddingTop: "20px" }}>          
              <Row style={{ color: "#FAC921", fontSize:"4em", textAlign:"center"}}>
                <Col xs={3} md={2}>00</Col>
                <Col xs={3} md={2}>00</Col>
                <Col xs={3} md={2}>00</Col>
                <Col xs={3} md={2}>00</Col>                
              </Row>
              <Row style={{ color: "#FAC921", fontSize:"0.75em", textAlign:"center"}}>
                <Col xs={3} md={2}>Days</Col>
                <Col xs={3} md={2}>Hours</Col>
                <Col xs={3} md={2}>Minutes</Col>
                <Col xs={3} md={2}>Seconds</Col>                
              </Row>
              <Row style={{ paddingTop: "20px", color: "#ffffff" }}>
                <Col>IMMEDIATE UTILITY & PERKS</Col>                
              </Row>
              <Row style={{ paddingTop:"5px" }}>
                <Col xs={2} style={{ textAlign: "center" }}><img alt="checkmark" src="/config/images/check-box.png" height="20" className="d-inline-block align-top"/></Col>
                <Col style={{ color: "#ffffff" }}>Daily Future NFT Mints Newsletter ($550/year value)</Col>
              </Row>       
              <Row style={{ paddingTop:"5px" }}>
                <Col xs={2} style={{ textAlign: "center" }}><img alt="checkmark" src="/config/images/check-box.png" height="20" className="d-inline-block align-top"/></Col>
                <Col style={{ color: "#ffffff" }}>Lifetime access to all research and analyses</Col>
              </Row>              
              <Row style={{ paddingTop:"5px" }}>
                <Col xs={2} style={{ textAlign: "center" }}><img alt="checkmark" src="/config/images/check-box.png" height="20" className="d-inline-block align-top"/></Col>
                <Col style={{ color: "#ffffff" }}>Private Discord</Col>
              </Row>  
              <Row style={{ paddingTop:"5px" }}>
                <Col xs={2} style={{ textAlign: "center" }}><img alt="checkmark" src="/config/images/check-box.png" height="20" className="d-inline-block align-top"/></Col>
                <Col style={{ color: "#ffffff" }}>1x Raffle Spot per NFT. Stackable.</Col>
              </Row> 
              <Row style={{ paddingTop:"5px" }}>
                <Col xs={2} style={{ textAlign: "center" }}><img alt="checkmark" src="/config/images/check-box.png" height="20" className="d-inline-block align-top"/></Col>
                <Col style={{ color: "#ffffff" }}>Early Supporter T-shirt</Col>
              </Row>  
              <Row style={{ paddingTop:"5px" }}>
                <Col xs={2} style={{ textAlign: "center" }}><img alt="checkmark" src="/config/images/check-box.png" height="20" className="d-inline-block align-top"/></Col>
                <Col style={{ color: "#ffffff" }}>And so much more...</Col>
              </Row>                     
            </Row>
            <Row style={{ paddingTop: "20px", color: "#ffffff" }}>
              <Col xs={4}>ALLOW LIST</Col>
              <Col>Mon, March 28 at 12pm ET</Col>
            </Row>
            <Row style={{ paddingTop: "5px", color: "#ffffff" }}>
              <Col xs={4}>PRESALE</Col>
              <Col>Wed, March 30 at 12pm ET</Col>
            </Row>
            <Row style={{ paddingTop: "5px", color: "#ffffff" }}>
              <Col xs={4}>PUBLIC</Col>
              <Col>Fri, April 1 at 12pm ET</Col>
            </Row>
            <Row style={{ paddingTop: "5px", color: "#ffffff" }}>
              <Col xs={4}>PRICE</Col>
              <Col>0.25 ETH</Col>
            </Row>
            <Row style={{ paddingTop: "5px", color: "#ffffff" }}>
              <Col xs={4}>QUANTITY</Col>
              <Col>450 + 50 reserved for team and marketing</Col>
            </Row>
          </Col>
          <Col md={4}>
            <Row style={{ paddingTop:"50px", textAlign: "center" }}>
              <Col><img fluid alt="Future NFT Mints - Genesis NFT Card" src="/config/images/fnftm-card.png" width="80%" className="d-inline-block align-top"/></Col>              
            </Row> 

            <Row style={{ marginTop:"50px", backgroundColor: "#212529", borderRadius: "5px", marginLeft:"1px", marginRight:"1px" }}>
              <Col>
                <Row style={{ paddingTop:"25px" }}>
                  <Col style={{ textAlign: "center", color: "#ffffff", fontSize:"1.5em" }}>Mint a Genesis NFT</Col>
                </Row>

                <Row style={{ paddingTop:"25px" }}>
                  <Col xs={3} style={{ textAlign: "left", color: "#ffffff" }}>PHASE</Col>
                  <Col style={{ textAlign: "left", color: "#ffffff" }}>Pre-Mint. Allow List opens on Mar 28 @ 12pm ET</Col>
                </Row> 
                {/*
                <Row>
                  <Col>
                    <ProgressBar now={data.totalSupply / CONFIG.MAX_SUPPLY * 100} />
                  </Col>                  
                </Row>

                <Row style={{ paddingTop:"5px" }}>                  
                  <Col style={{ textAlign: "left", color: "#ffffff" }}>0.25 ETH</Col>
                  <Col style={{ textAlign: "right", color: "#ffffff" }}>{data.totalSupply} / {CONFIG.MAX_SUPPLY}</Col>
                </Row>

                <Row  style={{ paddingBottom:"25px" }}>
                  <Col xs={12} style={{ paddingTop:"25px", textAlign: "center" }}>
                    <Button style={{ backgroundColor: "#F83700", border: "#F83700", width:"100%" }}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      } }
                    >
                      Connect Wallet
                    </Button>   
                  </Col>
                </Row>      
                */}

                <Row  style={{ paddingBottom:"100px" }}></Row>                  
              
              </Col> 

            </Row>
            
          </Col>
          <Col md={1}></Col>          
        </Row>
        
        <Row style={{ paddingTop: "75px" }}>

          <Col md={3}></Col>            
          <Col md={6} xs={12} style={{ textAlign:"center", fontSize: "2em", color: " #ffffff" }}>
            Frequently Asked Questions
          </Col>
          <Col md={3}></Col>            
        </Row>

        <Row style={{ paddingTop: "20px", paddingBottom: "100px" }}>

          <Col md={3}></Col>            
          <Col md={6} xs={12} style={{ textAlign:"left" }}>
            <Accordion alwaysOpen>
              <Accordion.Item eventKey="0" style={{marginBottom:"10px"}}>
                <Accordion.Header>Accordion Item #1</Accordion.Header>
                <Accordion.Body style={{color:"#fff"}}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                  est laborum.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1" style={{marginBottom:"10px"}}>
                <Accordion.Header>Accordion Item #2</Accordion.Header>
                <Accordion.Body style={{color:"#fff"}}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                  est laborum.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2" style={{marginBottom:"10px"}}>
                <Accordion.Header>Accordion Item #3</Accordion.Header>
                <Accordion.Body style={{color:"#fff"}}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                  est laborum.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3" style={{marginBottom:"10px"}}>
                <Accordion.Header>Accordion Item #4</Accordion.Header>
                <Accordion.Body style={{color:"#fff"}}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                  est laborum.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
          <Col md={3}></Col>            
        </Row>
        
      </Container>

      <s.Screen>
        <s.Container
          flex={1}
          ai={"center"}
          style={{ padding: 24, backgroundColor: "var(--primary)" }}
          image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
        >
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
          <s.SpacerSmall />
          <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg alt={"example"} src={"/config/images/example.gif"} />
            </s.Container>
            <s.SpacerLarge />
            <s.Container
              flex={2}
              jc={"center"}
              ai={"center"}
              style={{
                backgroundColor: "var(--accent)",
                padding: 24,
                borderRadius: 24,
                border: "4px dashed var(--secondary)",
                boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              }}
            >
              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 50,
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                {data.totalSupply} / {CONFIG.MAX_SUPPLY}
              </s.TextTitle>
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "var(--primary-text)",
                }}
              >
                <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                  {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                </StyledLink>
              </s.TextDescription>
              <s.SpacerSmall />
              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    The sale has ended.
                  </s.TextTitle>
                  <s.TextDescription
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    You can still find {CONFIG.NFT_NAME} on
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                    {CONFIG.NETWORK.SYMBOL}.
                  </s.TextTitle>
                  <s.SpacerXSmall />
                  <s.TextDescription
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    Excluding gas fees.
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >
                    View the collection on <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>{CONFIG.MARKETPLACE}</StyledLink>.
                  </s.TextDescription>
                  <s.SpacerSmall />
                  {blockchain.account === "" ||
                    blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        Connect to the {CONFIG.NETWORK.NAME} network using Metamask
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        } }
                      >
                        CONNECT
                      </StyledButton>
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                          style={{ lineHeight: 0.4 }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                          } }
                        >
                          -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {mintAmount}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <StyledRoundButton
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                          } }
                        >
                          +
                        </StyledRoundButton>
                      </s.Container>
                      <s.SpacerSmall />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledButton
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs();
                            getData();
                          } }
                        >
                          {claimingNft ? "BUSY" : "BUY"}
                        </StyledButton>
                      </s.Container>
                    </>
                  )}
                </>
              )}
              <s.SpacerMedium />
            </s.Container>
            <s.SpacerLarge />
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg
                alt={"example"}
                src={"/config/images/example.gif"} />
            </s.Container>
          </ResponsiveWrapper>
          <s.SpacerMedium />
          <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              This was a test mint.You can <StyledLink target={"_blank"} href={CONFIG.OTHER_NFT_LINK}>
                learn more about Future NFT Mints' upcoming Genesis NFT.
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              Please make sure you are connected to the right network (
              {CONFIG.NETWORK.NAME}) and the correct address. Please note:
              Once you make the purchase, you cannot undo this action.
            </s.TextDescription>
            <s.SpacerSmall />
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
              successfully mint your NFT. We recommend that you don't lower the
              gas limit.
            </s.TextDescription>
          </s.Container>
        </s.Container>
      </s.Screen></>
  );
}

export default App;
