'use client'
import * as React from 'react'
import { Grid, Button } from '@mui/material'
import Layout from '@/mic-component/Admin_UI/Layout/Layout'
import EnhancedTable from '@/mic-component/Admin_UI/TableComponent/TableComponent'
import toast from 'react-hot-toast'
import UserForm from '@/mic-component/Admin_UI/Form/UserForm'
import { useEffect, useState } from 'react'
import { MemberForAdmin } from '@/store/Models/Member'
import { useMemberStore } from '@/store/MyStore/MembersStore'

const Page: React.FC = () => {
  const members = useMemberStore(state => state.membersForAdmin)
  const fetchMembersForAdmin = useMemberStore(
    state => state.fetchMembersForAdmin
  )
  const deleteMembersForAdmin = useMemberStore(
    state => state.deleteMembersForAdmin
  )
  interface HeadCell {
    id: string
    numeric: boolean
    disablePadding: boolean
    label: string
  }
  const [editingMember, setEditingMember] = useState<MemberForAdmin | null>(
    null
  )

  useEffect(() => {
    const loadMembers = async () => {
      await fetchMembersForAdmin()
    }

    loadMembers()
  }, [fetchMembersForAdmin])

  const handleEdit = (id: string | number) => {
    const member = members.find(member => member._id === id)
    if (member) {
      setEditingMember(member)
    }
  }

  const headCells: HeadCell[] = [
    /*{ id: '_id', numeric: false, disablePadding: true, label: 'ID' }*/

    {
      id: 'NomPrenom',
      numeric: false,
      disablePadding: true,
      label: 'Nom et Prénom'
    },
    { id: 'Email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'Adresse', numeric: false, disablePadding: false, label: 'Adresse' },

    /*{
      id: 'FormattedDepartmentsIds',
      numeric: false,
      disablePadding: false,
      label: 'DepartmentIds'
    },*/

    {
      id: 'ImageLink',
      numeric: false,
      disablePadding: false,
      label: 'Image Link'
    }
  ]

  const handleDelete = async (id: string) => {
    try {
      await deleteMembersForAdmin(id)
      toast.success('Membre supprimé avec succès')
      await fetchMembersForAdmin() // Refresh members after deletion
    } catch (error) {
      toast.error('Erreur lors de la suppression du membre')
    }
  }

  return (
    <Layout>
      <Grid container spacing={1} sx={{ margin: 0, padding: 1 }}>
        <Grid item xs={8} sx={{ margin: 0, padding: 0 }}>
          <EnhancedTable
            data={members}
            headCells={headCells}
            title='List of Membres'
            onDelete={handleDelete}
            renderRowActions={row => (
              <Button
                variant='outlined'
                onClick={() => handleEdit(row._id as string)}
              >
                Éditer
              </Button>
            )}
          />
        </Grid>
        <Grid item xs={4} sx={{ margin: 0, padding: 1 }}>
          <UserForm
            editingMember={editingMember}
            setEditingMember={setEditingMember}
          />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Page
