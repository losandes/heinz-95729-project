import { useParams } from 'react-router-dom'
import Layout from '@layouts/Default'

export default function () {
  const { productId } = useParams()

  return (
    <Layout>
      <h1>Product</h1>
      <p>Product ID: {productId}</p>
    </Layout>
  )
}
