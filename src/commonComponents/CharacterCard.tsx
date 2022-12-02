import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useLayoutEffect, useRef } from "react";
import * as React from "react";
import { UserContext } from "../App";

type Props = {
  imageUrl: string;
  characterName: string;
  resourceURI: string;
  loading?: boolean;
  onClick: () => void;
};

export function CharacterCard(props: Props) {
  const [getCardDimention, setCardDimention] = useState({ x: 0, y: 0 });
  const { savedCharacters, saveNewCharacter, unSaveItem } =
    React.useContext(UserContext);
  const parentLayoutRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    parentLayoutRef.current &&
      setCardDimention({
        y: parentLayoutRef.current?.clientHeight,
        x: parentLayoutRef.current?.clientWidth,
      });
  }, []);

  const isItemSaved = savedCharacters.some(
    (char) => char.characterId == Number(props.resourceURI.split("/").pop()!)
  );
  const onSaveBtnClick = () => {
    if (isItemSaved) {
      unSaveItem(Number(props.resourceURI.split("/").pop()!));
    } else {
      saveNewCharacter({
        characterId: Number(props.resourceURI.split("/").pop()),
        imageurl: props.imageUrl,
        name: props.characterName,
        resourceUrl: props.resourceURI,
      });
    }
  };

  return (
    <Box display={"block"} position="relative">
      <Card ref={parentLayoutRef}>
        <CardContent>
          <Stack alignItems={"center"}>
            <Box
              component={ButtonBase}
              onClick={props.onClick}
              sx={{
                borderRadius: 5,
                overflow: "hidden",
                border: "1px solid gray",
              }}
            >
              <img
                src={props.imageUrl}
                style={{ objectFit: "contain", height: 320, width: 320 }}
              />
            </Box>
            <Typography sx={{ fontSize: 20 }}>{props.characterName}</Typography>
            <Typography
              component={ButtonBase}
              onClick={onSaveBtnClick}
              sx={{
                paddingLeft: 2,
                paddingRight: 2,
                backgroundColor: "yellow",
                borderRadius: 1,
              }}
            >
              {isItemSaved ? "Unsave" : "Save"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {props.loading && (
        <Box
          sx={{
            position: "absolute",
            borderRadius: 4,
            top: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: getCardDimention.x,
            height: getCardDimention.y,
            backgroundColor: "rgba(0,0,0,.8)",
          }}
        >
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      )}
    </Box>
  );
}
