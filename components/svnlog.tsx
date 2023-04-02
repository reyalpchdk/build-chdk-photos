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
          <a className="underline hover:text-chdk-red2" href={revlog.svn}>{revlog.revision}</a>
          {' '}- {revlog.author} - {new Date(revlog.utc).toLocaleString()} ({new Date(revlog.utc).toUTCString()})
          {revlog.msg.map((msg) => (
            <div className="bg-slate-50" key={msg}>{msg}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
