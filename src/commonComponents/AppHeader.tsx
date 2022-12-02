import {
  AppBar,
  ButtonBase,
  Card,
  CardContent,
  InputBase,
  InputBaseProps,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getMarvelCharacters } from "../APIs/marvel";
import { Box } from "@mui/system";

type Props = {
  triggerSearch: (searchText: string) => void;
  onSavedOptionClicked: () => void;
};
export function AppHeader(props: Props) {
  const timoutSearchReference = useRef<NodeJS.Timeout | null>(null);
  const timoutAutoCompleteReference = useRef<NodeJS.Timeout | null>(null);
  const [suggesstedSearch, setSuggestedSearch] = useState<Array<string>>([]);
  const [getSearchInput, setSearchInput] = useState("");
  const [getShowSuggestion, setShowSuggestion] = useState(false);

  const onTextInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
    setShowSuggestion(true);
    triggerSearch(event.target.value);
    triggerAutoComplete(event.target.value);
  };

  const triggerSearch = (text: string) => {
    timoutSearchReference.current &&
      clearTimeout(timoutSearchReference.current);
    timoutSearchReference.current = setTimeout(() => {
      props.triggerSearch(text);
    }, 700);
  };

  const triggerAutoComplete = (text: string) => {
    timoutAutoCompleteReference.current &&
      clearTimeout(timoutAutoCompleteReference.current);
    timoutAutoCompleteReference.current = setTimeout(async () => {
      const response = await getMarvelCharacters(5, 0, text);
      setSuggestedSearch(response.data.results.map((item: any) => item.name));
    }, 200);
  };

  const onSuggestionClick = (name: string) => {
    setSearchInput(name);
    setShowSuggestion(false);
    props.triggerSearch(name);
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "center", backgroundColor: "white" }}>
        <Stack direction={"row"}>
          <Stack
            alignItems={"center"}
            direction="row"
            sx={{
              border: "1px solid black",
              borderRadius: 5,
              paddingLeft: 2,
            }}
          >
            <SearchIcon color="action" />
            <InputBase
              onChange={onTextInputChange}
              value={getSearchInput}
              sx={{
                width: "20vw",
                borderRadius: 2,
                height: 42,
                paddingLeft: 1,
                paddingRight: 1,
                color: "black",
              }}
            />
          </Stack>
          <Typography
            onClick={props.onSavedOptionClicked}
            component={ButtonBase}
            sx={{ color: "blue", marginLeft: 5 }}
          >
            See Saved Item
          </Typography>
          <Card
            sx={{
              position: "absolute",
              backgroundColor: "white",
              height: 250,
              width: "25vw",
              top: "100%",
              display: getShowSuggestion ? "flex" : "none",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              {suggesstedSearch.map((name) => (
                <Typography
                  component={ButtonBase}
                  onClick={() => {
                    onSuggestionClick(name);
                  }}
                  sx={{
                    paddingtop: 1,
                    paddingBottom: 1,
                    width: "100%",
                    color: "black",
                    borderBottom: "1px solid black",
                  }}
                >
                  {name}
                </Typography>
              ))}
            </CardContent>
            <ButtonBase onClick={() => setShowSuggestion(false)}>
              <CloseIcon fontSize="large" />
            </ButtonBase>
          </Card>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
