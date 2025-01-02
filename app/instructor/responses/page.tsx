'use client'
import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { useResponseStore } from '@/app/store/MyStore/ResponseStore'
import { ResponseForInstructor } from '@/app/store/Models/Response'
import PendingIcon from '@mui/icons-material/HourglassEmpty'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { useSearchParams } from 'next/navigation'
import Empty from '@/mic-component/lottie_animation/Empty'
import ResponseStatusSelect from '@/mic-component/Instructor_UI/ResponseStatusSelect/ResponseStatusSelect'
import { toast } from 'react-hot-toast'

const Page: React.FC = () => {
  const [assignmentId, setAssignmentId] = useState<string | null>(null)
  const { responses, fetchResponses } = useResponseStore()
  const [expanded, setExpanded] = useState<string | false>(false)

  const [selectedResponse, setSelectedResponse] =
    useState<ResponseForInstructor | null>(null)

  const handleOpen = (response: ResponseForInstructor) => {
    setSelectedResponse(response)
  }

  const searchParams = useSearchParams()
  const selectedId = searchParams.get('assignmentId')

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedId) {
          await fetchResponses(selectedId)
        }
      } catch (error) {
        toast.error('Error fetching responses')
      }
    }
    if (selectedId) {
      setAssignmentId(selectedId)
      fetchData()
    }
  }, [])

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  if (!responses || responses.length === 0) {
    return (
      <div>
        <Empty />
        <Typography variant='h5' className='mb-4 text-center font-mono'>
          No responses available
        </Typography>
      </div>
    )
  }

  // Filtrer les réponses par statut
  const awaitingForReviewResponses = responses.filter(
    response => response.status === 'AWAITING FOR REVIEW'
  )
  const reviewedResponses = responses.filter(
    response => response.status === 'REVIEWED'
  )
  const editedResponses = responses.filter(
    response => response.status === 'EDITED'
  )
  const approvedResponses = responses.filter(
    response => response.status === 'APPROVED'
  )

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography
            className='rounded-md bg-gradient-to-r from-secondary to-primary text-white'
            variant='h6'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px'
            }}
          >
            <PendingIcon />
            Awaiting for Review
          </Typography>
          {awaitingForReviewResponses.length > 0 ? (
            awaitingForReviewResponses.map((response, index) => (
              <Accordion
                key={response._id}
                expanded={expanded === `panel${response._id}`}
                onChange={handleChange(`panel${response._id}`)}
                sx={{
                  width: '100%', // Largeur du conteneur parent
                  maxWidth: '600px', // Largeur maximale uniforme pour tous les accordéons
                  margin: '0 auto' // Centre horizontalement
                }}
              >
                <AccordionSummary
                  aria-controls={`panel${response._id}-content`}
                  id={`panel${response._id}-header`}
                >
                  <Typography sx={{ width: '100%' }}>
                    {response.Member.NomPrenom}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <strong>Content:</strong> {response.Content}
                    <br />
                    <strong>Created At:</strong>{' '}
                    {new Date(response.createdAt).toLocaleString()}
                    <br />
                    <Box display='flex' justifyContent='center' mt={2}>
                      <ResponseStatusSelect
                        idResponse={response._id}
                      ></ResponseStatusSelect>
                    </Box>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: '1rem',
                color: '#d32f2f',
                textAlign: 'center',
                width: '100%', // Largeur du conteneur parent
                maxWidth: '600px', // Largeur maximale uniforme pour tous les composants
                margin: '0 auto' // Centre horizontalement
              }}
            >
              No responses awaiting for review
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography
            className='rounded-md bg-gradient-to-r from-secondary to-primary text-white'
            variant='h6'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px'
            }}
          >
            <MarkEmailReadIcon />
            Reviewed
          </Typography>

          {reviewedResponses.length > 0 ? (
            reviewedResponses.map((response, index) => (
              <Accordion
                key={response._id}
                expanded={expanded === `panel${response._id}`}
                onChange={handleChange(`panel${response._id}`)}
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              >
                <AccordionSummary
                  aria-controls={`panel${response._id}-content`}
                  id={`panel${response._id}-header`}
                >
                  <Typography sx={{ width: '100%' }}>
                    {response.Member.NomPrenom}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <strong>Content:</strong> {response.Content}
                    <br />
                    <strong>Created At:</strong>{' '}
                    {new Date(response.createdAt).toLocaleString()}
                    <br />
                    <Box display='flex' justifyContent='center' mt={2}>
                      <ResponseStatusSelect
                        idResponse={response._id}
                      ></ResponseStatusSelect>
                    </Box>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: '1rem',
                color: '#d32f2f',
                textAlign: 'center',
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              No Reviewed responses
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography
            className='rounded-md bg-gradient-to-r from-secondary to-primary text-white'
            variant='h6'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px'
            }}
          >
            <BorderColorIcon />
            Edited
          </Typography>
          {editedResponses.length > 0 ? (
            editedResponses.map((response, index) => (
              <Accordion
                key={response._id}
                expanded={expanded === `panel${response._id}`}
                onChange={handleChange(`panel${response._id}`)}
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              >
                <AccordionSummary
                  aria-controls={`panel${response._id}-content`}
                  id={`panel${response._id}-header`}
                >
                  <Typography sx={{ width: '100%' }}>
                    {response.Member.NomPrenom}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <strong>Content:</strong> {response.Content}
                    <br />
                    <strong>Created At:</strong>{' '}
                    {new Date(response.createdAt).toLocaleString()}
                    <br />
                    <Box display='flex' justifyContent='center' mt={2}>
                      <ResponseStatusSelect
                        idResponse={response._id}
                      ></ResponseStatusSelect>
                    </Box>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: '1rem',
                color: '#d32f2f',
                textAlign: 'center',
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              No edited responses
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography
            className='rounded-md bg-gradient-to-r from-secondary to-primary text-white'
            variant='h6'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px'
            }}
          >
            <DoneAllIcon />
            Approved
          </Typography>
          {approvedResponses.length > 0 ? (
            approvedResponses.map((response, index) => (
              <Accordion
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
                key={response._id}
                expanded={expanded === `panel${response._id}`}
                onChange={handleChange(`panel${response._id}`)}
              >
                <AccordionSummary
                  aria-controls={`panel${response._id}-content`}
                  id={`panel${response._id}-header`}
                >
                  <Typography sx={{ width: '100%' }}>
                    {response.Member.NomPrenom}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <strong>Content:</strong> {response.Content}
                    <br />
                    <strong>Created At:</strong>{' '}
                    {new Date(response.createdAt).toLocaleString()}
                    <br />
                    <Box display='flex' justifyContent='center' mt={2}>
                      <ResponseStatusSelect
                        idResponse={response._id}
                      ></ResponseStatusSelect>
                    </Box>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: '1rem',
                color: '#d32f2f',
                textAlign: 'center',
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              No Approved responses
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Page
