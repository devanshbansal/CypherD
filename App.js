import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Button, Dimensions, Image } from 'react-native';
import React from 'react';
import { ImageBackground } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-elements';



var deviceWidth = Dimensions.get('window').width;





const Item = ({ contract_name, contract_ticker_symbol, logo_url, balance, contract_decimals, quote_rate }) => (

  <View style={styles.item}>
    <View style={styles.listItem}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: logo_url
        }}
      />
      <View style={{ flexDirection: 'row', flex: 4 }}>


        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.nameText}>{contract_name}</Text>
          <Text style={styles.labelText}>{contract_ticker_symbol}</Text>
        </View>

        <View style={{ flexDirection: 'column', paddingLeft: 50, }}>
          <Text style={styles.title}>${(balance / (Math.pow(10, contract_decimals)) * quote_rate).toFixed(2)}</Text>
          <Text style={styles.title}>{(balance / (Math.pow(10, contract_decimals))).toFixed(2)}</Text>



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


  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState([
    { label: 'Ethereum', value: '1' },   /* Blockchains and their chain-ids */
    { label: 'Polygon', value: '137' },
    { label: 'Fantom', value: '25'}
  ]);
  const API_URL = "https://api.covalenthq.com/v1/"+value+"/address/0x6AE65a7033a84bb36778fEA6607A25a0d6c8EE50/balances_v2/?key=ckey_af34717a92384b14b858f3d0d42"

  const [data, setData] = React.useState([]);

  const renderItem = ({ item }) => (
    <Item contract_name={item.contract_name} contract_ticker_symbol={item.contract_ticker_symbol} logo_url={item.logo_url} balance={item.balance} contract_decimals={item.contract_decimals} quote_rate={item.quote_rate} />
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


        <View style={{ flexDirection: "column"}}>

          <View style={{ flexDirection:"column",flex:1.8}}>
            <View style={{flex:1 , flexDirection:"column"}}>
            <Text style={styles.titleText}>Total Balance</Text>
            <Text style={styles.otherText}>$215</Text>
            </View>
            <View style={{flex:1,paddingBottom:15, width:150, left:220}}>
            <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      dropDownContainerStyle={{zIndex: 1000 }}
    />
            </View>
            <View style={styles.button}>

              <Button
                title="Check Balance"
                color="#000"
                style={styles.button}
                onPress={onChangeHandler}
              />

            </View>
            <Divider orientation="horizontal" />
          </View>

          <View
            style={{
              flex:4
            }}
          >
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
    paddingTop: 20,
    width: deviceWidth,
    flex: 1,
  },

  button: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 15,
    flex:1,
    zIndex:20,
    borderRadius: 10,
    backgroundColor: '#FFFF00',
    right: 20
  },

  dropdown: {
    position: 'absolute',
    bottom: 15,
    flex:2,
    paddingTop: 40,
    borderRadius: 10,
    backgroundColor: '#FFFF00',

  },
  titleText: {
    paddingTop:20,
    fontSize: 15,
    paddingLeft: 20,
    fontWeight: "bold"
  },
  otherText: {
    fontSize: 35,
    paddingLeft: 25,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  item: {
    flex: 1,
    marginVertical: 8,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 15,
    paddingLeft: 20,
  },
  labelText: {
    fontSize: 15,
    paddingLeft: 20,
  },
  title: {
    paddingLeft: 20,
    paddingTop: 5,
    fontSize: 11,
  },
  listItem: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
});
