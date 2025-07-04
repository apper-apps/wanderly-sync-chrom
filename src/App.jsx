import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Home from '@/components/pages/Home'
import Destinations from '@/components/pages/Destinations'
import PackageDetails from '@/components/pages/PackageDetails'
import GroupTravel from '@/components/pages/GroupTravel'
import Booking from '@/components/pages/Booking'
import BookingConfirmation from '@/components/pages/BookingConfirmation'
import MyTrips from '@/components/pages/MyTrips'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/package/:id" element={<PackageDetails />} />
<Route path="/group-travel" element={<GroupTravel />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/my-trips" element={<MyTrips />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!font-body"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App