import * as definy from "definy-core";
import * as typePartMap from "./typePartMap";
import { promises as fileSystem } from "fs";

fileSystem.writeFile(
  "./source/data.ts",
  definy.generateTypeScriptCodeAsString(typePartMap.typePartMap)
);
