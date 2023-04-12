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
import { useState } from 'react'

import {
  BuildInfo,
  SvnLogEntry,
} from '@/interfaces/buildmeta';

type SvnLogProps = {
  build_info: BuildInfo;
}

export default function SvnLog({ build_info }: SvnLogProps) {
  const [expand, setExpand] = useState(false);

  return (
    <div>
      <button onClick={() => setExpand(!expand)} className="relative pr-6">
        Recent changes
        <span className="absolute right-0 top-0 text-2xl leading-none">{expand?'\u00D7':'\uFF0B'}</span>
      </button>
      {expand && build_info.svnlog.map( (revlog) => (
        <div key={revlog.revision}
          className="bg-sky-100">
          <a target="_blank" className="underline hover:text-chdk-red2" href={revlog.svn}>{revlog.revision}</a>
          {' '}- {revlog.author} - {new Date(revlog.utc).toLocaleString()} ({new Date(revlog.utc).toUTCString()})
          {revlog.msg.map((msg) => (
            <div className="bg-slate-50" key={msg}>{msg}</div>
          ))}
        </div>
      ))}
      {(expand && build_info.svnlog.length) && (
        <div>
          <a target="_blank" className="underline hover:text-chdk-red2" href={build_info.svnlog[0].svn.replace(/\/\d+$/,'/list')}>Full log</a> (all branches)
        </div>
      )}
    </div>
  )
}
