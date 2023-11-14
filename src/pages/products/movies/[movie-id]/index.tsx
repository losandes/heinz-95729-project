import { useParams } from 'react-router-dom'
import Layout from '@layouts/Default'

export default function () {
  const { movieId } = useParams()

  return (
    <Layout>
      <h1>Movies</h1>
      <p>Movie ID: {movieId}</p>
    </Layout>
  )
}
