import { Authorized } from '@domains/profile'
import Layout from '@layouts/Default'

export default function () {
  return (
    <Layout>
      <Authorized />
    </Layout>
  )
}
