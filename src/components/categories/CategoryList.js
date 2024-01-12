import React, { useRef, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import colors from "../../colors";

const CategoryItem = ({ categoryName, style }) => (
  <TouchableOpacity style={[styles.categoryItem, style]}>
    <Text style={[styles.categoryText, style]}>{categoryName}</Text>
  </TouchableOpacity>
);

const CategoryList = () => {
  const scrollView = useRef();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, animated: true }); // Scroll to left on mount
    }
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        contentContainerStyle={styles.scrollViewContent}
        // onContentSizeChange={() => {
        //   scrollRef.current.scrollToEnd();
        // }}
      >
        {/* Example categories */}
        <CategoryItem
          categoryName="All"
          style={{
            backgroundColor: "#AAD9BB",
            color: colors.white,
            borderColor: "#ccc",
          }}
        />
        <CategoryItem categoryName="SmartPhones" />
        <CategoryItem categoryName="Headphones" />
        <CategoryItem categoryName="Laptops" />
        <CategoryItem categoryName="Charger" />
        <CategoryItem categoryName="Shoes" />
        <CategoryItem categoryName="Clothes" />
        {/* Add more CategoryItem components as needed */}
      </ScrollView>
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexDirection: "row",
    padding: 10,
  },
  categoryItem: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 10,
  },
  categoryText: {
    color: "black",
  },
  scrollView: {
    overflow: "hidden",
  },
});
