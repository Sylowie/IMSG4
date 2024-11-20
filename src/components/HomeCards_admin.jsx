import React from 'react'
import { Link } from 'react-router-dom'
import Card from './Card'

// changes made on 09/09 : to change from supplier to customer page
const HomeCards_admin = () => {
  return (
    <section className="py-4">
        <div className="container-xl lg:container m-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <Card bg='bg-indigo-200'>
            <h2 className="text-2xl font-bold">Purchase Orders</h2>
              <p className="mt-2 mb-4">
                View List of Pending Purchase Orders
              </p>
              <Link
                to="/purchaseOrders"
                className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
              >
                View Purchase Orders
              </Link>
            </Card>
            <Card>
            <h2 className="text-2xl font-bold">Customers</h2>
              <p className="mt-2 mb-4">
                View List of Customers
              </p>
              <Link
                to="/customer"
                className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
              >
                View Customers
              </Link>
            </Card>
          </div>
        </div>
      </section>
  )
}

export default HomeCards_admin