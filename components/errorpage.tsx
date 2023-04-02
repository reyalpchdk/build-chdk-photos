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
import Link from 'next/link'
import Head from 'next/head'
import SiteHeader from '@/components/siteheader'

type Props = {
  errno: number;
  message: string;
}
export default function ErrorPage({ errno, message}: Props) {
  return (
    <>
      <Head>
        <title>{errno + ' ' + message}</title>
        <meta name="description" content="CHDK Autobuild" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SiteHeader />
      <main className="flex flex-col h-[50vh] justify-end items-center">
        <div className="text-center">
          <h1 className="text-2xl mb-2">{errno} - {message}</h1>
          <Link href="/">Go home?</Link>
        </div>
      </main>
    </>
  )
}
