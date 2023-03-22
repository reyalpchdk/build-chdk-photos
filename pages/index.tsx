import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import BuildPanel from '@/components/buildpanel'

import logo from '../img/chdk_logo-200.png'

export default function Home() {
  return (
    <>
      <Head>
        <title>CHDK Autobuild</title>
        <meta name="description" content="Automatically updated builds of CHDK, a third party firmware add-on for some Canon cameras" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
      <Image src={logo} width={100} alt="CHDK logo" />
      </header>
      <main className="p-10">
        <h1 className="font-bold text-2xl mb-2">CHDK Autobuild</h1>
        <p>
        This server provides builds of CHDK, updated withing roughly one hour of changes being made.
        </p>
        <h2 className="font-bold text-2xl my-2">What is CHDK</h2>
        <p>
        CHDK is an unofficial, unsupported third party firmware add-on for certain Canon point and shoot and EOS M cameras. CHDK is not supported by or affiliated with Canon. CHDK is provided as-is, with absolutely no warranty. Any use of CHDK is at the user&apos;s own risk.
        </p>
        <h2 className="font-bold text-2xl my-2">Available branches</h2>
        <BuildPanel infoUrl="https://build.chdk.photos/builds/trunk/meta/build_info.json" />
        <BuildPanel infoUrl="https://build.chdk.photos/builds/release/meta/build_info.json" />
      </main>
    </>
  )
}
