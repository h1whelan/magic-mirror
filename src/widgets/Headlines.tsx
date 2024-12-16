import { useEffect, useState } from 'react'
import axios from 'axios'

interface NewsItem {
  title: string
  source: {
    name: string
  }
  publishedAt: string
}

function Headlines() {
  const [headlines, setHeadlines] = useState<NewsItem[]>([])
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        // Note: You'll need to replace 'YOUR_API_KEY' with an actual NewsAPI key
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=gb&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
        )
        setHeadlines(response.data.articles.slice(0, 5))
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch headlines')
        setIsLoading(false)
      }
    }

    fetchHeadlines()
    // Refresh headlines every 30 minutes
    const interval = setInterval(fetchHeadlines, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return <div className="widget headlines-widget">Loading headlines...</div>
  }

  if (error) {
    return <div className="widget headlines-widget">Error: {error}</div>
  }

  return (
    <div className="widget headlines-widget">
      <h2>Top Headlines</h2>
      <div className="headlines-container">
        {headlines.map((article, index) => (
          <div key={index} className="headline-item">
            <p className="headline-title">{article.title}</p>
            <div className="headline-meta">
              <span>{article.source.name}</span>
              <span>{new Date(article.publishedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Headlines 