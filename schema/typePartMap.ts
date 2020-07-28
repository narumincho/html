import * as definy from "definy-core";
import * as definyData from "definy-core/source/data";
import * as definyType from "definy-core/schema/type";
import * as definyTypePartMap from "definy-core/schema/typePartMap";

export const typePartMap: ReadonlyMap<
  definyData.TypePartId,
  definyData.TypePart
> = new Map([...definyTypePartMap.typePartMap]);
