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
  BuildDesc,
  BuildInfo
} from '@/interfaces/buildmeta';

import SvnLog from '@/components/svnlog'

type Props = {
  build_info: BuildInfo;
}

export default function BuildSummary({ build_info }: Props) {
  const build = build_info.build;
  return (
    <div>
      <div>
        Version: {build.version}-{build.revision} - {build_info.counts.models} models, {build_info.counts.cameras} cameras
      </div>
      <div>
        Built: {new Date(build.utc).toLocaleString()} ({new Date(build.utc).toUTCString()})
      </div>
      <div>
        Source: <a className="underline hover:text-chdk-red2 break-all" href={build.svn}>{build.svn}</a>
      </div>
      <SvnLog build_info={build_info} />
    </div>
  )
}

