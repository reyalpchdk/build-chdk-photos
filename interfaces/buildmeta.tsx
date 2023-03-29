/*
types representing build metadata json files
*/
export type BuildDesc = {
  desc: string;
  type: string;
  type_desc: string;
  utc: string;
  version: string;
  revision: string;
  svn: string;
  svn_checkout: string;
}

export type BuildStatus = {
  status_version: string;
  build: BuildDesc;
  status: boolean;
}

export type BuildFileInfo = {
  file: string;
  sha256: string;
  size: number;
}

export type CamFirmware = {
  id: string;
  full: BuildFileInfo;
  small: BuildFileInfo;
}

export type CamModel = {
  desc?: string;
  id: string;
  mid?: number;
  pid?: number;
  aka?: string;
  fw: CamFirmware[];
}

export type CamFamily = {
  id: string;
  line: string;
  aka?: string;
  models: CamModel[];
}

export type PortState = {
  desc: string;
  count: number;
}

export type BuildCounts = {
  models: number;
  cameras: number;
  states: PortState[];
}

export type SvnLogEntry = {
  svn: string;
  revision: string;
  author: string;
  utc: string;
  msg: string[];
}

export type BuildInfo = {
  info_version: string;
  build: BuildDesc;
  files_path: string;
  files: CamFamily[];
  counts: BuildCounts;
  svnlog: SvnLogEntry[];
}

