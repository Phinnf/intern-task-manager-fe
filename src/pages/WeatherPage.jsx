import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { TextField, Button, Paper, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import CloudIcon from "@mui/icons-material/Cloud";
import GrainIcon from "@mui/icons-material/Grain";
import UmbrellaIcon from "@mui/icons-material/Umbrella";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import BedtimeIcon from "@mui/icons-material/Bedtime";

const WeatherApp = () => {
  const theme = useTheme();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState("");
  const [displayName, setDisplayName] = useState("Da nang, Viet Nam");
  const [coords, setCoords] = useState({ lat: 16.0678, lon: 108.2208 });

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
        );
        if (!response.ok) {
          throw new Error("failed to fetch weather data");
        }
        const data = await response.json();
        setWeather(data.current);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [coords]);

  const searchCity = async () => {
    if (!cityInput) return;
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1&language=en&format=json`,
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { latitude, longitude, name, country } = data.results[0];
        setCoords({ lat: latitude, lon: longitude });
        setDisplayName(`${name}, ${country}`);
        setError(null);
      } else {
        setError("Cant find this city");
      }
    } catch (err) {
      setError(err.message || "Geocoding API Failed");
    }
  };

  const [currentTime, setCurrentTime] = useState(dayjs());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading)
    return (
      <Typography align="center" sx={{ mt: 10 }}>
        Loading weather...
      </Typography>
    );
  if (error)
    return (
      <Typography align="center" color="error" sx={{ mt: 10 }}>
        Error: {error}
      </Typography>
    );

  const weatherMapping = {
    0: { label: "Sunny", icon: <WbSunnyIcon /> },
    1: { label: "Mainly Clear", icon: <CloudQueueIcon /> },
    2: { label: "Partly Cloudy", icon: <CloudQueueIcon /> },
    3: { label: "Overcast", icon: <CloudIcon /> },
    45: { label: "Fog", icon: <GrainIcon /> },
    48: { label: "Depositing Rime Fog", icon: <GrainIcon /> },
    51: { label: "Light Drizzle", icon: <WaterDropIcon /> },
    53: { label: "Moderate Drizzle", icon: <WaterDropIcon /> },
    55: { label: "Dense Drizzle", icon: <WaterDropIcon /> },
    56: { label: "Light Freezing Drizzle", icon: <AcUnitIcon /> },
    57: { label: "Dense Freezing Drizzle", icon: <AcUnitIcon /> },
    61: { label: "Slight Rain", icon: <UmbrellaIcon /> },
    63: { label: "Moderate Rain", icon: <UmbrellaIcon /> },
    65: { label: "Heavy Rain", icon: <UmbrellaIcon /> },
    66: { label: "Light Freezing Rain", icon: <AcUnitIcon /> },
    67: { label: "Heavy Freezing Rain", icon: <AcUnitIcon /> },
    71: { label: "Slight Snow Fall", icon: <AcUnitIcon /> },
    73: { label: "Moderate Snow Fall", icon: <AcUnitIcon /> },
    75: { label: "Heavy Snow Fall", icon: <AcUnitIcon /> },
    77: { label: "Snow Grains", icon: <AcUnitIcon /> },
    80: { label: "Slight Rain Showers", icon: <UmbrellaIcon /> },
    81: { label: "Moderate Rain Showers", icon: <UmbrellaIcon /> },
    82: { label: "Violent Rain Showers", icon: <UmbrellaIcon /> },
    85: { label: "Slight Snow Showers", icon: <AcUnitIcon /> },
    86: { label: "Heavy Snow Showers", icon: <AcUnitIcon /> },
    95: { label: "Thunderstorm", icon: <ThunderstormIcon /> },
    96: { label: "Thunderstorm with Slight Hail", icon: <ThunderstormIcon /> },
    99: { label: "Thunderstorm with Heavy Hail", icon: <ThunderstormIcon /> },
  };
  const code = weather.weather_code;
  const TodayWeather = weatherMapping[code] || { label: "Unknown", icon: null };

  const hour = dayjs().hour();
  const TypeOfDayIcon = hour >= 6 && hour <= 18 ? WbSunnyIcon : BedtimeIcon;

  return (
    <Box sx={{ width: "100%", px: { xs: 2, sm: 0 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          maxWidth: 600,
          margin: { xs: "2rem auto", sm: "5rem auto" },
          background: theme.palette.background.paper,
          borderRadius: 4,
        }}>
        {/* 1.  Input */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="stretch"
          spacing={2}
          sx={{ mb: 4 }}>
          <TextField
            color="primary"
            fullWidth
            variant="outlined"
            placeholder="Enter your city"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: theme.palette.background.paper,
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={searchCity}
            sx={{ px: 4, height: { xs: "48px", sm: "auto" } }}>
            Search
          </Button>
        </Stack>

        {/* 2. Main Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: theme.palette.primary.contrastText,
            boxShadow: "0 8px 32px 0 rgba(99, 102, 241, 0.37)",
          }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Custom Header using Box/Typography */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "center", sm: "flex-start" },
                textAlign: { xs: "center", sm: "left" },
                mb: 4,
                gap: 2,
              }}>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="800"
                  sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}>
                  {displayName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}>
                  {currentTime.format("dddd, DD MMMM YYYY")}
                </Typography>
              </Box>
              <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
                <Typography variant="h6" fontWeight="bold">
                  {currentTime.format("HH:mm:ss")}
                </Typography>
                <TypeOfDayIcon fontSize="medium" />
              </Box>
            </Box>

            <Grid container spacing={{ xs: 3, sm: 4 }} alignItems="center">
              {/* Temp & Status */}
              <Grid item xs={12} sm={6}>
                <Stack
                  direction="column"
                  alignItems={{ xs: "center", sm: "flex-start" }}
                  textAlign={{ xs: "center", sm: "left" }}>
                  <Box>
                    <Typography
                      variant="h1"
                      fontWeight="900"
                      sx={{
                        lineHeight: 1,
                        fontSize: { xs: "4.5rem", sm: "6rem" },
                      }}>
                      {Math.round(weather.temperature_2m)}°
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        mt: 1,
                        justifyContent: { xs: "center", sm: "flex-start" },
                      }}>
                      {TodayWeather.icon}
                      <Typography variant="h6" fontWeight="500">
                        {TodayWeather.label}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                      Feels like:{" "}
                      <strong>{weather.apparent_temperature}°C</strong>
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Details */}
              <Grid item xs={12} sm={6}>
                <Stack
                  spacing={2}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    p: 2,
                    borderRadius: 3,
                  }}>
                  <Typography
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    variant="body1">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <WaterDropIcon fontSize="small" />
                      Humidity
                    </Box>
                    <strong>{weather.relative_humidity_2m}%</strong>
                  </Typography>
                  <Typography
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    variant="body1">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AirIcon fontSize="small" />
                      Wind Speed <strong>{weather.wind_speed_10m} km/h</strong>
                    </Box>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};

export default WeatherApp;
