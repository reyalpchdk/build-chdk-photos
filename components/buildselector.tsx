import { useState } from 'react'
import {
  BuildDesc,
  BuildFileInfo,
  CamFirmware,
  CamModel,
  CamFamily,
  BuildInfo
} from '@/interfaces/buildmeta';

type SelId = string | null;
type SelSetter = (a: SelId) => void;
type FamPanelProps = {
  build_info: BuildInfo;
  sel: SelId;
  setSel: SelSetter;
}

function FamPanel({ build_info, sel, setSel }: FamPanelProps) {
  return (
    <div className="mr-2">
      {build_info.files.map((fam: CamFamily) => (
        <button
          onClick={() => setSel((fam.id === sel)?null:fam.id)}
          key={fam.id}
          className={"block border-solid border p-1 m-1 w-full border-slate-300 rounded" + ((fam.id == sel)?' bg-slate-200':'')}>
          {fam.line} {fam.id}
        </button>
      ))}
    </div>
  )
}

type ModPanelProps = {
  build_info: BuildInfo;
  sel: SelId;
  sel_fam: SelId;
  setSel: SelSetter;
}

function ModPanel({ build_info, sel, sel_fam, setSel }: ModPanelProps) {
  return (
    <div className="mr-2">
      {build_info.files.find((fam: CamFamily) => fam.id == sel_fam)?.models.map((mod: CamModel) => (
        <button
          onClick={() => setSel((mod.id === sel)?null:mod.id)}
          key={mod.id}
          className={"block border-solid border p-1 m-1 w-full border-slate-300 rounded" + ((mod.id == sel)?' bg-slate-200':'')}>
         {mod.desc || mod.id} {mod.aka && " (" + mod.aka + ")"}
        </button>
      ))}
    </div>
  )
}

type BuildSelectorProps = {
  build_info: BuildInfo;
}

export default function BuildSelector({ build_info }: BuildSelectorProps) {
  const host = 'https://build.chdk.photos';
  const [sel_fam, setFam] = useState<SelId>(null);
  const [sel_mod, setMod] = useState<SelId>(null);

  return (
    <div className="flex">
      <FamPanel build_info={build_info} sel={sel_fam} setSel={setFam} />
      <ModPanel build_info={build_info} sel={sel_mod} sel_fam={sel_fam} setSel={setMod} />
      <div>
      {build_info.files.find((fam: CamFamily) => fam.id === sel_fam)
        ?.models.find((mod: CamModel) => (mod.id === sel_mod))
        ?.fw.map((fw: CamFirmware) => (
          <div key={sel_mod + ' ' + fw.id}>
            {fw.id} Full <a href={host+build_info.files_path+'/'+fw.full.file}>{fw.full.file}</a> Small <a href={host+build_info.files_path+'/'+fw.small.file}>{fw.small.file}</a>
          </div>
      ))}
      </div>
    </div>
  )
}

