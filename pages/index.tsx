/*
 * Copyright (C) 2023 <reyalp (at) gmail dot com>
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  with this software. If not, see <http://www.gnu.org/licenses/>.
 */

import Head from 'next/head'
//import styles from '@/styles/Home.module.css'
import SiteHeader from '@/components/siteheader'
import LinksPanel from '@/components/linkspanel'
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
      <div className="flex items-start gap-4 flex-wrap md:flex-nowrap mx-auto max-w-6xl px-1 sm:px-6 xl:px-8 pb-5">
        <LinksPanel />
        <main>
          <h1 className="font-bold text-2xl">About this Autobuild</h1>
          <p className="my-2">
          This site provides builds of <a className="underline hover:text-chdk-red2" href="https://chdk.fandom.com/wiki/CHDK">CHDK</a>, updated within roughly an hour of changes in the source. This autobuild is maintained by CHDK development team member <a className="underline hover:text-chdk-red2" href="https://chdk.fandom.com/wiki/User:ReyalP">reyalP</a>. Problems with this site may be reported on the <a className="underline hover:text-chdk-red2" href="https://chdk.setepontos.com/index.php">forum</a> or by emailing reyalp at gmail dot com. Source for this site is available on <a className="underline hover:text-chdk-red2" href="https://github.com/reyalpchdk/build-chdk-photos">github</a>.
          </p>
          <h2 className="font-bold text-2xl">About CHDK</h2>
          <p className="my-2">
          CHDK is an open source, unofficial, unsupported third party firmware add-on for certain Canon point and shoot and EOS M cameras. CHDK is not supported by or affiliated with Canon. All references to Canon trademarks on these pages are used solely to help identify the products in question. <b>CHDK is provided as-is, with absolutely no warranty. All use of CHDK is at the user&apos;s own risk.</b> See the <a className="underline hover:text-chdk-red2" href="https://chdk.fandom.com/wiki/CHDK">CHDK wiki</a> for more information. Please use the <a className="underline hover:text-chdk-red2" href="https://chdk.setepontos.com/index.php">CHDK forum</a> to report CHDK bugs.
          </p>
          <h2 className="font-bold text-2xl">Get CHDK</h2>
          <p className="my-2">
          To find a CHDK build, start by selecting a branch below.
          </p>
          <BranchSelector
            branches={['trunk','release']}
            base_url={process.env.NEXT_PUBLIC_SITE_ROOT || ''}
            builds_path={process.env.NEXT_PUBLIC_BUILDS_DIR || "/builds"} />
        </main>
      </div>
    </>
  )
}
