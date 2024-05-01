export interface MinecraftJSON {
  assetIndex: AssetIndex;
  assets: string;
  complianceLevel: number;
  downloads: Downloads;
  id: string;
  javaVersion: JavaVersion;
  libraries: Library[];
  logging: Logging;
  mainClass: string;
  minecraftArguments: string;
  minimumLauncherVersion: number;
  releaseTime: string;
  time: string;
  type: string;
}

export interface AssetIndex {
  id: string;
  sha1: string;
  size: number;
  totalSize: number;
  url: string;
}

export interface Downloads {
  client: Client;
  server: Server;
  windows_server: WindowsServer;
}

export interface Client {
  sha1: string;
  size: number;
  url: string;
}

export interface Server {
  sha1: string;
  size: number;
  url: string;
}

export interface WindowsServer {
  sha1: string;
  size: number;
  url: string;
}

export interface JavaVersion {
  component: string;
  majorVersion: number;
}

export interface Library {
  downloads: Downloads2;
  name: string;
  rules?: Rule[];
  extract?: Extract;
  natives?: Natives;
}

export interface Downloads2 {
  artifact?: Artifact;
  classifiers?: Classifiers;
}

export interface Artifact {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

export interface Classifiers {
  "natives-windows-32"?: NativesWindows32;
  "natives-windows-64"?: NativesWindows64;
  "natives-osx"?: NativesOsx;
  "natives-linux"?: NativesLinux;
  "natives-windows"?: NativesWindows;
}

export interface NativesWindows32 {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

export interface NativesWindows64 {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

export interface NativesOsx {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

export interface NativesLinux {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

export interface NativesWindows {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

export interface Rule {
  action: string;
  os?: Os;
}

export interface Os {
  name: string;
}

export interface Extract {
  exclude: string[];
}

export interface Natives {
  windows: string;
  linux?: string;
  osx?: string;
}

export interface Logging {
  client: Client2;
}

export interface Client2 {
  argument: string;
  file: File;
  type: string;
}

export interface File {
  id: string;
  sha1: string;
  size: number;
  url: string;
}
