'use client'
import { useEffect, useState, useRef } from 'react'
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useDepartmentStore } from '@/store/MyStore/DepartmentStore' 

type UpdateDepartementProps = {
  isOpen: boolean
  onRequestClose: () => void
  id: string
}

const UpdateDepartement: React.FC<UpdateDepartementProps> = ({
  isOpen,
  onRequestClose,
  id
}) => {
  const [DepartementName, setDepartementName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null) // Input reference for focus control
  const allowedDepartments = [
    'Basic Web',
    'Intermediate Web',
    'Advanced Web',
    'AI',
    'Mariem Department Attention!!!!!'
  ]
  // Zustand action to update the department
  const updateDepartment = useDepartmentStore(state => state.updateDepartment)
  const departments = useDepartmentStore(state => state.departments)

  // Fetch the department details from Zustand store when the modal is opened
  useEffect(() => {
    if (isOpen) {
      const department = departments.find(dept => dept._id === id)
      if (department) {
        setDepartementName(department.DepartmentName)
      }
      // Set focus on input when modal opens
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [id, isOpen, departments])

  // Handle form submission to update the department
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!allowedDepartments.includes(DepartementName)) {
      alert(
        `Nom du département invalide. Veuillez sélectionner un nom parmi : ${allowedDepartments.join(', ')}`
      )
      return
    }
    const updatedDepartment = {
      DepartmentName: DepartementName
    }

    try {
      await updateDepartment(id, updatedDepartment) // Call the Zustand action
      alert('Department updated successfully!')
     // window.location.reload()
      onRequestClose() // Close the modal after successful submission
    } catch (error) {
      console.error('Error updating the department:', error)
      alert('Failed to update the department. Please try again.')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false} // Prevent react-modal from hiding other content (helps with focus issues)
      className='flex h-full w-full items-center justify-center'
    >
      <main className='relative mt-14 flex h-[500px] w-[400px] flex-col items-center justify-evenly bg-white'>
        <FontAwesomeIcon
          icon={faTimes}
          className='absolute right-2 top-3 h-4 w-4 cursor-pointer font-bold text-black'
          onClick={onRequestClose}
        />
        <h1 className='text-xl font-bold text-blue-400'>Update Department</h1>

        <form
          onSubmit={handleSubmit}
          className='flex w-full flex-col items-center'
        >
          {/* Input field for Department Name */}
          <div className='mb-2 w-5/6'>
            <label htmlFor='departement-name' className='mb-1 block'>
              Department Name:
            </label>
            <input
              ref={inputRef} // Input reference for focus
              type='text'
              id='departement-name'
              value={DepartementName}
              onChange={e => setDepartementName(e.target.value)}
              className='w-full border border-gray-300 p-2'
              required
            />
          </div>

          {/* Submit button */}
          <button
            className='mt-4 w-5/6 rounded-md border-none bg-blue-500 px-4 py-2 text-xl text-white'
            type='submit'
          >
            Update
          </button>
        </form>
      </main>
    </Modal>
  )
}

export default UpdateDepartement
