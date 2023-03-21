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
  const host = 'https://build.chdk.photos';
  return (
    <div>
    {build_info.files.map((fam: CamFamily) => (
      <div key={fam.id}>
        <button>{fam.line} {fam.id}</button>
          {fam.models.map((mod: CamModel) => (
          <div key={mod.id}>
            {mod.desc || mod.id} {mod.aka && "AKA " + mod.aka}
            {mod.fw.map((fw: CamFirmware) => (
            <div key={mod.id + ' ' + fw.id}>
              {fw.id} Full <a href={host+build_info.files_path+'/'+fw.full.file}>{fw.full.file}</a> Small <a href={host+build_info.files_path+'/'+fw.small.file}>{fw.small.file}</a>
            </div>
            ))}
          </div>
        ))}
      </div>
    ))}
    </div>
  )
}

