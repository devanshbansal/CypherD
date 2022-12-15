import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Button, Dimensions, Image } from 'react-native';
import React from 'react';
import { ImageBackground } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-elements';
import axios from "axios";

var deviceWidth = Dimensions.get('window').width;


const Item = ({ name,symbol, balance,tokens, logo_url }) => (

  <View style={styles.item}>
    <View style={styles.listItem}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: logo_url
        }}
      />
      <View style={{ flexDirection: 'row', flex: 4 }}>


        <View style={{ flexDirection: 'column', flex:1 }}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.labelText}>{symbol}</Text>
        </View>

<View style={{flexDirection:'row', flex:1, justifyContent:'space-between', textAlign:'right',paddingLeft:50}}>
        <View style={{ flexDirection: 'column', left: 0 }}>
          <Text style={styles.title}>${balance}</Text>
          <Text style={styles.title}>{tokens}</Text>
          </View>


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
  

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(1);
  const[totalBalance, setTotalBalance] = React.useState(0);
  const [items, setItems] = React.useState([
    { label: 'Ethereum', value: '1' },   /* Blockchains and their chain-ids */
    { label: 'Polygon', value: '137' },
    { label: 'Fantom', value: '25'}
  ]);
  const [data, setData] = React.useState([]);

  const renderItem = ({ item }) => (
    <Item name={item.name} symbol={item.symbol} logo_url={item.logo_url} balance={item.balance} tokens={item.tokens} />
  );
  

  const onChangeHandler = () => {
    console.log(API_URL)
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
            setData(jsonRes.items);
            setTotalBalance(jsonRes.totalBalance);
          } else {
            console.log(res.status)
          }
        } catch (err) {
          console.log(err);
        };
      })
      .catch(err => {
        console.log(err);
      });
  };

  const API_URL = "http://localhost:3000/getWalletBalance?chainID="+value;

  return (
    <SafeAreaView style={styles.container}>


        <View style={{ flexDirection: "column"}}>

          <View style={{ flexDirection:"column",flex:1.8, backgroundColor: "#ffdc00"}}>
            <View style={{flex:1 , flexDirection:"column"}}>
            <Text style={styles.titleText}>Total Balance</Text>
            <Text style={styles.otherText}>${totalBalance}</Text>
            </View>
            <View style={{flex:1,paddingBottom:15, width:150, left:220}}>
            <DropDownPicker
      open={open}
      value={value}
      defaultValue={value}
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
    left:225,
    borderRadius: 10,
    backgroundColor: '#ff9d00',
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
    paddingLeft: 18,
    fontWeight: "bold"
  },
  otherText: {
    fontSize: 32,
    paddingLeft: 15,
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
    fontSize: 11,
    paddingLeft: 20,
  },
  labelText: {
    fontSize: 15,
    paddingLeft: 20,
  },
  title: {
    paddingLeft: 20,
    paddingTop: 5,
    fontSize: 15,
    textAlign:'left',
  },
  listItem: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
});
