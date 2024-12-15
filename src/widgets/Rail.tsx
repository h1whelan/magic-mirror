import { useState, useEffect } from 'react';
import { Text, Stack, Group, Loader, Table } from '@mantine/core';
import axios from 'axios';
import { format } from 'date-fns';

interface TrainService {
  scheduledDeparture: string;
  estimatedDeparture: string;
  destination: string;
  platform?: string;
  status: string;
  operator?: string;
}

function Rail() {
  const [services, setServices] = useState<TrainService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const crs = import.meta.env.VITE_HOME_STATION;
      const response = await axios.get(
        `https://api1.raildata.org.uk/1010-live-departure-board-dep1_2/LDBWS/api/20220120/GetDepartureBoard/${crs}`,
        {
          headers: {
            'x-apikey': import.meta.env.VITE_RAIL_API_KEY,
            'Accept': 'application/json'
          },
          params: {
            numRows: 10,
            timeWindow: 120,
            timeOffset: 0
          }
        }
      );

      const trainServices = response.data?.trainServices || [];

      if (!trainServices || trainServices.length === 0) {
        setError('No departures found');
        setServices([]);
        return;
      }

      const transformedServices = trainServices
        .filter((service: any) => {
          const destination = service.destination[0].locationName.toLowerCase();
          console.log('Train destination:', destination);
          return destination.includes('london') || 
                 destination.includes('charing cross') || 
                 destination.includes('cannon') || 
                 destination.includes('bridge');
        })
        .map((service: any) => ({
          scheduledDeparture: service.std,
          estimatedDeparture: service.std,
          destination: service.destination[0].locationName,
          platform: service.platform,
          status: service.etd,
          operator: service.operator
        }));

      if (transformedServices.length === 0) {
        setError('No London-bound trains found');
        setServices([]);
        return;
      }

      setServices(transformedServices);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Could not load train times';
      console.error('Rail API Error:', err);
      setError(errorMessage);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="widget">
        <Stack align="center" spacing="md">
          <Text size="xl">Train Departures</Text>
          <Loader color="gray" />
        </Stack>
      </div>
    );
  }

  if (error) {
    return (
      <div className="widget">
        <Stack align="center" spacing="md">
          <Text size="xl">Train Departures</Text>
          <Text color="red">{error}</Text>
        </Stack>
      </div>
    );
  }

  return (
    <div className="widget">
      <Stack spacing="lg">
        <Group position="apart" align="baseline">
          <Text 
            size="sm"
            weight={500}
            style={{ 
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            DEPARTURES
          </Text>
          <Text 
            size="sm"
            weight={500}
            style={{ 
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            HITHER GREEN
          </Text>
        </Group>
        
        <div style={{ overflowX: 'auto' }}>
          <Table 
            fontSize="sm"
            verticalSpacing="md"
            style={{ 
              fontFamily: 'monospace',
              minWidth: '100%'
            }}
          >
            <thead>
              <tr>
                <th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>TIME</th>
                <th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>DESTINATION</th>
                <th style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>PLAT</th>
                <th style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'right' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <td style={{ 
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)',
                    whiteSpace: 'nowrap'
                  }}>
                    {format(new Date(`2000-01-01T${service.scheduledDeparture}`), 'HH:mm')}
                  </td>
                  <td style={{ 
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.9)',
                    maxWidth: '200px'
                  }}>
                    {service.destination}
                  </td>
                  <td style={{ 
                    textAlign: 'center',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    {service.platform || '-'}
                  </td>
                  <td style={{ 
                    textAlign: 'right',
                    fontWeight: 600,
                    color: service.status === 'On time' ? '#4FD1C5' : '#FFD700',
                    whiteSpace: 'nowrap'
                  }}>
                    {service.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Stack>
    </div>
  );
}

export default Rail; 