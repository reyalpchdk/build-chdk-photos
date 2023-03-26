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
    <>
      <div className="flex gap-1">
      <BuildOptCtl
        title="Choose Branch"
        opts={opts}
        sel={sel_branch}
        setSel={setBranch}
      />
      </div>
      {sel_branch && data[sel_branch]?.status === LoadStatus.LOADED && (
        <div key={sel_branch} className="border border-slate-300 p-1 mt-1 rounded">
          <BuildSummary build_info={data[sel_branch].info} />
          <BuildSelector build_info={data[sel_branch].info} base_url={base_url} />
        </div>
      )}
      {sel_branch && data[sel_branch]?.status === LoadStatus.ERROR && (
        <div key={sel_branch} className="border border-slate-300 p-1 mt-1 rounded">
        {String(data[sel_branch].err)}
        </div>
      )}
    </>
  )
}

