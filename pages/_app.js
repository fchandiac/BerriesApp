import React from 'react'
import '../styles/global.css'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { esES } from '@mui/material/locale'
import { LocalizationProvider, esES as esESPick } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'

const theme = createTheme(
  {
    palette: {
      primary: { main: '#0091ea' }
    },
  }, esES)

// { palette: { primary: { main: '#1976d2' }, }, }

// { palette: { 
//   primary: { main: '#ef5350' },
//   secondary: {main: '#616161'}
// }

const loc = moment.locale('en',
  {
    months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mie._jue._vie._sab.'.split('_')
  })



export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Component {...pageProps} />
      </LocalizationProvider>
    </ThemeProvider>

  )
}
