/*
 * Copyright (C) 2023 <reyalp (at) gmail dot com>
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  with this software. If not, see <http://www.gnu.org/licenses/>.
 */
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
      label:fam.line + ' ' + fam.id + (fam.aka?' ('+fam.aka+')':'')
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
  svn_root:string;
  sel: SelId;
  sel_fam?: CamFamily;
  setSel: SelSetter;
}

function ModPanel({ svn_root, sel, sel_fam, setSel }: ModPanelProps) {
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
  const sel_mod = sel_fam.models.find((mod: CamModel) => mod.id === sel)
  return (
    <div className="border border-slate-300 p-1 mt-1 rounded">
      <BuildOptCtl
        title="Model"
        opts={opts}
        sel={sel}
        setSel={setSel} />
      {sel_mod && (
        <a target="_blank" href={svn_root + '/platform/'+sel_mod.id+'/notes.txt'} className="block underline hover:text-chdk-red2 my-2">Model notes</a>
      )}
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
        title="Canon Firmware Version"
        opts={opts}
        sel={sel}
        setSel={setSel} />
        {sel_fw && (
          <div>
            <h3 className="font-bold text-l my-1">Complete build</h3>
            <div>
              <a href={files_url+'/'+sel_fw.full.file} className="underline hover:text-chdk-red2">Download {sel_fw.full.file}</a> {sel_fw.full.size && (<span>({(sel_fw.full.size/1024).toFixed()} KB)</span>)}
            </div>
            <div className="break-all w-full">
              sha256: {sel_fw.full.sha256}
            </div>
            <div className="border-b border-slate-300 my-2"></div>
            <h3 className="font-bold text-l my-1">Small update build</h3>
            <div>
              <a href={files_url+'/'+sel_fw.small.file} className="underline hover:text-chdk-red2">Download {sel_fw.small.file}</a> {sel_fw.small.size && (<span>({(sel_fw.small.size/1024).toFixed()} KB)</span>)}
            </div>
            <div className="break-all w-full">
              sha256: {sel_fw.small.sha256}
            </div>
            <div className="my-1">
              NOTE: Small file is <b>only</b> suitable for updating an existing install of a similar version. Use the complete build if unsure.
            </div>
          </div>
        )}
        {!sel_fw && (
          <p className="my-2">
A CHDK build must match the version of the Canon firmware installed on the camera. See the <a href="https://chdk.fandom.com/wiki/FAQ#Q._How_can_I_get_the_original_firmware_version_number_of_my_camera?" className="underline hover:text-chdk-red2">FAQ</a> for more information.
          </p>
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
      <FamPanel
        build_info={build_info}
        sel={sel_fam_id}
        setSel={ (f) => { setMod(null); setFam(f) }} />
      <ModPanel
        svn_root={build_info.build.svn}
        sel={sel_mod_id}
        sel_fam={sel_fam}
        setSel={ (s) => { setFw(null); setMod(s) }} />
      <FwPanel
        sel={sel_fw_id}
        sel_mod={sel_mod}
        setSel={setFw}
        files_url={base_url+build_info.files_path} />
    </>
  )
}

