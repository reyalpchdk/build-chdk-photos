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
  useState,
  useEffect,
  useCallback
} from 'react'

import {
  ErrorBoundary,
  FallbackProps,
  useErrorBoundary
} from "react-error-boundary"

import { useDropzone } from 'react-dropzone'
import ExifReader from 'exifreader'

import {
  CamModel,
  CamFamily,
  CamFirmware,
} from '@/interfaces/buildmeta';

import {
  BuildSelection,
  PathSetter,
} from '@/interfaces/buildselection';

import {
  makePathStr
} from '@/lib/buildselection';

import {
  MakerNoteCamID,
  getMakerNoteValues
} from '@/lib/makernote';

import BuildOptCtl from '@/components/buildoptctl'

interface ModelMatch extends CamModel {
  family:string;
}

interface ExifModelInfo extends MakerNoteCamID {
  filename:string;
  make?:string;
  model?:string;
  exact_match?:boolean;
  matches?:ModelMatch[];
}

/*
multiple models can have the same exif id (N / N facebook, ixus132 / ius135)
*/
const getModelsByMID = ( sel_info:BuildSelection, mid?:number):ModelMatch[]|undefined => {
  const models = sel_info.branch?.info?.files.reduce((r:ModelMatch[], fam:CamFamily) => {
    r = fam.models.reduce((rr:ModelMatch[], mod:CamModel) => {
      if(mod.mid === mid) {
        rr.push({...mod, family:fam.id})
      }
      return rr
    },r)
    return r
  },[])
  //console.log(models)
  return models
}

type FileInfoPanelProps = {
  exif_info?:ExifModelInfo;
  branch?:string;
  setPath:PathSetter;
}

