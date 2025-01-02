'use client'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import AddInstructorModal from '@/mic-component/CRUDInstructors/AjoutModal'
import UpdateInstructorModal from '@/mic-component/CRUDInstructors/updateModal'
import DeleteInstructorModal from '@/mic-component/CRUDInstructors/DeleteModal'

import Layout from '@/mic-component/Admin_UI/Layout/Layout'
import EnhancedTable from '@/mic-component//Admin_UI/TableComponent/TableComponent'
import Button from '@mui/material/Button'
import { useInstructorStore } from '@/store/MyStore/InstructorStore'

export default function  Page ()  {
  const {
    instructors,
    fetchInstructors,
    addInstructor,
    updateInstructor,
    removeInstructor
  } = useInstructorStore()
  const [filter, setFilter] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  interface HeadCell {
    id: string
    numeric: boolean
    disablePadding: boolean
    label: string
  }
  useEffect(() => {
    const loadMembers = async () => {
      await fetchInstructors()
    }

    loadMembers()
  }, [fetchInstructors])

  const openAddModal = () => setIsAddModalOpen(true)
  const closeAddModal = async () => {
    await fetchInstructors()
    setIsAddModalOpen(false)
  }

  const openUpdateModal = instructor => {
    console.log('Opening update modal for:', instructor) // Debugging line
    setSelectedInstructor(instructor)
    setIsUpdateModalOpen(true)
  }

  const closeUpdateModal = async () => {
    console.log('Closing update modal') // Debugging line
    setIsUpdateModalOpen(false)
    setSelectedInstructor(null) // Clear selected instructor
    await fetchInstructors()
  }

  const openDeleteModal = instructor => {
    setSelectedInstructor(instructor)

    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => setIsDeleteModalOpen(false)

  const handleConfirmDelete = async () => {
    await removeInstructor(selectedInstructor)
    await fetchInstructors()
    closeDeleteModal()
  }
  const headCells: HeadCell[] = [
    {
      id: '_id',
      numeric: false,
      disablePadding: true,
      label: 'ID'
    },
    {
      id: 'NomPrenom',
      numeric: false,
      disablePadding: true,
      label: 'Nom et Prénom'
    },
    { id: 'Email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'Adresse', numeric: false, disablePadding: false, label: 'Adresse' },
    /*{
      {
      id: 'FormattedDepartmentsIds',
      numeric: false,
      disablePadding: false,
      label: 'DepartmentIds'
    },
    },*/
    {
      id: 'ImageLink',
      numeric: false,
      disablePadding: false,
      label: 'Image Link'
    }
  ]
  return (
    <Layout>
      <div className='p-10'>
        <div className='flex h-fit w-full flex-col items-center justify-center border-2 border-solid border-gray-400 bg-white'>
          <div className='flex h-20 w-full items-center justify-between bg-blue-500 px-5'>
            <h1 className='my-auto w-1/2 text-2xl text-white'>
              Manage Instructors
            </h1>
            <div className='flex w-1/2 items-center justify-end'>
              <div
                className='flex h-12 w-48 cursor-pointer items-center justify-evenly rounded-sm border-none bg-green-400 text-white'
                onClick={openAddModal}
              >
                <FontAwesomeIcon
                  className='h-5 w-5 rounded-xl bg-white text-green-400'
                  icon={faPlus}
                />
                Add New Instructor
              </div>
            </div>
          </div>
          <div className='flex w-full flex-col'>
            <EnhancedTable
              data={instructors}
              headCells={headCells}
              title='List of Membres'
              onDelete={row => openDeleteModal(row)}
              renderRowActions={row => (
                <Button variant='outlined' onClick={() => openUpdateModal(row)}>
                  Éditer
                </Button>
              )}
            />
          </div>
        </div>
        <AddInstructorModal
          isOpen={isAddModalOpen}
          onRequestClose={closeAddModal}
        />
        {selectedInstructor && (
          <UpdateInstructorModal
            isOpen={isUpdateModalOpen}
            onRequestClose={closeUpdateModal}
            id={selectedInstructor?._id} // Pass the ID of the selected instructor
          />
        )}
        <DeleteInstructorModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
        />
        <div />
      </div>
    </Layout>
  )
}


