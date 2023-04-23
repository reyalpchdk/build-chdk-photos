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
  BuildSelection,
  PathSetter,
} from '@/interfaces/buildselection';

import FileIdPanel from '@/components/fileidpanel'
import FamPanel from '@/components/fampanel'
import ModPanel from '@/components/modpanel'
import FwPanel from '@/components/fwpanel'

type BuildSelectorProps = {
  sel_info: BuildSelection;
  base_url: string;
  setPath: PathSetter;
}

export default function BuildSelector({ sel_info, base_url, setPath }: BuildSelectorProps) {
  return (
    <>
      <FileIdPanel
        sel_info={sel_info}
        setPath={setPath} />
      <FamPanel
        sel_info={sel_info}
        setPath={setPath} />
      <ModPanel
        sel_info={sel_info}
        setPath={setPath} />
      <FwPanel
        sel_info={sel_info}
        setPath={setPath}
        base_url={base_url} />
    </>
  )
}

