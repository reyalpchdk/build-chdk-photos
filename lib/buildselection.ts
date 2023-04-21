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
  LoadStatus,
  BuildSelection,
  BranchMap,
} from '@/interfaces/buildselection';

export const infoFromPath = (data:BranchMap, path:string) => {
  const r:BuildSelection={
    path:[]
  }
  const hash = path.split('#')[1]
  if(!hash) {
    return r
  }
  const buildstr = new URLSearchParams(hash).get('build')
  if(!buildstr) {
    return r
  }
  const parts = buildstr.split('/')
  if(!data[parts[0]]) {
    return r
  }
  r.branch = data[parts[0]]
  r.path.push(parts[0])
  if(r.branch.status !== LoadStatus.LOADED || !r.branch.info) {
    return r
  }

  r.family = r.branch.info.files.find((info) => info.id === parts[1])
  if(r.family) {
    r.path.push(parts[1])
  } else {
    return r
  }
  r.model = r.family.models.find((info) => info.id === parts[2])
  if(r.model) {
    r.path.push(parts[2])
  } else {
    return r
  }
  r.fw = r.model.fw.find((info) => info.id === parts[3])
  if(r.fw) {
    r.path.push(parts[3])
  }
  return r
}

export const makePathStr = (prev_path:string[], level:number, id:string|null) => {
  if(level == 0) {
    if(!id) {
      return ''
    }
    return 'build='+id
  }
  const path = prev_path.slice(0,level)
  if(id !== null) {
    path.push(id)
  }
  return 'build='+path.join('/')
}

