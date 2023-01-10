

import { React, useState, useEffect, useRef } from 'react'
import AppDataGrid from '../../AppDataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, Grid, DialogActions, DialogTitle, Button, DialogContent, TextField, Typography, Box, CardMedia, Divider } from '@mui/material'
import moment from 'moment'
import PrintIcon from '@mui/icons-material/Print'
import AppErrorSnack from '../../AppErrorSnack'

import * as htmlToImage from 'html-to-image'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'

const receptions = require('../../../promises/receptions')
const pays = require('../../../promises/pays')
const utils = require('../../../utils')
const print = require('../../../promises/print')

export default function ReceptionsGrid() {
  const [receptionsList, setReceptionsList] = useState([])
  const [gridApiRef, setGridApiRef] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openInfoDialog, setOpenInfoDialog] = useState(false)
  const [rowData, setRowData] = useState(rowDataDefault())
  const [openTicketDialog, setOpenTicketDialog] = useState(false)
  const printComponentRef = useRef()
  const [openSnack, setOpenSnack] = useState(false)
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    receptions.findAll()
      .then(res => {
        //console.log(res)
        let data = res.map(item => ({
          id: item.id,
          producer: item.Producer == null ? 'eliminado' : item.Producer.name,
          rut: item.Producer == null ? 'eliminado' : item.Producer.rut,
          discount: item.discount,
          driver: item.driver,
          gross: item.gross,
          guide: item.guide,
          net: item.net,
          price: item.price,
          returned_trays: item.returned_trays,
          trays_quanty: item.trays_quanty,
          variety: item.Variety == null ? 'eliminada' : item.Variety.name,
          returned_trays: item.returned_trays,
          createdAt: item.createdAt,
        }))
        setReceptionsList(data)

      })
      .catch(err => { console.log(err) })
  }, [])

  const columns = [
    { field: 'id', headerName: 'Id', flex: .6, type: 'number' },
    { field: 'rut', headerName: 'Rut', flex: .8 },
    { field: 'producer', headerName: 'Nombre', flex: 1.5 },
    { field: 'driver', headerName: 'Chófer', flex: 1.3, hide: true },
    { field: 'guide', headerName: 'Guía', flex: .8, hide: true },
    { field: 'variety', headerName: 'Variedad', flex: .8 },
    { field: 'price', headerName: 'Precio', flex: .6, type: 'number', valueFormatter: (params) => (utils.renderMoneystr(params.value)) },
    { field: 'trays_quanty', headerName: 'bandejas', flex: 1, type: 'number' },
    { field: 'gross', headerName: 'Kg Bruto', flex: .8, type: 'number' },
    { field: 'discount', headerName: 'Descuento Kg', flex: .8, type: 'number' },
    { field: 'net', headerName: 'Kg Neto', flex: .8, type: 'number' },
    { field: 'createdAt', headerName: 'Fecha', flex: .8, type: 'Datetime', valueFormatter: (params) => (moment(params.value).format('DD-MM-YYYY HH:mm')) },
    {
      field: 'actions',
      headerName: '',
      type: 'actions', flex: .7, getActions: (params) => [
        <GridActionsCellItem
          label='info'
          icon={<DeleteIcon />}
          onClick={() => {
            setRowData({
              rowId: params.id,
              id: params.row.id,
              producer: params.row.producer
            })
            setOpenDeleteDialog(true)
          }}
        />,
        <GridActionsCellItem
          label='info'
          icon={<PrintIcon />}
          onClick={() => {
            pays.findByReception(params.row.id)
              .then(res => {
                //console.log(res)
                
                setRowData({
                  rowId: params.id,
                  id: params.row.id,
                  producer: params.row.producer,
                  rut: params.row.rut,
                  date: moment(params.row.createdAt).format('DD-MM-YYYY'),
                  time: moment(params.row.createdAt).format('HH:mm'),
                  driver: params.row.driver,
                  guide: params.row.guide,
                  variety: params.row.variety,
                  price: params.row.price,
                  trays_quanty: params.row.trays_quanty,
                  gross: params.row.gross,
                  discount: params.row.discount,
                  net: params.row.net,
                  pay: res.amount,
                  pay_state: res.state,
                  returned_trays: params.row.returned_trays,

                })
                setOpenTicketDialog(true)

              })

          }}
        />,
      ]
    }

  ]

  const destroy = () => {
    pays.destroyByReception(rowData.id)
      .then(() => {
        receptions.destroy(rowData.id)
          .then(() => {
            gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
            setOpenDeleteDialog(false)

          })
          .catch(err => { console.error(err) })
      })
      .catch(err => { console.error(err) })
  }

  const printTicket = () => {
    htmlToImage.toPng(printComponentRef.current)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        //download(dataUrl, 'my-node.png')
        print.ticket(img.src)
          .then(() => {
            setOpenTicketDialog(false)
          }).catch(err => {
            setErrorText('Error de comunicación con la impresora')
            setOpenSnack(true)
          })

        //console.log(img.src)
        //document.body.appendChild(img);
      })
      .catch(err => {

        console.error(err)
      })
    // .catch(function (error) {
    //     console.error('oops, something went wrong!', error);
    // });

  }



  return (
    <>
      <AppDataGrid title='Recepciones' rows={receptionsList} columns={columns} height='37rem' setGridApiRef={setGridApiRef}></AppDataGrid>
      <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
        <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
          Eliminar Recepción
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
                label='Nombre Productor'
                value={rowData.producer}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item>
              <Typography>Se eliminara la recepción y el pago asociado.</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button variant={'contained'} onClick={destroy} >Eliminar</Button>
          <Button variant={'outlined'} onClick={() => { setOpenDeleteDialog(false) }} >cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTicketDialog} maxWidth={'xs'} fullWidth>
        <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2, displayPrint: 'none' }}>
          Vista previa ticket
        </DialogTitle>
        <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
          <Box ref={printComponentRef}>
            <Grid container>
              <Grid item xs={4} sm={4} md={4}>
                <CardMedia
                  sx={{ height: '120px', width: '120px' }}
                  image='http://localhost:3001/logoBerries.png' />

              </Grid>
              <Grid item xs={8} sm={8} md={8}>
              <Typography fontSize={20}>Recepción Maureira</Typography>
              <Typography fontSize={20}>17.332.699-8</Typography>
              <Typography fontSize={20}>Los cuarteles - Hijuela 20, Parral </Typography>
              <Typography fontSize={20}>952242741</Typography>
              </Grid>
            </Grid>
            <Divider />
            <Typography fontSize={20}>Recepción Nº: {rowData.id}</Typography>
            <Typography fontSize={20}>Fecha: {rowData.date}</Typography>
            <Typography fontSize={20}>Hora: {rowData.time}</Typography>
            <Typography fontSize={20}>Productor: {rowData.producer == null ? '' : rowData.producer}</Typography>
            <Typography fontSize={20}>Rut: {rowData.rut == null ? '' : rowData.rut}</Typography>
            <Typography fontSize={20}>Chófer: {rowData.driver}</Typography>
            <Typography fontSize={20}>Guía: {rowData.guide}</Typography>
            {/* <Typography fontSize={20}>Bandeja: {rowData.tray == null ? '' : rowData.tray}</Typography> */}
            <Typography fontSize={20}>Variedad: {rowData.variety == null ? '' : rowData.variety}</Typography>
            <Typography fontSize={20}>Precio: {rowData.price == null ? '' : rowData.price}</Typography>
            <Divider />
            <Typography fontSize={24}>Cantidad bandejas: {rowData.trays_quanty}</Typography>
            <Typography fontSize={24}>Kg Bruto: {rowData.gross}</Typography>
            <Typography fontSize={24}>Descuento Kg: {rowData.discount}</Typography>
            <Typography fontSize={24}>Kg Neto: {rowData.net}</Typography>
            <Divider />
            <Typography textAlign={'center'} fontSize={28}> A pagar: {utils.renderMoneystr(rowData.pay)}</Typography>
            <Divider />
            <Typography fontSize={20}>Bandejas devueltas: {rowData.returned_trays}</Typography>
            <Typography fontSize={20}>Estado del pago: {rowData.pay_state == true ? 'pagado' : 'pendiente'}</Typography>

          </Box>
        </DialogContent>
        <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button variant={'contained'} onClick={printTicket} >imprimir</Button>
          <Button variant={'outlined'} onClick={() => { setOpenTicketDialog(false) }} >cerrar</Button>
        </DialogActions>
      </Dialog>
      <AppErrorSnack openSnack={openSnack} errorText={errorText} setOpenSnack={setOpenSnack} />

    </>
  )
}

function rowDataDefault() {
  return ({
    id: '',
    date: '',
    time:'',
    producer: '',
    rut: '',
    driver: '',
    guide: '',
    variety: '',
    price: '',
    trays_quanty: '',
    gross: '',
    discount: 0,
    net: 0,
    pay: '',
    pay_state: false,
    returned_trays: '',
  })
}