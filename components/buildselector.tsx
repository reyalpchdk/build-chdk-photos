import { useState, useEffect } from 'react'
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
    <>
    <h3 className="font-bold text-l my-1">Select model family</h3>
    <div className="flex w-full gap-1 flex-wrap">
      {build_info.files.map((fam: CamFamily) => (
        <button
          onClick={() => setSel((fam.id === sel)?null:fam.id)}
          key={fam.id}
          className={"block border-solid border p-1 border-slate-300 rounded" + ((fam.id == sel)?' bg-slate-200':'')}>
          {fam.line} {fam.id}
        </button>
      ))}
    </div>
    </>
  )
}

type ModPanelProps = {
  sel: SelId;
  sel_fam?: CamFamily;
  setSel: SelSetter;
}

function ModPanel({ sel, sel_fam, setSel }: ModPanelProps) {
  // if we only have one model (*cough tx1*), make it selected
  // must be before conditional return because react
  useEffect(() => {
    if(sel_fam?.models.length === 1 && sel !== sel_fam.models[0].id) {
      setSel(sel_fam.models[0].id)
    }
  }, [sel_fam,setSel,sel])

  if(!sel_fam) {
    return null
  }
  const bg_color = (id:SelId,sel:SelId) => {
    if(id === sel) {
      return 'bg-sky-400'
    }
    return 'even:bg-slate-50 odd:bg-sky-100'
  }
  return (
    <div className="min-w-[19em]">
      <h3 className="font-bold text-l my-1">Select model</h3>
      <div className="max-h-[50vh] overflow-y-auto">
      {sel_fam?.models.map((mod: CamModel) => (
        <button
          onClick={() => setSel((mod.id === sel)?null:mod.id)}
          key={mod.id}
          className={"text-left block p-1 w-full " + bg_color(mod.id,sel)}>
         {mod.desc || mod.id} {mod.aka && " (" + mod.aka + ")"}
        </button>
      ))}
      </div>
    </div>
  )
}

type FwPanelProps = {
  sel: SelId;
  sel_mod?: CamModel;
  setSel: SelSetter;
  files_url: string;
}

function FwPanel({ sel, sel_mod, setSel, files_url }: FwPanelProps) {
  // if we only have one firmware, make it selected
  // must be before conditional return because react
  useEffect(() => {
    if(sel_mod?.fw.length === 1 && sel_mod.fw[0].id !== sel) {
      setSel(sel_mod.fw[0].id)
    }
  }, [sel_mod,setSel,sel])

  if(!sel_mod) {
    return null
  }
  const sel_fw = sel_mod.fw.find((fw: CamFirmware) => fw.id === sel)

  return (
    <div>
      <h3 className="font-bold text-l my-1">Select Canon firmware version</h3>
      <div className="flex w-full gap-1 flex-wrap">
        {sel_mod.fw.map((fw: CamFirmware) => (
          <button
            onClick={() => setSel((fw.id === sel)?null:fw.id)}
            key={fw.id}
            className={"block border-solid border p-1 border-slate-300 rounded" + ((fw.id == sel)?' bg-slate-200':'')}>
            {fw.id}
          </button>
        ))}
      </div>
      {sel_fw && (
        <>
          <div>
            Complete: <a href={files_url+'/'+sel_fw.full.file} className="underline">{sel_fw.full.file}</a> (use this if not sure!)
          </div>
          <div>
            sha256: {sel_fw.full.sha256}
          </div>
          <div>
            Small: <a href={files_url+'/'+sel_fw.small.file} className="underline">{sel_fw.small.file}</a>
          </div>
          <div>
            sha256: {sel_fw.small.sha256}
          </div>
        </>
      )}
    </div>
  )

}

type BuildSelectorProps = {
  build_info: BuildInfo;
  base_url: string;
}

export default function BuildSelector({ build_info, base_url }: BuildSelectorProps) {
  const [sel_fam_id, setFam] = useState<SelId>(null);
  const [sel_mod_id, setMod] = useState<SelId>(null);
  const [sel_fw_id, setFw] = useState<SelId>(null);

  const sel_fam = build_info.files.find((fam: CamFamily) => fam.id === sel_fam_id)
  const sel_mod = sel_fam?.models.find((mod: CamModel) => (mod.id === sel_mod_id))
  return (
    <div>
      <FamPanel build_info={build_info} sel={sel_fam_id} setSel={ (f) => { setMod(null); setFam(f) }} />
      <div className="flex gap-1">
        <ModPanel sel={sel_mod_id} sel_fam={sel_fam} setSel={ (s) => { setFw(null); setMod(s) }} />
        <FwPanel sel={sel_fw_id} sel_mod={sel_mod} setSel={setFw} files_url={base_url+build_info.files_path} />
      </div>
    </div>
  )
}

