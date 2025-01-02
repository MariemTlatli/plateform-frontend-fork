'use client'
import React, { useEffect, useState } from 'react'
import { Container, Grid, Typography } from '@mui/material'

import { useAuthStore } from '@/app/store/MyStore/AuthStore'
import { useMemberStore } from '@/store/MyStore/MembersStore'
import Member_card from '@/mic-component/Member_card/Member_card'
import PaginationComponent from '@/mic-component/PaginationComponent/PaginationComponent'

export default function Page() {
  const members = useMemberStore(state => state.members)
  const fetchMembers = useMemberStore(state => state.fetchMembers)
  const user = useAuthStore(state => state.user)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const loadMembers = async () => {
      await fetchMembers(user.DepartmentId)
    }

    loadMembers()
  }, [])

  const indexOfLastMember = currentPage * itemsPerPage
  const indexOfFirstMember = indexOfLastMember - itemsPerPage
  const currentMembers = members
    ? members.slice(indexOfFirstMember, indexOfLastMember)
    : []
  const handlePageChange = newPage => {
    setCurrentPage(newPage)
  }

  return (
    <Container>
      <Typography
        variant='h4'
        component='h1'
        align='center'
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#fff' }}
      ></Typography>

      {/* Liste des membres */}
      <Grid container spacing={2}>
        {currentMembers.length > 0 ? (
          currentMembers.map((member, index) => (
            <Grid item xs={12} sm={4} md={2} key={index}>
              <Member_card member={member} />
            </Grid>
          ))
        ) : (
          <Typography variant='h6' align='center' sx={{ color: '#fff' }}>
            Aucun membre disponible pour le moment.
          </Typography>
        )}
      </Grid>

      {/* Pagination */}
      <PaginationComponent
        currentPage={currentPage}
        totalItems={members ? members.length : 0}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </Container>
  )
}
