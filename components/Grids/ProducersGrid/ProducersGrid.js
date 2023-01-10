import { React, useState, useEffect } from 'react'
import AppDataGrid from '../../AppDataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, Grid, DialogActions, DialogTitle, Button, DialogContent, TextField } from '@mui/material'

const producers = require('../../../promises/producers')

export default function ProducersGrid(props) {
    const { update } = props
    const [producersList, setproducersList] = useState([])
    const [gridApiRef, setGridApiRef] = useState(null)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [rowData, setRowData] = useState(rowDataDefault())

    useEffect(() => {
        producers.findAll()
            .then(res => {
                setproducersList(res)
            })
            .catch(err => console.error(err))
    }, [update])


    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'rut', headerName: 'Rut', flex: 1 },
        { field: 'name', headerName: 'Nombre', flex: 2.5 },
        { field: 'phone', headerName: 'Teléfono', flex: .55 },
        { field: 'address', headerName: 'Dirección', flex: 1.5 },
        { field: 'mail', headerName: 'Mail', flex: 1.3 },
        {
            field: 'actions',
            headerName: '',
            type: 'actions', flex: 1, getActions: (params) => [
                <GridActionsCellItem
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            rut: params.row.rut,
                            name: params.row.name,
                            phone: params.row.phone,
                            address: params.row.address,
                            mail: params.row.mail
                        })
                        setOpenDeleteDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    label='info'
                    icon={<InfoIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            rut: params.row.rut,
                            name: params.row.name,
                            phone: params.row.phone,
                            address: params.row.address,
                            mail: params.row.mail
                        })
                        setOpenInfoDialog(true)
                    }}
                />,
            ]
        },
        

    ]

    const destroy = () => {
        producers.destroy(rowData.id)
            .then(() => {
                gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
                setOpenDeleteDialog(false)
            })
            .catch(err => {console.error(err)})
    }

    const updateProductor =  () => {

    }
    return (
        <>
            <AppDataGrid title='Productores' rows={producersList} columns={columns} height='37rem' setGridApiRef={setGridApiRef}></AppDataGrid>
            <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Eliminar productor
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <Grid container sx={{ p: 1 }} spacing={1} direction="column">
                        <Grid item>
                            <TextField
                                label='Id'
                                value={rowData.id}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label='Nombre'
                                value={rowData.name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    <Button variant={'contained'} onClick={destroy} >Eliminar</Button>
                    <Button variant={'outlined'} onClick={() => { setOpenDeleteDialog(false) }} >cerrar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openInfoDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Actualizar productor
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <Grid container sx={{ p: 1 }} spacing={1} direction="column">
                        <Grid item>
                       
                        </Grid>
                        <Grid item>
                   
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    <Button variant={'contained'} onClick={updateProductor} >Actualizar</Button>
                    <Button variant={'outlined'} onClick={() => { setOpenInfoDialog(false)}} >cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function rowDataDefault() {
    return ({
        rowId: null,
        id: null,
        rut: '',
        name: '',
        phone: '',
        address: '',
        mail: ''
    })
}
