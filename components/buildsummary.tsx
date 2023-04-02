import {
  BuildDesc,
  BuildInfo
} from '@/interfaces/buildmeta';

import SvnLog from '@/components/svnlog'

type Props = {
  build_info: BuildInfo;
}

export default function BuildSummary({ build_info }: Props) {
  const build = build_info.build;
  return (
    <div>
      <div>
        Version: {build.version}-{build.revision} - {build_info.counts.models} models, {build_info.counts.cameras} cameras
      </div>
      <div>
        Built: {new Date(build.utc).toLocaleString()} ({new Date(build.utc).toUTCString()})
      </div>
      <div>
        Source: <a className="underline hover:text-chdk-red2" href={build.svn}>{build.svn}</a>
      </div>
      <SvnLog build_info={build_info} />
    </div>
  )
}

