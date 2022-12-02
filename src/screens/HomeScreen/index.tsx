import { Box, ButtonBase, Modal, styled, Typography } from "@mui/material";

import React, { useContext, useEffect, useState } from "react";
import { Stack } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import { CharacterCard } from "../../commonComponents/CharacterCard";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getMarvelCharacters } from "../../APIs/marvel";
import { AppHeader } from "../../commonComponents/AppHeader";
import { UserContext } from "../../App";

export const BoldText = styled(Typography)(({ theme }) => ({
  "&": {
    color: theme.palette.common.black,
    fontWeight: "bold",
    display: "inline",
    // ...and so on
  },
})) as typeof Typography;

export function HomeScreen() {
  const [getLoading, setLoading] = useState(true);
  const [marvelCharacter, setMarvelCharacter] = useState<any>();
  const { savedCharacters, unSaveItem } = useContext(UserContext);
  const [getSearchText, setSearchText] = useState("");
  const [openDetailModal, setOpendetailModal] = useState({
    visible: false,
    selectedIndex: 0,
  });
  const [openSavedModal, setOpenSavedModal] = useState(false);

  useEffect(() => {
    fetchMarvelCharacter();
  }, []);

  const fetchMarvelCharacter = async (
    offset: number = 0,
    searchText: string = getSearchText
  ) => {
    setLoading(true);
    const response = await getMarvelCharacters(3, offset, searchText);
  
    setMarvelCharacter(response.data);
    setLoading(false);
  };

  const onNextPressed = () => {
    fetchMarvelCharacter(marvelCharacter.offset + marvelCharacter.count);
  };
  const onPrevPressed = () => {
    fetchMarvelCharacter(marvelCharacter.offset - marvelCharacter.count);
  };

  const fetchSearchCharacters = async (searchText: string) => {
    fetchMarvelCharacter(0, searchText);
    setSearchText(searchText);
  };

  const changeModalVisibility = () => {
    setOpendetailModal({
      ...openDetailModal,
      visible: !openDetailModal.visible,
    });
  };

  const disablePrev = marvelCharacter?.offset < 1;
  const disableNext =
    marvelCharacter?.offset + marvelCharacter?.count >= marvelCharacter?.total;

  return (
    <React.Fragment>
      <AppHeader
        triggerSearch={fetchSearchCharacters}
        onSavedOptionClicked={() => {
          setOpenSavedModal(true);
        }}
      />
      <Stack
        direction={"row"}
        justifyContent="space-around"
        alignItems={"center"}
        sx={{ height: "90vh", paddingTop: 4 }}
      >
        {marvelCharacter?.results?.length == 0 && (
          <Typography sx={{ color: "red" }}>
            We couldn't found anything for you search
          </Typography>
        )}
        {marvelCharacter?.results?.map((character: any, index: number) => (
          <CharacterCard
            resourceURI={character.resourceURI}
            key={"index" + index}
            onClick={() => {
              setOpendetailModal({ visible: true, selectedIndex: index });
            }}
            characterName={character.name}
            loading={getLoading}
            imageUrl={
              character.thumbnail.path + "." + character.thumbnail.extension
            }
          />
        ))}
      </Stack>

      <Stack direction="row" justifyContent={"center"}>
        <Typography
          onClick={onPrevPressed}
          sx={{ ...styles.pagingtext, color: disablePrev ? "gray" : "blue" }}
          component={ButtonBase}
          disabled={disablePrev}
        >
          <ArrowBackIosNewIcon />
          <ArrowBackIosNewIcon /> PREV
        </Typography>
        <Box sx={{ width: 40 }} />
        <Typography
          onClick={onNextPressed}
          sx={{
            ...styles.pagingtext,
            color: disableNext ? "gray" : "blue",
          }}
          component={ButtonBase}
          disabled={disableNext}
        >
          NEXT <ArrowForwardIosIcon />
          <ArrowForwardIosIcon />
        </Typography>
      </Stack>

      <Modal open={openDetailModal.visible} onClose={changeModalVisibility}>
        <Box sx={{ width: "50%", height: "100%", background: "white" }}>
          <Stack justifyContent={"flex-end"} direction="row">
            <ButtonBase onClick={changeModalVisibility}>
              <CloseIcon fontSize="large" />
            </ButtonBase>
          </Stack>
          <Typography>
            <BoldText>Name: </BoldText>
            {marvelCharacter?.results?.[openDetailModal.selectedIndex]?.name}
          </Typography>
          <Typography>
            <BoldText>Description: </BoldText>
            {marvelCharacter?.results?.[openDetailModal.selectedIndex]
              ?.description || "No description given"}
          </Typography>
          <Typography>
            <BoldText>Thumbnail url: </BoldText>
            <a
              target="_blank"
              href={
                marvelCharacter?.results?.[openDetailModal.selectedIndex]
                  ?.thumbnail.path +
                "." +
                marvelCharacter?.results?.[openDetailModal.selectedIndex]
                  ?.thumbnail.extension
              }
            >
              Link
            </a>
          </Typography>
          <Box>
            <BoldText>Stories </BoldText>
            {marvelCharacter?.results?.[
              openDetailModal.selectedIndex
            ]?.stories?.items?.map((item: any, index: number) => (
              <Typography key={"teim" + index}>
                <a
                  href={item.resourceURI + process.env.REACT_APP_CRED}
                  target="_blank"
                >
                  {item.name}
                </a>
              </Typography>
            ))}
          </Box>
        </Box>
      </Modal>

      <Modal open={openSavedModal} onClose={() => setOpenSavedModal(false)}>
        <Box
          sx={{
            width: "50%",
            height: "100%",
            marginLeft: "50%",
            backgroundColor: "white",
          }}
        >
          <ButtonBase onClick={() => setOpenSavedModal(false)}>
            <CloseIcon fontSize="large" />
          </ButtonBase>
          {savedCharacters.map((item) => {
            return (
              <Stack
                key={"ittt" + item.characterId}
                direction={"row"}
                alignItems="center"
              >
                <img src={item.imageurl} height={120} width={120} />
                <BoldText sx={{ color: "green", flexGrow: 1 }}>
                  {item.name}
                </BoldText>
                <ButtonBase
                  sx={{ padding: 2 }}
                  onClick={() => {
                    unSaveItem(item.characterId);
                  }}
                >
                  <DeleteForeverIcon />
                </ButtonBase>
              </Stack>
            );
          })}
          {savedCharacters.length == 0 && (
            <BoldText>No character saved</BoldText>
          )}
        </Box>
      </Modal>
    </React.Fragment>
  );
}

const styles = {
  pagingtext: {
    textDecoration: "underline",
    marginLeft: 1,
    marginRight: 1,
  },
};
