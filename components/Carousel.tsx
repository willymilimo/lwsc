import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import Layouts from "../constants/Layouts";
import Colors from "../constants/Colors";

const Stat = (props: any) => {
  const { label, value, image } = props;

  return (
    <View style={styles.stat}>
      <ImageBackground
        borderRadius={12}
        style={styles.statImage}
        source={typeof image === "string" ? { uri: image } : image}
      >
        <Text
          style={styles.statLabel}
        >
          {label}
        </Text>
      </ImageBackground>
    </View>
  );
};

const Slide = (props: any) => {
  const { title } = props;

  return (
    <View style={styles.slide}>
      <Text style={{ ...styles.slideText }}>{title}</Text>
    </View>
  );
};

export const Carousel = (props: any) => {
  const { items, style } = props;
  const itemsPerInterval =
    props.itemsPerInterval === undefined ? 1 : props.itemsPerInterval;

  const [interval, setInterval] = React.useState(1);
  const [intervals, setIntervals] = React.useState(1);
  const [width, setWidth] = React.useState(0);

  const init = (width: number) => {
    // initialise width
    setWidth(width);
    // initialise total intervals
    const totalItems = items.length;
    setIntervals(Math.ceil(totalItems / itemsPerInterval));
  };

  const getInterval = (offset: any): number => {
    let result = 0;
    for (let i = 1; i <= intervals; i++) {
      if (offset < (width / intervals) * i) {
        return i;
      }
      if (i == intervals) {
        result = i;
      }
    }

    return result;
  };

  let bullets = [];
  for (let i = 1; i <= intervals; i++) {
    bullets.push(
      <Text
        key={i}
        style={{
          ...styles.bullet,
          opacity: interval === i ? 0.5 : 0.1,
        }}
      >
        &bull;
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          ...styles.scrollView,
          width: `${100 * intervals}%`,
        }}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(w, h) => init(w)}
        onScroll={(data) => {
          setWidth(data.nativeEvent.contentSize.width);
          setInterval(getInterval(data.nativeEvent.contentOffset.x));
        }}
        scrollEventThrottle={200}
        pagingEnabled
        decelerationRate="fast"
      >
        {items.map((item: any, index: number) => {
          switch (style) {
            case "stats":
              return (
                <Stat
                  key={index}
                  label={item.label}
                  image={item.image}
                  value={item.value}
                />
              );
            default:
              return (
                <Slide key={index} title={item.title} image={item.image} />
              );
          }
        })}
      </ScrollView>
      <View style={styles.bullets}>{bullets}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsHead: {
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  container: {
    width: "100%",
    backgroundColor: "#fbfbfb",
    borderColor: "#ebebeb",
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: "#fcfcfc",
    shadowOpacity: 1,
    // marginTop: 10,
    // marginVertical: 5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
  scrollView: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
  bullets: {
    position: "absolute",
    top: 0,
    right: 0,
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  bullet: {
    paddingHorizontal: 5,
    fontSize: 20,
  },
  stat: {
    // paddingHorizontal: 20,
    // paddingBottom: 10,
    // paddingTop: 30,
    flexBasis: "50%",
    flex: 1,
    maxWidth: "50%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    position: "relative",
  },
  statImage: {
    borderRadius: 10,
    width: Layouts.window.width - 30,
    height: (448 * (Layouts.window.width - 30)) / 1024,
    alignItems: "center",
    justifyContent: "center",
    // alignSelf: "center",
  },
  statText: {
    width: "100%",
    textAlign: "left",
    fontSize: 20,
  },
  statHold: {
    width: "100%",
    marginBottom: 8,
    borderRadius: 50,
  },
  statLabel: {
    // width: "100%",
    // textAlign: "left",
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 5,
    padding: 10,
    backgroundColor: `${Colors.LwscBlue}55`,
    color: '#fff'
  },
  slide: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 30,
    flexBasis: "100%",
    flex: 1,
    maxWidth: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    height: 200,
  },
  slideText: {
    width: "100%",
    textAlign: "left",
    fontSize: 20,
  },
});

export default Carousel;
