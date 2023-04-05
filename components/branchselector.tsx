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
import BuildSummary from '@/components/buildsummary'
import BuildSelector from '@/components/buildselector'

import {
  SelId,
  SelSetter
} from '@/interfaces/buildctlprops';

import BuildOptCtl from '@/components/buildoptctl'

import {
  BuildInfo
} from '@/interfaces/buildmeta';

type Props = {
  branches: string[];
  base_url: string;
  builds_path: string;
}

enum LoadStatus {
  LOADING = "loading",
  LOADED = "loaded",
  ERROR = "error",
}

type BranchState = {
  info?: BuildInfo;
  status: LoadStatus;
  err?: any;
}

export default function BranchSelector({ branches, base_url, builds_path }: Props) {
  const [data, setData] = useState(() => branches.reduce( (s:any,bname) => {
    s[bname]={status:LoadStatus.LOADING}
    return s
  },{}))

  const [sel_branch, setBranch] = useState<SelId>(null);

  useEffect(() => {
    branches.forEach( (bname) => {
      fetch(base_url+builds_path+'/'+bname+'/meta/build_info.json')
        .then(
          (res) => res.json(),
          (err) => {
            console.log('error fetching data',bname,err)
            setData((prevdata:any) => ({...prevdata,[bname]:{status:LoadStatus.ERROR, err:err}}))
          }
        )
        .then(
          (binfo) => {
            setData((prevdata:any) => {
              if(prevdata[bname]?.status === LoadStatus.LOADING) {
                return {...prevdata,[bname]:{info:binfo, status:LoadStatus.LOADED }}
              } else {
                return prevdata
              }
            })
          },
          (err) => {
            console.log('error parsing data',bname,err)
            setData((prevdata:any) => ({...prevdata,[bname]:{status:LoadStatus.ERROR, err:err}}))
          }
        )
    });
  }, [branches, base_url, builds_path])

  const branchStatusDesc = (bname:string) => {
    if (data[bname].status === LoadStatus.LOADING) {
      return `Loading ${bname}...`
    }
    if (data[bname].status === LoadStatus.ERROR) {
      return `Error loading ${bname}`
    }
    if (data[bname].status === LoadStatus.LOADED) {
      return data[bname].info.build.type_desc + ' ('+bname+')'
    }
  }

  const opts = branches.map( (bname) => ({
    id:bname,
    label:branchStatusDesc(bname)
  }))

  return (
    <div>
      <div className="border border-slate-300 p-1 mt-1 rounded">
        <BuildOptCtl
          title="Choose Branch"
          opts={opts}
          sel={sel_branch}
          setSel={setBranch}
        />
        {sel_branch && data[sel_branch]?.status === LoadStatus.LOADED && (
          <BuildSummary build_info={data[sel_branch].info} />
        )}
        {sel_branch && data[sel_branch]?.status === LoadStatus.ERROR && (
          <div>{String(data[sel_branch].err)}</div>
        )}
        {!sel_branch && (
          <>
            <p className="my-2">
The <i>development</i> branch may contain features under active development, and is considered <i>unstable</i>. The <i>release</i> branch is a released version which is generally only updated for bug fixes, and is considered <i>stable</i>. Note however that <i>stable</i> here mostly refers to features and interfaces, not the likelihood of encountering crashes or bugs.
            </p>
            <p className="my-2">
The development branch may include ports for models not present in the stable branch.
            </p>
            <p className="my-2">
See the <a className="underline hover:text-chdk-red2" href="https://chdk.fandom.com/wiki/Releases" target="_blank">releases</a> wiki page for information about significant changes in CHDK releases.
            </p>
          </>
        )}
      </div>
      {sel_branch && data[sel_branch]?.status === LoadStatus.LOADED && (
        <BuildSelector build_info={data[sel_branch].info} base_url={base_url} />
      )}
    </div>
  )
}

