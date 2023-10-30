import {
  View,
  Text,
  Dimensions,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { style } from "../theme";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import {
  fallbackPersonImage,
  fetchPersonDetails,
  fetchPersonMovie,
  image342,
} from "../api/moviedb";

var { width, height } = Dimensions.get("window"); //this will give height and width of mobile
const ios = Platform.OS == "ios";
const verticalMargin = ios ? "" : "my-3";
export default function PersonScreen() {
  const { params: item } = useRoute();
  const [isFavourite, setIsFavourite] = useState(false);
  const navigation = useNavigation();
  const [personMovies, setPersonMovies] = useState([]);
  const [person, setPerson] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getPersonDetails(item.id);
    getPersonMovieDetails(item.id);
  }, [item]);
  const getPersonDetails = async (id) => {
    const data = await fetchPersonDetails(id);
    if (data) setPerson(data);
    setLoading(false);
  };
  const getPersonMovieDetails = async (id) => {
    const data = await fetchPersonMovie(id);
    if (data && data.cast) setPersonMovies(data.cast);
  };
  return (
    <ScrollView
      className="flex-1 bg-neutral-900 "
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* Back button and Heart Icon */}
      <SafeAreaView
        className={` z-20 flex-row w-full justify-between items-center px-4  ${verticalMargin}`}
      >
        <TouchableOpacity
          className="rounded-xl p-1"
          style={style.background}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size="28" color="white" strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsFavourite(!isFavourite);
          }}
        >
          <HeartIcon
            size="35"
            color={isFavourite ? "red" : "white"}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Person Details */}
      {loading ? (
        <Loading />
      ) : (
        <View>
          <View
            className="flex-row justify-center"
            style={{
              shadowColor: "gray",
              shadowRadius: 40,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 1,
            }}
          >
            <View className="items-center rounded-full overflow-hidden h-72 w-72 border-2 border-neutral-700">
              <Image
                source={{
                  uri: image342(person.profile_path) || fallbackPersonImage,
                }}
                style={{ height: height * 0.43, width: width * 0.74 }}
              />
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-3xl text-white font-bold text-center">
              {person.name}
            </Text>
            <Text className="text-base text-neutral-500  text-center">
              {person.place_of_birth}
            </Text>
          </View>
          <View className="mx-3 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full p-4">
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Gender</Text>
              <Text className="text-neutral-300 font-sm">
                {person.gender == 1 ? "Female" : "Male"}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Birthday</Text>
              <Text className="text-neutral-300 font-sm">
                {person.birthday}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Known</Text>
              <Text className="text-neutral-300 font-sm">
                {person.known_for_department}
              </Text>
            </View>
            <View className="px-2 items-center">
              <Text className="text-white font-semibold">Popularity</Text>
              <Text className="text-neutral-300 font-sm">
                {person.popularity} %
              </Text>
            </View>
          </View>
          <View className="my-6 mx-4 space-y-2">
            <Text className="text-white text-lg ">Biography</Text>
            <Text className="text-neutral-400 tracking-wide">
              {person.biography}
            </Text>
          </View>
          {/* MovieList of the person */}
          <MovieList title={"Movies"} data={personMovies} />
        </View>
      )}
    </ScrollView>
  );
}
