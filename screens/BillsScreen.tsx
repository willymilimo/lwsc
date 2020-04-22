import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import BillComponent from "../components/BillComponent";

const DATA = [
  {
    _id: "92FA9D4C-F498-CDA7-A1DC-51ABB1C36712",
    meter_number: "68500248599",
    meter_reading: 2452511,
    account_number: "405363-4913",
    name: "Lucius Mooney",
    address: "P.O. Box 769, 1803 Metus. Rd.",
    amount_due: 3241447,
    usage: 633715,
  },
  {
    _id: "EFB9CAC7-0837-6800-8A3C-A806436FF987",
    meter_number: "49805808199",
    meter_reading: 3121606,
    account_number: "522592-4082",
    name: "Eden G. Dodson",
    address: "P.O. Box 609, 4898 Massa Av.",
    amount_due: 2623067,
    usage: 739444,
  },
  {
    _id: "D2ED4971-200F-7C19-9299-62F52FBA388B",
    meter_number: "43933825599",
    meter_reading: 670259,
    account_number: "686176-7470",
    name: "Emmanuel U. Adkins",
    address: "Ap #665-7344 Elementum Av.",
    amount_due: 7417369,
    usage: 140601,
  },
  {
    _id: "958F8AA8-5F93-EC49-25C7-6F59D1083DC9",
    meter_number: "06273344899",
    meter_reading: 4345435,
    account_number: "464044-3877",
    name: "Simone Hewitt",
    address: "393-6963 Consequat Rd.",
    amount_due: 565819,
    usage: 170050,
  },
  {
    _id: "491CD2E2-CF15-2001-04BE-22ED9BF64939",
    meter_number: "54732178699",
    meter_reading: 9183699,
    account_number: "289673-7950",
    name: "Serina H. Merritt",
    address: "P.O. Box 263, 4913 Donec St.",
    amount_due: 9819675,
    usage: 992635,
  },
  {
    _id: "53C9088E-F496-8EB5-672F-1C94E4969F41",
    meter_number: "80551743199",
    meter_reading: 4054926,
    account_number: "459791-1207",
    name: "Rhiannon Mcpherson",
    address: "Ap #840-9058 Eu St.",
    amount_due: 5001416,
    usage: 987527,
  },
  {
    _id: "2C576A7E-35E3-B7DF-FCA2-87BF8122D8E5",
    meter_number: "18702390799",
    meter_reading: 6603733,
    account_number: "848403-9014",
    name: "Shelby Y. Wiley",
    address: "P.O. Box 731, 1259 Pede. Avenue",
    amount_due: 4722682,
    usage: 812076,
  },
  {
    _id: "0A062227-F3B5-1554-BF17-F4F0142D8D7B",
    meter_number: "89687978599",
    meter_reading: 7825372,
    account_number: "676419-9086",
    name: "Brittany H. Ashley",
    address: "P.O. Box 320, 1443 Dapibus Rd.",
    amount_due: 460774,
    usage: 973891,
  },
  {
    _id: "0BEDC5D9-E576-D02D-76C5-B601AD123E03",
    meter_number: "19971247999",
    meter_reading: 3816763,
    account_number: "297583-7408",
    name: "Lyle U. Montoya",
    address: "141-6380 Suspendisse Av.",
    amount_due: 2463355,
    usage: 186806,
  },
  {
    _id: "975EFE58-3766-F58C-68EE-4A51715B4843",
    meter_number: "01822831399",
    meter_reading: 9175433,
    account_number: "622434-7978",
    name: "Macon T. Woodward",
    address: "7355 Ac St.",
    amount_due: 8216310,
    usage: 516779,
  },
  {
    _id: "D09CE237-1391-E90C-477E-C0D2FC2435E9",
    meter_number: "90837209199",
    meter_reading: 9874504,
    account_number: "683764-3169",
    name: "Cassandra Jordan",
    address: "Ap #888-5189 Sit Road",
    amount_due: 8101169,
    usage: 763283,
  },
  {
    _id: "86EB1F86-C378-A8CF-F0D6-01D34C760BCF",
    meter_number: "38425520299",
    meter_reading: 8669111,
    account_number: "904422-7446",
    name: "Matthew Witt",
    address: "242-343 Dis Rd.",
    amount_due: 3201486,
    usage: 481720,
  },
  {
    _id: "97FE213A-374A-2C8D-083D-4F1ED2066437",
    meter_number: "44901866199",
    meter_reading: 8204480,
    account_number: "025543-2155",
    name: "Declan Conrad",
    address: "P.O. Box 181, 1337 Adipiscing, Road",
    amount_due: 413080,
    usage: 561699,
  },
  {
    _id: "91BD0685-0FDC-5DD0-E95E-47F9B22B5EAE",
    meter_number: "33943899699",
    meter_reading: 2872831,
    account_number: "127015-0533",
    name: "Silas R. Obrien",
    address: "P.O. Box 824, 2328 Nonummy Street",
    amount_due: 9962797,
    usage: 349755,
  },
  {
    _id: "8DE12EFA-60AC-55AF-BBAC-064B19C2479A",
    meter_number: "03881625699",
    meter_reading: 2919605,
    account_number: "267506-1820",
    name: "Jacqueline Crawford",
    address: "Ap #473-3787 Penatibus Av.",
    amount_due: 5198861,
    usage: 181807,
  },
  {
    _id: "E89CC67E-195F-FDB3-6572-0077C298E138",
    meter_number: "90771409999",
    meter_reading: 4337927,
    account_number: "034773-6035",
    name: "Holmes P. Curry",
    address: "831-9920 Non, Avenue",
    amount_due: 2892001,
    usage: 931952,
  },
  {
    _id: "46E54BCA-7996-A6B5-914A-E3E5812296E9",
    meter_number: "44627039199",
    meter_reading: 991809,
    account_number: "127766-2274",
    name: "Dora X. Wallace",
    address: "484-3295 Nec Street",
    amount_due: 2436518,
    usage: 847628,
  },
  {
    _id: "7AFFADF5-E8A4-BF4E-8546-338965830BC7",
    meter_number: "56607255599",
    meter_reading: 3158325,
    account_number: "445907-3039",
    name: "Alfonso L. Mayo",
    address: "P.O. Box 362, 6599 Quis St.",
    amount_due: 474901,
    usage: 449326,
  },
  {
    _id: "85A15BCF-B8EB-6393-F116-624F27BB4857",
    meter_number: "40285752899",
    meter_reading: 1868244,
    account_number: "118912-7481",
    name: "Preston Bush",
    address: "1429 Nullam Road",
    amount_due: 9560658,
    usage: 575325,
  },
  {
    _id: "4985A23A-7B84-FCD7-2094-01FC90CDD29E",
    meter_number: "45404138399",
    meter_reading: 1128537,
    account_number: "924251-3290",
    name: "Ronan Higgins",
    address: "6474 A, Av.",
    amount_due: 5753401,
    usage: 518474,
  },
  {
    _id: "4D58B81C-B944-9026-F468-A0C4D2E8FF94",
    meter_number: "83536086799",
    meter_reading: 232393,
    account_number: "645010-9712",
    name: "Cynthia Petersen",
    address: "881-253 Nisi. Road",
    amount_due: 8527308,
    usage: 53690,
  },
  {
    _id: "590B484A-6C84-95F7-3552-488D5BB9FE1F",
    meter_number: "27825595399",
    meter_reading: 9831749,
    account_number: "839275-2054",
    name: "Georgia C. Dawson",
    address: "P.O. Box 757, 9445 Nibh. Rd.",
    amount_due: 5179946,
    usage: 998123,
  },
];

const BillsScreen = () => {
  const { container } = styles;
  return (
    <SafeAreaView style={container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <BillComponent
            _id={item._id}
            name={item.name}
            address={item.address}
            meter_number={item.meter_number}
            account_number={item.account_number}
            meter_reading={item.meter_reading}
            usage={item.usage}
            amount_due={item.amount_due}
            onPress={() => console.log("clicked...")}
          />
        )}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
};

export default BillsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
