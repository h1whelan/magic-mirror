import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Text, Stack } from '@mantine/core';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="widget">
      <Stack spacing={0} align="center">
        <Text size="6rem" weight={700} style={{ lineHeight: 1.1 }}>
          {format(time, 'HH:mm')}
        </Text>
        <Text size="2rem" color="dimmed" style={{ marginTop: '0.5rem' }}>
          {format(time, 'EEEE')}
        </Text>
        <Text size="1.5rem" color="dimmed">
          {format(time, 'MMMM d')}
        </Text>
      </Stack>
    </div>
  );
}

export default Clock; 