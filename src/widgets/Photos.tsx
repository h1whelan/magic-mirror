import { useEffect, useState } from 'react'
import axios from 'axios'

interface Photo {
  id: string
  baseUrl: string
  filename: string
}

interface AuthState {
  accessToken: string
  expiresAt: number
}

const SCOPES = ['https://www.googleapis.com/auth/photoslibrary.readonly']
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const AUTH_STORAGE_KEY = 'google_photos_auth'
const PHOTOS_TO_SHOW = 4 // Number of photos to show in collage

declare global {
  interface Window {
    google: any
  }
}

function Photos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [startIndex, setStartIndex] = useState(0)
  const [authState, setAuthState] = useState<AuthState | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  // Load saved auth state from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth) as AuthState
      if (parsed.expiresAt > Date.now()) {
        setAuthState(parsed)
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
  }, [])

  // Initialize Google API
  useEffect(() => {
    const loadGoogleApi = async () => {
      try {
        if (!CLIENT_ID || !API_KEY) {
          throw new Error('Missing Google API credentials. Please check your .env file.')
        }
        setDebugInfo('Loading Google Identity Services...')

        // Load the Google Identity Services script
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://accounts.google.com/gsi/client'
          script.onload = resolve
          script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
          document.body.appendChild(script)
        })

        setDebugInfo('Loading Google API client...')

        // Load the Google API client script
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://apis.google.com/js/api.js'
          script.onload = resolve
          script.onerror = () => reject(new Error('Failed to load Google API client'))
          document.body.appendChild(script)
        })

        // Load the client library
        await new Promise((resolve) => {
          window.gapi.load('client', resolve)
        })

        // Initialize the client
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest']
        })

        setDebugInfo('Google API initialization complete')
        setIsLoading(false)

        // Try to restore session
        if (authState) {
          fetchPhotos()
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setDebugInfo(`Error during initialization: ${errorMessage}`)
        setError(`Failed to load Google API: ${errorMessage}`)
        setIsLoading(false)
      }
    }

    loadGoogleApi()
  }, [])

  const handleSignIn = async () => {
    try {
      setDebugInfo('Initializing Google Identity Services client...')
      
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        callback: async (response: any) => {
          if (response.error) {
            setError(response.error)
            return
          }

          const newAuthState: AuthState = {
            accessToken: response.access_token,
            expiresAt: Date.now() + (response.expires_in * 1000)
          }

          setAuthState(newAuthState)
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState))

          // Schedule token refresh
          setTimeout(
            () => handleSignIn(),
            (response.expires_in - 300) * 1000 // Refresh 5 minutes before expiry
          )

          await fetchPhotos()
        }
      })

      setDebugInfo('Requesting access token...')
      client.requestAccessToken()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setDebugInfo(`Sign in error: ${errorMessage}`)
      setError('Failed to sign in')
    }
  }

  const fetchPhotos = async () => {
    if (!authState?.accessToken) return

    try {
      const response = await axios.get(
        'https://photoslibrary.googleapis.com/v1/mediaItems',
        {
          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
          },
          params: {
            pageSize: 20, // Fetch more photos for variety
          },
        }
      )

      setPhotos(response.data.mediaItems)
      setError('')
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setAuthState(null)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
  }

  // Fetch photos when auth state changes
  useEffect(() => {
    if (authState) {
      fetchPhotos()
    }
  }, [authState])

  // Auto-rotate collage
  useEffect(() => {
    if (photos.length < PHOTOS_TO_SHOW) return

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % (photos.length - (PHOTOS_TO_SHOW - 1)))
    }, 10000) // Change every 10 seconds

    return () => clearInterval(interval)
  }, [photos.length])

  if (isLoading || error || !authState || photos.length === 0) {
    return <div className="widget photos-widget photos-collage" />
  }

  const currentPhotos = photos.slice(startIndex, startIndex + PHOTOS_TO_SHOW)

  return (
    <div className="widget photos-widget photos-collage">
      {currentPhotos.map((photo, index) => (
        <div 
          key={photo.id} 
          className={`collage-item collage-item-${index}`}
        >
          <img
            src={`${photo.baseUrl}=w400-h400-c`}
            alt=""
            className="photo"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}

export default Photos 