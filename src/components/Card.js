import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React from "react";
import colors from "../colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { image500 } from "../../utils/moviesapi";
var { width, height } = Dimensions.get("window");

const Card = ({ item, handleClick, style }) => {
  console.log(item);
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
      <View style={[styles.card]}>
        <Image
          source={{
            uri: item.image,
          }}
          style={[
            {
              width: width * 0.65,
              height: height * 0.25,
            },
            style,
          ]}
          resizeMode="contain"
          className="rounded-2xl"
        />
        <View style={styles.detailContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subTitle}>{`$${item.price}`}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    borderRadius: 25,
    backgroundColor: "#fff",
    marginBottom: 20,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  detailContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  title: {
    marginBottom: 7,
  },
  subTitle: {
    color: "#AAD9BB",
    fontWeight: "bold",
  },
});
