import { Grid } from '@mui/material'
import {React, useState} from 'react'
import NewProducerForm from '../components/Forms/NewProducerForm'
import ProducersGrid from '../components/Grids/ProducersGrid'
import Layout from '../components/Layout'

export default function producers() {
    const [producersGridState, setProducersGridState] = useState(false)

    const updateProducersGridState = () => {
        let gridState = producersGridState == false ? true : false
        setProducersGridState(gridState)
    }
    

    return (
        <>
            <Layout pageTitle={'Productores'}>
                <Grid container spacing={1}>
                    <Grid item xs={4} sm={4} md={4}>
                        <NewProducerForm updateGrid={updateProducersGridState}/>
                    </Grid>
                    <Grid item xs={8} sm={8} md={8}>
                        <ProducersGrid update={producersGridState} />
                    </Grid>
                </Grid>
            </Layout>
        </>
    )
}


