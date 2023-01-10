import { React, useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Button, CardMedia, Grid, TextField } from '@mui/material'
import electron from 'electron'
import AppPaper from '../components/AppPaper/AppPaper'
import AppErrorSnack from '../components/AppErrorSnack'
import { useRouter } from 'next/router'
const ipcRenderer = electron.ipcRenderer || false

export default function Home() {
    const [config, setConfig] = useState(configDataDefault())
    const [newPass, setNewPass] = useState('')
    const [oldPass, setOldPass] = useState('')
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const router = useRouter()

    useEffect(() => {
        const readConfig = ipcRenderer.sendSync('read-config', 'sync');
        //console.log(readConfig)
        setConfig(readConfig)
    }, [])


    const saveConfig = () => {
        if (oldPass != config.app_pass) {
            setErrorText('Contraseña actual incorrecta')
            setOpenSnack(true)
        } else {
            //setConfig({...config, app_pass: newPass})
            ipcRenderer.send('write-config', newPass)
            router.push('/')
        }

        //
    }

    return (
        <Layout pageTitle='Configuración App'>
            <AppPaper title='Cambiar contraseña'>
                <Grid container sx={{ p: 1 }}>
                    <Grid item xs={4} sm={4} md={4} paddingTop={1}>
                        <TextField
                            label='Contraseña actual'
                            value={oldPass}
                            type={'password'}
                            onChange={(e) => { setOldPass(e.target.value) }}
                            size={'small'} fullWidth />
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} paddingTop={1}>
                        <TextField
                            label='Nueva contraseña App'
                            value={newPass}
                            type={'password'}
                            onChange={(e) => { setNewPass(e.target.value) }}
                            size={'small'} fullWidth />
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} paddingTop={1}>
                        <Button variant='contained' onClick={saveConfig}>Cambiar</Button>
                    </Grid>
                </Grid>
            </AppPaper>

            <AppErrorSnack openSnack={openSnack} errorText={errorText} setOpenSnack={setOpenSnack} />
        </Layout>
    )
}

function configDataDefault() {
    return ({
        db_host: '',
        db_name: '',
        db_password: '',
        db_user: '',
        port_app: 0,
        app_pass: '',
    })
}
