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
types representing build metadata json files
*/
export interface BuildDesc {
  desc: string;
  type: string;
  type_desc: string;
  utc: string;
  version: string;
  revision: string;
  svn: string;
  svn_checkout: string;
}

export interface BuildStatus {
  status_version: string;
  build: BuildDesc;
  status: boolean;
}

export interface BuildFileInfo {
  file: string;
  sha256: string;
  size: number;
}

export interface CamFirmware {
  id: string;
  full: BuildFileInfo;
  small: BuildFileInfo;
}

export interface CamModel {
  desc?: string;
  id: string;
  mid?: number;
  pid?: number;
  aka?: string;
  fw: CamFirmware[];
}

export interface CamFamily {
  id: string;
  line: string;
  aka?: string;
  models: CamModel[];
}

export interface PortState {
  desc: string;
  count: number;
}

export interface BuildCounts {
  models: number;
  cameras: number;
  states: PortState[];
}

export interface SvnLogEntry {
  svn: string;
  revision: string;
  author: string;
  utc: string;
  msg: string[];
}

export interface BuildInfo {
  info_version: string;
  build: BuildDesc;
  files_path: string;
  files: CamFamily[];
  counts: BuildCounts;
  svnlog: SvnLogEntry[];
}

