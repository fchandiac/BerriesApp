import { Grid, TextField, Button } from '@mui/material'
import { React, useState } from 'react'
import AppErrorSnack from '../../AppErrorSnack'
import AppPaper from '../../AppPaper'

const utils = require('../../../utils')
const varieties = require('../../../promises/varieties')

export default function NewVarietyForm(props) {
    const { updateGrid } = props
    const [varietyData, setVarietyData] = useState(varietyDataDefault())
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')

    const submit = (e) => {
        e.preventDefault()
        varieties.create(
            varietyData.name,
            utils.moneyToInt(varietyData.price)
        )
            .then(() => {
                updateGrid()
                setVarietyData(varietyDataDefault())
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
            <AppPaper title={'Nueva variedad'}>
                <form onSubmit={submit}>
                    <Grid sx={{ p: 2 }}>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Nombre"
                                value={varietyData.name}
                                onChange={(e) => { setVarietyData({ ...varietyData, name: e.target.value }) }}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Precio"
                                value={varietyData.price}
                                onChange={(e) => { setVarietyData({ ...varietyData, price: utils.renderMoneystr(e.target.value) }) }}
                                variant="outlined"
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

function varietyDataDefault() {
    return ({
        name: '',
        price: ''
    })
}