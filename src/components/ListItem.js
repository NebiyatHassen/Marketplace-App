import React from "react";
import { View, Text, Image, Button } from "react-native";

const ListingItem = ({ listing, onDelete, onEdit, onView }) => {
  return (
    <View>
      <Image
        source={{ uri: listing.image }}
        style={{ width: 100, height: 100 }}
      />
      <Text>{listing.title}</Text>
      <Text>{listing.price}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="View" onPress={onView} />
        <Button title="Edit" onPress={onEdit} />
        <Button title="Delete" onPress={onDelete} />
      </View>
    </View>
  );
};

export default ListingItem;
