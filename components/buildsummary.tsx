import {
  BuildDesc,
  BuildInfo
} from '@/interfaces/buildmeta';

type Props = {
  build_info: BuildInfo;
  handle_click: () => void;
}

export default function BuildSummary({ build_info, handle_click }: Props) {
  const build = build_info.build;
  return (
    <button onClick={handle_click}>
    {build.desc} {build.type} ({build.type_desc}) {build.version}-{build.revision} built {build.utc}
    </button>
  )
}

