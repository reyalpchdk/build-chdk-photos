import { useState, useEffect } from 'react'

import {
  BuildDesc,
  BuildFileInfo,
  CamFirmware,
  CamModel,
  CamFamily,
  BuildInfo
} from '@/interfaces/buildmeta';

import {
  SelId,
  SelSetter
} from '@/interfaces/buildctlprops';

import BuildOptCtl from '@/components/buildoptctl'


type FamPanelProps = {
  build_info: BuildInfo;
  sel: SelId;
  setSel: SelSetter;
}

function FamPanel({ build_info, sel, setSel }: FamPanelProps) {
  const opts = build_info.files.map( (fam:CamFamily) => ({
      id:fam.id,
      label:fam.line + ' ' + fam.id
    })
  )
  return (
    <div className="border border-slate-300 p-1 mt-1 rounded">
      <BuildOptCtl
        title="Model Family"
        opts={opts}
        sel={sel}
        setSel={setSel} />
    </div>
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
  const opts = sel_fam.models.map( (mod) => ({
      id:mod.id,
      label:(mod.desc || mod.id) + ((mod.aka)? " (" + mod.aka + ")":'')
    })
  )
  return (
    <div className="border border-slate-300 p-1 mt-1 rounded">
      <BuildOptCtl
        title="Model"
        opts={opts}
        sel={sel}
        setSel={setSel} />
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

  const opts = sel_mod.fw.map( (fw) => ({
      id:fw.id,
    })
  )
  return (
    <div className="border border-slate-300 p-1 mt-1 rounded">
      <BuildOptCtl
        title="Canon Firmware Ver"
        opts={opts}
        sel={sel}
        setSel={setSel} />
        {sel_fw && (
          <div>
            <h3 className="font-bold text-l my-1">Downloads</h3>
            <div>
              Complete: <a href={files_url+'/'+sel_fw.full.file} className="underline">{sel_fw.full.file}</a> (use this if unsure!)
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
          </div>
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
    <>
      <FamPanel build_info={build_info} sel={sel_fam_id} setSel={ (f) => { setMod(null); setFam(f) }} />
      <ModPanel sel={sel_mod_id} sel_fam={sel_fam} setSel={ (s) => { setFw(null); setMod(s) }} />
      <FwPanel sel={sel_fw_id} sel_mod={sel_mod} setSel={setFw} files_url={base_url+build_info.files_path} />
    </>
  )
}

