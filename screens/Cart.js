import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import Web3 from 'web3'

import PaymentReciever from '../abis/PaymentsReciever.json'
import { CartContext } from '../CartContext';

export function Cart ({navigation}) {
  const SHOP_HASH = "14851888cf824d1588209f3afbbfa9d2275da13e228c93765dd00d895530ded1";
  var ACCOUNT;
  var PAYMENT_RECIEVER;


  const {items, getItemsCount, getTotalPrice} = useContext(CartContext);
  
  function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      window.ethereum.enable()
      return true;
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      return true;
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      return false;
    }
  }

  async function setupContract() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    ACCOUNT = accounts[0];
    
    const networkId = await web3.eth.net.getId()
    const networkData = PaymentReciever.networks[networkId]
    if (networkData) {
      PAYMENT_RECIEVER = new web3.eth.Contract(PaymentReciever.abi, networkData.address);      
    } else {
      window.alert('PaymentReciever contract not deployed to detected network.')
    }
  }
  
  async function handlePayment(sum){
    loadWeb3()
    await setupContract()

    var response;
    await fetch(`http://localhost:3001/crypto/conversions?price=${sum}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    }).then(res => res.json()).then(data => response = data.price);
    PAYMENT_RECIEVER.methods.pay(SHOP_HASH, response).send({ from: ACCOUNT }).once('receipt', (receipt) => {
      console.log(receipt);
    });

    const response2 = await fetch(`http://localhost:3001/payments`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        shopHash: SHOP_HASH,
        rubAmount: sum,
        etherAmount: response,
        payerAddress: ACCOUNT
      })
    }).then(res => res.json()).then(data => console.log(data));
  }

  function Totals() {
    let [total, setTotal] = useState(0);
    useEffect(() => {
      setTotal(getTotalPrice());
    });
    return (
       <View style={styles.cartLineTotal}>
          <Text style={[styles.lineLeft, styles.lineTotal]}>Total</Text>
          <Text style={styles.lineRight}>$ {total}</Text>
          <Button  title="Buy" onPress={async () => {
            await handlePayment(total);
          }} />
          <Button title="Admin panel" onPress={async () => {
            navigation.navigate('Admin');
          }} />
       </View>
       
    );
  }

  function renderItem({item}) {
    return (
       <View style={styles.cartLine}>
          <Text style={styles.lineLeft}>{item.product.name} x {item.qty}</Text>
          <Text style={styles.lineRight}>$ {item.totalPrice}</Text>
          
       </View>
    );
  }
  
  return (
    <FlatList
      style={styles.itemsList}
      contentContainerStyle={styles.itemsListContainer}
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.product.id.toString()}
      ListFooterComponent={Totals}
    />
  );
}

const styles = StyleSheet.create({
  cartLine: { 
    flexDirection: 'row',
  },
  cartLineTotal: { 
    flexDirection: 'row',
    borderTopColor: '#dddddd',
    borderTopWidth: 1
  },
  lineTotal: {
    fontWeight: 'bold',    
  },
  lineLeft: {
    fontSize: 20, 
    lineHeight: 40, 
    color:'#333333' 
  },
  lineRight: { 
    flex: 1,
    fontSize: 20, 
    fontWeight: 'bold',
    lineHeight: 40, 
    color:'#333333', 
    textAlign:'right',
  },
  itemsList: {
    backgroundColor: '#eeeeee',
  },
  itemsListContainer: {
    backgroundColor: '#eeeeee',
    paddingVertical: 8,
    marginHorizontal: 8,
  },
});
