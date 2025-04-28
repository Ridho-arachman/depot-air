import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { useStore } from "@/store/useStore"; // Sesuaikan dengan path store Anda
import { Button, Input, Text, View } from "tamagui";

const Pesanan = () => {
  const store = useStore((state) => state.bears);
  const tambah = useStore((state) => state.increasePopulation);
  const kurang = useStore((state) => state.removeAllBears);
  const updateBears = useStore((state) => state.updateBears);

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Text color={"red"}>{store}</Text>
      <Button onPress={tambah}>TAMBAH</Button>
      <Button onPress={kurang}>KURANG</Button>
      <Input
        value={store.toString()}
        onChangeText={(e: string) => {
          const num = parseInt(e);
          updateBears(num);
        }}
        placeholder="Masukkan angka"
      />
    </View>
  );
};

export default Pesanan;

const styles = StyleSheet.create({});
