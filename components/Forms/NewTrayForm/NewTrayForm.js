import { Grid, TextField, Button } from '@mui/material'
import { React, useState } from 'react'
import AppErrorSnack from '../../AppErrorSnack'
import AppPaper from '../../AppPaper'

const utils = require('../../../utils')
const trays = require('../../../promises/trays')

export default function NewTrayForm(props) {
    const { updateGrid } = props
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [trayData, setTrayData] = useState(trayDataDefault())

    const submit = (e) => {
        e.preventDefault()
        trays.create(
            trayData.name, trayData.weight)
            .then(() => {
                updateGrid()
                setTrayData(trayDataDefault())
            })
            .catch(err => {
                console.error(err)
                if (err.errors[0].message == 'name must be unique') {
                    setErrorText('El nombre ya existe en los registros')
                    setOpenSnack(true)
                }
            })

    }


    return (
        <>
            <AppPaper title={'Nueva bandeja'}>
                <form onSubmit={submit}>
                    <Grid sx={{ p: 2 }}>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Nombre"
                                value={trayData.name}
                                onChange={(e) => { setTrayData({ ...trayData, name: e.target.value }) }}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Peso Kg"
                                value={trayData.weight}
                                onChange={(e) => { setTrayData({ ...trayData, weight: e.target.value }) }}
                                variant="outlined"
                                type={'number'}
                                inputProps={{ step: "0.01" }}
                                size={'small'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign={'right'}>
                            <Button variant='contained' type='submit'>Guardar</Button>
                        </Grid>
                    </Grid>
                </form>
            </AppPaper>
            <AppErrorSnack openSnack={openSnack} errorText={errorText} setOpenSnack={setOpenSnack} />
        </>
    )
}

function trayDataDefault() {
    return ({
        name: '',
        weight: ''
    })
}