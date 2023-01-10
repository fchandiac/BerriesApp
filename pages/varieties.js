import { Grid } from '@mui/material'
import {React, useState} from 'react'
import NewVarietyForm from '../components/Forms/NewVarietyForm'
import VarietiesGrid from '../components/Grids/VarietiesGrid'
import Layout from '../components/Layout'

export default function varieties() {
    const [varietiesGridState, setVarietiesGridState] = useState(false)

    const updateVarietiesGridState = () => {
        let gridState = varietiesGridState == false ? true : false
        setVarietiesGridState(gridState)
    }
  return (
    <>
    <Layout pageTitle={'Variedades'}>
        <Grid container spacing={1}>
            <Grid item xs={4} sm={4} md={4}>
                <NewVarietyForm updateGrid={updateVarietiesGridState}/>
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
                <VarietiesGrid update={varietiesGridState}/>
            </Grid>
        </Grid>
    </Layout>
</>
  )
}
