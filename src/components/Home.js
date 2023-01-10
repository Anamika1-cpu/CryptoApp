import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import btcSrc from "../../src/assets/btc.png";
import { motion } from "framer-motion";
const Home = () => {
  return (
    <Box w={"full"} objectFit={"contain"} bgColor={"blackAlpha.900"} h={"85vh"}>
      <Image
        w={"full"}
        h={"full"}
        filter={"grayscale(1)"}
        objectFit={"contain"}
        src={btcSrc}
      />
      <Text
        fontSize={"6xl"}
        textAlign={"center"}
        fontWeight={"thin"}
        color={"whiteAlpha.600"}
        mt={"-18"}
      >
        FetchCrypto
      </Text>
    </Box>
  );
};

export default Home;
