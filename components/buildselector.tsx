import {
  BuildDesc,
  BuildFileInfo,
  CamFirmware,
  CamModel,
  CamFamily,
  BuildInfo
} from '@/interfaces/buildmeta';

type Props = {
  build_info: BuildInfo;
}

export default function BuildSelector({ build_info }: Props) {
  return (
    <div>
    {build_info.files.map((fam: CamFamily) => fam.models.map((mod: CamModel) => (
      <div key={mod.id}>{mod.desc || mod.id}</div>
    )))}
    </div>
  )
}

