

import { React, useState, useEffect } from 'react'
import AppDataGrid from '../../AppDataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, Grid, DialogActions, DialogTitle, Button, DialogContent, TextField } from '@mui/material'
import moment from 'moment'
import PaysGridBase from '../../PaysGridBase/PaysGridBase'

const pays = require('../../../promises/pays')
const utils = require('../../../utils')

export default function TraysGrid(props) {
    const { update, configData } = props
    const [paysList, setPaysList] = useState([])
    const [gridApiRef, setGridApiRef] = useState(null)
    // const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    // const [openInfoDialog, setOpenInfoDialog] = useState(false)
    // const [rowData, setRowData] = useState(rowDataDefault())

    useEffect(() => {
        pays.findAllBetweenDate(configData.start, configData.end)
            .then(res => {
                let data = res.map(item => ({
                    id: item.id,
                    reception_id: item.reception_id==null? 'eliminada':item.reception_id,
                    rut: item.Producer.rut,
                    producer: item.Producer.name,
                    amount: item.amount,
                    payment: item.payment,
                    balance: item.balance,
                    method: paymentMethod(item.method),
                    state: item.state == true ? 'pagado' : 'pendiente',
                    updatedAt: moment(item.updatedAt).format('DD-MM-YYYY HH:mm')
                }))
                setPaysList(data)
            })
            .catch(err => { console.log(err) })
    }, [update])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'reception_id', headerName: 'Recepción', flex: .6, type: 'number' },
        { field: 'rut', headerName: 'Rut', flex: .8 },
        { field: 'producer', headerName: 'Nombre', flex: 1.2 },
        { field: 'amount', headerName: 'Monto', flex: .6, type: 'number', valueFormatter: (params) => (utils.renderMoneystr(params.value)) },
        { field: 'payment', headerName: 'Pagado', flex: .6, type: 'number', valueFormatter: (params) => (utils.renderMoneystr(params.value)) },
        { field: 'balance', headerName: 'Saldo', flex: .6, type: 'number', valueFormatter: (params) => (utils.renderMoneystr(params.value)) },
        { field: 'method', headerName: 'Medio de pago', flex: .8 },
        { field: 'state', headerName: 'Estado', flex: .4, renderCell: (params) => stateRender(params.value) },
        { field: 'updatedAt', headerName: 'modificado', flex: .8},
        // {
        //   field: 'actions',
        //   headerName: '',
        //   type: 'actions', flex: 1, getActions: (params) => [
        //     <GridActionsCellItem
        //       label='delete'
        //       icon={<DeleteIcon />}
        //       onClick={() => {
        //         setRowData({
        //           rowId: params.id,
        //           id: params.row.id,
        //           name: params.row.name,
        //           weigth: params.row.weigth
        //         })
        //         setOpenDeleteDialog(true)
        //       }}
        //     />,
        //   ]
        // }

    ]

    //   const destroy = () => {
    //     trays.destroy(rowData.id)
    //       .then(() => {
    //         gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
    //         setOpenDeleteDialog(false)
    //       })
    //       .catch(err => { console.error(err) })
    //   }



    return (
        <>
            <PaysGridBase title='Pagos' rows={paysList} columns={columns} height='37rem' setGridApiRef={setGridApiRef} />

            {/* <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
        <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
          Eliminar variedad
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
      </Dialog> */}
        </>
    )
}

function rowDataDefault() {
    return ({
        rowId: '',
        id: '',
        name: '',
        weigth: ''
    })
}

function stateRender(value) {
    if (value == 'pagado') {
        return (<CheckCircleIcon color={'success'} />)
    } else {
        return (<CancelIcon color={'error'} />)
    }
}

function paymentMethod(value){
    let method = ''
    if(value == 0){
        method = 'efectivo'
    } else if (value == 1){
        method = 'transferencia'
    } else if (value == 2){
        method = 'cheque'
    } else if (value == null){
        method = ''
    }

    return method
}

