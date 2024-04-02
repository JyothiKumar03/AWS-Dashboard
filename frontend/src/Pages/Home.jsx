import React from 'react'
import Header from '../Components/Header'
import Dashboard from '../Components/Dashboard'
import HostingZoneDashboard from '../Components/HostingZoneDashboard.jsx'

function Home() {
  return (
    <div>
      <Header/>
      <HostingZoneDashboard />
    </div>
  )
}

export default Home
