
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
    width: 700,
    height: 32,
    paddingHorizontal: 4,
    fontSize: FontSizes.size16,
    alignSelf: 'stretch',
  }),
  editTodoItem2: RX.Styles.createTextInputStyle({
    margin: 8,
    width: 300,
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
  label: RX.Styles.createTextStyle({
    font: Fonts.displayBold,
    fontSize: FontSizes.size12,
    color: 'black',
  })
};


import * as RX from 'reactxp';

import { useMoralis } from 'react-moralis'
import { useEffect, useMemo, useState } from 'react';

import { BsFillCollectionFill } from "@react-icons/all-files/bs/BsFillCollectionFill";


import * as UI from '@sproutch/ui';
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
    user,
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

  const [startAmount, setStartAmount] = useState<any>(1)
  const [endAmount, setEndAmount] = useState<any>(0.0001)
  const [currentNav, setNav] = useState('toAsset')

  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState('')
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
  const web3Account = useMemo(() => isAuthenticated && user?.get("accounts")[0],
    [user, isAuthenticated])

  const toSellOrder = async () => {
    setAlert('')
    setNav('toSellOrder')
  }
  const toBuyOrder = async () => {
    setAlert('')
    setNav('toBuyOrder')
  }
  const toAsset = async () => {
    setAlert('')
    setNav('toAsset')
  }
  const toOrder = async () => {
    setAlert('')
    setNav('toOrder')
  }

  const getAsset = async () => {
    setLoading(true)
    setAlert('')
    try {
      const res = await Moralis.Plugins.opensea.getAsset({
        network: 'testnet',
        tokenAddress: nftTokenAddress,
        tokenId: nftTokenId,
      });
      setAlert(JSON.stringify(res))
      console.log(JSON.stringify(res))
      setLoading(false)

    } catch (error) {
      setAlert(error.message)
      setLoading(false)

    }
  }


  const getOrder = async () => {
    setAlert('')
    setLoading(true)

    try {
      const res = await Moralis.Plugins.opensea.getOrders({
        network: 'testnet',
        tokenAddress: nftTokenAddress,
        tokenId: nftTokenId,
      });
      setAlert(JSON.stringify(res))

      console.log(JSON.stringify(res))
      setLoading(false)

    } catch (error) {
      setLoading(false)

      setAlert(error.message)
    }
  }

  const createSellOrder = async () => {
    setAlert('')
    setLoading(true)
    try {

      await Moralis.Plugins.opensea.createSellOrder({
        network: 'testnet',
        tokenAddress: nftTokenAddress,
        tokenId: nftTokenId,
        tokenType: contractType,
        userAddress: web3Account,
        startAmount,
        endAmount,
        // expirationTime: expirationTime, Only set if you startAmount > endAmount
      });
      setLoading(false)

      setAlert("Sell Order create successful")
    } catch (error) {
      setAlert(error.message)
      setLoading(false)

      console.log(error.message[0].message)
    }
  }

  const createBuyOrder = async () => {
    setAlert('')
    setLoading(true)

    try {
      const res = await Moralis.Plugins.opensea.createBuyOrder({
        network: 'testnet',
        tokenAddress: nftTokenAddress,
        tokenId: nftTokenId,
        tokenType: contractType,
        amount: amount,
        userAddress: web3Account,
        paymentTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
      });
      console.log(res)
      setLoading(false)

      setAlert("Buy Order create successful")
    } catch (error) {
      setLoading(false)

      // Expire this auction one day from now.
      // Note that we convert from the JavaScript timestamp (milliseconds):
      // const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24);
      setAlert(error.message)
      console.log(error.message)
    }
  }

  return <RX.ScrollView style={{ flex: 1, alignSelf: 'stretch' }} >

    <RX.View style={{ flex: 1, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>


      <UI.Button onPress={() => toAsset()} iconSlot={(iconStyle: any) => (
        <BsFillCollectionFill color={'#FF296D'} style={{ marginTop: 0, alignSelf: 'center', marginRight: 5, width: 14, height: 14 }} />
      )} style={{ root: [{ marginLeft: 15, height: 35 }], content: [{ width: 200, borderRadius: 11, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }], label: _styles.label }
      } elevation={4} variant={"outlined"} label="Get Asset" />

      <UI.Button onPress={() => toOrder()} iconSlot={(iconStyle: any) => (
        <BsFillCollectionFill color={'#FF296D'} style={{ marginTop: 0, alignSelf: 'center', marginRight: 5, width: 14, height: 14 }} />
      )} style={{ root: [{ marginLeft: 15, height: 35 }], content: [{ width: 200, borderRadius: 11, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }], label: _styles.label }
      } elevation={4} variant={"outlined"} label="Get Order" />

      <RX.View style={{ width: 10 }}>

      </RX.View>
      <RX.View style={{ width: 10 }}></RX.View>

    </RX.View>
    <RX.View style={{ flex: 1, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>


      <UI.Button onPress={() => toBuyOrder()} iconSlot={(iconStyle: any) => (
        <BsFillCollectionFill color={'#FF296D'} style={{ marginTop: 0, alignSelf: 'center', marginRight: 5, width: 14, height: 14 }} />
      )} style={{ root: [{ marginLeft: 15, height: 35 }], content: [{ width: 200, borderRadius: 11, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }], label: _styles.label }
      } elevation={4} variant={"outlined"} label="Create Buy Order" />



      <UI.Button onPress={() => toSellOrder()} iconSlot={(iconStyle: any) => (
        <BsFillCollectionFill color={'#FF296D'} style={{ marginTop: 0, alignSelf: 'center', marginRight: 5, width: 14, height: 14 }} />
      )} style={{ root: [{ marginLeft: 15, height: 35 }], content: [{ width: 200, borderRadius: 11, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }], label: _styles.label }
      } elevation={4} variant={"outlined"} label="Create Sell Order" />
      <RX.View style={{ width: 10 }}>

      </RX.View>
      <RX.View style={{ width: 10 }}></RX.View>

    </RX.View>
    <RX.Text style={[_styles.text1, {}]} >
      {'NFT Token Address'}
    </RX.Text>
    <RX.TextInput
      style={_styles.editTodoItem}
      value={nftTokenAddress}
      placeholder={'nftTokenAddress'}
      onChangeText={setNftTokenAddress}
      accessibilityId={'EditTodoPanelTextInput'}
    />
    <RX.Text style={[_styles.text1, {}]} >
      {'NFT Token ID'}
    </RX.Text>
    <RX.TextInput
      style={_styles.editTodoItem}
      value={nftTokenId}
      placeholder={'nftTokenId'}
      onChangeText={setNftTokenId}
      accessibilityId={'EditTodoPanelTextInput'}
    />

    <RX.Text style={[_styles.text1, {}]} >
      {'Smart Contract Type ERC721 or ERC1155'}
    </RX.Text>
    <RX.TextInput
      style={_styles.editTodoItem2}
      value={contractType}
      placeholder={"Smart contract Type eg ERC1155"}
      onChangeText={setContractType}
      accessibilityId={'EditTodoPanelTextInput'}
    />

    {currentNav === 'toBuyOrder' ? <RX.View style={_styles.buttonContainer}>

      <RX.Text style={[_styles.text1, {}]} >
        {'Order amount:'}
      </RX.Text>
      <NumericInput height={34} size={5} snap step={0.001} min={0.0001} max={9999999} onChange={setAmount} value={amount} />

    </RX.View> : null
    }
    {currentNav === 'toSellOrder' ? <RX.View style={_styles.buttonContainer}>

      <RX.Text style={[_styles.text1, {}]} >
        {'Start Amount:'}
      </RX.Text>
      <NumericInput height={34} size={5} snap step={0.001} min={0.0001} max={9999999} onChange={setStartAmount} value={startAmount} />

    </RX.View> : null
    }
    {currentNav === 'toSellOrder' ? <RX.View style={_styles.buttonContainer}>

      <RX.Text style={[_styles.text1, {}]} >
        {'End Amount:'}
      </RX.Text>
      <NumericInput height={34} size={5} snap step={0.001} min={0.0001} max={9999999} onChange={setEndAmount} value={endAmount} />

    </RX.View> : null}
    {loading ? <UI.Spinner size={'medium'} style={{ marginBottom: 5, alignSelf: 'center', }} color={'black'} /> :
      < RX.View style={_styles.buttonContainer}>
        {currentNav === 'toAsset' ?
          <UI.Button onPress={() => getAsset()} iconSlot={(iconStyle: any) => (
            <BsFillCollectionFill color={'#FF296D'} style={{ marginTop: 0, alignSelf: 'center', marginRight: 5, width: 14, height: 14 }} />
          )} style={{ root: [{ marginLeft: 15, height: 35 }], content: [{ width: 200, borderRadius: 11, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }], label: _styles.label }
          } elevation={4} variant={"outlined"} label="Get Asset" />
          : null}
        {currentNav === 'toOrder' ?
          <UI.Button onPress={() => getOrder()} iconSlot={(iconStyle: any) => (
            <BsFillCollectionFill color={'#FF296D'} style={{ marginTop: 0, alignSelf: 'center', marginRight: 5, width: 14, height: 14 }} />
          )} style={{ root: [{ marginLeft: 15, height: 35 }], content: [{ width: 200, borderRadius: 11, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }], label: _styles.label }
          } elevation={4} variant={"outlined"} label="Get Order" />
          : null}

        {currentNav === 'toBuyOrder' ?
          <UI.Button onPress={() => createBuyOrder()} iconSlot={(iconStyle: any) => (
            <BsFillCollectionFill color={'#FF296D'} style={{ marginTop: 0, alignSelf: 'center', marginRight: 5, width: 14, height: 14 }} />
          )} style={{ root: [{ marginLeft: 15, height: 35 }], content: [{ width: 200, borderRadius: 11, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }], label: _styles.label }
          } elevation={4} variant={"outlined"} label="Create Buy Order" />
          : null}

        {currentNav === 'toSellOrder' ?
          <UI.Button onPress={() => createSellOrder()} iconSlot={(iconStyle: any) => (
            <BsFillCollectionFill color={'#FF296D'} style={{ marginTop: 0, alignSelf: 'center', marginRight: 5, width: 14, height: 14 }} />
          )} style={{ root: [{ marginLeft: 15, height: 35 }], content: [{ width: 200, borderRadius: 11, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }], label: _styles.label }
          } elevation={4} variant={"outlined"} label="Create Sell Order" />
          : null}


      </RX.View>
    }
    {alert === '' ? null :
      <RX.Text style={[_styles.text1, {}]} >
        {alert}
      </RX.Text>}

  </RX.ScrollView >


}

