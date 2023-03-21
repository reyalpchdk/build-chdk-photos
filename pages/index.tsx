import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import BuildPanel from '@/components/buildpanel'

export default function Home() {
  return (
    <>
      <Head>
        <title>CHDK Autobuild</title>
        <meta name="description" content="CHDK Autobuild" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-10">
        <h1 className="font-bold text-2xl mb-2">CHDK builds</h1>
        <BuildPanel infoUrl="https://build.chdk.photos/builds/trunk/meta/build_info.json" />
      </main>
    </>
  )
}
