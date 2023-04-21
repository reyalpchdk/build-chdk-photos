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
import { useRouter } from 'next/router'

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

import {
  LoadStatus,
  BranchState,
  BuildSelection,
  BranchMap
} from '@/interfaces/buildselection';

import {
  infoFromPath,
  makePathStr
} from '@/lib/buildselection';

type Props = {
  branches: string[];
  base_url: string;
  builds_path: string;
}


export default function BranchSelector({ branches, base_url, builds_path }: Props) {
  const [data, setData] = useState(() => branches.reduce( (s:any,bname) => {
    s[bname]={status:LoadStatus.LOADING}
    return s
  },{}))

  const [sel_info, setSelInfo] = useState<BuildSelection>({path:[]});

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

  const router = useRouter()
  useEffect(() => {
      setSelInfo(infoFromPath(data,router.asPath))
  }, [data, router.asPath])

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
  const setPath = (path:string|null,replace?:boolean) => {
    if(replace) {
      router.replace({hash:path})
    } else {
      router.push({hash:path})
    }
  }

  return (
    <div>
      <div className="border border-slate-300 p-1 mt-1 rounded">
        <BuildOptCtl
          title="Choose Branch"
          opts={opts}
          sel={sel_info.path[0]}
          setSel={(id)=>{router.push({hash:makePathStr(sel_info.path,0,id)})}}
        />
        {sel_info.branch?.status === LoadStatus.LOADED && sel_info.branch.info && (
          <BuildSummary build_info={sel_info.branch.info} />
        )}
        {sel_info.branch?.status === LoadStatus.ERROR && (
          <div>{String(sel_info.branch.err)}</div>
        )}
        {!sel_info.branch && (
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
      {sel_info.branch?.status === LoadStatus.LOADED && (
        <BuildSelector sel_info={sel_info} base_url={base_url} setPath={setPath} />
      )}
    </div>
  )
}

