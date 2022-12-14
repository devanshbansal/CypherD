import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Button, Dimensions, Image } from 'react-native';
import React from 'react';
import { ImageBackground } from 'react-native';


const API_URL = "https://api.covalenthq.com/v1/137/address/0x6AE65a7033a84bb36778fEA6607A25a0d6c8EE50/balances_v2/?key=ckey_af34717a92384b14b858f3d0d42"
var deviceWidth = Dimensions.get('window').width;





const Item = ({contract_name, contract_ticker_symbol, logo_url, balance, contract_decimals,quote_rate }) => (
  
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
    <Text style={styles.nameText}>{contract_name}</Text>
    <Text style={styles.labelText}>{contract_ticker_symbol}</Text>
    </View>

    <View style={{flexDirection:'column', paddingLeft:50,}}>
    <Text style={styles.title}>${(balance/(Math.pow(10, contract_decimals))*quote_rate).toFixed(2)}</Text>
    <Text style={styles.title}>{(balance/(Math.pow(10, contract_decimals))).toFixed(2)}</Text>
 


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
    <Item contract_name={item.contract_name} contract_ticker_symbol={item.contract_ticker_symbol} logo_url={item.logo_url} balance={item.balance} contract_decimals={item.contract_decimals} quote_rate={item.quote_rate}/>
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
    

      <View style={{flexDirection: "column", flex:1}}>
  <View style={{height:150}}>
      <Text style={styles.titleText}>Total Balance</Text>
      <Text style={styles.otherText}>$215</Text>
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
flex:1,
  },

  button: {
    position: 'absolute',
    bottom:15,
    borderRadius:10,
    backgroundColor: '#FFFF00',
    right:20
    },
    titleText: {
      fontSize: 15,
      paddingLeft:20,
      fontWeight: "bold"
    },
    otherText:{
     fontSize: 35,
     fontWeight: "bold",
     paddingLeft: 25,
    },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  item: {
    flex:1,
    marginVertical: 8,
  },
  nameText:{
   fontWeight:"bold",
   fontSize: 15,
   paddingLeft:20,
  },
  labelText:{
    fontSize: 15,
    paddingLeft:20,
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
