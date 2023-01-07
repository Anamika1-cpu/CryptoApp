import {
  Badge,
  Box,
  Container,
  HStack,
  Image,
  Progress,
  Radio,
  RadioGroup,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "..";
import ErrorComp from "./ErrorComp";
import Loader from "./Loader";
import Chart from "./Chart";

const CoinDetails = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${id}`);

        const { data: chartData } = await axios.get(
          `${server}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
        );
        setChartArray(chartData);
        setCoin(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoin();
  }, [id, currency, days]);
  if (error) return <ErrorComp message={"Error while fetching coin"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        Loader
      ) : (
        <>
          <Box w={"full"} borderWidth={1}>
            <Chart currency={currencySymbol} arr={chartArray} />
          </Box>
          <RadioGroup value={currency} onChange={setCurrency}>
            <HStack spacing={"4"}>
              <Radio value={"inr"}>₹</Radio>
              <Radio value={"eur"}>€</Radio>
              <Radio value={"usd"}>$</Radio>
            </HStack>
          </RadioGroup>
          <VStack spacing={"4"} p={"16"} alignItems={"flex-start"}>
            <Text fontSize={"small"} alignSelf='center' opacity={"0.7"}>
              Last Upated on {Date(coin.market_data.last_updated).split("G")[0]}
            </Text>
            <Image
              src={coin.image.large}
              h={"16"}
              w={"16"}
              objectFit={"contain"}
            />
            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {currencySymbol}
                {coin.market_data.current_price[currency]}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    coin.market_data.price_change_percentage_24h > 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coin.market_data.price_change_percentage_24h}
              </StatHelpText>
            </Stat>
            <Badge
              fontSize={"2xl"}
              bgColor={"blackAlpha.800"}
              color={"white"}
            >{`#${coin.market_cap_rank}`}</Badge>
            <CustomBar
              high={`${coin.market_data.high_24h[currency]}`}
              low={`${coin.market_data.low_24h[currency]}`}
            />
            <Box w={"full"} p='4'>
              <Item title={"Max Supply"} value={coin.market_data.max_supply} />
              <Item
                title={"Circulating Supply"}
                value={coin.market_data.circulating_supply}
              />
              <Item
                title={"Market Cap"}
                value={`${currencySymbol}${coin.market_data.market_cap[currency]}`}
              />
              <Item
                title={"All Time Low"}
                value={`${currencySymbol}${coin.market_data.atl[currency]}`}
              />
              <Item
                title={"All Time High"}
                value={`${currencySymbol}${coin.market_data.ath[currency]}`}
              />
            </Box>
          </VStack>
        </>
      )}
    </Container>
  );
};

const Item = ({ title, value }) => (
  <HStack justifyContent={"space-between"} w={"full"} my='4'>
    <Text fontFamily={"Bebas Neue"}>{title}</Text>
    <Text>{value}</Text>
  </HStack>
);
const CustomBar = ({ high, low }) => (
  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"} />
      <Text fontSize={"sm"}>24H Range</Text>
      <Badge children={high} colorScheme={"green"} />
    </HStack>
  </VStack>
);
export default CoinDetails;
