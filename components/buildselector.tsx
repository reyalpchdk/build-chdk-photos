import {
  BuildDesc,
  BuildFileInfo,
  CamFirmware,
  CamModel,
  CamFamily,
  BuildInfo
} from '@/interfaces/buildmeta';

type Props = {
  build: BuildInfo;
}

export default function BuildSelector({ build }: Props) {
  return (
    <div>
    {build.files.map((fam: CamFamily) => fam.models.map((mod: CamModel) => (
      <div key={mod.id}>{mod.desc || mod.id}</div>
    )))}
    </div>
  )
}

