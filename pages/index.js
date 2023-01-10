import { React, useState, useEffect } from 'react'
import { Button, Grid, TextField, CardMedia, Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import AppPaper from '../components/AppPaper'
import AppErrorSnack from '../components/AppErrorSnack'
const ipcRenderer = electron.ipcRenderer || false
import electron from 'electron'



export default function Home() {
  const [userData, setUserData] = useState(userDataDefault())
  const [openSnack, setOpenSnack] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [config, setConfig] = useState('')
  const router = useRouter()
  const [serial, setSerial] = useState('')

  useEffect(() => {
    const readConfig = ipcRenderer.sendSync('read-config', 'sync');
    setConfig(readConfig)
    const readSerial = ipcRenderer.sendSync('read-serial', 'sync');
    setSerial(readSerial)
  }, [])

  //FVFGC8MQQ6L5
  //C1MNPBLRDTY3
  const submit = (e) => {
    e.preventDefault()
    if (serial != 'C1MNPBLRDTY3'){
      setErrorText('Licencia de Sofware inválida')
      setOpenSnack(true)
    } else if (userData.user != 'admin') {
      setErrorText('Usuario incorrecto')
      setOpenSnack(true)
    } else if (userData.pass != config.app_pass) {
      setErrorText('Contraseña incorrecta')
      setOpenSnack(true)
    } else {
      router.push('/newReception')
    }
  }
  return (
    <>
      <Grid container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: 'lightgray' }}
        marginLeft={-2}
        marginRight={-2}
        marginTop={'-4.7rem'}
        height={'100vh'}
        width={'100.2vw'}
        alignSelf={'start'}
      >


        <AppPaper title=''>
          <Grid container direction="column"
            alignItems="center"
            justifyContent="center"
            paddingTop={2}
          >
            <CardMedia
              sx={{ height: '80px', width: '80px' }}
              image='http://localhost:3001/logoBerries.png' />
            <Grid item textAlign={'center'}>
              <Typography fontSize={18}>Recepción Maureira</Typography>
              <Typography fontSize={12}>17.332.699-8</Typography>
              <Typography fontSize={12}>Los cuarteles - Hijuela 20, Parral </Typography>
              <Typography fontSize={12}>952242741</Typography>
            </Grid>
          </Grid>
          <form onSubmit={submit}>
            <Grid container sx={{ p: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <TextField label="Usuario"
                  value={userData.user}
                  onChange={(e) => { setUserData({ ...userData, user: e.target.value }) }}
                  variant="outlined"
                  size={'small'}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                <TextField label="Contraseña"
                  value={userData.pass}
                  onChange={(e) => { setUserData({ ...userData, pass: e.target.value }) }}
                  variant="outlined"
                  size={'small'}
                  type={'password'}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign='right'>
                <Button variant={'contained'} type='submit'>Acceso App</Button>
              </Grid>
            </Grid>
          </form>
        </AppPaper>
      </Grid>
      <AppErrorSnack openSnack={openSnack} errorText={errorText} setOpenSnack={setOpenSnack} />
    </>
  )
}


function userDataDefault() {
  return ({
    user: '',
    pass: '',
  })
}

function configDataDefault() {
  return ({
    db_name: '',
    db_user: '',
    db_host: '',
    db_password: '',
    port_app: '',
    app_pass: ''
  })
}