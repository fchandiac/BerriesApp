import React from 'react'
import NewReceptionForm from '../components/Forms/NewReceptionForm'
import Layout from '../components/Layout'



export default function newReception() {
    return (
        <>
            <Layout pageTitle={'Nueva recepción'}>
                <NewReceptionForm />
            </Layout>
        </>
    )
}
