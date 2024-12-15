import { useState, useEffect } from 'react';
import { Text, Stack, Group, Loader } from '@mantine/core';
import axios from 'axios';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const lat = import.meta.env.VITE_WEATHER_LAT;
      const lon = import.meta.env.VITE_WEATHER_LON;

      if (!apiKey || !lat || !lon) {
        throw new Error('Weather API configuration missing');
      }

      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&exclude=minutely,alerts`;
      const response = await axios.get(url);

      setWeather({
        temperature: Math.round(response.data.current.temp),
        humidity: response.data.current.humidity,
        windSpeed: Math.round(response.data.current.wind_speed),
        description: response.data.current.weather[0].description,
        icon: response.data.current.weather[0].icon,
      });
      setError(null);
    } catch (err: any) {
      console.error('Full Weather API Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Could not load weather data';
      setError(`Error: ${errorMessage} (${err.response?.status || 'unknown status'})`);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="widget">
        <Stack align="center" spacing="md">
          <Text size="xl">Weather</Text>
          <Loader color="gray" />
        </Stack>
      </div>
    );
  }

  if (error) {
    return (
      <div className="widget">
        <Stack align="center" spacing="md">
          <Text size="xl">Weather</Text>
          <Text color="red" size="sm" align="center" style={{ maxWidth: '300px' }}>
            {error}
          </Text>
        </Stack>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="widget">
      <Stack spacing="xl">
        <Text size="sm" weight={500}>CURRENT WEATHER</Text>
        
        <Group position="apart" align="flex-start" style={{ width: '100%' }}>
          <Stack spacing={4}>
            <Group spacing="md" align="center">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                style={{ width: '64px', height: '64px', margin: '-12px' }}
              />
              <Text size="3rem" weight={700} style={{ lineHeight: 1 }}>
                {weather.temperature}°C
              </Text>
            </Group>
            <Text size="sm" color="dimmed" transform="capitalize" ml="md">
              {weather.description}
            </Text>
          </Stack>

          <Stack spacing="lg" align="flex-start">
            <Group spacing="sm" noWrap>
              <WiHumidity size={22} style={{ opacity: 0.7 }} />
              <Text size="sm" style={{ minWidth: '4rem' }}>{weather.humidity}%</Text>
            </Group>
            <Group spacing="sm" noWrap>
              <WiStrongWind size={22} style={{ opacity: 0.7 }} />
              <Text size="sm">{weather.windSpeed}m/s</Text>
            </Group>
          </Stack>
        </Group>
      </Stack>
    </div>
  );
}

export default Weather; 