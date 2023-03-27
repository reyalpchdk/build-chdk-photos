import Image from 'next/image'
import logo from '../img/chdk_logo-200.png'
import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="mb-4 bg-chdk-red1 text-white text-2xl">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 xl:px-8 flex flex-wrap gap-x-5 py-1 items-center">
        <Link href="/"><Image src={logo} width={80} alt="CHDK logo" /></Link>
        <Link className="hover:underline" href="/">CHDK Autobuild</Link>
        <nav className="grow flex gap-4 justify-left sm:justify-end">
          <a className="hover:underline" href="https://chdk.fandom.com/wiki/CHDK">Wiki</a>
          <a className="hover:underline" href="https://chdk.setepontos.com/index.php">Forum</a>
          <a className="hover:underline" href="https://web.libera.chat/?channels=#chdk">IRC</a>
        </nav>
      </div>
    </header>
  )
}

