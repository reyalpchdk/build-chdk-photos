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
import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

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

type FileIdPanelProps = {
  sel_info: BuildSelection;
  setPath: PathSetter;
}

export default function FileIdPanel({ sel_info, setPath }: FileIdPanelProps) {
  const onDrop = useCallback(files => {
    console.log('accepted files!',files)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept:{
      'image/jpeg':[],
    },
    multiple:false,
    onDrop
  })

  if(!sel_info.branch) {
    return null
  }

  return (
    <div className="border border-slate-300 p-1 mt-1 rounded">
      <div
        className="p-2 border-2 border-dashed text-center bg-slate-50 border-slate-200 hover:border-sky-200"
        {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Click or drop camera .JPG to identify model and firmware by image</p>
        <p className="text-xs my-2">NOTE: File should be unmodified camera .JPG with original EXIF. It is analyzed in your browser only, not uploaded anywhere.</p>
      </div>
    </div>
  )
}
