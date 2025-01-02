'use client'
import React, { useState, ChangeEvent } from 'react'
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material'
import Layout from '@/mic-component/Admin_UI/Layout/Layout'
import { z } from 'zod'
import axiosInstance from '@/axiosInstance*'

// Schéma pour valider les données JSON
const jsonDataSchema = z.array(
  z.object({
    email: z.string().email(),
    department1: z.string().nonempty(),
    department2: z.string().optional(),
    NomPrenom: z.string().optional(),
    Adresse: z.string().optional(),
    Password: z.string().optional(),
    Role: z.string().optional()
  })
)

interface JsonData {
  [key: string]: string
}

// Tableau de remplacement : mot -> identifiant
const replacementTable: { [key: string]: string } = {
  BASICWEB: '670792e3ee0e13424434d371',
  AI: '6754f4cff1f2e70bdd460af4',
  INTERMEDIATEWEB: '670ae2f9684fce305e8e8348',
  ADVANCEDWEB: '670bedc344886445be846ec5'
  // Ajoutez d'autres correspondances ici
}

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jsonData, setJsonData] = useState<JsonData[]>([])
  const [filteredData, setFilteredData] = useState<JsonData[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axiosInstance.post('/test/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const validatedData = jsonDataSchema.parse(response.data)
      setJsonData(validatedData)
      setFilteredData(validatedData)
      alert('Fichier uploadé avec succès')
    } catch (error: any) {
      console.error(
        "Erreur lors de l'upload du fichier",
        error.response?.data || error.message
      )
      alert("Erreur lors de l'upload du fichier")
    }
  }

  const adjustDepartments = (data: JsonData[]) => {
    return data.map(row => {
      const updatedRow: JsonData = { ...row }

      // Si department2 contient "BASICWEB", on met à jour department1
      if (
        updatedRow.department2 &&
        updatedRow.department2.includes(selectedDepartment)
      ) {
        updatedRow.department1 = selectedDepartment
      }

      return updatedRow
    })
  }

  const replaceValuesWithIds = (data: JsonData[]) => {
    return data.map(row => {
      const updatedRow: JsonData = { ...row }
      Object.keys(updatedRow).forEach(key => {
        if (typeof updatedRow[key] === 'string') {
          const value = updatedRow[key] as string
          if (replacementTable[value]) {
            updatedRow[key] = replacementTable[value]
          }
        }
      })
      return updatedRow
    })
  }

  const handleSave = async () => {
    if (!selectedDepartment) {
      alert('Veuillez choisir un département')
      return
    }

    // Appliquer le choix de l'utilisateur pour department1
    const adjustedData = adjustDepartments(filteredData).map(row => ({
      ...row,
      department1: selectedDepartment // Appliquer la sélection de département
    }))

    const replacedData = replaceValuesWithIds(adjustedData)

    const membersData = replacedData.map(row => ({
      email: row.email,
      department1: row.department1,
      NomPrenom: row.NomPrenom || 'Default Name',
      Password: row.Password || 'DefaultPassword123',
      Adresse: row.Adresse || 'Default Address',
      Role: row.Role || 'member'
    }))

    try {
      const response = await axiosInstance.post(
        '/member/upload-many-members',
        { membersData },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )

      alert('Données sauvegardées avec succès')
      console.log(response.data)
    } catch (error: any) {
      console.error(
        'Erreur lors de la sauvegarde des données',
        error.response?.data || error.message
      )
      alert('Erreur lors de la sauvegarde des données')
    }
  }

  const handleCancel = () => {
    setJsonData([])
    setFilteredData([])
    setSelectedFile(null)
    setSelectedDepartment('') // Réinitialiser la sélection du département
  }

  return (
    <Layout>
      <Container>
        <Typography variant='h4' gutterBottom>
          Uploader un fichier XLS pour insérer dans la base de données
        </Typography>

        <input type='file' accept='.xls,.xlsx' onChange={handleFileChange} />
        <Box mt={2}>
          <Button variant='contained' color='primary' onClick={handleUpload}>
            Upload
          </Button>
          <Button variant='contained' color='success' onClick={handleSave}>
            Sauvegarder
          </Button>
          <Button variant='contained' onClick={handleCancel}>
            Annuler
          </Button>
        </Box>

        {/* Sélectionner le département */}
        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel id='department-select-label'>
              Sélectionner le Département
            </InputLabel>
            <Select
              labelId='department-select-label'
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              label='Sélectionner le Département'
            >
              <MenuItem value='BASICWEB'>BASICWEB</MenuItem>
              <MenuItem value='AI'>AI</MenuItem>
              <MenuItem value='INTERMEDIATEWEB'>INTERMEDIATEWEB</MenuItem>
              <MenuItem value='ADVANCEDWEB'>ADVANCEDWEB</MenuItem>
              {/* Ajoutez d'autres départements si nécessaire */}
            </Select>
          </FormControl>
        </Box>

        {filteredData.length > 0 && (
          <Box mt={4}>
            <Typography variant='h5' gutterBottom>
              Données affichées :
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(filteredData[0]).map(key => (
                      <TableCell key={key}>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Container>
    </Layout>
  )
}
