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
  CamFirmware,
  CamModel,
  CamFamily,
  BuildInfo
} from '@/interfaces/buildmeta';

export enum LoadStatus {
  LOADING = "loading",
  LOADED = "loaded",
  ERROR = "error",
}

export type BranchState = {
  info?: BuildInfo;
  status: LoadStatus;
  err?: any;
}

export type BuildSelection = {
  branch?:BranchState;
  family?:CamFamily;
  model?:CamModel;
  fw?:CamFirmware;
  path:string[];
}

export type BranchMap = {
  [key:string]:BranchState;
}
export type PathSetter = (path: string|null, replace?:boolean) => void;
