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

/*
minimal interface to read Canon model ID and firmware revision from
Canon MakerNote in array of bytes, as provided by ExifReader
This is NOT a general purpose exif or makernote interface
*/
type IFDTypeDesc = {
  name:string;
  size:number;
}

const IFD_types:IFDTypeDesc[] = [
  {
    name:'INVALID',
    size:0,
  },
  {
    name:'BYTE',
    size:1,
  },
  {
    name:'ASCII',
    size:1,
  },
  {
    name:'SHORT',
    size:2,
  },
  {
    name:'LONG',
    size:4,
  },
  {
    name:'RATIONAL',
    size:8,
  },
  {
    name:'SBYTE',
    size:1,
  },
  {
    name:'UNDEFINED',
    size:1,
  },
  {
    name:'SSHORT',
    size:2,
  },
  {
    name:'SLONG',
    size:4,
  },
  {
    name:'SRATIONAL',
    size:8,
  },
  {
    name:'FLOAT',
    size:4,
  },
  {
    name:'DOUBLE',
    size:8,
  },
]

/*
get 16 bit unsigned int from array of presumed little-endian bytes
*/
const get_u16 = (data:number[], off:number) => {
  return data[off] | data[off+1]<<8
}

/*
get 32 bit unsigned int from array of presumed little-endian bytes
*/
const get_u32 = (data:number[], off:number) => {
  return data[off] | data[off+1]<<8 | data[off+2]<<16 | data[off+3] << 24
}

interface IFDEntry {
  offset:number;
  tag:number;
  tag_type:number;
  count:number;
  data_size:number;
  type_info:IFDTypeDesc;
  value?:number,
  data_offset?:number;
}

/*
get IFD entry from array of presumed little-endian bytes
*/
const getIFDEnt = (data:number[], idx:number):IFDEntry => {
  const off = 2 + idx*12
  const tag = get_u16(data, off)
  const tag_type = get_u16(data, off+2)
  const count = get_u32(data, off+4)
  const val_off = get_u32(data, off+8)
  const type_info = ((tag_type < IFD_types.length)?IFD_types[tag_type]:IFD_types[0])
  const data_size = count*type_info.size
  return {
    offset:off,
    tag:tag,
    tag_type:tag_type,
    count:count,
    data_size:data_size,
    type_info:type_info,
    value:(data_size <= 4)?val_off:undefined,
    data_offset:(data_size > 4)?val_off:undefined,
  }
}

/*
convert unsigned 32 bit int containing BCD-ish Canon firmware rev to string
*/
const getFWRevStr = (val:number):string => {
  let major = ((val >> 24) & 0xFF).toString()
  let minor = ((val >> 16) & 0xFF).toString()
  if(minor.length == 1) {
    minor = '0' + minor
  }
  // 1 = revision 'a'
  let sub = String.fromCodePoint('a'.charCodeAt(0) - 1 + ((val >> 8) & 0xff))
  return major + minor + sub
}

export interface MakerNoteCamID {
  mid?:number;
  fw_rev?:number;
  fw_rev_str?:string;
}

export const getMakerNoteValues = (mn:any):MakerNoteCamID => {
  if(!Array.isArray(mn)) {
    return {}
  }
  const mn_count = get_u16(mn,0)
  //console.log('maker note entries',mn_count)
  let mid = undefined
  let fw_rev = undefined
  let fw_rev_str = undefined
  for(let i=0; i < mn_count; i++) {
    const de = getIFDEnt(mn,i)
    if(de.tag == 0x10) {
      mid = de.value
    } else if (de.tag == 0x1e && de.value !== undefined) {
      fw_rev = de.value
      fw_rev_str = getFWRevStr(fw_rev)
    }
    //console.log(i,de)
  }
  // test values
  // Ixus 132 / 135
  // mid = 54984704
  // fw_rev_str = '100b'
  // N / N Facebook 54001664
  // mid = 54001664
  // force not found
  // mid = 123
  // force firmware not found
  // fw_rev_str = '100z'
  return {
    mid,
    fw_rev,
    fw_rev_str,
  }
}
