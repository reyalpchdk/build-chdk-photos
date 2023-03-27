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
