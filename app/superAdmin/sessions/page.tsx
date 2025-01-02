'use client'
import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Modal } from '@mui/material'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useSearchParams } from 'next/navigation'
import Empty from '@/mic-component/lottie_animation/Empty'
import { parse } from 'date-fns'
import timeGridPlugin from '@fullcalendar/timegrid'
import axiosInstance from '@/axiosInstance*'
import Layout from '@/mic-component/Admin_UI/Layout/Layout'

const Page = () => {
  // const [selectedEvent, setSelectedEvent] = useState<any>(null)
  // const [sessions, setSessions] = useState([])

  // useEffect(() => {
  //   const loadSessions = async () => {
  //       try {
  //           const response = await axiosInstance.get(
  //           '/session/all'
  //           )
  //           setSessions(response.data)

  //         } catch (error) {
  //           console.error("Erreur lors de l'upload du fichier", error)
  //           alert("Erreur lors de l'upload du fichier")
  //         }
  //   }

  //   loadSessions()

  // }, [])

  // const handleEventClick = (info: any) => {
  //   setSelectedEvent(info.event.extendedProps)
  // }

  // const handleCloseModal = () => {
  //   setSelectedEvent(null)
  // }

  return (
    <Layout>
      <div> à implementer plus tard</div>
      {/* {sessions.length > 0 ? (
        <Box
          sx={{
            padding: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            width: '70%',
            height: '70%',
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin , timeGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            headerToolbar={{
              right: 'prev,next today',
              center: 'title',
              left: 'dayGridMonth,timeGridWeek,timeGridDay', 
            }}
            
            events={sessions.map((session) => ({
              title: session.Title || 'Untitled Session',
              start: parse(
                session.Date,
                'dd/MM/yyyy HH:mm:ss',
                new Date()
              ),
              extendedProps: {
                id: session._id,
                title: session.Title  || 'Untitled Session',
                instructor: session.Instructor || 'Unknown Instructor',
                room: session.Room || 'No Room Assigned',
                description: session.Description || 'No description available',
              },
            }))}
            eventContent={(eventInfo) => renderEventContent(eventInfo)}
            eventClick={handleEventClick} // Gestionnaire pour le clic sur un événement
          />
        </Box>
      ) : (
        <div>
          <Empty />
          <Typography variant="h5" className="text-center">
            No sessions available
          </Typography>
        </div>
      )}

      
      <Modal
        open={!!selectedEvent}
        onClose={handleCloseModal}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
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
            
            borderRadius: 4,
          }}
        >
          {selectedEvent && (
            <>
              <Typography className="rounded-md bg-gradient-to-r from-secondary to-primary text-white text-center p-2" id="event-modal-title" variant="h6" component="h2">
                {selectedEvent.title || 'Untitled Session'}
              </Typography>
              <Typography id="event-modal-description"sx={{ pl: 4 , pr: 4 , mt: 2 }}>
                <strong>Instructor:</strong> {selectedEvent.instructor}
              </Typography>
              <Typography sx={{ pl: 4 , pr: 4 }} >
                <strong>Room:</strong> {selectedEvent.room}
              </Typography>
              <Typography sx={{ pl: 4 , pr: 4 }} >
                <strong>Duration :</strong> 2 hours
              </Typography>
              <Typography sx={{ pl: 4 , pr: 4 , mb : 2}} >
                <strong>Description:</strong> {selectedEvent.description}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
     */}
    </Layout>
  )
}
// function renderEventContent(eventInfo: any) {
//   const { event } = eventInfo
//   const { title, start } = event
//   const { instructor, room, description } = event.extendedProps
//   return (
//     <Box
//       className="rounded-md bg-gradient-to-r from-secondary to-primary text-white text-center p-2"
//       sx={{
//         width: '96%',
//         overflow: 'auto',
//         justifyContent: 'center',
//         padding: 1,
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         borderRadius: 2,
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
//       }}
//     >
//       <Typography variant='body2' fontWeight='bold'>
//         {title}
//       </Typography>
//       <Typography variant='body2'>
//         <strong>{new Date(start).toLocaleTimeString('en-US', {
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit',
//           hour12: false
//         })}</strong>
//       </Typography>
//       <Typography variant='body2'>
//         <strong>Room:</strong> {room}
//       </Typography>

//     </Box>
//   )
// }

export default Page
