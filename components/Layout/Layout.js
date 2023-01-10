import {
  AppBar, Container, Grid, IconButton, Typography, Box, Divider, Drawer, List,
  ListItem, ListItemButton, ListItemText, CardMedia
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { React, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
// can use on component className={styles.exampleClass}
import styles from './Layout.module.css'

export default function Layout(props) {
  const { children, pageTitle } = props
  const [drawerState, setDrawerState] = useState(false)
  const router = useRouter()
  return (
    <>
      <AppBar >
        <Container sx={{ display: 'flex', alignItems: 'center', paddingTop: '0.3rem', paddingBottom: '0.3rem' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => { setDrawerState(true) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CardMedia
              sx={{ height: '50px', width: '50px' }}
              image='http://localhost:3002/logoBerries.png' />
          </Box>
        </Container>
      </AppBar>
      <Drawer
        anchor='left'
        open={drawerState}
      >
        <Box sx={{ justifyContent: 'flex-end', display: 'flex', padding: '0.3rem' }}>
          <IconButton onClick={() => setDrawerState(false)} >
            <ChevronLeft />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Nueva recepción"
                onClick={() => {
                  router.push({
                    pathname: '/newReception',
                  })
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Recepciones"
                onClick={() => {
                  router.push({
                    pathname: '/receptions',
                  })
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Pagos"
                onClick={() => {
                  router.push({
                    pathname: '/pays',
                  })
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Productores"
                onClick={() => {
                  router.push({
                    pathname: '/producers',
                  })
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Variedades"
                onClick={() => {
                  router.push({
                    pathname: '/varieties',
                  })
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Bandejas"
                onClick={() => {
                  router.push({
                    pathname: '/trays',
                  })
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Configuración App"
                onClick={() => {
                  router.push({
                    pathname: '/config',
                  })
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box>
        {children}
      </Box>
    </>

  )
}



