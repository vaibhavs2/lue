import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { getMarvelCharacters } from "./APIs/marvel";
import { HomeScreen } from "./screens/HomeScreen";

type Saveditem = {
  name: string;
  resourceUrl: string;
  imageurl: string;
  characterId: number;
};

export const UserContext = React.createContext<{
  savedCharacters: Array<Saveditem>;
  unSaveItem: (characterId: number) => void;
  saveNewCharacter: (character: Saveditem) => void;
}>({} as any);

function App() {
  const [savedCharacters, setSavedCharacters] = useState<Array<Saveditem>>([]);
  const unSaveItem = (characterId: number) => {
    setSavedCharacters(
      savedCharacters.filter((item) => item.characterId != characterId)
    );
  };
  const saveNewCharacter = (character: Saveditem) => {
    setSavedCharacters([...savedCharacters, character]);
  };

  return (
    <UserContext.Provider
      value={{ savedCharacters, unSaveItem, saveNewCharacter }}
    >
      <HomeScreen />
    </UserContext.Provider>
  );
}

export default App;
