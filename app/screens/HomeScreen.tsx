import MemeSelector from "@/components/MemeSelector";
import { Meme, TrendingMeme, useApi } from "@/hooks/useApi";
import { NavigationProp } from "@react-navigation/native";
import {
  Box,
  Center,
  Container,
  Heading,
  Image,
  ScrollView,
  Skeleton,
  theme,
  useTheme,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Swiper from "react-native-swiper";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

export default HomeScreen = ({ navigation }: RouterProps) => {
  const theme = useTheme();
  const { getTrending } = useApi();
  const [memes, setMemes] = useState<TrendingMeme[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemes = async () => {
      const result = await getTrending();
      setMemes(result);
      setLoading(false);
    };
    loadMemes();
  }, []);

  const memeSelected = (meme: Meme) => {
    console.log("memeselected");
    navigation.navigate("Creator", { meme: meme.name });
  };

  return (
    <ScrollView>
      {loading && (
        <Center w="100%" mt={8}>
          <VStack w="90%" space={4}>
            <Skeleton.Text px="2" />
            <Skeleton h="80" />
          </VStack>
        </Center>
      )}

      {!loading && (
        <Swiper
          style={styles.wrapper}
          showsButtons={true}
          showsPagination={false}
        >
          {memes?.map((meme, index) => (
            <View key={index}>
              <VStack alignItems={"center"} space={4} mt={4}>
                <Heading style={styles.text}>{meme.title}</Heading>
                <Image
                  source={{ uri: meme.url }}
                  resizeMode="contain"
                  alt="image"
                  style={{ width: "95%", height: 300 }}
                />
              </VStack>
            </View>
          ))}
        </Swiper>
      )}

      <Container m={4}>
        <MemeSelector
          onSelect={(meme) => {
            memeSelected(meme);
          }}
        />
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 400,
  },
  text: {
    color: theme.colors.primary[500],
    fontSize: 30,
    fontWeight: "bold",
  },
});
