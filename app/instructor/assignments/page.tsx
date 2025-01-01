'use client'
import React, { useEffect, useState } from 'react'
import {
  Grid,
  Button,
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useRouter } from 'next/navigation'
import { useAssignmentStore } from '@/store/MyStore/AssignmentsStore'
import { useAuthStore } from '@/store/MyStore/AuthStore'
import PaginationComponent from '@/mic-component/PaginationComponent/PaginationComponent'
import AssignmentCardForInstructor from '@/mic-component/Instructor_UI/AssignmentCardForInstructor/AssignmentCardForInstructor'
import EnhancedTable from '@/mic-component/Admin_UI/TableComponent/TableComponent'
import DeleteAssignmentModal from '@/mic-component/Instructor_UI/AssignmentDeleteModalForInstructor/AssignmentDeleteModalForInstructor'
import AssignmentModal from '@/mic-component/Instructor_UI/AssignmentModal/AssignmentModal'
import { toast } from 'react-hot-toast'

const Page = () => {
  const router = useRouter()
  const assignments = useAssignmentStore(state => state.assignments)
  const fetchAssignments = useAssignmentStore(state => state.fetchAssignments)
  const deleteAssignment = useAssignmentStore(state => state.deleteAssignment)
  const user = useAuthStore(state => state.user)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [assignmentToDelete, setAssignmentToDelete] = useState(null)
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  useEffect(() => {
    const loadAssignments = async () => {
      if (user && user.DepartmentId) {
        try {
          await fetchAssignments(user.DepartmentId)
        } catch (error) {
          toast.error('Failed to fetch assignments')
        }
      }
    }
    loadAssignments()
  }, [])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAssignments = React.useMemo(() => {
    return assignments
      ? assignments.slice(indexOfFirstItem, indexOfLastItem)
      : []
  }, [assignments, indexOfFirstItem, indexOfLastItem])

  const handlePageChange = newPage => setCurrentPage(newPage)

  const handleEditAssignment = id => {
    const assignment = assignments.find(a => a._id === id)
    if (assignment) {
      setEditingAssignment(assignment)
      setOpenUpdateDialog(true)
    }
  }

  const handleDeleteAssignment = id => {
    setAssignmentToDelete(id)
    setOpenDeleteDialog(true)
  }

  const confirmDeleteAssignment = async () => {
    if (assignmentToDelete) {
      try {
        await deleteAssignment(assignmentToDelete, user.DepartmentId)
        toast.success('Assignment deleted successfully')
      } catch {
        toast.error('Failed to delete assignment')
      } finally {
        setOpenDeleteDialog(false)
        setAssignmentToDelete(null)
      }
    }
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const headCells = [
    { id: 'Title', numeric: false, disablePadding: true, label: 'Title' },
    { id: 'DueDate', numeric: false, disablePadding: false, label: 'Due Date' }
  ]

  return (
    <>
      {isMobile ? (
        <Box
          className='container mx-auto flex flex-col items-center'
          sx={{ mt: 14 }}
        >
          <Button
            variant='contained'
            startIcon={<AddCircleOutlineIcon />}
            onClick={() =>
              router.push(
                `/instructor/create?departmentId=${user.DepartmentId}`
              )
            }
          >
            Add New Assignment
          </Button>
          {currentAssignments.length > 0 ? (
            // currentAssignments.map(assignment => (
            //   <AssignmentCardForInstructor
            //     key={assignment._id}
            //     assignment={assignment}
            //     onEdit={() => handleEditAssignment(assignment._id)}
            //     onDelete={() => handleDeleteAssignment(assignment._id)}
            //     onOpenAssignmentModal={() => {
            //       setSelectedAssignment(assignment)
            //       setOpenAssignmentModal(true)
            //     }}
            //   />
            // ))
            <div> AssignmentCardForInstructor </div>
          ) : (
            <Typography>No assignments available</Typography>
          )}
          <PaginationComponent
            currentPage={currentPage}
            totalItems={assignments ? assignments.length : 0}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </Box>
      ) : (
        <Box sx={{ width: '90%', mx: 'auto', mt: 10, mb: 10 }}>
          <Button
            className='rounded-md bg-gradient-to-r from-secondary to-primary text-white'
            variant='contained'
            startIcon={<AddCircleOutlineIcon />}
            sx={{ mt: 4, mb: 4 }}
            onClick={() =>
              router.push(
                `/instructor/create?departmentId=${user.DepartmentId}`
              )
            }
          >
            Add New Assignment
          </Button>
          <EnhancedTable
            data={assignments}
            headCells={headCells}
            onDelete={handleDeleteAssignment}
            title='List of Assignments'
            renderRowActions={row => (
              <div className='flex space-x-4'>
                <Button
                  className='rounded-md bg-gradient-to-r from-secondary to-primary text-white'
                  onClick={() => {
                    router.push(`/instructor/create?assignmentId=${row._id}`)
                  }}
                  variant='contained'
                >
                  Edit
                </Button>
                <Button
                  className='rounded-md bg-gradient-to-r from-secondary to-primary text-white'
                  variant='contained'
                  onClick={() => {
                    setSelectedAssignment(row)
                    setOpenAssignmentModal(true)
                  }}
                >
                  Details
                </Button>
                <Button
                  className='rounded-md bg-gradient-to-r from-secondary to-primary text-white'
                  variant='contained'
                  onClick={() =>
                    router.push(`/instructor/responses?assignmentId=${row._id}`)
                  }
                >
                  View Responses
                </Button>
              </div>
            )}
          />
        </Box>
      )}

      {openDeleteDialog && (
        <DeleteAssignmentModal
          isOpen={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={confirmDeleteAssignment}
        />
      )}

      {selectedAssignment && (
        <AssignmentModal
          isOpen={openAssignmentModal}
          onOpenChange={setOpenAssignmentModal}
          DueDate={selectedAssignment.DueDate}
          Description={selectedAssignment.Description}
          Title={selectedAssignment.Title}
          assignmentId={selectedAssignment._id}
        />
      )}
    </>
  )
}

export default Page
