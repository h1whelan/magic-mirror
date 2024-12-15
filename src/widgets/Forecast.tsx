import { useState, useEffect } from 'react';
import { Text, Stack, Group, Loader } from '@mantine/core';
import axios from 'axios';
import { format } from 'date-fns';

interface HourlyForecast {
  time: string;
  temperature: number;
  icon: string;
  description: string;
}

interface DailyForecast {
  date: string;
  temperature: number;
  icon: string;
  description: string;
}

function Forecast() {
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = async () => {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const lat = import.meta.env.VITE_WEATHER_LAT;
      const lon = import.meta.env.VITE_WEATHER_LON;

      if (!apiKey || !lat || !lon) {
        throw new Error('Weather API configuration missing');
      }

      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&exclude=minutely,alerts`;
      const response = await axios.get(url);
      
      // Process hourly forecast (next 12 hours)
      const hourly = response.data.hourly
        .filter((_: any, index: number) => index % 3 === 0)
        .slice(0, 4)
        .map((hour: any) => ({
          time: format(new Date(hour.dt * 1000), 'HH:mm'),
          temperature: Math.round(hour.temp),
          icon: hour.weather[0].icon,
          description: hour.weather[0].description,
        }));

      // Process daily forecast (next 7 days)
      const daily = response.data.daily
        .slice(1, 8) // Skip today, get next 7 days
        .map((day: any) => ({
          date: format(new Date(day.dt * 1000), 'EEE'),
          temperature: Math.round(day.temp.max),
          icon: day.weather[0].icon,
          description: day.weather[0].description,
        }));

      setHourlyForecast(hourly);
      setDailyForecast(daily);
      setError(null);
    } catch (err: any) {
      console.error('Full Weather API Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Could not load forecast data';
      setError(`Error: ${errorMessage} (${err.response?.status || 'unknown status'})`);
      setHourlyForecast([]);
      setDailyForecast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
    const interval = setInterval(fetchForecast, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="widget">
        <Stack align="center" spacing="md">
          <Text size="xl">Forecast</Text>
          <Loader color="gray" />
        </Stack>
      </div>
    );
  }

  if (error) {
    return (
      <div className="widget">
        <Stack align="center" spacing="md">
          <Text size="xl">Forecast</Text>
          <Text color="red" size="sm" align="center" style={{ maxWidth: '300px' }}>
            {error}
          </Text>
        </Stack>
      </div>
    );
  }

  return (
    <div className="widget">
      <Stack spacing="xl">
        <div>
          <Text size="sm" weight={500} mb="md">NEXT 12 HOURS</Text>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            {hourlyForecast.map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                  alt={item.description}
                  style={{ width: '40px', height: '40px' }}
                />
                <Text size="lg" weight={500}>
                  {item.temperature}°C
                </Text>
                <Text size="sm" color="dimmed">
                  {item.time}
                </Text>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Text size="sm" weight={500} mb="md">NEXT 7 DAYS</Text>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {dailyForecast.map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                  alt={item.description}
                  style={{ width: '32px', height: '32px' }}
                />
                <Text size="md" weight={500}>
                  {item.temperature}°C
                </Text>
                <Text size="xs" color="dimmed">
                  {item.date}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </Stack>
    </div>
  );
}

export default Forecast; 