'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/MyStore/AuthStore'
import { ENDPOINTS } from '@/store/constants/api'
import axiosInstance from '@/axiosInstance*'
import { Button } from '@mui/material'
import { User } from '@/store/Models/User'
import throttle from 'lodash.throttle'

const DepartmentCard = dynamic(() =>  import('@/mic-component/departmentCard/DepartmentCard'))


interface Department {
  _id: string
  DepartmentName: string
  imgUrl: string
}
interface LastSession {
  _id: string
  Title: string
  Description: string
  Room: string
  Instructor?: {
    NomPrenom: string
    Email: string
  }
  DepartmentId?: {
    _id: string
    DepartmentName: string
  }
  Date: string
}

export default function Dashboard() {
  const router = useRouter()
  const [departments, setDepartments] = useState<Department[]>([])
  const departmentIds = useAuthStore(state => state.user?.DepartmentIds || [])
  const userId = useAuthStore(state => state.user?.id || '')
  const setCurrentDepartment = useAuthStore(state => state.setCurrentDepartment)
  let selectedDepartmentName = ''
  const [lastSessions, setLastSessions] = useState<LastSession[]>([])
  const [aboutResponses, setAboutResponses] = useState({
    totalResponses: 0,
    responsesByStatus: []
  })

  const fetchDepartments = throttle(async () => {
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.GET_DEPARTMENTS_NAMES_IDS
      )
      setDepartments(response.data.departments)
    } catch (error) {
      console.error('Department fetching failed:', error)
    }
  }, 1000)
  const fetchResponses = throttle(async () => {
    try {
      const response = await axiosInstance.get(`/response/status/${userId}`)
      console.log(response.data)
      setAboutResponses(response.data)
    } catch (error) {
      console.error('Department fetching failed:', error)
    }
  }, 1000)
  const fetchLastSessions = throttle(async () => {
    try {
      const sessionPromises = departmentIds.map(depId =>
        axiosInstance.get(`/session/LastSession/${depId}`)
      )
      const responses = await Promise.all(sessionPromises)
      const sessions = responses
        .map((res, index) => {
          if (res.data?.session) {
            // Création de l'objet session avec departmentId
            const session = {
              ...res.data.session,
              departmentId: departmentIds[index]
            }

            // Vérification si l'objet session contient uniquement departmentId
            if (Object.keys(session).length === 1 && session.departmentId) {
              return null // Si l'objet contient uniquement departmentId, on le supprime
            }

            return session
          }

          console.error(
            'Invalid session data for department:',
            departmentIds[index]
          )
          return null
        })
        .filter(Boolean)
      console.log(sessions)

      setLastSessions(sessions)
    } catch (error) {
      console.error('Error fetching last sessions:', error)
    }
  }, 1000)

  useEffect(() => {
    fetchDepartments()
    fetchLastSessions()
    fetchResponses()
  }, [])

  return (
    <div className='mx-auto mt-24 min-h-screen w-[72%] text-black'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='col-span-1 rounded-lg bg-gray-100 p-1 shadow-md'>
          <h2 className='mb-1 rounded-md bg-gradient-to-r from-secondary to-primary ps-3 text-center text-3xl font-semibold text-white'>
            Response Statistics
          </h2>
          <p className='mt-4 text-center font-bold text-gray-700'>
            Total Responses: {aboutResponses.totalResponses}
          </p>
          <ul className='space-y-2 p-6'>
            {aboutResponses.responsesByStatus.map(response => (
              <li
                key={response._id}
                className='flex justify-between text-gray-800'
              >
                <span>{response._id}</span>
                <span>{response.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className='col-span-2 rounded-lg bg-gray-100 p-1 shadow-md'>
          <h2 className='mb-1 rounded-md bg-gradient-to-r from-secondary to-primary ps-3 text-center text-3xl font-semibold text-white'>
            Last Sessions
          </h2>
          <div className='flex flex-wrap gap-6 p-2'>
            {lastSessions.map(session => (
              <div
                key={session._id}
                className='w-full rounded-lg bg-white p-4 shadow-md transition duration-200 hover:bg-gray-50 md:w-1/3'
              >
                <h3 className='mb-2 text-xl font-bold'>{session.Title}</h3>
                <p className='mb-2 text-sm text-gray-500'>{session.Date}</p>
                <p className='mb-0 text-gray-700'>{session.Description}</p>
                <p className='text-sm text-gray-500'>
                  <strong>Instructor:</strong>{' '}
                  {session.Instructor?.NomPrenom || 'N/A'}
                </p>
                <p className='text-sm text-gray-500'>
                  <strong>Department:</strong>{' '}
                  {session.DepartmentId?.DepartmentName || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-2 rounded-lg bg-gray-100 p-1 shadow-md'>
        <h2 className='mb-2 rounded-md bg-gradient-to-r from-secondary to-primary p-1 text-center text-3xl font-semibold text-white'>
          Departments
        </h2>
        <div className='flex flex-wrap items-center justify-center gap-6'>
          {departmentIds.length === 0 ? (
            <p className='text-center text-gray-700'>No departments found.</p>
          ) : (
            departments
              .filter(department => departmentIds.includes(department._id))
              .map(department => {
                const imageUrl = `/images/departments/${department.DepartmentName.toLowerCase()}.png`
                return (
                  <button
                    key={department._id}
                    onClick={() => {
                      setCurrentDepartment(department._id)
                      router.push(
                        `/member/assignments?id_dep=${department._id}`
                      )
                    }}
                    className='w-full rounded-lg bg-white p-0 shadow-md transition duration-200 hover:bg-gray-50 md:w-1/4'
                  >
                    <DepartmentCard
                      name={department.DepartmentName}
                      imageUrl={imageUrl}
                    />
                  </button>
                )
              })
          )}
        </div>
      </div>
    </div>
  )
}
