import { React, useState, useEffect } from 'react'
import { Button, Grid, TextField } from '@mui/material'

import { useRouter } from 'next/router'
import AppPaper from '../../AppPaper'
import AppErrorSnack from '../../AppErrorSnack'

const producers = require('../../../promises/producers')
const utils = require('../../../utils')

export default function NewProducerForm(props) {
    const { updateGrid } = props
    const [producerData, setProducerData] = useState(producerDataDefault())
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')

    const submit = (e) => {
        e.preventDefault()
        producers.create(
            producerData.rut,
            producerData.name,
            producerData.phone,
            producerData.mail,
            producerData.address
        )
            .then(() => {
                updateGrid()
                setProducerData(producerDataDefault())
            })
            .catch(err => {
                console.error(err)
                if (err.errors[0].message == 'rut must be unique') {
                    setErrorText('El rut ya existe en los registros')
                    setOpenSnack(true)

                } else if (err.errors[0].message == 'name must be unique') {
                    setErrorText('El nombre ya existe en los registros')
                    setOpenSnack(true)
                }
            })
    }
    return (
        <>
            <AppPaper title={'Nuevo productor'}>
                <form onSubmit={submit}>
                    <Grid sx={{ p: 2 }}>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField label="Rut"
                                value={producerData.rut}
                                onChange={(e) => { setProducerData({ ...producerData, rut: utils.formatRut(e.target.value) }) }}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Nombre"
                                value={producerData.name}
                                onChange={(e) => { setProducerData({ ...producerData, name: e.target.value }) }}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Teléfono"
                                value={producerData.phone}
                                onChange={(e) => { setProducerData({ ...producerData, phone: e.target.value }) }}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Dirección"
                                value={producerData.address}
                                onChange={(e) => { setProducerData({ ...producerData, address: e.target.value }) }}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Mail"
                                value={producerData.mail}
                                onChange={(e) => { setProducerData({ ...producerData, mail: e.target.value }) }}
                                variant="outlined"
                                size={'small'}
                                fullWidth
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


function producerDataDefault() {
    return ({
        rut: '',
        name: '',
        phone: '',
        address: '',
        mail: ''
    })
}