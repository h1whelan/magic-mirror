import { useState, useEffect } from 'react';
import { Text, Stack, Group, Loader } from '@mantine/core';
import axios from 'axios';
import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi';
import { format } from 'date-fns';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast: ForecastData[];
}

interface ForecastData {
  time: string;
  temperature: number;
  icon: string;
  description: string;
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

      // Fetch current weather and forecast using One Call API
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&exclude=minutely,alerts`;
      const response = await axios.get(url);
      
      // Get hourly forecast for next 24 hours, at 3-hour intervals
      const hourlyForecast = response.data.hourly
        .filter((_: any, index: number) => index % 3 === 0) // Every 3 hours
        .slice(0, 8) // Next 24 hours (8 x 3 = 24)
        .map((hour: any) => ({
          time: format(new Date(hour.dt * 1000), 'HH:mm'),
          temperature: Math.round(hour.temp),
          icon: hour.weather[0].icon,
          description: hour.weather[0].description,
        }));

      setWeather({
        temperature: Math.round(response.data.current.temp),
        humidity: response.data.current.humidity,
        windSpeed: Math.round(response.data.current.wind_speed),
        description: response.data.current.weather[0].description,
        icon: response.data.current.weather[0].icon,
        forecast: hourlyForecast,
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
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes
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
      <Stack spacing="md">
        {/* Current Weather */}
        <Group position="apart" align="flex-start">
          <Stack spacing={0}>
            <Text size="3rem" weight={700} style={{ lineHeight: 1.1 }}>
              {weather.temperature}°C
            </Text>
            <Text size="lg" color="dimmed" transform="capitalize">
              {weather.description}
            </Text>
          </Stack>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            style={{ width: '64px', height: '64px' }}
          />
        </Group>
        
        {/* Current Details */}
        <Group spacing="xl">
          <Group spacing="xs">
            <WiThermometer size={24} />
            <Text>{weather.temperature}°C</Text>
          </Group>
          <Group spacing="xs">
            <WiHumidity size={24} />
            <Text>{weather.humidity}%</Text>
          </Group>
          <Group spacing="xs">
            <WiStrongWind size={24} />
            <Text>{weather.windSpeed} m/s</Text>
          </Group>
        </Group>

        {/* Hourly Forecast */}
        <Stack spacing="sm">
          <Text size="sm" color="dimmed" weight={500}>
            24-HOUR FORECAST
          </Text>
          <div style={{ overflowX: 'auto' }}>
            <Group spacing="xl" noWrap style={{ minWidth: 'min-content' }}>
              {weather.forecast.map((forecast, index) => (
                <Stack key={index} spacing={4} align="center">
                  <Text size="sm" color="dimmed">
                    {forecast.time}
                  </Text>
                  <img
                    src={`https://openweathermap.org/img/wn/${forecast.icon}.png`}
                    alt={forecast.description}
                    style={{ width: '40px', height: '40px' }}
                  />
                  <Text size="sm" weight={500}>
                    {forecast.temperature}°C
                  </Text>
                </Stack>
              ))}
            </Group>
          </div>
        </Stack>
      </Stack>
    </div>
  );
}

export default Weather; 