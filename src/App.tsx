import { useState, useEffect } from 'react'
import { MantineProvider, AppShell, Stack, Group } from '@mantine/core'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Widget components
import Clock from './widgets/Clock'
import Rail from './widgets/Rail'
import Weather from './widgets/Weather'
import Forecast from './widgets/Forecast'

function App() {
  const [isWidgetsVisible, setWidgetsVisible] = useState(false)

  const toggleWidgets = () => {
    setWidgetsVisible(!isWidgetsVisible)
  }

  return (
    <MantineProvider
      theme={{
        colorScheme: 'dark',
        primaryColor: 'blue',
      }}
    >
      <div 
        style={{ 
          width: '100vw',
          height: '100vh',
          background: '#000000',
          position: 'fixed',
          top: 0,
          left: 0,
          overflow: 'hidden',
        }}
        onClick={toggleWidgets}
      >
        <Clock subtle={true} />

        <AppShell
          padding="md"
          style={{ 
            height: '100%',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AnimatePresence>
            {isWidgetsVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2rem',
                }}
              >
                <div style={{ 
                  display: 'flex',
                  gap: '2rem',
                  justifyContent: 'center',
                  marginBottom: '2rem'
                }}>
                  <div style={{ flex: '0 1 400px' }}>
                    <Weather />
                  </div>
                  <div style={{ flex: '0 1 400px' }}>
                    <Forecast />
                  </div>
                </div>
                <div style={{ 
                  maxWidth: '800px',
                  margin: '0 auto',
                  width: '100%'
                }}>
                  <Rail />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AppShell>
      </div>
    </MantineProvider>
  )
}

export default App
