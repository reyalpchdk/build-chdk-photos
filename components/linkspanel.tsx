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

export default function LinksPanel() {
  return (
    <nav className="min-w-full md:min-w-fit order-1 md:order-none border border-slate-300 p-2 rounded">
      <h2 className="font-bold text-2xl mb-2">Useful Links</h2>
      <ul role="list">
        <li><a className="underline hover:text-chdk-red2" href="https://chdk.fandom.com/wiki/CHDK">CHDK Wiki</a>
          <ul role="list" className="ml-2">
            <li><a className="underline hover:text-chdk-red2" href="https://chdk.fandom.com/wiki/CHDK_User_Manual">User Manual</a></li>
            <li><a className="underline hover:text-chdk-red2" href="https://chdk.fandom.com/wiki/Prepare_your_SD_card">Installing CHDK</a></li>
            <li><a className="underline hover:text-chdk-red2" href="https://chdk.fandom.com/wiki/FAQ">FAQ</a></li>
            <li><a className="underline hover:text-chdk-red2" href="https://chdk.fandom.com/wiki/CHDK_Scripting_Cross_Reference_Page">Scripting Reference</a></li>
            <li><a className="underline hover:text-chdk-red2" href="https://chdk.fandom.com/wiki/For_Developers">For Developers</a></li>
          </ul>
        </li>
        <li><a className="underline hover:text-chdk-red2" href="https://app.assembla.com/spaces/chdk/subversion/source">Source code</a></li>
        <li><a className="underline hover:text-chdk-red2" href="https://chdk.setepontos.com/index.php">International Forum</a></li>
        <li><a className="underline hover:text-chdk-red2" href="https://forum.chdk-treff.de/">German Forum</a></li>
        <li><a className="underline hover:text-chdk-red2" href="https://web.libera.chat/?channels=#chdk">IRC libera.chat#chdk</a></li>
      </ul>
    </nav>
  )
}

