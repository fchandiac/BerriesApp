import { React, useState, useEffect } from 'react'
import AppDataGrid from '../../AppDataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, Grid, DialogActions, DialogTitle, Button, DialogContent, TextField } from '@mui/material'
import moment from 'moment'

const trays = require('../../../promises/trays')
const utils = require('../../../utils')

export default function TraysGrid(props) {
  const { update } = props
  const [traysList, setTraysList] = useState([])
  const [gridApiRef, setGridApiRef] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openInfoDialog, setOpenInfoDialog] = useState(false)
  const [rowData, setRowData] = useState(rowDataDefault())

  useEffect(() => {
    trays.findAll()
      .then(res => {
        let data = res.map(item => ({
          id: item.id,
          name: item.name,
          weight: item.weight,
          updatedAt: item.updatedAt
        }))
        setTraysList(data)

      })
      .catch(err => { console.log(err) })
  }, [update])

  const columns = [
    { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
    { field: 'name', headerName: 'Nombre', flex: 2.5 },
    { field: 'weight', headerName: 'Peso Kg', flex: 1, type: 'number' },
    { field: 'updatedAt', headerName: 'Actualización', flex: 1, valueFormatter: (params) => (moment(params.value).format('DD-MM-YYYY')) },
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
              name: params.row.name,
              weigth: params.row.weigth
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
              name: params.row.name,
              weight: params.row.weight
            })
            setOpenInfoDialog(true)
          }}
        />
      ]
    }

  ]

  const destroy = () => {
    trays.destroy(rowData.id)
      .then(() => {
        gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
        setOpenDeleteDialog(false)
      })
      .catch(err => { console.error(err) })
  }

  const updateTray = () => {
    trays.update(rowData.id, rowData.name, rowData.weight)
      .then(() => {
        gridApiRef.current.updateRows([{
          id: rowData.rowId,
          name: rowData.name,
          rowId: rowData.id,
          weight: rowData.weight

        }])
        setOpenInfoDialog(false)
      })
      .catch(err => {console.error(err)})
  }



  return (
    <>
      <AppDataGrid title='Bandejas' rows={traysList} columns={columns} height='37rem' setGridApiRef={setGridApiRef}></AppDataGrid>
      <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
        <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
          Eliminar Bandeja
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
          Actualizar Bandeja
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
              <TextField label="Nombre"
                value={rowData.name}
                onChange={(e) => { setRowData({ ...rowData, name: e.target.value }) }}
                variant="outlined"
                size={'small'}
                fullWidth
                required
              />
            </Grid>
            <Grid item>
              <TextField label="Peso Kg"
                value={rowData.weight}
                onChange={(e) => { setRowData({ ...rowData, weight: e.target.value }) }}
                variant="outlined"
                type={'number'}
                inputProps={{ step: "0.01" }}
                size={'small'}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button variant={'contained'} onClick={updateTray} >Actualizar</Button>
          <Button variant={'outlined'} onClick={() => { setOpenInfoDialog(false) }} >cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function rowDataDefault() {
  return ({
    rowId: '',
    id: '',
    name: '',
    weight: ''
  })
}