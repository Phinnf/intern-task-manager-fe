import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Container } from "@mui/material";
import {
  Stack,
  Card,
  CardContent,
  CardActions,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import theme from "../theme/theme";

const cleanSnippet = (html) => {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

const WikiSearch = () => {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const searchWiki = async (e) => {
    e.preventDefault();
    if (!query) return;
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=5&srsearch=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    setResults(data.query.search);
  };

  return (
    <Container>
      <Box
        maxWidth={true}
        component="form"
        onSubmit={searchWiki}
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          p: 3,
          margin: "0 auto",
          flexDirection: { xs: "column", sm: "row" },
        }}>
        <TextField
          id="filled-basic"
          label="Search Wikipedia"
          variant="filled"
          inputRef={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          sx={{ minWidth: {sx: "auto", md: "500px" } }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{minWidth: "100px"}}
          >
          Search
        </Button>
      </Box>

      <Stack spacing={3} alignItems="center">
        {results.map((result) => (
          <Card
            key={result.pageid}
            sx={{
              display: "flex",
              maxWidth: "800px",
              bgcolor: "#4d4d4d",

              borderRadius: 3,
            }}>
            <CardContent sx={{ flex: 1, p: 3 }}>
              <Typography variant="body2" color={theme.palette.primary.light}>
                {cleanSnippet(result.snippet)}
              </Typography>
            </CardContent>

            <CardActions sx={{ p: 3 }}>
              <Button
                startIcon={<TravelExploreIcon />}
                size="small"
                variant="outlined"
                href={`https://en.wikipedia.org/?curid=${result.pageid}`}
                target="_blank"
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                  whiteSpace: "nowrap",
                }}>
                Read Article
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default WikiSearch;
