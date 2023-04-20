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
  BuildSelection,
} from '@/interfaces/buildselection';

import {
  makePathStr
} from '@/lib/buildselection';

import BuildOptCtl from '@/components/buildoptctl'

type PathSetter = (a: string|null) => void

type FamPanelProps = {
  sel_info: BuildSelection;
  setPath: PathSetter
}

function FamPanel({ sel_info, setPath }: FamPanelProps) {
  const opts = sel_info.branch?.info?.files.map( (fam:CamFamily) => ({
      id:fam.id,
      label:fam.line + ' ' + fam.id + (fam.aka?' ('+fam.aka+')':'')
    })
  )
  return (
    <div className="border border-slate-300 p-1 mt-1 rounded">
      <BuildOptCtl
        title="Model Family"
        opts={opts}
        sel={sel_info.path[1]}
        setSel={(id)=>{setPath(makePathStr(sel_info.path,1,id))}} />
    </div>
  )
}

type ModPanelProps = {
  sel_info: BuildSelection;
  setPath: PathSetter;
}

function ModPanel({ sel_info, setPath }: ModPanelProps) {
  // if we only have one model (*cough tx1*), make it selected
  // must be before conditional return because react
  useEffect(() => {
    if(sel_info.family?.models.length === 1 && !sel_info.model) {
      setPath(makePathStr(sel_info.path,2,sel_info.family.models[0].id))
    }
  }, [sel_info,setPath])

  if(!sel_info.branch || !sel_info.branch.info || !sel_info.family) {
    return null
  }
  const opts = sel_info.family.models.map( (mod:CamModel) => ({
      id:mod.id,
      label:(mod.desc || mod.id) + ((mod.aka)? " (" + mod.aka + ")":'')
    })
  )
  const svn_root = sel_info.branch.info.build.svn
  return (
    <div className="border border-slate-300 p-1 mt-1 rounded">
      <BuildOptCtl
        title="Model"
        opts={opts}
        sel={sel_info.path[2]}
        setSel={(id)=>{setPath(makePathStr(sel_info.path,2,id))}} />
      {sel_info.model && (
        <a target="_blank" href={svn_root + '/platform/'+sel_info.model.id+'/notes.txt'} className="block underline hover:text-chdk-red2 my-2">Model notes</a>
      )}
    </div>
  )
}

type FwPanelProps = {
  sel_info: BuildSelection;
  setPath: PathSetter;
  base_url: string;
}

function FwPanel({ sel_info, setPath, base_url }: FwPanelProps) {
  // if we only have one firmware, make it selected
  // must be before conditional return because react
  useEffect(() => {
    if(sel_info.model?.fw.length === 1 && !sel_info.fw) {
      setPath(makePathStr(sel_info.path,3,sel_info.model.fw[0].id))
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

type BuildSelectorProps = {
  sel_info: BuildSelection;
  base_url: string;
  setPath: PathSetter;
}

export default function BuildSelector({ sel_info, base_url, setPath }: BuildSelectorProps) {
  return (
    <>
      <FamPanel
        sel_info={sel_info}
        setPath={setPath} />
      <ModPanel
        sel_info={sel_info}
        setPath={setPath} />
      <FwPanel
        sel_info={sel_info}
        setPath={setPath}
        base_url={base_url} />
    </>
  )
}

