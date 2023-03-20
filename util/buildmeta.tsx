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
}

export type BuildStatus = {
  status_version: string;
  build: BuildDesc;
  status: boolean;
}

export type BuildFileInfo = {
  file: string;
  sha256: string;
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
  models: CamModel[];
}

export type BuildInfo = {
  info_version: string;
  build: BuildDesc;
  files: CamFamily[];
}

