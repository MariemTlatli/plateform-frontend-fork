'use client'
import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Modal } from '@mui/material'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useSearchParams } from 'next/navigation'
import Empty from '@/mic-component/lottie_animation/Empty'
import { useSessionsStore } from '@/store/MyStore/SessionsStore'
import { parse } from 'date-fns'
import timeGridPlugin from '@fullcalendar/timegrid'

type Session = {
  _id: string
  Title: string
  Date: string
  Instructor: string
  Room: string
  Description: string
}

export default function Page() {
  const sessions = useSessionsStore(state => state.sessions)
  const fetchSessions = useSessionsStore(state => state.fetchSessions)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [selectedEvent, setSelectedEvent] = useState<any>(null) // Stocke les informations de l'événement sélectionné

  const searchParams = useSearchParams()
  const departmentId = searchParams.get('id_dep')

  useEffect(() => {
    const loadSessions = async (departmentId: string) => {
      await fetchSessions(departmentId)
    }
    if (departmentId) {
      loadSessions(departmentId)
    }
  }, [])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSessions = sessions
    ? sessions.slice(indexOfFirstItem, indexOfLastItem)
    : []

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps)
  }

  const handleCloseModal = () => {
    setSelectedEvent(null)
  }

  return (
    <Paper
      sx={{
        height: '60%',
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 2,
        width: '70%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {currentSessions && currentSessions.length > 0 ? (
        <Box
          sx={{
            padding: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            width: '70%',
            height: '70%'
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView='dayGridMonth'
            weekends={true}
            headerToolbar={{
              right: 'prev,next today',
              center: 'title',
              left: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={currentSessions.map(session => ({
              title: session.Title || 'Untitled Session',
              start: parse(session.Date, 'dd/MM/yyyy HH:mm:ss', new Date()),
              extendedProps: {
                id: session._id,
                title: session.Title || 'Untitled Session',
                instructor: session.Instructor || 'Unknown Instructor',
                room: session.Room || 'No Room Assigned',
                description: session.Description || 'No description available'
              }
            }))}
            eventContent={eventInfo => renderEventContent(eventInfo)}
            eventClick={handleEventClick} // Gestionnaire pour le clic sur un événement
          />
        </Box>
      ) : (
        <div>
          <Empty />
          <Typography variant='h5' className='text-center'>
            No sessions available
          </Typography>
        </div>
      )}

      {/* Modal pour afficher les détails de l'événement */}
      <Modal
        open={!!selectedEvent}
        onClose={handleCloseModal}
        aria-labelledby='event-modal-title'
        aria-describedby='event-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',

            boxShadow: 24,

            borderRadius: 4
          }}
        >
          {selectedEvent && (
            <>
              <Typography
                className='rounded-md bg-gradient-to-r from-secondary to-primary p-2 text-center text-white'
                id='event-modal-title'
                variant='h6'
                component='h2'
              >
                {selectedEvent.title || 'Untitled Session'}
              </Typography>
              <Typography
                id='event-modal-description'
                sx={{ pl: 4, pr: 4, mt: 2 }}
              >
                <strong>Instructor:</strong> {selectedEvent.instructor}
              </Typography>
              <Typography sx={{ pl: 4, pr: 4 }}>
                <strong>Room:</strong> {selectedEvent.room}
              </Typography>
              <Typography sx={{ pl: 4, pr: 4 }}>
                <strong>Duration :</strong> 2 hours
              </Typography>
              <Typography sx={{ pl: 4, pr: 4, mb: 2 }}>
                <strong>Description:</strong> {selectedEvent.description}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Paper>
  )
}
function renderEventContent(eventInfo: any) {
  const { event } = eventInfo
  const { title, start } = event
  const { instructor, room, description } = event.extendedProps
  return (
    <Box
      className='rounded-md bg-gradient-to-r from-secondary to-primary p-2 text-center text-white'
      sx={{
        width: '96%',
        overflow: 'auto',
        justifyContent: 'center',
        padding: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Typography variant='body2' fontWeight='bold'>
        {title}
      </Typography>
      <Typography variant='body2'>
        <strong>
          {new Date(start).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}
        </strong>
      </Typography>
      <Typography variant='body2'>
        <strong>Room:</strong> {room}
      </Typography>
    </Box>
  )
}
