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
import Image from 'next/image'
import logo from '../img/chdk_logo-200.png'
import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="mb-4 bg-chdk-red1 text-white text-2xl">
      <div className="max-w-6xl mx-auto px-1 sm:px-6 xl:px-8 flex flex-wrap gap-x-5 py-1 items-center">
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

