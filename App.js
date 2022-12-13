import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Button, Dimensions, Image } from 'react-native';

const API_URL = "https://api.covalenthq.com/v1/1/address/0x6AE65a7033a84bb36778fEA6607A25a0d6c8EE50/balances_v2/?key=ckey_af34717a92384b14b858f3d0d42"
var deviceWidth = Dimensions.get('window').width;


var DATA;

const parseResult = (jsonRes) => {
  console.log("we are parsing result now");
  DATA = jsonRes.data.items;
  console.log("data parsed succesfully");
  console.log(DATA);
 }


const Item = ({contract_name,contract_ticker_symbol,logo_url }) => (
  <View style={styles.item}>
    <View style={styles.listItem}>
    <Image
        style={styles.tinyLogo}
        source={{
uri:{logo_url},
        }}
      />
        <View style={{flexDirection: 'row', flex:4}}>
  

          <View style={{flexDirection:'column'}}>
    <Text style={styles.title}>{contract_name}</Text>
    <Text style={styles.title}>{contract_ticker_symbol}</Text>
    </View>

    <View style={{flexDirection:'column', paddingLeft:50,}}>
    <Text style={styles.title}>$23.62</Text>
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


export default function App() {
  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );

  return (
    <SafeAreaView style={styles.container}>

    <View style={styles.view}>
      <View style ={styles.view}>
      <Text>Total Balance</Text>
      <Text> 215</Text>
      <Button
        title="Check Balance"
        onPress={onChangeHandler}
      />
      <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
  }}
/>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      </View>
      <StatusBar style="auto" />
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