function FileInfoPanel({exif_info, branch, setPath}:FileInfoPanelProps) {
  if(!exif_info || !branch) {
    return null
  }

  const { filename, make, model, exact_match, mid, fw_rev, fw_rev_str, matches } = exif_info
  const try_again = (
    <div className="my-1">
    Select another image to try again
    </div>
  )
  const icon_bad=(<>&#10060;</>) // red X
  const icon_good=(<>&#9989;</>) // green check
  const model_desc = (
    <p>
    <b>Make:</b> {make || '(unknown make)'} <b>Model:</b> {model || '(unknown model)'}
    </p>
  )
  let msg = null

  if(!make) {
    msg = (
      <>
        <p>
          {icon_bad} No manufacturer found, file may be missing EXIF.
        </p>
        {try_again}
      </>
    )
  } else if(make !== 'Canon') {
    msg = (
      <>
        {model_desc}
        <p>
          {icon_bad} Non-Canon image. CHDK only supports Canon cameras.
        </p>
        {try_again}
      </>
    )
  } else {
    const mnote_desc = (
      <div>
      <b>Model ID:</b> {(mid && '0x'+mid.toString(16)) || '(missing)'}
      {' '} <b>Firmware revision:</b> {(fw_rev && ` 0x${fw_rev.toString(16)} (${fw_rev_str})`) || '(missing)'}
      </div>
    )
    const test_builds_msg = (
      <p>
        If a port is in development, test builds may be available on the
        {' '}<a
          className="underline hover:text-chdk-red2"
          href="https://chdk.fandom.com/wiki/Test_releases_not_available_in_autobuilds"
          target="_blank">
        test releases not available in autobuilds
        </a> wiki page or the
        {' '}<a
          className="underline hover:text-chdk-red2"
          href="https://chdk.setepontos.com/index.php?action=forum"
          target="_blank">CHDK forum</a>. If you use a test build <b>please</b> report results on the forum
        {' '}so it can be added to the autobuild.
      </p>
    )
    const unsupported_sub_msg = (
      <>
          {test_builds_msg}
          <p>
          In rare cases, a Canon firmware update may be available to update to a CHDK supported version. Check
          the model wiki page or
          {' '}<a
            className="underline hover:text-chdk-red2"
            href="https://chdk.setepontos.com/index.php?action=forum"
            target="_blank">CHDK forum</a>.
          </p>
          <p>
          If all else fails, support for this firmware version might be added if requested in the
          {' '}<a
            className="underline hover:text-chdk-red2"
            href="https://chdk.setepontos.com/index.php?action=forum"
            target="_blank">CHDK forum</a>.
          </p>
      </>
    )


    // identified single firmware with build available
    // canon model names usually include Canon, so don't include make
    if(exact_match) {
      msg = (
        <>
          {model_desc}
          {mnote_desc}
          <p>
           {icon_good} A CHDK build is available, download from the link below.
          </p>
        </>
      )
    }
    // maker note missing
    else if(!mid || !fw_rev) {
      msg = (
        <>
          {model_desc}
          {mnote_desc}
          <p>
            {icon_bad} Missing Canon model or firmware revision MakerNote. May be caused by edited images, or converting from raw.
          </p>
          {try_again}
        </>
      )
    }
    // multiple matches
    else if(matches && matches.length > 1) {
      // theoretically possible for some models to have builds and others not, though not in current (2023) CHDK
      let matched_builds = 0
      const opts = matches.map( (mod:ModelMatch) => {
        let fw_label = ` (no build for firmware ${fw_rev_str})`
        let match = false
        if(mod.fw.find((fw:CamFirmware) => fw_rev_str == fw.id)) {
          matched_builds++
          fw_label = ' firmware ' + fw_rev_str
          match = true
        }
        return {
          id:[mod.family,mod.id,fw_rev_str].join('/'),
          label:(mod.desc || mod.id) + ((mod.aka)? " (" + mod.aka + ")":'') + fw_label,
          disabled:!match,
        }
      })

      msg = (
        <>
          {model_desc}
          {mnote_desc}
          <p>
            {matched_builds?icon_good:icon_bad} Multiple, <b>different</b> cameras match model ID {'0x'+mid.toString(16)}.
          </p>
          {matched_builds === matches.length && (
          <p>
          CHDK builds are available for all identified models. You must select the camera you actually have below.
          </p>
          )}
          {(matched_builds !== 0 && matched_builds !== matches.length) && (
          <p>
          CHDK builds are available for {matched_builds} of {matches.length} identified models. If the camera you actually have shows a build available, select it below.
          </p>
          )}
          {matched_builds === 0 && (
          <>
            <p>
            No CHDK builds are available for the identified models and firmware version.
            </p>
            {unsupported_sub_msg}
          </>
          )}
          <BuildOptCtl
            title={(matched_builds > 0)?"Select Build":"Matching models"}
            sel={null}
            opts={opts}
            setSel={(id)=>{setPath(makePathStr([branch],1,id))}} />
        </>
      )
    // matching model, but no sub
    } else if(matches?.length) {
      msg = (
        <>
          {model_desc}
          {mnote_desc}
          <p>
            {icon_bad} This model is supported by CHDK, but no build is available for firmware {fw_rev_str}.
          </p>
          {unsupported_sub_msg}
        </>
      )
    // no support for model
    } else {
      msg = (
        <>
          {model_desc}
          {mnote_desc}
          <p>
            {icon_bad} No builds are available for this model.
          </p>
          {test_builds_msg}
        </>
      )
    }
  }
  return (
    <div>
      <div className="border-b border-slate-300 my-2"></div>
      <h4 className="font-bold text-l my-1">Results for {filename}</h4>
      {msg}
    </div>
  )
}

type FileDropAreaProps = {
  sel_info: BuildSelection;
  setPath: PathSetter;
  setExifInfo:(exif_info: ExifModelInfo|undefined) => void;
}

function FileDropArea( { sel_info, setPath, setExifInfo }: FileDropAreaProps) {
  const { showBoundary } = useErrorBoundary();
  const onDrop = useCallback(async (files:File[]) => {
    //console.log('accepted files!',files)
    try {
      const tags = await ExifReader.load(files[0])
      //console.log('tags',tags)
      let info:ExifModelInfo = {
        filename:files[0].name,
        make:tags.Make?.description,
        model:tags.Model?.description,
        exact_match:false,
      }
      if(tags.MakerNote?.value && tags.Make?.description === 'Canon') {
        info = {...info,...getMakerNoteValues(tags.MakerNote.value)}
      }
      info.matches = getModelsByMID(sel_info, info.mid)
      if(info.matches) {
        const models = info.matches
        // if exactly one model with build for supported firmware, select it
        if(models.length === 1) {
          const fw = models[0].fw.find((fw) => fw.id === info.fw_rev_str)
          if(fw) {
            info.exact_match = true
            setPath(makePathStr(sel_info.path,1,[models[0].family,models[0].id,fw.id].join('/')))
          }
        }
      }
      // no exact match, clear any existing slection up to branch to avoid confusion
      if(!info.exact_match) {
        setPath(makePathStr(sel_info.path,1,null))
      }
      setExifInfo(info)
    } catch(e) {
      showBoundary(e)
    }
  }, [setExifInfo, sel_info, setPath, showBoundary])
  const {getRootProps, getInputProps} = useDropzone({
    accept:{
      'image/jpeg':[],
    },
    multiple:false,
    noClick: true,
    onDrop
  })
  return (
    <label
      className="block px-2 py-3 border-2 border-dashed text-center bg-slate-50 border-slate-200 hover:border-sky-200 cursor-pointer"
      {...getRootProps()}>
      Click or drop camera .JPG here to identify model and firmware, or select model family below
      <input {...getInputProps()} />
    </label>
  )
}

function ErrorFallback({ error, resetErrorBoundary }:FallbackProps) {
  return (
    <div>
      <p>Error processing image</p>
      <p>{(typeof error?.message !== 'undefined')?String(error.message):String(error)}</p>
      <div className="my-3">
        <button
          className="underline hover:text-chdk-red2"
          onClick={resetErrorBoundary}>
          Reset
        </button>
      </div>
    </div>
  )
}

type FileIdPanelProps = {
  sel_info: BuildSelection;
  setPath: PathSetter;
}

export default function FileIdPanel({ sel_info, setPath }: FileIdPanelProps) {
  const [exif_info, setExifInfo] = useState<ExifModelInfo|undefined>(undefined)

  if(!sel_info.branch) {
    return null
  }

  return (
    <div className="border border-slate-300 p-1 mt-1 rounded">
      <h3 className="font-bold text-l my-1">Find Build by Image</h3>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {setExifInfo(undefined)}}>
        <FileDropArea sel_info={sel_info} setPath={setPath} setExifInfo={setExifInfo} />
        <p className="text-xs my-2">
          NOTE: File should be unmodified camera .JPG with original EXIF. Image is checked in your browser, not uploaded anywhere.
        </p>
        <FileInfoPanel exif_info={exif_info} branch={sel_info.path[0]} setPath={setPath} />
      </ErrorBoundary>
    </div>
  )
}
