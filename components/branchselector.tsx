import { useState, useEffect } from 'react'
import BuildSummary from '@/components/buildsummary'
import BuildSelector from '@/components/buildselector'

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
  errmsg?: string;
}

export default function BranchSelector({ branches, base_url, builds_path }: Props) {
  const [data, setData] = useState(() => branches.reduce( (s:any,bname) => {
    s[bname]={status:LoadStatus.LOADING}
    return s
  },{}))

  const [sel_branch, setBranch] = useState<string>(branches[0]);

  useEffect(() => {
    branches.forEach( (bname) => {
      fetch(base_url+builds_path+'/'+bname+'/meta/build_info.json')
        .then(
          (res) => res.json(),
          (err) => {
            console.log('error fetching data',bname,err)
            setData((data:any) => ({...data,[bname]:{status:LoadStatus.ERROR, errmsg:err}}))
          }
        )
        .then(
          (binfo) => {
            setData((data:any) => {
              if(data[bname]?.status === LoadStatus.LOADING) {
                return {...data,[bname]:{info:binfo, status:LoadStatus.LOADED }}
              } else {
                return data
              }
            })
          },
          (err) => {
            console.log('error parsing data',bname,err)
            setData((data:any) => ({...data,[bname]:{status:LoadStatus.ERROR, errmsg:err}}))
          }
        )
    });
  }, [branches, base_url, builds_path])

  return (
    <>
      <div className="flex gap-1">
        {branches.map((bname) => (
        <div key={bname}>
        {data[bname].status === LoadStatus.LOADING && `loading ${bname}...`}
        {data[bname].status === LoadStatus.ERROR && `error loading ${bname}`}
        {data[bname].status === LoadStatus.LOADED && (
          <button
            onClick={() => setBranch(bname)}
            className={"block border-solid border p-1 w-full border-slate-300 rounded" + ((bname == sel_branch)?' bg-slate-200':'')}>
            {data[bname].info.build.type_desc}
          </button>
        )}
        </div>
        ))}
      </div>
      {branches.map((bname) => (
        (bname === sel_branch && data[bname].status === LoadStatus.LOADED) && (
        <div key={bname} className="border border-slate-300 p-1 mt-1 rounded">
          <>
          <BuildSummary build_info={data[bname].info} />
          <BuildSelector build_info={data[bname].info} base_url={base_url} />
          </>
        </div>
        )
      ))}
    </>
  )
}

