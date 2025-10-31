import { useEffect, useState } from 'react'
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Findwork from './components/Findwork'
import Findfreelancers from './components/Findfreelancers'
import Login from './components/Login'
import Logout from './components/Logout'
import Signin from './components/Signin'
import Navbar from './components/Navbar'
import Postproject from './components/Postproject'
import CitizenForm from './components/CitizenForm'
import FreelancerProfile from './components/FreelancerProfile'
import {AuthProvider} from './components/AuthContext';
import ClientProfile from './components/Department'
import CreateJob from './components/CreateJob'
import { div } from 'framer-motion/client'
import JobCard from './components/JobCard'
import DepartmentForm from './components/DepartmentForm'
import AdminDashboard from './components/AdminDashboard';
function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Fetch user on app load
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:3000/users/api/me', {
          credentials: 'include' // <--- important for cookies!
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log(err);
        setUser(null);
      }
    }

    checkAuth();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element:
        <div>
          <Navbar user={user} />
          <Home user={user} />
        </div>
    },
    {
      path: "/findwork",
      element:
        <div>
          <Navbar user={user} />
          <Findwork />
        </div>
    },
    {
      path: "/findfreelancers",
      element:
        <div>
          <Navbar user={user} />
          <Findfreelancers />
        </div>
    },
    {
      path: "/login",
      element:
        <div>
          <Navbar user={user} />
          <Login />
        </div>
    },
    {
      path: "/logout",
      element:
        <div>
          <Navbar user={user} />
          <Logout />
        </div>
    },
    {
      path: "/signin",
      element:
        <div>
          <Navbar user={user} />
          <Signin />
        </div>
    },
    {
      path: "/citizen-form/:id",
      element:
        <div>
          <Navbar user={user} />
          <CitizenForm />
        </div>
    },
     {
      path: "/department-form/:id",
      element:
        <div>
          <Navbar user={user} />
          <DepartmentForm />
        </div>
    },
    {
      path: "/user/:id",
      element:
        <div>
          <Navbar user={user} />
          <FreelancerProfile />
        </div>
    },
    {
      path: "/postproject",
      element:
        <div>
          <Navbar user={user} />
          <Postproject />
        </div>
    },
    {
      path: "/department/:id",
      element:
        <div>
          <Navbar user={user} />
          <ClientProfile />
        </div>
    },
    {
      path: "/createjob/:id",
      element:
        <div>
          <Navbar user={user} />
          <CreateJob />
        </div>
    },
    {
      path: "/job/:id/:freelancerId",
      element:
      <div>
        <Navbar/>
        <JobCard/>
      </div>
    },
    {
      path: "/admin",
      element:
      <div>
        <Navbar/>
        <AdminDashboard/>
      </div>
    }
    
  ])

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
