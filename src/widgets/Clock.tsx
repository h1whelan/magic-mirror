import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Text, Stack } from '@mantine/core';

interface ClockProps {
  subtle?: boolean;
}

function Clock({ subtle = false }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (subtle) {
    return (
      <Stack 
        spacing={2} 
        align="flex-end" 
        style={{ 
          position: 'fixed',
          top: '0.75rem',
          right: '0.75rem',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '0.5rem 0.75rem',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)',
          maxWidth: '30%',
        }}
      >
        <Text size="1.5rem" weight={700} style={{ lineHeight: 1, opacity: 0.5 }}>
          {format(time, 'HH:mm')}
        </Text>
        <Text size="0.75rem" color="dimmed" style={{ opacity: 0.4 }}>
          {format(time, 'EEEE, MMM d')}
        </Text>
      </Stack>
    );
  }

  return (
    <div className="widget">
      <Stack spacing={0} align="center">
        <Text size="5rem" weight={700} style={{ lineHeight: 1.1 }}>
          {format(time, 'HH:mm')}
        </Text>
        <Text size="1.5rem" color="dimmed" style={{ marginTop: '0.5rem' }}>
          {format(time, 'EEEE')}
        </Text>
        <Text size="1.25rem" color="dimmed">
          {format(time, 'MMMM d')}
        </Text>
      </Stack>
    </div>
  );
}

export default Clock; 