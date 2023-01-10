import { Grid } from '@mui/material'
import {React, useState} from 'react'
import NewTrayForm from '../components/Forms/NewTrayForm/NewTrayForm'
import TraysGrid from '../components/Grids/TraysGrid/TraysGrid'
import Layout from '../components/Layout'

export default function trays() {
    const [traysGridState, setTraysGridState] = useState(false)

    const updateTraysGridState = () => {
        let gridState = traysGridState == false ? true : false
        setTraysGridState(gridState)
    }
    return (
        <>
            <Layout pageTitle={'Bandejas'}>
                <Grid container spacing={1}>
                    <Grid item xs={4} sm={4} md={4}>
                        <NewTrayForm updateGrid={updateTraysGridState} />
                    </Grid>
                    <Grid item xs={8} sm={8} md={8}>
                        <TraysGrid update={traysGridState} />
                    </Grid>
                </Grid>

            </Layout>
        </>
    )
}
