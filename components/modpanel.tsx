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
  CamModel,
} from '@/interfaces/buildmeta';

import {
  BuildSelection,
  PathSetter,
} from '@/interfaces/buildselection';

import {
  makePathStr
} from '@/lib/buildselection';

import BuildOptCtl from '@/components/buildoptctl'

type ModPanelProps = {
  sel_info: BuildSelection;
  setPath: PathSetter;
}

export default function ModPanel({ sel_info, setPath }: ModPanelProps) {
  // if we only have one model (*cough tx1*), make it selected
  // must be before conditional return because react
  useEffect(() => {
    if(sel_info.family?.models.length === 1 && !sel_info.model) {
      setPath(makePathStr(sel_info.path,2,sel_info.family.models[0].id),true)
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
