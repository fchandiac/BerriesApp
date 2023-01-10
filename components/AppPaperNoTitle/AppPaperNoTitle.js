import { Paper, Typography } from '@mui/material'
import React from 'react'


export default function AppPaperNoTitle(props) {
  const { children } = props
  return (
    <Paper elevation={0} variant="outlined" >
      {children}
    </Paper>
  )
}
