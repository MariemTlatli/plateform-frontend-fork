import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Link from 'next/link' // Importer Link de Next.js
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { useAuthStore } from '@/store/MyStore/AuthStore'

const drawerWidth = 200

export default function Sidebar({ links }) {
  const logout = useAuthStore(state => state.logout)
  const handleLogOut = async () => {
    console.log('Logging out')
    try {
      await logout()
      // window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column', // Organisation verticale
          justifyContent: 'space-between' // Place le bouton en bas
        }
      }}
      variant='permanent'
      anchor='left'
    >
      <div>
        <Toolbar />
        <Divider />
        <List>
          {links.map((link, index) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <Link href={link.path} passHref legacyBehavior>
                  <ListItemText primary={link.label} />
                </Link>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
      {/* Bouton de déconnexion en bas */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <button
          className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white'
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>
    </Drawer>
  )
}
