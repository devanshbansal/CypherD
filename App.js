import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Button, Dimensions } from 'react-native';

const API_URL = "https://api.covalenthq.com/v1/1/address/0x6AE65a7033a84bb36778fEA6607A25a0d6c8EE50/balances_v2/?key=ckey_af34717a92384b14b858f3d0d42"
var deviceWidth = Dimensions.get('window').width;
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    
    <Text style={styles.title}>{title}</Text>
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
          console.log(jsonRes);
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
    padding:20,
    fontSize: 11,
  },
});
