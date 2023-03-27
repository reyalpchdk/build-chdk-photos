import Head from 'next/head'
//import styles from '@/styles/Home.module.css'
import SiteHeader from '@/components/siteheader'
import BranchSelector from '@/components/branchselector'

export default function Home() {
  return (
    <>
      <Head>
        <title>CHDK Autobuild</title>
        <meta name="description" content="Automatically updated builds of CHDK, a third party firmware add-on for some Canon cameras" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-6">
        <h1 className="font-bold text-2xl mb-2">Autobuild</h1>
        <p>
        This page provides builds of CHDK, updated withing roughly one hour of changes being made.
        </p>
        <h2 className="font-bold text-2xl my-2">What is CHDK</h2>
        <p>
        CHDK is an open source, unofficial, unsupported third party firmware add-on for certain Canon point and shoot and EOS M cameras. CHDK is not supported by or affiliated with Canon. CHDK is provided as-is, with absolutely no warranty. Any use of CHDK is at the user&apos;s own risk.
        </p>
        <h2 className="font-bold text-2xl my-2">Get CHDK</h2>
        Use the tool below to specify your camera and Canon Firmware version
        <BranchSelector branches={['trunk','release']} base_url="https://build.chdk.photos" builds_path="/builds" />
      </main>
    </>
  )
}
