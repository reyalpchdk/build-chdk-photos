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
import {
  CamFamily,
} from '@/interfaces/buildmeta';

import {
  BuildSelection,
  PathSetter,
} from '@/interfaces/buildselection';

import {
  makePathStr
} from '@/lib/buildselection';

import BuildOptCtl from '@/components/buildoptctl'

type FamPanelProps = {
  sel_info: BuildSelection;
  setPath: PathSetter
}

export default function FamPanel({ sel_info, setPath }: FamPanelProps) {
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
