import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

type CamModel = {
  desc?: string;
  id: string;
  mid?: number;
  pid?: number;
  aka?: string;
  fw: any[];
}

type CamFamily = {
  id: string;
  line: string;
  models: CamModel[];
}

type BuildInfo = {
  info_version: string;
  build: any;
  files: CamFamily[];
}


export default function Home() {
  const [data, setData]:[any, any] = useState(null)
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    fetch('https://build.chdk.photos/builds/trunk/meta/build_info.json')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])
  return (
    <>
      <Head>
        <title>CHDK Autobuild</title>
        <meta name="description" content="CHDK Autobuild" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-center">
        <h1>Nothing to see here</h1>
        <div>
        {isLoading && "loading..."}
        {data && "got data! " + data.build.desc + ' ' + data.build.version + ' ' + data.build.revision}
        {data && data.files.map((fam: CamFamily) => fam.models.map((mod: CamModel) => (
          <div key={mod.id}>{mod.desc || mod.id}</div>
        )))}
        </div>
      </main>
    </>
  )
}
