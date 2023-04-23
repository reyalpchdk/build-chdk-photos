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
import { useEffect } from 'react'

import {
  CamFirmware,
} from '@/interfaces/buildmeta';

import {
  BuildSelection,
  PathSetter,
} from '@/interfaces/buildselection';

import {
  makePathStr
} from '@/lib/buildselection';

import BuildOptCtl from '@/components/buildoptctl'

type FwPanelProps = {
  sel_info: BuildSelection;
  setPath: PathSetter;
  base_url: string;
}

export default function FwPanel({ sel_info, setPath, base_url }: FwPanelProps) {
  // if we only have one firmware, make it selected
  // must be before conditional return because react
  useEffect(() => {
    if(sel_info.model?.fw.length === 1 && !sel_info.fw) {
      setPath(makePathStr(sel_info.path,3,sel_info.model.fw[0].id),true)
    }
  }, [sel_info,setPath])

  if(!sel_info.branch || !sel_info.branch.info || !sel_info.model) {
    return null
  }

  const opts = sel_info.model.fw.map( (fw:CamFirmware) => ({
      id:fw.id,
    })
  )
  const files_url = base_url+sel_info.branch.info.files_path
  return (
    <div className="border border-slate-300 p-1 mt-1 rounded">
      <BuildOptCtl
        title="Canon Firmware Version"
        opts={opts}
        sel={sel_info.path[3]}
        setSel={(id)=>{setPath(makePathStr(sel_info.path,3,id))}} />
        {sel_info.fw && (
          <div>
            <h3 className="font-bold text-l my-1">Complete build</h3>
            <div>
              <a href={files_url+'/'+sel_info.fw.full.file} className="underline hover:text-chdk-red2">Download {sel_info.fw.full.file}</a> {sel_info.fw.full.size && (<span>({(sel_info.fw.full.size/1024).toFixed()} KB)</span>)}
            </div>
            <div className="break-all w-full">
              sha256: {sel_info.fw.full.sha256}
            </div>
            <div className="border-b border-slate-300 my-2"></div>
            <h3 className="font-bold text-l my-1">Small update build</h3>
            <div>
              <a href={files_url+'/'+sel_info.fw.small.file} className="underline hover:text-chdk-red2">Download {sel_info.fw.small.file}</a> {sel_info.fw.small.size && (<span>({(sel_info.fw.small.size/1024).toFixed()} KB)</span>)}
            </div>
            <div className="break-all w-full">
              sha256: {sel_info.fw.small.sha256}
            </div>
            <div className="my-1">
              NOTE: Small file is <b>only</b> suitable for updating an existing install of a similar version. Use the complete build if unsure.
            </div>
          </div>
        )}
        {!sel_info.fw && (
          <p className="my-2">
A CHDK build must match the version of the Canon firmware installed on the camera. See the <a target="_blank" href="https://chdk.fandom.com/wiki/FAQ#Q._How_can_I_get_the_original_firmware_version_number_of_my_camera?" className="underline hover:text-chdk-red2">FAQ</a> for more information.
          </p>
        )}
    </div>
  )
}
