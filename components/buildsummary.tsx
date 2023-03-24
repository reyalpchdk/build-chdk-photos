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
    {build.desc} {build.type_desc} ({build.type}) {build.version}-{build.revision} built {build.utc}
    </div>
  )
}

