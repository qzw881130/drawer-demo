import { Meme, useApi } from "@/hooks/useApi";
import { Center, Heading, Image, Row, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";

interface MemeProps {
  activeMeme?: string;
  onSelect: (meme: Meme) => void;
}

const MemeSelector: React.FC<MemeProps> = (props) => {
  const { getMemes } = useApi();
  const [memes, setMemes] = useState<Meme[] | null>(null);

  useEffect(() => {
    const loadMemes = async () => {
      getMemes().then((result) => {
        setMemes(result);
      });
    };
    loadMemes();
  }, []);

  const memeSelected = (meme: Meme) => {
    console.log("selected", meme);
    props.onSelect(meme);
  };

  return (
    <>
      <Center>
        <Heading>Select your Meme:</Heading>
      </Center>
      <Row
        flexWrap={"wrap"}
        mb={5}
        mt={5}
        alignItems={"center"}
        justifyContent={"center"}
        space={2}
      >
        {memes?.map((meme) => (
          <Pressable
            key={meme.name}
            m={1}
            onPress={() => memeSelected(meme)}
            shadow={2}
          >
            <Image
              source={meme.image}
              size={"lg"}
              borderColor={"cyan.600"}
              borderWidth={props.activeMeme === meme.name ? 4 : 0}
              alt={meme.name}
            />
          </Pressable>
        ))}
      </Row>
    </>
  );
};

export default MemeSelector;
