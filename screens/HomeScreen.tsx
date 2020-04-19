import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Image,
  Animated,
} from "react-native";
import { connect } from "react-redux";
import {
  Appbar,
  Badge,
  IconButton,
  Paper,
  BodyText,
  Menu,
  Button,
  MenuItem,
} from "material-bread";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Octicons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Layouts from "../constants/Layouts";
import { ScrollView } from "react-native-gesture-handler";
import Carousel from "../components/Carousel";
import { banner_1, banner_2, banner_3 } from "../constants/Images";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { setTheme } from "../redux/actions/theme";
import HeaderComponent from "../components/HeaderComponent";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const {
    container,
    scrollViewStyle,
    carousel,
    btnsBox,
    btnStyle,
    iconContainer,
  } = styles;
  const navigation = useNavigation();

  const [marginLeft, setMarginLeft] = React.useState(new Animated.Value(0));

  const animateMarginLeft = (size: number, iteration = 1) => {
    const modulo = iteration % size;
    const end = isNaN(modulo) ? 0 : -(modulo * Layouts.window.width);

    Animated.sequence([
      Animated.delay(iteration === 1 ? 0 : 7000),
      Animated.timing(marginLeft, {
        toValue: end,
        duration: 500,
        // useNativeDriver: true,
      }),
    ]).start(() => {
      animateMarginLeft(size, iteration + 1);
    });
  };

  return (
    <SafeAreaView style={container}>
      {/* <HeaderComponent title="LWSC" /> */}
      <ScrollView style={scrollViewStyle}>
        <Paper
          style={{
            height: 166,
            width: Layouts.window.width - 30,
            marginTop: 15,
            borderRadius: 10,
            alignItems: "center",
            alignSelf: "center",
          }}
          elevation={2}
        >
          <Carousel
            style="stats"
            itemsPerInterval={1}
            items={[
              {
                label: "Sanitization is Health!",
                value: 2,
                image: banner_2,
              },
              {
                label: "Rehabilitation of Kaunda Square ponds.",
                value: 3,
                image: banner_3,
              },
              {
                label: "Water is Life... Value it!",
                value: 1,
                image: banner_1,
              },
            ]}
          />
        </Paper>
        <View style={btnsBox}>
          {btns.map((btn) => (
            <Button
              key={btn.component}
              onPress={() => navigation.navigate(btn.component)}
              style={{
                height: Layouts.window.width / 2 - 80,
                width: Layouts.window.width / 2 - 80,
                flexDirection: "column",
                marginRight: 24,
                padding: 20,
                backgroundColor: "#fff",
                shadowColor: Colors.LwscBlue,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                marginBottom: 25,
                borderColor: "white",
              }}
              type={"outlined"}
              borderSize={0}
              radius={10}
            >
              <View style={[iconContainer, { backgroundColor: btn.color }]}>
                {btn.icon}
              </View>
              <Text style={{ fontWeight: "600", textAlign: "center" }}>
                {btn.label}
              </Text>
            </Button>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const btns = [
  {
    icon: <FontAwesome name="credit-card" color="#00bb27" size={25} />,
    label: "Make Payment",
    color: `#00bb2723`,
    component: Strings.ManageAccountsScreen,
  },
  {
    icon: <FontAwesome name="map-marker" color="maroon" size={40} />,
    label: "Pay Points",
    color: "#ff000023",
    component: Strings.LocatePayPointScreen,
  },
  {
    icon: <Octicons name="settings" color={Colors.LwscBlack} size={30} />,
    label: "Services",
    color: "#00000023",
    component: Strings.ServicesScreen,
  },
  {
    icon: (
      <MaterialCommunityIcons
        name="pipe-disconnected"
        color="#1081e9"
        size={30}
      />
    ),
    label: "Request Connection",
    color: "#1081e923",
    component: "test",
  },
  {
    icon: <Entypo name="drop" color="#1ac3ee" size={30} />,
    label: "Report Leakage",
    color: "#1ac3ee23",
    component: "test2",
  },
  {
    icon: (
      <MaterialIcons
        name="report-problem"
        color={Colors.LwscOrange}
        size={30}
      />
    ),
    label: "Lodge Complaint",
    color: "#fdd02333",
    component: "test3",
  },
];

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  scrollViewStyle: {
    display: "flex",
    flex: 1,
    // backgroundColor: 'red'
  },
  carousel: {},
  btnsBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 50,
    justifyContent: "space-between",
    paddingTop: 20,
  },
  btnStyle: {
    height: 120,
    width: 120,
    marginBottom: 25,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 65,
    height: 65,
    padding: 5,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
});

const mapStateToProps = ({ theme }: RootReducerI) => ({ theme });

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setTheme,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
