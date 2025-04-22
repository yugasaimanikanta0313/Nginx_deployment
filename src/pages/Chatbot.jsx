
import { useState } from "react";
import { getChatResponse } from "../services/gemini";
import { FaPaperPlane } from "react-icons/fa";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "🌿 Welcome! Ask me about farming, weather, and crop guidance!", sender: "bot" },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    if (input.toLowerCase().includes("weather update")) {
      getWeatherUpdate();
    } else {
      const botResponse = await getChatResponse(input);
      setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    }
  };

  const getWeatherUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("📍 User Location:", latitude, longitude);
  
          // Fetch the location name using OpenStreetMap's Nominatim API
          const locationUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  
          try {
            const locationResponse = await axios.get(locationUrl);
            const locationData = locationResponse.data;
            console.log("🌍 Location Data:", locationData);
  
            const locationName = locationData.display_name || "Unknown Location";
  
            // Show detected location name with coordinates
            setMessages((prev) => [
              ...prev,
              { 
                text: `📍 Your Location: ${locationName}\n🗺️ Coordinates: Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)}`, 
                sender: "bot" 
              },
            ]);
  
            // Fetch Weather Data
            const apiKey = "9b8df2de2c8a48b4511b6bd7d2c9fac3"; // Replace with a valid API key
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  
            console.log("🔗 Weather API URL:", weatherUrl);
  
            const weatherResponse = await axios.get(weatherUrl);
            console.log("✅ Weather API Response:", weatherResponse.data);
  
            if (weatherResponse.data && weatherResponse.data.weather) {
              const weatherData = weatherResponse.data;
              const weatherMessage = `🌤️ Weather: ${weatherData.weather[0].description}\n🌡️ Temperature: ${weatherData.main.temp}°C\n🌬️ Wind Speed: ${weatherData.wind.speed} m/s`;
  
              setMessages((prev) => [...prev, { text: weatherMessage, sender: "bot" }]);
            } else {
              throw new Error("Invalid weather data received");
            }
          } catch (error) {
            console.error("❌ API Error:", error.response ? error.response.data : error.message);
            setMessages((prev) => [...prev, { text: "❌ Unable to fetch location/weather data.", sender: "bot" }]);
          }
        },
        (error) => {
          console.error("❌ Geolocation Error:", error.message);
          setMessages((prev) => [...prev, { text: "❌ Please enable location access for weather updates.", sender: "bot" }]);
        }
      );
    } else {
      setMessages((prev) => [...prev, { text: "❌ Geolocation is not supported in your browser.", sender: "bot" }]);
    }
  };
  
  
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ width: "100%", maxWidth: 600, height: "70vh", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 2 }}>
        <Box flex={1} overflow="auto" sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 1 }}>
          {messages.map((msg, index) => (
            <Box key={index} display="flex" justifyContent={msg.sender === "user" ? "flex-end" : "flex-start"}>
              <Typography variant="body1" sx={{ backgroundColor: msg.sender === "user" ? "#1976d2" : "#e0e0e0", color: msg.sender === "user" ? "white" : "black", padding: 1.5, borderRadius: 2, maxWidth: "80%" }}>
                {msg.text}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <TextField variant="outlined" fullWidth value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything..." onKeyPress={(e) => e.key === "Enter" && sendMessage()} />
          <Button variant="contained" color="primary" onClick={sendMessage} sx={{ padding: "12px 16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <FaPaperPlane style={{ fontSize: "1.2rem", color: "white" }} />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chatbot;