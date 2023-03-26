import {
  BuildDesc,
  BuildInfo
} from '@/interfaces/buildmeta';

type Props = {
  build_info: BuildInfo;
}

export default function BuildSummary({ build_info }: Props) {
  const build = build_info.build;
  return (
    <div>
      <div>
        Version: {build.version}-{build.revision}
      </div>
      <div>
        Built: {new Date(build.utc).toLocaleString()} ({new Date(build.utc).toUTCString()})
      </div>
    </div>
  )
}

