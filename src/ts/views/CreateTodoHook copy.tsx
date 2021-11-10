
import { Fonts, FontSizes } from '../app/Styles';


const Moralis = require('moralis');
const serverUrl = "https://kyyslozorkna.usemoralis.com:2053/server";
const appId = "eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC";
Moralis.start({ serverUrl, appId });


const _styles = {
  container: RX.Styles.createViewStyle({
    flex: 1,
    backgroundColor: 'transparent',
  }),
  editTodoItem: RX.Styles.createTextInputStyle({
    margin: 8,
    height: 32,
    paddingHorizontal: 4,
    fontSize: FontSizes.size16,
    alignSelf: 'stretch',
  }),
  buttonContainer: RX.Styles.createViewStyle({
    margin: 8,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  grid: RX.Styles.createViewStyle({
    maxWidth: 1024,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#eee"
  }),
  chart: RX.Styles.createViewStyle({
    backgroundColor: "white",
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center'
  }),
  text1: RX.Styles.createTextStyle({
    font: Fonts.displayBold,
    color: 'black',
  }),
  text2: RX.Styles.createTextStyle({
    font: Fonts.displayBold,
    fontSize: 13,
    color: 'black',
  }),
  text3: RX.Styles.createTextStyle({
    font: Fonts.displayBold,
    fontSize: 13,
    color: '#9796CF',
  }),
  text4: RX.Styles.createTextStyle({
    font: Fonts.displayBold,
    fontSize: 13,
    color: 'white',
  }),
};


import * as RX from 'reactxp';

import { useMoralis } from 'react-moralis'
import { useEffect, useState } from 'react';
import SimpleButton from '../controls/SimpleButton';

import * as NumericInput from "react-numeric-input";
export const CreateTodoHook = ({
  width,
  height,
  isTiny,
}: {
  width: number,
  height: number,
  isTiny: boolean
}) => {

  const {
    Moralis,
    isInitialized,
    authenticate,
    enableWeb3,
    isAuthenticated,
    isWeb3Enabled,
  } = useMoralis()
  const [nftTokenAddress, setNftTokenAddress] = useState("0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656")
  const [nftTokenId, setNftTokenId] = useState("16923634234309235305936278977612378847065311654836719990863808853227023106548")
  const [contractType, setContractType] = useState("ERC1155")
  const [amount, setAmount] = useState<any>(0.5)

  useEffect(() => {
    if (isInitialized) {
    }
  }, [])
  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled) {
      enableWeb3();
    } else {
      authenticate()
    }
  }, [isAuthenticated])

  const getAsset = async () => {
    console.log('nftTokenAddress ' + nftTokenAddress)
    console.log('nftTokenId ' + nftTokenId)
    const res = await Moralis.Plugins.opensea.getAsset({
      network: 'testnet',
      tokenAddress: nftTokenAddress,
      tokenId: nftTokenId,
    });
    console.log(res)
  }

  const getOrder = async () => {
    const res = await Moralis.Plugins.opensea.getOrders({
      network: 'testnet',
      tokenAddress: nftTokenAddress,
      tokenId: nftTokenId,
    });
    console.log(res)
  }

  const createSellOrder = async () => { }

  const createBuyOrder = async () => {

    const res = await Moralis.Plugins.opensea.createBuyOrder({
      network: 'testnet',
      tokenAddress: nftTokenAddress,
      tokenId: nftTokenId,
      tokenType: contractType,
      amount: amount,
      userAddress: '0x6057b9bA4BAe35B8128685f342a8e1016b77046d',
      paymentTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    });
    console.log(res)
  }

  return <RX.View>
    <RX.TextInput
      style={_styles.editTodoItem}
      value={nftTokenAddress}
      placeholder={'nftTokenAddress'}
      onChangeText={setNftTokenAddress}
      accessibilityId={'EditTodoPanelTextInput'}
    />
    <RX.TextInput
      style={_styles.editTodoItem}
      value={nftTokenId}
      placeholder={'nftTokenId'}
      onChangeText={setNftTokenId}
      accessibilityId={'EditTodoPanelTextInput'}
    />

    <RX.TextInput
      style={_styles.editTodoItem}
      value={contractType}
      placeholder={"Smart contract Type eg ERC1155"}
      onChangeText={setContractType}
      accessibilityId={'EditTodoPanelTextInput'}
    />

    <RX.View style={_styles.buttonContainer}>

      <RX.Text style={[_styles.text1, {}]} >
        {'Price amount:'}
      </RX.Text>
      <NumericInput height={34} size={5} snap step={0.001} min={0.0001} max={9999999} onChange={setAmount} value={amount} />

    </RX.View>
    <RX.View style={_styles.buttonContainer}>
      <SimpleButton text={'Get Asset'} onPress={getAsset} />
      <SimpleButton text={'Get Order'} onPress={getOrder} />
      <SimpleButton text={'Create Buy Order'} onPress={createBuyOrder} />
      <SimpleButton text={'Create Sell Order'} onPress={createSellOrder} />

    </RX.View>

  </RX.View>


}

