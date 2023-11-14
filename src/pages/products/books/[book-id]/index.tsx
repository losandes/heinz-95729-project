import { useParams } from 'react-router-dom'
import Layout from '@layouts/Default'

export default function () {
  const { bookId } = useParams()

  return (
    <Layout>
      <h1>Books</h1>
      <p>Book ID: {bookId}</p>
    </Layout>
  )
}
