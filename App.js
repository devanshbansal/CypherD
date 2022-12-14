import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Button, Dimensions, Image } from 'react-native';
import React from 'react';
import { ImageBackground } from 'react-native';



const API_URL = "https://api.covalenthq.com/v1/1/address/0x6AE65a7033a84bb36778fEA6607A25a0d6c8EE50/balances_v2/?key=ckey_af34717a92384b14b858f3d0d42"
var deviceWidth = Dimensions.get('window').width;

const url = 'https://logos.covalenthq.com/tokens/1/0xc18360217d8f7ab5e7c516566761ea12ce7f9d72.png';





const Item = ({contract_name, contract_ticker_symbol, logo_url, balance, contract_decimals }) => (
  <View style={styles.item}>
    <View style={styles.listItem}>
    <Image
        style={styles.tinyLogo}
        source={{
uri:logo_url
        }}
      />
        <View style={{flexDirection: 'row', flex:4}}>
  

          <View style={{flexDirection:'column'}}>
    <Text style={styles.title}>{contract_name}</Text>
    <Text style={styles.title}>{contract_ticker_symbol}</Text>
    </View>

    <View style={{flexDirection:'column', paddingLeft:50,}}>
    <Text style={styles.title}>{balance}</Text>
    <Text style={styles.title}>0.9936</Text>
 


    </View>
    </View>
    </View>

    <View
  style={{
    borderBottomColor: 'black',
    width: deviceWidth,
    paddingLeft: 0,
    paddingTop: 5,
    borderBottomWidth: 0.45,
  }}
/>
  </View>
);




export default function App() {
  const parseResult = (jsonRes) => {
    console.log("we are parsing result now");
     setData(jsonRes.data.items);
    console.log("data parsed succesfully");
    console.log(data);
   }
  const [data, setData] = React.useState([]);

  const renderItem = ({ item }) => (
    <Item contract_name={item.contract_name} contract_ticker_symbol={item.contract_ticker_symbol} logo_url={item.logo_url} balance={item.balance} contract_decimals={item.contract_decimals}/>
  );


  const onChangeHandler = () => {
    fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  })
  .then(async res => { 
      try {
          const jsonRes = await res.json();
          if (res.status === 200) {
            parseResult(jsonRes);
          } else {
            console.log("Not working lol")
          }
      } catch (err) {
          console.log(err);
      };
  })
  .catch(err => {
      console.log(err);
  });
  };
  

  const image = { uri: "https://reactjs.org/logo-og.png" };


  return (
    <SafeAreaView style={styles.container}>


    <View style={styles.view}>
    

      <View style={{flexDirection: "column"}}>
  <View style={{height:150}}>
      <Text>Total Balance</Text>
      <Text> 215</Text>
      <View style={styles.button}>
      <Button
        title="Check Balance"
        color="#000"
        style={styles.button}
        onPress={onChangeHandler}
      />
      </View>
      </View>
      <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
  }}
/>
      <FlatList
        data={data}
        renderItem={renderItem}
        extraData={data}
      />
      </View>
    




    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingLeft: 20,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'left',
  },
  view: {
    paddingTop:20,
width: deviceWidth,
  },
  button: {
    position: 'absolute',
    bottom:15,
    borderRadius:10,
    backgroundColor: '#FFFF00',
    right:20
    },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  item: {
    flex:1,
    marginVertical: 8,
  },
  title: {
    paddingLeft:20,
    paddingTop:5,
    fontSize: 11,
  },
  listItem: {
flexDirection: 'row',
paddingLeft:20,
  },
});
